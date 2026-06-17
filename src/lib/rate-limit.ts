/* ============================================
   RATE LIMITER (in-memory, per-IP, fixed window)
   Best-effort throttle for sensitive server actions
   (login, admin create-project/client).

   SCOPE / CAVEAT: this is an in-memory limiter. It is
   correct and sufficient for a single Vercel/Node
   instance, which is this app's deployment shape. On a
   horizontally-scaled deployment each instance keeps
   its own counters, so the effective limit is per
   instance. For multi-instance hardening, swap this for
   a Supabase-backed or Upstash/Redis counter behind the
   same `rateLimit()` interface. Documented in
   SUPABASE_INSTRUCTIONS.md.
   ============================================ */
import 'server-only'

type Bucket = { count: number; resetAt: number }

// Keyed by `${name}:${ip}`. Persists for the lifetime of the
// server instance (module scope survives across requests).
const buckets = new Map<string, Bucket>()

// Opportunistic cleanup so the map can't grow unbounded.
function sweep(now: number) {
  if (buckets.size < 5000) return
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Fixed-window rate limit.
 * @param name   Logical limiter name (e.g. 'login').
 * @param ip     Client IP (already extracted from headers).
 * @param limit  Max requests allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(
  name: string,
  ip: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const key = `${name}:${ip}`
  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 }
}

/**
 * Trusted client IP from proxy headers (M-01 hardening).
 *
 * The previous implementation trusted the LEFT-MOST `X-Forwarded-For`
 * entry, which is fully attacker-controllable (a client can prepend
 * any value), allowing trivial per-request bucket rotation to bypass
 * the limiter. We now prefer single-value headers set by the hosting
 * edge — which the platform OVERWRITES and clients cannot append to —
 * and only fall back to `X-Forwarded-For` using the RIGHT-MOST entry
 * (appended by the closest trusted proxy), never the spoofable left.
 *
 * Priority:
 *   1. x-nf-client-connection-ip  (Netlify edge — not client-settable)
 *   2. x-vercel-forwarded-for     (Vercel edge — not client-settable)
 *   3. x-real-ip                  (single value set by common proxies)
 *   4. x-forwarded-for RIGHT-MOST entry (trusted-proxy hop)
 *
 * `RATE_LIMIT_TRUSTED_PROXY_HOPS` (default 0) lets an operator pick an
 * entry further left of the right-most XFF value if extra trusted
 * proxies sit in front of the app.
 */
const TRUSTED_PROXY_HOPS = Math.max(
  0,
  Number(process.env.RATE_LIMIT_TRUSTED_PROXY_HOPS ?? '0') || 0,
)

export function clientIpFromHeaders(headers: Headers): string {
  // 1–2) Platform edge headers (single value, not client-appendable).
  const edge =
    headers.get('x-nf-client-connection-ip')?.trim() ||
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
  if (edge) return edge

  // 3) Single-value proxy header.
  const realIp = headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  // 4) Fall back to X-Forwarded-For, taking the RIGHT-MOST (trusted)
  //    entry rather than the spoofable left-most one.
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    if (parts.length > 0) {
      const idx = Math.max(0, parts.length - 1 - TRUSTED_PROXY_HOPS)
      return parts[idx]
    }
  }

  // No IP available → shared bucket so the limiter still throttles
  // (fail-closed-ish: shared rather than unlimited).
  return 'unknown'
}

/* ---- Tuned limits for each sensitive surface ---- */
export const LOGIN_LIMIT = { limit: 8, windowMs: 60_000 } // 8 / minute / IP
export const CREATE_LIMIT = { limit: 12, windowMs: 60_000 } // 12 / minute / IP

/* ============================================
   ACCOUNT-LEVEL LOGIN THROTTLE  (L-06)
   Per-account temporary cooldown layered ON TOP of the
   per-IP limiter — so an attacker who rotates IPs still
   hits a per-account wall when targeting a single login.

   Properties:
     - Keyed on the SUBMITTED email regardless of whether
       the account exists → NO user enumeration, and the
       caller still returns the SAME generic error.
     - Time-boxed window → admins are NEVER permanently
       locked out; the cooldown self-expires.
     - In-memory, same single-instance caveat as the IP
       limiter (documented in FIX_REPORT.md).
   ============================================ */
type FailRecord = { count: number; firstAt: number }

const accountFails = new Map<string, FailRecord>()

// After ACCOUNT_MAX_FAILURES failed attempts within the window, the
// account enters cooldown until the window elapses.
export const ACCOUNT_MAX_FAILURES = 7
export const ACCOUNT_WINDOW_MS = 10 * 60_000 // 10 minutes

function accountKey(email: string): string {
  return email.trim().toLowerCase()
}

/** True if this account is currently in cooldown (too many recent fails). */
export function isAccountLockedOut(email: string): boolean {
  const key = accountKey(email)
  const rec = accountFails.get(key)
  if (!rec) return false
  if (Date.now() - rec.firstAt > ACCOUNT_WINDOW_MS) {
    accountFails.delete(key) // window elapsed → reset (never permanent)
    return false
  }
  return rec.count >= ACCOUNT_MAX_FAILURES
}

/** Record a failed login for this account (call on auth failure). */
export function recordAccountFailure(email: string): void {
  const key = accountKey(email)
  const now = Date.now()
  const rec = accountFails.get(key)
  if (!rec || now - rec.firstAt > ACCOUNT_WINDOW_MS) {
    accountFails.set(key, { count: 1, firstAt: now })
  } else {
    rec.count += 1
  }
}

/** Clear an account's failure record (call on successful login). */
export function clearAccountFailures(email: string): void {
  accountFails.delete(accountKey(email))
}

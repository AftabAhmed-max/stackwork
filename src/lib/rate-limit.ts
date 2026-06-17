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
 * Best-effort client IP from proxy headers. Vercel sets
 * `x-forwarded-for`. Falls back to a constant bucket so the
 * limiter still throttles even when no IP is available
 * (fail-closed-ish: shared bucket rather than unlimited).
 */
export function clientIpFromHeaders(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')?.trim() || 'unknown'
}

/* ---- Tuned limits for each sensitive surface ---- */
export const LOGIN_LIMIT = { limit: 8, windowMs: 60_000 } // 8 / minute / IP
export const CREATE_LIMIT = { limit: 12, windowMs: 60_000 } // 12 / minute / IP

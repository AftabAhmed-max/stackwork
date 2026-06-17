# StackWork — Remediation / Fix Report

**Scope:** Fix ONLY the manually verified findings M-01, M-03, M-04, L-03, L-04, L-06, L-08.
**Constraint compliance:** No changes to authentication architecture, Supabase RLS, the download authorization model, the role model, portal routing structure, or existing business logic. No breaking changes introduced.
**Date:** 2026-06-17

---

## 1. Build Result

```
next build  (Next.js 16.2.4, Turbopack)
✓ Compiled successfully
✓ TypeScript: no type errors
✓ 12/12 pages generated
✓ Proxy (Middleware) compiled
```

All portal + API routes remain present and unchanged in shape:
`/portal`, `/portal/login`, `/portal/admin`, `/portal/admin/[projectId]`, `/portal/client`, and all 8 `/api/portal/*` handlers.

Build was run clean (`rm -rf .next`) with placeholder env vars; no errors or warnings affecting type safety.

---

## 2. Changed Files

### Added
| File | Purpose |
|---|---|
| `src/lib/security-headers.ts` | Single source of truth for the security-header suite + practical CSP (L-03, L-04). |
| `src/lib/origin.ts` | `isSameOrigin` / `enforceSameOrigin` helper for CSRF defense-in-depth (M-04). |

### Modified
| File | Finding(s) |
|---|---|
| `src/lib/rate-limit.ts` | M-01 (trusted IP extraction), L-06 (account throttle) |
| `src/app/api/portal/auth/login/route.ts` | L-06 (account cooldown wired in) |
| `src/app/api/portal/auth/logout/route.ts` | M-04 (same-origin gate) |
| `src/app/api/portal/admin/projects/route.ts` | M-04 |
| `src/app/api/portal/admin/projects/[projectId]/status/route.ts` | M-04 |
| `src/app/api/portal/admin/projects/[projectId]/active/route.ts` | M-04 |
| `src/app/api/portal/admin/documents/route.ts` | M-04 |
| `src/app/api/portal/admin/documents/[documentId]/route.ts` | M-04 (also `_request` → `request`) |
| `src/proxy.ts` | L-03/L-04 (shared headers), L-08 (removed `next` param) |
| `next.config.ts` | L-04 (security headers for marketing/non-portal routes) |
| `supabase_setup.sql` | M-03 (schema reconciled with app + migrations) |

### Deleted
| File | Reason |
|---|---|
| `src/lib/safe-redirect.ts` | Dead code; its only purpose was the removed `next`-path flow (L-08). Confirmed zero references before deletion. |

> Not part of this change set (pre-existing/unrelated artifacts seen in `git status`): `TEST_REPORT.md`, `stackwork-clean.zip`, `project-structure.txt`.

---

## 3. How Each Finding Was Resolved

### M-01 — Rate-Limiting Hardening (trusted client IP)
**What changed:** `src/lib/rate-limit.ts` → `clientIpFromHeaders()` rewritten.

- **Stopped trusting the left-most `X-Forwarded-For`** (fully attacker-controllable → trivial bucket rotation).
- New priority order uses **edge-set, non-client-appendable headers first**:
  1. `x-nf-client-connection-ip` (Netlify edge)
  2. `x-vercel-forwarded-for` (Vercel edge)
  3. `x-real-ip` (single-value proxy header)
  4. `x-forwarded-for` **right-most** entry (the hop appended by the closest trusted proxy) — never the spoofable left-most.
- Added optional `RATE_LIMIT_TRUSTED_PROXY_HOPS` env (default `0`) to select an entry further left when additional trusted proxies sit in front.
- **API contract preserved:** function signature unchanged (`(headers) => string`); `rateLimit()` behaviour, limits (`LOGIN_LIMIT` 8/min, `CREATE_LIMIT` 12/min), and 429 responses are unchanged. Protection was strengthened, not weakened.

**Documented limitation (unchanged architecture):** the limiter remains **in-memory / per-instance**. On a multi-instance serverless deployment, counters are not shared across instances, so the effective limit is per instance. This is acceptable for the current single-instance shape; for horizontal scale, swap the `Map` for a shared store (Upstash/Redis/Supabase) behind the same `rateLimit()` interface. No new dependency was added (none suitable already present in `package.json`; adding one would exceed "do not change architecture unnecessarily").

**Verification:** Build passes. Spoofing `X-Forwarded-For: 9.9.9.<n>` no longer changes the bucket when an edge/`x-real-ip` header is present (the edge header wins); when only XFF exists, the right-most (trusted) entry is used, which the client cannot control.

---

### M-03 — Schema Drift
**What changed:** `supabase_setup.sql` `documents` table definition reconciled to the **current** application contract:

- `stage_label` CHECK now lists the **12 labels** matching `src/lib/validation.ts` (`STAGE_LABELS`).
- `storage_path` is now **nullable** (link rows have no file).
- Added the **`link_url text`** column.
- Added the **`documents_file_xor_link`** CHECK (a row is a file XOR a link) — the same name/shape the migrations use, so the migrations remain idempotent against both fresh and upgraded databases.

**Result:** A fresh deployment that follows `SUPABASE_INSTRUCTIONS.md` (which runs `supabase_setup.sql`) now produces a **fully working database** without needing the migration files. The `supabase_migration_*` files are retained and still correct for upgrading pre-existing/production databases (their drop→remap→add ordering is unchanged), so **existing production behavior is preserved**. A comment in the file documents this.

**Verification:** SQL reviewed for consistency with `src/lib/validation.ts` and all three migration files; constraint name `documents_file_xor_link` matches `supabase_migration_staging_link.sql`; the 12-label set matches `supabase_migration_stages_v2.sql`.

---

### M-04 — CSRF / Origin Validation
**What changed:** Added `src/lib/origin.ts` and called `enforceSameOrigin(request)` at the top of the **authenticated, state-changing** portal endpoints:

- `POST /api/portal/admin/projects`
- `POST /api/portal/admin/projects/[projectId]/status`
- `POST /api/portal/admin/projects/[projectId]/active`
- `POST /api/portal/admin/documents`
- `DELETE /api/portal/admin/documents/[documentId]`
- `POST /api/portal/auth/logout`

**Logic:** the request's `Origin` header host must equal the host it arrived on (`x-forwarded-host` *or* `host`), otherwise `403 { error: "Invalid origin." }`. This allows **same-origin only** and works correctly behind Vercel/Netlify proxies (public host in `x-forwarded-host`). Browsers always send `Origin` on `POST`/`DELETE`, so legitimate first-party fetch calls (all portal forms use same-origin `fetch`) pass unchanged.

**Why login is intentionally NOT gated:** `POST /api/portal/auth/login` is **unauthenticated** (the finding targets *authenticated* state-changing endpoints), and it is already protected by per-IP throttling, the new account cooldown, and generic errors. Adding an origin gate there is unnecessary and risks edge breakage — so login is left functionally identical. **Logout is gated** (it is an authenticated state change) which prevents forced cross-site logout.

**No breakage:** `GET` endpoints (including `/api/portal/download/[documentId]`) are untouched; the download authorization model is unchanged. SameSite=Lax cookies remain; this is purely an added second layer.

**Verification:** Build passes. All portal UI mutations use same-origin `fetch` (`PortalHeader`, `CreateProjectForm`, `StatusControl`, `ActiveToggle`, `DocumentUpload`, `DocumentRow`) → they send a matching `Origin` and continue to work. Cross-site `POST/DELETE` now receive `403`.

---

### L-03 — Content Security Policy
**What changed:** `src/lib/security-headers.ts` builds a **practical CSP** (replacing the old `frame-ancestors 'none'`-only policy), applied to portal responses via `src/proxy.ts`.

Key directives (preserving current functionality):
- `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, `form-action 'self'`.
- `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com` — `'unsafe-inline'` retained because **Next.js** injects inline bootstrap/hydration scripts and **@next/third-parties** injects an inline GA snippet (no nonce pipeline in this app). `'unsafe-eval'` deliberately **not** granted.
- `style-src 'self' 'unsafe-inline'` — required by Next/inline styles.
- `connect-src` allows **Supabase** (`https://*.supabase.co`, `wss://*.supabase.co`), **EmailJS** (`https://api.emailjs.com`), and **Google Analytics**.
- `img-src 'self' data: blob: https:`, `font-src 'self' data:`, `frame-src 'self'` (the only iframe is a same-origin sample wireframe), `worker-src 'self' blob:`, `manifest-src 'self'`.

This is intentionally **not maximal** to avoid breaking production, exactly as required.

**Verification:** Build passes; CSP is assembled from a typed directive map. Allowed origins match the actual third parties in use (`GoogleAnalytics` in marketing layout, `emailjs.send` in ContactForm, Supabase clients).

---

### L-04 — Marketing Security Headers
**What changed:** `next.config.ts` now returns the **same `SECURITY_HEADERS` suite** for all non-portal routes via:

```ts
async headers() {
  return [{ source: '/((?!portal|api/portal).*)', headers: SECURITY_HEADERS }]
}
```

- Marketing pages (`/`, `/about`, `/services`, `/contact`) and other non-portal assets now receive: CSP, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `X-Permitted-Cross-Domain-Policies`, `Strict-Transport-Security` (HSTS, no `includeSubDomains`/preload to avoid impacting subdomains), and `Permissions-Policy`.
- The source pattern **excludes** `/portal/*` and `/api/portal/*` because the **proxy** already applies the identical suite there — preventing duplicate headers.
- SEO/analytics preserved: the CSP allows Google Analytics + GTM; `X-Frame-Options: DENY` only blocks *others* from framing the site (the same-origin sample iframe is the other direction and is allowed by `frame-src 'self'`).

**Verification:** Build passes; `headers()` accepted by Next; portal vs marketing header application is mutually exclusive (no duplication).

---

### L-06 — Account-Level Login Protection
**What changed:** `src/lib/rate-limit.ts` gained an in-memory **per-account cooldown**, wired into `src/app/api/portal/auth/login/route.ts`.

- New helpers: `isAccountLockedOut(email)`, `recordAccountFailure(email)`, `clearAccountFailures(email)`.
- Policy: after **`ACCOUNT_MAX_FAILURES = 7`** failed attempts within a **10-minute** window, that account is in cooldown.
- **No user enumeration:** keyed on the **submitted email** whether or not it exists, and the route returns the **same generic `401 { error: "Invalid credentials." }`** in all cases (cooldown, bad password, invalid input). An attacker cannot distinguish cooldown from a wrong password.
- **Admins are never permanently locked out:** the window self-expires (the record is cleared once `ACCOUNT_WINDOW_MS` passes), and a successful login immediately clears the counter.
- Layered on top of the existing per-IP limiter, so IP rotation (even with M-01 in place) still hits a per-account wall.

**Same documented limitation as M-01:** in-memory / per-instance (acceptable for single-instance; shared store needed for horizontal scale).

**Verification:** Build passes. Login flow: invalid input → generic 401 (unchanged); locked account → generic 401 (no signIn performed); failed signIn → record + generic 401; successful signIn → clear + role-based redirect (unchanged). Generic-error / no-enumeration property preserved.

---

### L-08 — Dead Redirect Parameter
**What changed (Option B — remove dead generation):**
- `src/proxy.ts` no longer appends `?next=<pathname>` to the login redirect; it now redirects to the hardcoded `/portal/login` only. A comment documents that post-login routing is role-based and server-resolved, so there is no `next`/`redirectTo` surface.
- Deleted the unused `src/lib/safe-redirect.ts` (its sole purpose was the now-removed flow; zero references confirmed).
- `LoginForm.tsx` already validates the server-provided `data.redirect` with `isInternalPortalPath` (kept) — no open redirect anywhere.

**Verification:** Build passes; `grep` confirmed no remaining references to `next` param generation or `safeInternalPath`.

---

## 4. Preserved (explicitly NOT modified)

- **Authentication architecture** — `auth.getUser()` server validation, cookie-based sessions, login/logout flow unchanged (logout only gained a same-origin gate).
- **Supabase RLS** — `supabase_setup.sql` policies (`profiles`/`projects`/`documents`/`storage.objects`) untouched; only the `documents` table column/constraint shape was reconciled to match the app.
- **Download authorization model** — `GET /api/portal/download/[documentId]` unchanged (RLS entitlement check + 60s signed URL).
- **Role model** — role still read from DB; no client-trusted role; admin bootstrap unchanged.
- **Portal routing structure** — route tree identical (verified in build output).
- **Existing business logic** — create-project idempotency, status/close cascade, active toggle, file XOR link, MIME allowlist, 10 MB cap, UUID storage paths — all unchanged.

---

## 5. Verification Summary

| Finding | Fix | Build | No-enumeration / contract preserved |
|---|---|---|---|
| M-01 | Trusted IP extraction; right-most XFF; edge headers | ✅ | Limiter contract unchanged |
| M-03 | `supabase_setup.sql` reconciled (12 labels, nullable storage_path, link_url, XOR) | ✅ | Migrations still idempotent |
| M-04 | `enforceSameOrigin` on 5 admin mutations + logout | ✅ | Same-origin fetches unaffected |
| L-03 | Practical CSP (Next/Supabase/EmailJS/GA preserved) | ✅ | Functionality preserved |
| L-04 | Security headers on marketing via `next.config` | ✅ | SEO/analytics preserved |
| L-06 | Per-account cooldown, generic 401, self-expiring | ✅ | No enumeration; admins not permanently locked |
| L-08 | Removed dead `next` param + dead module | ✅ | No open redirect |

**Operational note (out of code scope):** H-01 from the audit (service-role key disclosed in plaintext) is **not** a code fix — rotate the Supabase `service_role` key and update Vercel + `.env.local`.

*End of fix report.*

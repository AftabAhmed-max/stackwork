# StackWork — Security, Authorization, QA & Deployment Audit

**Target application:** StackWork client portal
**Production URL:** https://stackworkhq.com
**Audit type:** White-box static source review (read-only). No code was modified.
**Audit date:** 2026-06-17
**Auditor scope:** Authentication, Authorization, Session, Supabase usage, File upload/download, API security, Dynamic routes, Deployment config, Env exposure, Rate limiting, Proxy/middleware, plus the requested advanced test classes (SQLi/NoSQLi/SSTI/XSS/CmdInj/IDOR/SSRF/Open-Redirect/CORS/ReDoS/LPDoS/Large-payload/Host-Header).

> **Methodology note.** This is a source-level (white-box) audit of the repository. Findings are derived from reading the actual code paths. Where a finding requires confirmation against the running deployment (e.g. observed HTTP headers, rate-limit behaviour on the live serverless platform), the reproduction steps are written for a tester to execute against `stackworkhq.com`, and the **Confidence** field distinguishes *code-verified* from *runtime-confirmation-recommended*.

---

## 0. Executive Summary

The portal is, overall, **well-architected from a security standpoint**. Access control is enforced at the database layer via Supabase Row-Level Security (RLS); the service-role key is isolated to server-only modules; downloads use short-lived signed URLs against a private bucket; identity is validated server-side with `auth.getUser()` (not by trusting a decoded cookie); role is read from the database, never the client; inputs are validated server-side; and user-controlled strings are rendered through React's default escaping (no `dangerouslySetInnerHTML`).

No **Critical** code-level vulnerabilities (auth bypass, IDOR, SQLi, stored XSS, privilege escalation, exposed admin endpoint) were found.

The notable issues are concentrated in **operational/deployment hardening** and **rate-limiting robustness**, plus one **High** operational secret-handling issue (service-role key disclosed in plaintext during this engagement).

### Findings by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 0 | — |
| High | 1 | H-01 |
| Medium | 4 | M-01, M-02, M-03, M-04 |
| Low | 8 | L-01 … L-08 |
| Informational | 7 | I-01 … I-07 |

---

## 1. Environment & Framework Fingerprint

| Property | Value | Source |
|---|---|---|
| Framework | **Next.js 16.2.4** (App Router) | `package.json`, build output |
| UI runtime | **React 19.2.4 / react-dom 19.2.4** | `package.json` |
| Middleware | **`src/proxy.ts`** (Next.js 16 renamed "middleware" → "proxy") | `src/proxy.ts` |
| Auth/data | **Supabase** — `@supabase/ssr ^0.12.0`, `@supabase/supabase-js ^2.108.2` | `package.json` |
| Styling | Tailwind v4, framer-motion 12 | `package.json` |
| Email (marketing) | `@emailjs/browser ^4.4.1` | `package.json` |
| Deploy plugin present | `@netlify/plugin-nextjs ^5.15.10` + `netlify.toml` | `netlify.toml` |
| Stated deploy target | Vercel (per env-var workflow & code comments) | conversation / comments |

> **Deployment ambiguity:** the repo contains `netlify.toml` and the Netlify Next.js plugin, while the operator manages env vars on **Vercel**. See **M-02**.

---

## 2. Architecture Overview (as-built)

**Authentication.** Credential login via a route handler `POST /api/portal/auth/login` → `supabase.auth.signInWithPassword`. Sessions live entirely in Supabase `sb-*` cookies managed by `@supabase/ssr`. No auth state in `localStorage`/`sessionStorage` (verified — only doc-comments mention the words).

**Authorization.** Two layers + the DB:
1. `src/proxy.ts` — optimistic redirect guard for unauthenticated users on `/portal/*` (explicitly *not* the sole gate; excludes `/api/portal/*`).
2. Per-page / per-route checks in `src/lib/auth.ts` (`getAuthContext`, `requireAdmin`, `requireClient`) — identity validated with `auth.getUser()`, role read from `profiles` table.
3. **Supabase RLS** (`supabase_setup.sql`) — the real gate. `is_admin()` / `is_active_client()` `SECURITY DEFINER` helpers; clients can `SELECT` only their own project/documents while `is_active = true`.

**Privileged writes** use `createAdminClient()` (service-role, `import 'server-only'`) and are always preceded by an admin auth check.

**Downloads.** `GET /api/portal/download/[documentId]` verifies entitlement through the caller's RLS context, then mints a 60-second signed URL from the private `project-documents` bucket.

---

## 3. Findings

### H-01 — Service-role key disclosed in plaintext (operational secret handling)
- **Severity:** High
- **Location:** `.env.local` (line containing `SUPABASE_SERVICE_ROLE_KEY`); the value was also pasted into the assistant session/IDE selection during this engagement.
- **Reproduction Steps:**
  1. Decode the JWT value of `SUPABASE_SERVICE_ROLE_KEY`.
  2. Observe payload `{"role":"service_role", ...}` with `ref: qxlradmkcleoldcvpouc`.
  3. A holder of this key can call the Supabase REST/Storage API directly, **bypassing all RLS** (full read/write/delete of `profiles`, `projects`, `documents`, storage objects; create/delete auth users).
- **Evidence:** Key is a `service_role` JWT; `src/lib/supabase/admin.ts` uses it to bypass RLS. It was transmitted in cleartext in the chat/editor context.
- **Impact:** Total data-plane compromise if the key is captured (full CRUD on all tenant data, user creation/deletion, account takeover). Because it was exposed outside the secret store, it should be treated as compromised.
- **Confidence:** High (code-verified the key is service-role; exposure observed in-session).
- **Note:** Storage *posture* in the repo is correct — the key is server-only and `.env*` is git-ignored (see I-05). This finding is specifically about the **disclosure event**, which warrants rotation.

---

### M-01 — Rate limiting is in-memory and IP-spoofable → brute-force / throttle bypass
- **Severity:** Medium
- **Location:** `src/lib/rate-limit.ts` (`rateLimit`, `clientIpFromHeaders`); consumers `src/app/api/portal/auth/login/route.ts`, `src/app/api/portal/admin/projects/route.ts`.
- **Reproduction Steps:**
  1. **State loss:** On serverless (Vercel/Netlify functions), counters live in per-instance module memory (`const buckets = new Map(...)`). Issue repeated logins; observe that scaling/cold-starts spread requests across instances, each with its own counter, raising the effective limit well above 8/min.
  2. **Spoof bypass:** `clientIpFromHeaders` trusts the **left-most** `X-Forwarded-For` value. Send `POST /api/portal/auth/login` with a rotating header, e.g. `X-Forwarded-For: 9.9.9.<n>`, incrementing `n` each request. Each value is a fresh bucket → effectively unlimited attempts.
- **Evidence:**
  ```ts
  const buckets = new Map<string, Bucket>()          // per-instance memory
  const xff = headers.get('x-forwarded-for')
  const first = xff.split(',')[0]?.trim()            // attacker-controllable leftmost entry
  export const LOGIN_LIMIT = { limit: 8, windowMs: 60_000 }
  ```
- **Impact:** The login throttle (anti-brute-force / anti-enumeration timing) and the admin create-project throttle can be bypassed, and the limiter provides little protection in the real (multi-instance, serverless) deployment. Enables credential brute-force and (via login, see large-payload note L-06) amplification.
- **Confidence:** High for the X-Forwarded-For spoof (code-verified). Medium for the per-instance ineffectiveness (depends on the live platform's instance reuse — runtime confirmation recommended).

---

### M-02 — Deployment configuration mismatch (Netlify config vs. Vercel operation)
- **Severity:** Medium (deployment readiness)
- **Location:** `netlify.toml`, `package.json` (`@netlify/plugin-nextjs`), vs. Vercel env-var workflow and `src/lib/rate-limit.ts` comment ("single Vercel/Node instance").
- **Reproduction Steps:**
  1. Inspect `netlify.toml` → `@netlify/plugin-nextjs`, `publish = ".next"`.
  2. Note env vars are being configured on Vercel.
  3. Determine which platform actually serves `stackworkhq.com` and whether the proxy (`src/proxy.ts`) and route handlers run with the expected runtime/headers.
- **Evidence:** `netlify.toml` present and Netlify plugin in dependencies, while operator manages Vercel env vars.
- **Impact:** Ambiguity about which platform is authoritative can cause: proxy/middleware not executing as assumed (security headers + session refresh skipped), different `X-Forwarded-For` handling (amplifies M-01), or a stale/parallel deployment serving traffic. Operational/security drift.
- **Confidence:** Medium (config-verified; live target platform needs confirmation).

---

### M-03 — Base schema (`supabase_setup.sql`) is out of sync with the application
- **Severity:** Medium (deployment readiness / data-integrity)
- **Location:** `supabase_setup.sql` vs. `supabase_migration_staging_link.sql`, `supabase_migration_stages.sql`, `supabase_migration_stages_v2.sql`, and `src/lib/validation.ts`.
- **Reproduction Steps:**
  1. In `supabase_setup.sql`, the `documents` table declares `storage_path text **not null**` and `stage_label ... check (stage_label in ('Proposal','Signed Agreement','Staging Link','Other'))`, and has **no `link_url` column**.
  2. The app (`src/app/api/portal/admin/documents/route.ts`) inserts `link_url` with `storage_path = null` for staging links, and `src/lib/validation.ts` allows 12 stage labels.
  3. A fresh environment provisioned with **only** `supabase_setup.sql` (migrations skipped or applied out of order) will reject staging-link inserts and any new stage label.
- **Evidence:** Column/constraint definitions in `supabase_setup.sql` lines 47–56 vs. current app behaviour.
- **Impact:** A new/rebuilt Supabase project that does not also run all three migrations in order will throw on uploads (NOT NULL violation) and on new stage labels (CHECK violation). Reliability/availability of core features post-deploy.
- **Confidence:** High (code-verified). Live DB is presumably already migrated; this is a *reproducibility/DR* risk.

---

### M-04 — State-changing API relies solely on SameSite=Lax cookies (no CSRF token / Origin check)
- **Severity:** Medium (defense-in-depth)
- **Location:** All mutating route handlers under `src/app/api/portal/**` (login, logout, projects create, status, active, documents POST/DELETE). Cookie flags set in `src/lib/supabase/server.ts` and `src/lib/supabase/proxy-session.ts`.
- **Reproduction Steps:**
  1. Note auth is cookie-based; cookies are `SameSite=Lax`, `HttpOnly`, `Secure` (prod).
  2. There is no anti-CSRF token and no `Origin`/`Referer` allow-list check in any handler.
  3. Cross-site **POST/DELETE** via `fetch`/form: under `SameSite=Lax` the browser will *not* attach the session cookie to cross-site non-GET requests, so classic CSRF is blocked **by the cookie flag alone**.
- **Evidence:** `sameSite: 'lax'` is set on cookie writes; no CSRF middleware exists.
- **Impact:** Protection currently depends entirely on `SameSite=Lax` being honored by the client browser and on the platform not weakening it. There is no second layer (token or strict Origin check). Top-level GET-based vectors (e.g. the GET `download` route) are the only ones that receive cookies cross-site, and they return a redirect to a signed URL (not readable cross-origin), so impact is limited.
- **Confidence:** Medium (code-verified that mitigation is single-layer; practical exploitability is low due to Lax).

---

### L-01 — JWT access token remains valid until expiry after logout
- **Severity:** Low
- **Location:** `src/app/api/portal/auth/logout/route.ts`, Supabase session model.
- **Reproduction Steps:** Log in; capture the `sb-access-token`. Call `POST /api/portal/auth/logout`. Replay the captured access token directly against Supabase REST before its `exp`.
- **Evidence:** Logout calls `supabase.auth.signOut()` (revokes the *refresh* token) and clears `sb-*` cookies, but the already-issued stateless access JWT is valid until `exp`.
- **Impact:** A stolen access token is usable for the remainder of its lifetime (Supabase default ~1h) even after logout. Standard JWT limitation.
- **Confidence:** High (code/architecture-verified).

---

### L-02 — Large multipart body buffered before size check (admin upload)
- **Severity:** Low
- **Location:** `src/app/api/portal/admin/documents/route.ts` (`await request.formData()` precedes the `file.size > MAX_FILE_BYTES` check).
- **Reproduction Steps:** As admin, `POST` a multipart body with a very large `file` part; observe the whole body is parsed/buffered before the 10 MB rejection.
- **Evidence:** `form = await request.formData()` runs before any size validation; `MAX_FILE_BYTES` is checked afterward.
- **Impact:** Memory pressure / potential function OOM from oversized uploads. Mitigated by requiring admin auth and by platform body limits.
- **Confidence:** Medium (code-verified; real impact depends on platform request-size caps).

---

### L-03 — Minimal Content-Security-Policy (only `frame-ancestors`)
- **Severity:** Low
- **Location:** `src/proxy.ts` → `applySecurityHeaders`.
- **Reproduction Steps:** Load any `/portal/*` page; inspect the `Content-Security-Policy` response header → `frame-ancestors 'none'` only. No `script-src`, `object-src`, `base-uri`, etc.
- **Evidence:**
  ```ts
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'")
  ```
- **Impact:** XSS defense-in-depth is limited to React's escaping; a future injection bug would not be contained by CSP. (No current XSS sink found — see I-02.)
- **Confidence:** High (code-verified).

---

### L-04 — Marketing site has no security headers
- **Severity:** Low
- **Location:** `src/proxy.ts` matcher `['/portal/:path*', '/api/portal/:path*']` only; `next.config.ts` sets no `headers()`.
- **Reproduction Steps:** Request `/`, `/about`, `/services`, `/contact`; observe absence of `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, CSP.
- **Evidence:** Proxy excludes marketing routes; `next.config.ts` has only `allowedDevOrigins`.
- **Impact:** Marketing pages are clickjackable / lack MIME-sniffing protection. Low data sensitivity, but inconsistent posture.
- **Confidence:** High (code-verified).

---

### L-05 — EmailJS credentials shipped in client bundle (marketing contact form)
- **Severity:** Low
- **Location:** `src/components/sections/contact/ContactForm.tsx` (`NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `_TEMPLATE_ID`, `_PUBLIC_KEY`).
- **Reproduction Steps:** View page source / JS bundle for `/contact`; extract the three EmailJS identifiers; replay `emailjs.send` from any origin.
- **Evidence:** `NEXT_PUBLIC_` vars are inlined into the browser bundle by design.
- **Impact:** Third parties can send email through your EmailJS template (spam/abuse, quota exhaustion) unless restricted by EmailJS allow-listed domains + reCAPTCHA. These are *intended-public* keys, so this is abuse-surface, not a secret leak.
- **Confidence:** High (code-verified).

---

### L-06 — No account lockout; login throttle is the only brute-force control
- **Severity:** Low (compounds M-01)
- **Location:** `src/app/api/portal/auth/login/route.ts`.
- **Reproduction Steps:** Submit repeated wrong passwords for a known email; observe only the per-IP 429 throttle (bypassable per M-01); no per-account lockout/backoff.
- **Evidence:** Login relies on `rateLimit('login', ip, ...)` only.
- **Impact:** Combined with M-01, facilitates online password guessing. Generic error messages do prevent enumeration (good).
- **Confidence:** High (code-verified).

---

### L-07 — Redirects build URLs from `request.url` (Host-header trust)
- **Severity:** Low
- **Location:** `src/proxy.ts`, `src/app/api/portal/download/[documentId]/route.ts` (`new URL('/portal/login', request.url)`).
- **Reproduction Steps:** Send requests with a spoofed `Host`/`X-Forwarded-Host` to a non-allow-listed value; check whether generated `Location` headers reflect the attacker host.
- **Evidence:** Internal redirects are resolved against `request.url`, whose authority derives from the Host header.
- **Impact:** Potential host-header-influenced redirect/cache-poisoning **if** the hosting platform forwards an unvalidated Host. Vercel/Netlify normally pin the host, mitigating this. Targets are fixed internal paths, limiting impact.
- **Confidence:** Low (platform-dependent; runtime confirmation recommended).

---

### L-08 — Dead `next` redirect parameter & unused open-redirect guard
- **Severity:** Low (code hygiene / latent risk)
- **Location:** `src/proxy.ts` sets `loginUrl.searchParams.set('next', pathname)`; `src/app/(portal)/portal/login/LoginForm.tsx` never reads it; `src/lib/safe-redirect.ts` (`safeInternalPath`) is unused; `src/lib/auth.ts` `getAdminOrThrow` is unused.
- **Reproduction Steps:** Trigger an unauthenticated visit to `/portal/admin`; observe redirect to `/portal/login?next=/portal/admin`; confirm the value is ignored on submit (server returns a hardcoded role-based path).
- **Evidence:** LoginForm uses `data.redirect` from the API (validated by `isInternalPortalPath`) and discards `next`.
- **Impact:** **No open redirect today** (the param is dead). Risk is latent: if a future change wires `next` into navigation without the existing guard, an open redirect could be introduced.
- **Confidence:** High (code-verified there is currently no open redirect).

---

## 4. Test-Class Results (requested matrix)

| Class | Result | Confidence | Notes / Location |
|---|---|---|---|
| **SQL Injection** | Not found | High | All DB access via Supabase query builder (parameterized); no string-built SQL. Storage RLS uses `split_part(name,'/',1)::uuid` on server-generated names. |
| **NoSQL Injection** | N/A | High | Postgres only. |
| **SSTI** | Not found | High | No template engine; JSX only. |
| **XSS — Stored** | Not found | High | `file_name`, `client_name`, project name, `link_url` rendered as text (React escaping). Staging-link `href` constrained to `http(s)` by `isValidHttpUrl` → no `javascript:`/`data:`. See I-02. |
| **XSS — Reflected/DOM** | Not found | High | No `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write` in `src`. |
| **Command Injection** | Not found | High | No `child_process`/`exec` usage. |
| **IDOR** | Not found | High | Download + client views gated by RLS (`owner_id = auth.uid()` + `is_active`); admin writes use service-role *after* role check. Crafting another client's `documentId` → 404. (`download/[documentId]/route.ts`, `supabase_setup.sql`.) |
| **SSRF** | Not found (by design) | Medium | Staging-link URL is **stored and rendered**, never fetched server-side. Admin-only input. No server-side request to user-supplied URLs. |
| **Open Redirect** | Not found | High | Hardcoded role-based post-login redirect + `isInternalPortalPath` client check. See L-08 (dead `next` param). |
| **CORS Misconfiguration** | Not found | High | No `Access-Control-Allow-Origin` set on portal APIs → same-origin only. |
| **ReDoS** | Not found | High | `EMAIL_RE`, `UUID_RE`, `isInternalPortalPath` are linear; no nested quantifiers. |
| **LPDoS / Large payload** | Partial | Medium | See L-02 (multipart buffered pre-check). JSON endpoints: login rate-limits *before* parsing; create-project requires admin before parsing. |
| **Host Header Injection** | Possible (platform-dependent) | Low | See L-07. |
| **Privilege Escalation** | Not found | High | `role` only writable by admins (`profiles_admin_update` requires `is_admin()`); trigger hardcodes `role='client'`; server never trusts client-supplied role; admin bootstrap is a manual DB step. |

---

## 5. Detailed Control Verification

### Authentication
- **Login** — `POST /api/portal/auth/login`: rate-limited (caveat M-01), generic `401 "Invalid credentials."` for *all* failure modes (no user enumeration — code-verified), server-side email/password validation, Supabase sets `HttpOnly` cookies. ✅
- **Logout** — `POST /api/portal/auth/logout`: server `signOut()` + defensive expiry of `sb-*` cookies. ✅ (caveat L-01 — access token TTL).
- **Session persistence / refresh** — `src/lib/supabase/proxy-session.ts` rotates tokens on every matched request via `auth.getUser()`. ✅
- **Session invalidation** — refresh token revoked on logout. ✅ (L-01).
- **Cookie security** — `HttpOnly: true`, `SameSite: 'lax'`, `secure: isProd`, `path: '/'` set in both `server.ts` and `proxy-session.ts`. ✅ *Runtime check recommended:* confirm `Secure` flag is actually present on prod responses.
- **JWT handling** — identity validated by `auth.getUser()` (server round-trip), not by decoding the cookie. ✅
- **localStorage auth** — none (verified by grep; only comments reference the term). ✅

### Authorization
- **Admin route protection** — every `/portal/admin/*` page calls `requireAdmin()`; every `/api/portal/admin/*` handler checks `getAuthContext()` + `role==='admin'`. ✅
- **Client route protection** — `requireClient()`; inactive clients reach a locked state with **zero data** (RLS returns nothing). ✅
- **Direct URL access** — client → `/portal/admin` redirects to `/portal/client`; unauthenticated → `/portal/login`. ✅
- **API authorization** — no unauthenticated/admin-less data route. The proxy intentionally skips `/api/portal/*`, but each handler self-guards (verified for all 8 routes). ✅
- **Hidden navigation bypass / privilege escalation** — not possible via app surface (see matrix). ✅

### Payments
- **No payment flow exists** in the codebase. "Invoice" is merely a document **stage label** (a file/link tag) in `STAGE_LABELS`; there is no charge, price, amount, or payment-provider integration. No client-controlled monetary values; nothing to validate. ✅ (Informational I-06.)

### File upload security
- Admin-only; **type allow-list by real `content-type`** (`isAllowedMime`); **10 MB** server cap; **server-generated storage path** `"<projectId>/<uuid>.<ext>"` (raw filename never in path → no path traversal); filename kept only as escaped display label; rollback of stored object if metadata insert fails. ✅ (caveat L-02). *MIME bypass note:* validation trusts the browser-reported `content-type` rather than magic-byte sniffing — acceptable given admin-only access and private storage, but a determined admin could store a mislabeled file. Low/Informational.

### Download security
- Auth required; **entitlement checked through caller's RLS context**; **60-second signed URL** against a **private** bucket; staging-link rows (`storage_path` null) explicitly 404. ✅

### Dynamic route security
- `[projectId]` / `[documentId]` params validated with `isUuid()` before use; non-UUID → 400. ✅

### Secrets / bundle exposure
- `SUPABASE_SERVICE_ROLE_KEY` referenced **only** in `src/lib/supabase/admin.ts` (begins with `import 'server-only'`). No `NEXT_PUBLIC_` service-role variant (verified). `.env*` git-ignored; only `.env.local.example` tracked. ✅ — *except the disclosure event H-01.*

### Rate limiting
- Implemented for login + create-project; returns `429` + `Retry-After`. Robustness caveats in **M-01**. (Per the engagement rules, no aggressive lockout testing was performed.)

### Middleware / proxy behaviour
- `src/proxy.ts`: refreshes session, redirects unauthenticated `/portal/*` → login, redirects authenticated `/portal` & `/portal/login` → `/portal/admin` (role re-resolved server-side), applies 5 security headers. Matcher scoped to portal only. ✅

---

## 6. Informational

- **I-01 — Framework versions:** Next.js 16.2.4, React 19.2.4 (current major lines).
- **I-02 — Staging-link rendering is safe:** `link_url` is validated `http(s)`-only server-side and rendered as text + as an `href` with `rel="noreferrer noopener"`; no script-scheme XSS.
- **I-03 — Proxy double-hop:** authenticated users hitting `/portal`/`/portal/login` are sent to `/portal/admin` regardless of role; clients then bounce to `/portal/client`. Cosmetic.
- **I-04 — Dead code:** `safeInternalPath` (`src/lib/safe-redirect.ts`) and `getAdminOrThrow` (`src/lib/auth.ts`) are unused.
- **I-05 — Secret storage posture is correct** (server-only + git-ignored); H-01 concerns the disclosure, not the storage.
- **I-06 — No payments:** "Invoice" is a document stage label only.
- **I-07 — GA measurement ID** is hardcoded in the marketing root layout (`G-…`); GA IDs are non-secret by design.

---

## 7. Prioritized Remediation Order (no code provided, per scope)

1. **H-01** — Rotate the Supabase `service_role` key; update Vercel + `.env.local`; treat the exposed value as compromised.
2. **M-02** — Confirm the authoritative hosting platform; remove the unused config for the other; verify the proxy + security headers actually execute in prod.
3. **M-01** — Replace/augment the in-memory limiter with a shared store and a trusted client-IP source; do not trust the leftmost `X-Forwarded-For`.
4. **M-03** — Reconcile `supabase_setup.sql` with the migrations so a clean provision is consistent.
5. **M-04 / L-01 … L-08** — Defense-in-depth: add an Origin/CSRF check, tighten CSP, extend security headers to marketing, restrict EmailJS by domain, add per-account login backoff.

---

## 8. Scope & Confidence Statement

This was a **static source audit**; no exploit was executed against live infrastructure and no code was changed. Items marked *"runtime-confirmation-recommended"* (cookie `Secure` flag in prod, live rate-limit behaviour, host-header handling, active hosting platform) should be validated with authenticated manual testing against `stackworkhq.com` using the provided admin/customer credentials. All code-path findings were verified directly against the repository at audit time.

*End of report.*

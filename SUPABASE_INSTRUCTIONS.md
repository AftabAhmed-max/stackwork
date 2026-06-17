# Stackwork Client Portal — Supabase Setup

Follow these steps once, in order. The portal enforces all access
control in the database (Row-Level Security), so this setup is the
security foundation — not optional polish.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> → **New project**.
2. Pick a name, a strong database password, and a region near your users.
3. Wait for provisioning to finish.

---

## 2. Run the schema + policies

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase_setup.sql`](./supabase_setup.sql).
3. Click **Run**.

This creates the `profiles`, `projects`, and `documents` tables, the
profile-creation trigger, the **private** `project-documents` storage
bucket, and every RLS policy. The script is **idempotent** — re-running
it is safe.

---

## 3. Get your API keys

Dashboard → **Project Settings → API**. You need three values:

| Value | Used as | Exposure |
| ----- | ------- | -------- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | public |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public |
| `service_role` `secret` key | `SUPABASE_SERVICE_ROLE_KEY` | **server-only secret** |

> ⚠️ The `service_role` key bypasses RLS. Never expose it in the browser,
> never prefix it with `NEXT_PUBLIC_`, never commit it. In this codebase
> it is imported only by `src/lib/supabase/admin.ts`, which begins with
> `import 'server-only'` — the build will FAIL if any client component
> ever imports it.

---

## 4. Set environment variables

**Local:** copy `.env.local.example` to `.env.local` and fill in the three
values:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Vercel:** Project → **Settings → Environment Variables** → add the same
three (Production + Preview). Redeploy after adding them.

---

## 5. Create your FIRST admin user (one intentional manual step)

There is **no public signup** and the create-client flow always makes
`role='client'`. So the very first admin must be promoted by hand. This is
deliberate and safe: it means an admin can only ever be minted by someone
with direct database access, never through the app.

1. Dashboard → **Authentication → Users → Add user → Create new user**.
   - Enter **your** email and a strong password.
   - Tick **Auto Confirm User** so you can log in immediately.
2. The profile trigger creates a `profiles` row for you with
   `role='client'`. Promote it to admin — Dashboard → **SQL Editor**, run
   (replace the email):

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'you@stackwork.com');
   ```

3. Done. Sign in at `/portal/login` — you'll be routed to `/portal/admin`.

From here, create all client logins **inside** the admin dashboard. Never
create client accounts in the Supabase dashboard (they'd skip the project
linkage).

---

## 6. How the security pieces fit together

- **Auth cookies** are written by `@supabase/ssr` as **HttpOnly**,
  **SameSite=Lax**, and **Secure in production** (see
  `src/lib/supabase/server.ts` and `src/lib/supabase/proxy-session.ts`).
  No auth state is ever stored in `localStorage`/`sessionStorage`.
- **RLS** (in `supabase_setup.sql`) is the real access gate: a client can
  read only their own active project + documents. Direct/raw API calls for
  another client's data return zero rows.
- **Downloads** use the private bucket only. The server verifies
  entitlement (via the caller's RLS context) and then issues a **60-second
  signed URL** — there are no public file URLs.
- **Rate limiting** (`src/lib/rate-limit.ts`) throttles login and
  create-client per IP and returns **HTTP 429** when exceeded. It is an
  in-memory, best-effort limiter sized for a single Vercel deployment; for
  multi-instance scale, swap it for a Supabase/Redis-backed counter behind
  the same `rateLimit()` interface.

---

## 7. Optional: tighten auth settings

In **Authentication → Providers → Email**, since there is no public signup:

- Disable **Enable email signups** (admins create users via the
  service-role key, which is unaffected by this toggle).
- Keep email confirmations on; the app creates client users with
  `email_confirm: true` so they can sign in right away.

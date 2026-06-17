/* ============================================
   SUPABASE — SERVER CLIENT (anon key, cookie-aware)
   For Server Components, Server Actions and Route
   Handlers. Uses the anon key and reads/writes the
   Supabase auth cookies via Next's async cookies()
   API (Next 16 / React 19).

   Cookie security: @supabase/ssr writes the auth
   cookies HttpOnly by default. We additionally pin
   sameSite='lax' and secure (in production) on every
   write so the session cookie cannot be read by JS,
   is not sent cross-site, and only travels over HTTPS
   in prod. See SUPABASE_INSTRUCTIONS.md.

   IMPORTANT: this client is bound to the caller's
   cookies, so every query runs under that user's
   Row-Level Security context. It can NEVER read data
   the logged-in user is not entitled to.
   ============================================ */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const isProd = process.env.NODE_ENV === 'production'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                sameSite: 'lax',
                secure: isProd,
                path: '/',
              })
            })
          } catch {
            // `setAll` is called from a Server Component render,
            // where mutating cookies is not allowed. This is safe
            // to ignore because session refresh also runs in
            // proxy.ts (which CAN write cookies) on every request.
          }
        },
      },
    },
  )
}

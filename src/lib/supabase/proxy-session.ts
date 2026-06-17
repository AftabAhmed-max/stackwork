/* ============================================
   SUPABASE — SESSION REFRESH FOR PROXY
   Runs on every matched request. Refreshes the auth
   token (rotating cookies) and reports the validated
   user so the proxy can perform an optimistic guard.

   The cookies written here are HttpOnly (default),
   SameSite=Lax and Secure-in-prod — the same posture
   as the server client. This keeps the browser session
   alive without ever exposing tokens to JS.
   ============================================ */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const isProd = process.env.NODE_ENV === 'production'

export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse
  userId: string | null
}> {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Reflect refreshed cookies onto both the request (so
          // downstream render sees them) and the outgoing response.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              sameSite: 'lax',
              secure: isProd,
              path: '/',
            })
          })
        },
      },
    },
  )

  // IMPORTANT: getUser() validates the token with the Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, userId: user?.id ?? null }
}

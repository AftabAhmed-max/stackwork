/* ============================================
   POST /api/portal/auth/logout
   Full server-side session invalidation:
   - supabase.auth.signOut() revokes the session and
     instructs the client to clear the auth cookies.
   - We also defensively expire any leftover Supabase
     auth cookies on the response.
   No auth state is ever kept in web storage, so there
   is nothing client-side to clear.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Revoke server-side. signOut() also clears cookies via setAll.
  await supabase.auth.signOut()

  const res = NextResponse.json({ ok: true }, { status: 200 })

  // Defensive sweep: expire any sb-* auth cookies that remain.
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith('sb-')) {
      res.cookies.set(cookie.name, '', { path: '/', maxAge: 0 })
    }
  }

  return res
}

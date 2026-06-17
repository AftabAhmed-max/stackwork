/* ============================================
   PROXY  (Next.js 16 — formerly "middleware")
   Three jobs, for /portal and /api/portal only:
     1. Refresh the Supabase session on every request
        so tokens rotate and stay HttpOnly.
     2. OPTIMISTIC guard: bounce unauthenticated users
        away from protected portal routes to /login.
        (This is defence-in-depth only — every page and
        server action ALSO checks auth + role, and the
        database enforces access via RLS. The proxy is
        never the sole gate.)
     3. Attach security headers to portal responses
        WITHOUT affecting the marketing site.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy-session'

// Public portal paths that do NOT require a session.
const PUBLIC_PORTAL_PATHS = ['/portal/login']

function applySecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'none'",
  )
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  return res
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Refresh session + learn whether a valid user exists.
  const { response, userId } = await updateSession(request)

  const isPublic = PUBLIC_PORTAL_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  // Guard: unauthenticated access to a protected portal page →
  // redirect to login (preserving intended destination, validated
  // later by the open-redirect guard).
  const isApi = pathname.startsWith('/api/portal')
  if (!userId && !isPublic && !isApi) {
    const loginUrl = new URL('/portal/login', request.url)
    if (pathname !== '/portal') {
      loginUrl.searchParams.set('next', pathname)
    }
    const redirectRes = NextResponse.redirect(loginUrl)
    // Carry refreshed auth cookies onto the redirect response.
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c))
    return applySecurityHeaders(redirectRes)
  }

  // If an authenticated user lands on /portal or /portal/login,
  // send them inward. Final role-routing happens server-side.
  if (userId && (pathname === '/portal' || pathname === '/portal/login')) {
    const dest = new URL('/portal/admin', request.url)
    const redirectRes = NextResponse.redirect(dest)
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c))
    return applySecurityHeaders(redirectRes)
  }

  return applySecurityHeaders(response)
}

export const config = {
  // Run only on portal pages + portal API. The marketing site is
  // never touched, so its chrome/headers are unchanged.
  matcher: ['/portal/:path*', '/api/portal/:path*'],
}

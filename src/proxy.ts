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
import { SECURITY_HEADERS } from '@/lib/security-headers'

// Public portal paths that do NOT require a session.
const PUBLIC_PORTAL_PATHS = ['/portal/login']

// Apply the shared security-header suite (incl. the full CSP) to
// portal responses. The same suite is applied to marketing routes
// via next.config.ts headers(), so posture is identical everywhere.
function applySecurityHeaders(res: NextResponse) {
  for (const { key, value } of SECURITY_HEADERS) {
    res.headers.set(key, value)
  }
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
    // Hardcoded destination only — no `next`/`redirectTo` parameter is
    // generated or honoured (post-login routing is role-based and
    // server-resolved), so there is no open-redirect surface. (L-08)
    const loginUrl = new URL('/portal/login', request.url)
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

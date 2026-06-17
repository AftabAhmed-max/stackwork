/* ============================================
   SAME-ORIGIN ENFORCEMENT  (M-04, CSRF defense-in-depth)
   A lightweight Origin check for authenticated,
   state-changing portal endpoints. It layers on top of
   the existing SameSite=Lax cookies: a cross-site
   POST/DELETE is rejected even if a browser ever attached
   the cookie.

   Strategy:
     - Compare the request's `Origin` header host to the
       host the request actually arrived on. We accept a
       match against EITHER `x-forwarded-host` (public
       host behind a proxy/CDN) OR `host`, so legitimate
       same-origin requests behind Vercel/Netlify pass.
     - A missing/invalid Origin on a state-changing request
       is rejected (browsers always send Origin on
       POST/DELETE). Non-browser clients must send a
       correct Origin.

   This does NOT touch authentication, RLS, routing, or the
   download model — it only adds a same-origin gate.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'

export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false

  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    return false
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = request.headers.get('host')

  return (
    (!!forwardedHost && originHost === forwardedHost) ||
    (!!host && originHost === host)
  )
}

/**
 * Returns a 403 response if the request is not same-origin, or null
 * if it is. Call at the top of mutating route handlers:
 *   const bad = enforceSameOrigin(request); if (bad) return bad
 */
export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  if (isSameOrigin(request)) return null
  return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 })
}

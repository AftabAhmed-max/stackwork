/* ============================================
   SHARED SECURITY HEADERS  (L-03, L-04)
   Single source of truth for the security response
   headers applied across the whole site:
     - The PROXY (src/proxy.ts) applies them to
       /portal/* and /api/portal/* responses.
     - next.config.ts applies them to all OTHER
       (marketing) routes via headers().
   Keeping one definition guarantees identical posture
   on both surfaces with no drift.

   CSP is intentionally practical, not maximal: it
   preserves Next.js, Supabase, EmailJS, Google
   Analytics and self-hosted fonts/assets.

   Why 'unsafe-inline' for script/style:
     Next.js injects inline bootstrap/hydration scripts
     and @next/third-parties injects an inline GA config
     snippet; this app does not run a nonce pipeline, so
     'unsafe-inline' is required to avoid breaking
     production. 'unsafe-eval' is deliberately NOT
     granted (not needed in a production Next build).
   ============================================ */

const CSP_DIRECTIVES: Record<string, string[]> = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  // Allow self-hosted + data/blob images, and https images (e.g. any
  // future remote image). Tighten later if a fixed host set is known.
  'img-src': ["'self'", 'data:', 'blob:', 'https:'],
  'font-src': ["'self'", 'data:'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://www.googletagmanager.com',
    'https://*.google-analytics.com',
  ],
  // REST + Realtime (Supabase), EmailJS, and Google Analytics beacons.
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.emailjs.com',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
  ],
  // The only iframe used is a same-origin sample wireframe.
  'frame-src': ["'self'"],
  'worker-src': ["'self'", 'blob:'],
  'manifest-src': ["'self'"],
}

function buildCsp(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}

export type SecurityHeader = { key: string; value: string }

export const SECURITY_HEADERS: SecurityHeader[] = [
  { key: 'Content-Security-Policy', value: buildCsp() },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  // HSTS without includeSubDomains/preload to avoid impacting any
  // non-HTTPS subdomain; the apex is served over HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

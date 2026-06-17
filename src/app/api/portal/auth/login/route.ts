/* ============================================
   POST /api/portal/auth/login
   Rate-limited, enumeration-safe credential login.
   - Throttled per-IP (429 on limit).
   - On ANY failure returns a single generic 401
     "Invalid credentials." — never reveals whether
     the email exists or which check failed.
   - On success, Supabase sets the HttpOnly auth
     cookies and we return the role-based redirect
     target (a hardcoded internal path).
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, clientIpFromHeaders, LOGIN_LIMIT } from '@/lib/rate-limit'
import { isValidEmail, isValidPassword } from '@/lib/validation'

const GENERIC_401 = { error: 'Invalid credentials.' }

export async function POST(request: NextRequest) {
  // 1) Throttle by IP.
  const ip = clientIpFromHeaders(request.headers)
  const rl = rateLimit('login', ip, LOGIN_LIMIT.limit, LOGIN_LIMIT.windowMs)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    )
  }

  // 2) Parse + validate input server-side.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(GENERIC_401, { status: 401 })
  }
  const email = (body as Record<string, unknown>)?.email
  const password = (body as Record<string, unknown>)?.password

  if (!isValidEmail(email) || !isValidPassword(password)) {
    // Same generic response as bad credentials — no enumeration,
    // no leaking of which field failed validation.
    return NextResponse.json(GENERIC_401, { status: 401 })
  }

  // 3) Attempt sign-in. The server client writes HttpOnly cookies.
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return NextResponse.json(GENERIC_401, { status: 401 })
  }

  // 4) Resolve role for hardcoded role-based redirect.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const redirect = profile?.role === 'admin' ? '/portal/admin' : '/portal/client'

  return NextResponse.json({ ok: true, redirect }, { status: 200 })
}

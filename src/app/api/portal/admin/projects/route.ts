/* ============================================
   POST /api/portal/admin/projects
   Create a project AND its client login in ONE
   idempotent, double-submit-safe action.

   Guards (in order):
     1. Auth + role=admin (server-verified).
     2. Per-IP rate limit (429).
     3. Full server-side input validation.
     4. In-flight lock per email → blocks concurrent
        double-submit from creating duplicate users.
     5. Supabase's unique-email constraint is the
        durable backstop against duplicate users.
     6. Compensating delete: if the project insert
        fails after the user was created, the orphan
        auth user is removed so retries stay clean.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { getAuthContext } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit, clientIpFromHeaders, CREATE_LIMIT } from '@/lib/rate-limit'
import { isValidEmail, isValidPassword, cleanRequiredText } from '@/lib/validation'

// Per-server in-flight email locks (best-effort double-submit guard).
const inFlight = new Set<string>()

export async function POST(request: NextRequest) {
  // 1) Auth + admin role.
  const ctx = await getAuthContext()
  if (!ctx) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  if (ctx.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  // 2) Rate limit.
  const ip = clientIpFromHeaders(request.headers)
  const rl = rateLimit('create-project', ip, CREATE_LIMIT.limit, CREATE_LIMIT.windowMs)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    )
  }

  // 3) Parse + validate.
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = body.password
  const displayName = cleanRequiredText(body.displayName)
  const projectName = cleanRequiredText(body.projectName)

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid client email is required.' }, { status: 400 })
  }
  if (!isValidPassword(password)) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    )
  }
  if (!displayName) {
    return NextResponse.json({ error: 'Client display name is required.' }, { status: 400 })
  }
  if (!projectName) {
    return NextResponse.json({ error: 'Project name is required.' }, { status: 400 })
  }

  // 4) In-flight lock (reject concurrent duplicate submit).
  if (inFlight.has(email)) {
    return NextResponse.json(
      { error: 'A request for this client is already being processed.' },
      { status: 409 },
    )
  }
  inFlight.add(email)

  const admin = createAdminClient()

  try {
    // 5) Create the auth user. email_confirm=true so the client can
    //    sign in immediately (no public signup exists). display_name
    //    is passed in metadata for the profile trigger.
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: password as string,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    })

    if (createErr || !created?.user) {
      const msg = (createErr?.message ?? '').toLowerCase()
      const isDuplicate =
        msg.includes('already') || msg.includes('registered') || msg.includes('exists')
      return NextResponse.json(
        {
          error: isDuplicate
            ? 'A client with this email already exists.'
            : 'Could not create the client login.',
        },
        { status: isDuplicate ? 409 : 500 },
      )
    }

    const newUserId = created.user.id

    // Ensure the profile row carries the display name (the trigger
    // creates the row with role='client', is_active=true).
    await admin
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', newUserId)

    // 6) Insert the project owned by the new client.
    const { data: project, error: projectErr } = await admin
      .from('projects')
      .insert({
        name: projectName,
        client_name: displayName,
        owner_id: newUserId,
        status: 'ongoing',
      })
      .select('id')
      .single()

    if (projectErr || !project) {
      // Compensating cleanup: remove the orphaned auth user so the
      // admin can retry without hitting the duplicate-email guard.
      await admin.auth.admin.deleteUser(newUserId)
      return NextResponse.json(
        { error: 'Could not create the project. Please try again.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, projectId: project.id }, { status: 201 })
  } finally {
    inFlight.delete(email)
  }
}

/* ============================================
   POST /api/portal/admin/projects/[projectId]/active
   Admin-only. Explicitly toggle the project client's
   is_active flag. This is the ONLY way to reactivate
   a client after a project was closed.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { getAuthContext } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { enforceSameOrigin } from '@/lib/origin'
import { isUuid } from '@/lib/validation'

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ projectId: string }> },
) {
  const originError = enforceSameOrigin(request) // CSRF: same-origin only (M-04)
  if (originError) return originError

  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  if (auth.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { projectId } = await ctx.params
  if (!isUuid(projectId)) {
    return NextResponse.json({ error: 'Invalid project id.' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof body.isActive !== 'boolean') {
    return NextResponse.json({ error: 'isActive must be a boolean.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: project, error: fetchErr } = await admin
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single()

  if (fetchErr || !project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  const { error: updErr } = await admin
    .from('profiles')
    .update({ is_active: body.isActive })
    .eq('id', project.owner_id)

  if (updErr) {
    return NextResponse.json({ error: 'Could not update client access.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

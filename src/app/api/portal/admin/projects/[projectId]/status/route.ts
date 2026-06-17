/* ============================================
   POST /api/portal/admin/projects/[projectId]/status
   Admin-only. Change a project's status.
   Closing a project ALSO deactivates its client
   (is_active=false). Reopening does NOT reactivate —
   the admin must toggle that explicitly elsewhere.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { getAuthContext } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { enforceSameOrigin } from '@/lib/origin'
import { isProjectStatus, isUuid } from '@/lib/validation'

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

  const status = body.status
  if (!isProjectStatus(status)) {
    return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Need the owner to cascade deactivation on close.
  const { data: project, error: fetchErr } = await admin
    .from('projects')
    .select('id, owner_id')
    .eq('id', projectId)
    .single()

  if (fetchErr || !project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  const { error: updErr } = await admin
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (updErr) {
    return NextResponse.json({ error: 'Could not update status.' }, { status: 500 })
  }

  // Auto-deactivate the client when the project is closed.
  if (status === 'closed') {
    await admin.from('profiles').update({ is_active: false }).eq('id', project.owner_id)
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

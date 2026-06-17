/* ============================================
   DELETE /api/portal/admin/documents/[documentId]
   Admin-only. Removes the stored object from the
   private bucket AND deletes its metadata row.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { getAuthContext } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { enforceSameOrigin } from '@/lib/origin'
import { isUuid } from '@/lib/validation'

const BUCKET = 'project-documents'

export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ documentId: string }> },
) {
  const originError = enforceSameOrigin(request) // CSRF: same-origin only (M-04)
  if (originError) return originError

  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  if (auth.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { documentId } = await ctx.params
  if (!isUuid(documentId)) {
    return NextResponse.json({ error: 'Invalid document id.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: doc, error: fetchErr } = await admin
    .from('documents')
    .select('id, storage_path')
    .eq('id', documentId)
    .single()

  if (fetchErr || !doc) {
    return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
  }

  // Remove the stored object first (best-effort), then the row.
  // Staging Link rows have a null storage_path — nothing to remove.
  if (doc.storage_path) {
    await admin.storage.from(BUCKET).remove([doc.storage_path])
  }

  const { error: delErr } = await admin.from('documents').delete().eq('id', documentId)
  if (delErr) {
    return NextResponse.json({ error: 'Could not delete the document.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

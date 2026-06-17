/* ============================================
   GET /api/portal/download/[documentId]
   Issues a short-lived (60s) signed URL for a private
   document, and ONLY after verifying the requester is
   entitled to it.

   IDOR protection: entitlement is checked by SELECTing
   the document through the user's OWN RLS context (the
   cookie-bound anon client). The database policy only
   returns the row if the caller is an admin, or a
   client who owns the document's project AND is active.
   A client crafting another client's documentId simply
   gets no row back → 404. The bucket is private and no
   public URL ever exists; the signed URL expires in 60s.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAuthContext } from '@/lib/auth'
import { isUuid } from '@/lib/validation'

const BUCKET = 'project-documents'
const SIGNED_URL_TTL_SECONDS = 60

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ documentId: string }> },
) {
  // Must be authenticated.
  const auth = await getAuthContext()
  if (!auth) {
    return NextResponse.redirect(new URL('/portal/login', request.url))
  }

  const { documentId } = await ctx.params
  if (!isUuid(documentId)) {
    return NextResponse.json({ error: 'Invalid document id.' }, { status: 400 })
  }

  // Entitlement check via the caller's RLS context.
  const supabase = await createClient()
  const { data: doc, error } = await supabase
    .from('documents')
    .select('id, storage_path, file_name')
    .eq('id', documentId)
    .single()

  if (error || !doc) {
    // Not entitled (or doesn't exist) — never disclose which.
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  // This route serves FILE rows only. Staging Link rows have a null
  // storage_path and are not downloadable — never try to sign them.
  if (!doc.storage_path) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  }

  // Mint a short-lived signed URL (private bucket, no public access).
  const admin = createAdminClient()
  const { data: signed, error: signErr } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(doc.storage_path, SIGNED_URL_TTL_SECONDS, {
      download: doc.file_name,
    })

  if (signErr || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Could not prepare download.' }, { status: 500 })
  }

  return NextResponse.redirect(signed.signedUrl)
}

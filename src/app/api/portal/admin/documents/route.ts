/* ============================================
   POST /api/portal/admin/documents   (multipart)
   Admin-only. Creates a document row for a project.

   A row is EITHER a FILE or a LINK:
     - Stage "Staging Link"  → a URL (link_url set, no file).
       The body carries a `url` text field; it is validated
       server-side as a well-formed http(s) URL (≤500 chars)
       and stored in link_url with storage_path null.
     - All OTHER stages       → an uploaded FILE, exactly as
       before. Type checked against a server allowlist by the
       real content-type, size capped at 10 MB, and stored at a
       server-generated `<projectId>/<uuid>.<ext>` path (the raw
       filename never appears in the path).

   The client is never trusted for stage type, URL, or file —
   everything is re-validated here.
   ============================================ */
import { NextResponse, type NextRequest } from 'next/server'
import { randomUUID } from 'node:crypto'
import { getAuthContext } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  isStageLabel,
  isUuid,
  isAllowedMime,
  isValidHttpUrl,
  hostnameLabel,
  ALLOWED_MIME_TYPES,
  MAX_FILE_BYTES,
  cleanRequiredText,
} from '@/lib/validation'

const BUCKET = 'project-documents'

export async function POST(request: NextRequest) {
  const auth = await getAuthContext()
  if (!auth) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  if (auth.profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 })
  }

  const projectId = form.get('projectId')
  const stageLabel = form.get('stageLabel')

  if (typeof projectId !== 'string' || !isUuid(projectId)) {
    return NextResponse.json({ error: 'Invalid project id.' }, { status: 400 })
  }
  if (!isStageLabel(stageLabel)) {
    return NextResponse.json({ error: 'Invalid stage label.' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Ensure the target project actually exists.
  const { data: project, error: projErr } = await admin
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .single()
  if (projErr || !project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  /* ---------- STAGING LINK branch: store a URL, no file ---------- */
  if (stageLabel === 'Staging Link') {
    const url = form.get('url')
    if (!isValidHttpUrl(url)) {
      return NextResponse.json(
        { error: 'A valid http(s) URL is required (max 500 characters).' },
        { status: 400 },
      )
    }

    const { error: linkErr } = await admin.from('documents').insert({
      project_id: projectId,
      stage_label: stageLabel,
      file_name: hostnameLabel(url), // friendly display label
      storage_path: null,
      link_url: url,
      mime_type: null,
      size_bytes: null,
    })

    if (linkErr) {
      return NextResponse.json({ error: 'Could not save the staging link.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  /* ---------- FILE branch: all other stages ---------- */
  const file = form.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'A file is required.' }, { status: 400 })
  }
  // Type allowlist by REAL content-type.
  if (!isAllowedMime(file.type)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Allowed: PDF, PNG, JPG, WEBP, DOC, DOCX.' },
      { status: 400 },
    )
  }
  // Size cap.
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: 'File exceeds the 10 MB limit.' }, { status: 400 })
  }

  // Server-generated path; extension derived from the allowlist,
  // not from the (untrusted) filename.
  const ext = ALLOWED_MIME_TYPES[file.type]
  const storagePath = `${projectId}/${randomUUID()}.${ext}`

  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error: uploadErr } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadErr) {
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  // Original filename kept ONLY as a display label (bounded length).
  const displayName = cleanRequiredText(file.name, 255) ?? `document.${ext}`

  const { error: insertErr } = await admin.from('documents').insert({
    project_id: projectId,
    stage_label: stageLabel,
    file_name: displayName,
    storage_path: storagePath,
    link_url: null,
    mime_type: file.type,
    size_bytes: file.size,
  })

  if (insertErr) {
    // Roll back the stored object if the metadata insert fails.
    await admin.storage.from(BUCKET).remove([storagePath])
    return NextResponse.json({ error: 'Could not save the document.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

'use client'

/* ============================================
   DOCUMENT ROW (shared: admin + client)
   Renders EITHER a file row or a staging-link row.

   FILE row:
     - Download button → server download route, which
       verifies entitlement and 302s to a 60s signed
       URL. No public URL is ever exposed.
   LINK row (linkUrl set):
     - Copy link (clipboard) + Open (new tab,
       rel="noreferrer noopener") buttons. NO download.

   All text (fileName, the URL) is rendered as PLAIN
   TEXT via React escaping — never as HTML. Delete only
   renders for admins; the server re-checks admin.
   ============================================ */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Download,
  Trash2,
  FileText,
  FileImage,
  FileType,
  Link2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function iconFor(mime: string | null | undefined) {
  if (!mime) return <FileText size={18} />
  if (mime.startsWith('image/')) return <FileImage size={18} />
  if (mime === 'application/pdf') return <FileType size={18} />
  return <FileText size={18} />
}

export default function DocumentRow({
  id,
  fileName,
  mimeType,
  sizeBytes,
  linkUrl,
  admin = false,
}: {
  id: string
  fileName: string
  mimeType?: string | null
  sizeBytes?: number | null
  linkUrl?: string | null
  admin?: boolean
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  const isLink = Boolean(linkUrl)

  async function onDelete() {
    if (deleting) return
    if (!confirm('Delete this document? This cannot be undone.')) return
    setError(false)
    setDeleting(true)
    try {
      const res = await fetch(`/api/portal/admin/documents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      } else {
        setError(true)
        setDeleting(false)
      }
    } catch {
      setError(true)
      setDeleting(false)
    }
  }

  async function onCopy() {
    if (!linkUrl) return
    try {
      await navigator.clipboard.writeText(linkUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setError(true)
    }
  }

  return (
    <div className="doc-row">
      <div className="doc-icon">{isLink ? <Link2 size={18} /> : iconFor(mimeType)}</div>

      <div style={{ minWidth: 0, flex: 1 }}>
        {/* Plain-text render — escaped by React */}
        <div
          style={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {fileName}
        </div>
        <div
          className="doc-meta"
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {isLink ? linkUrl : formatSize(sizeBytes ?? 0)}
          {error ? ' · action failed, try again' : ''}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
        {isLink ? (
          <>
            <button className="btn btn-ghost btn-sm" onClick={onCopy} aria-label="Copy link">
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <a
              className="btn btn-ghost btn-sm"
              href={linkUrl ?? '#'}
              target="_blank"
              rel="noreferrer noopener"
            >
              <ExternalLink size={15} /> Open
            </a>
          </>
        ) : (
          <a className="btn btn-ghost btn-sm" href={`/api/portal/download/${id}`}>
            <Download size={15} /> Download
          </a>
        )}

        {admin ? (
          <button
            className="btn btn-danger btn-sm"
            onClick={onDelete}
            disabled={deleting}
            aria-label="Delete document"
          >
            {deleting ? <span className="spinner" /> : <Trash2 size={15} />}
          </button>
        ) : null}
      </div>
    </div>
  )
}

'use client'

/* ============================================
   DOCUMENT UPLOAD (client)
   Stage select + (file picker OR url input) → POSTs
   multipart to the documents route.

   When stage = "Staging Link" the file picker is
   replaced by a URL text field; every other stage is a
   file upload exactly as before. The browser hints
   (accept list, url type) are UX only — the SERVER
   independently enforces the type allowlist, 10 MB cap,
   and http(s) URL validation.
   ============================================ */
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, Link as LinkIcon } from 'lucide-react'
import {
  STAGE_LABELS,
  type StageLabel,
  MAX_FILE_BYTES,
  MAX_URL_LENGTH,
} from '@/lib/validation'

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.doc,.docx'

export default function DocumentUpload({ projectId }: { projectId: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [stage, setStage] = useState<StageLabel>(STAGE_LABELS[0])
  const [fileName, setFileName] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isLink = stage === 'Staging Link'

  function resetInputs() {
    setFileName('')
    setUrl('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (uploading) return
    setError(null)
    setSuccess(false)

    const fd = new FormData()
    fd.append('projectId', projectId)
    fd.append('stageLabel', stage)

    if (isLink) {
      const trimmed = url.trim()
      // Lightweight client check; the server is authoritative.
      let valid = trimmed.length > 0 && trimmed.length <= MAX_URL_LENGTH
      if (valid) {
        try {
          const u = new URL(trimmed)
          valid = u.protocol === 'http:' || u.protocol === 'https:'
        } catch {
          valid = false
        }
      }
      if (!valid) {
        setError('Enter a valid http(s) URL (max 500 characters).')
        return
      }
      fd.append('url', trimmed)
    } else {
      const file = fileRef.current?.files?.[0]
      if (!file) {
        setError('Please choose a file.')
        return
      }
      if (file.size > MAX_FILE_BYTES) {
        setError('File exceeds the 10 MB limit.')
        return
      }
      fd.append('file', file)
    }

    setUploading(true)
    try {
      const res = await fetch('/api/portal/admin/documents', { method: 'POST', body: fd })
      if (res.ok) {
        setSuccess(true)
        resetInputs()
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Upload failed.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error ? (
        <div className="alert alert-error" style={{ marginBottom: 16 }} role="alert">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="alert alert-success" style={{ marginBottom: 16 }} role="status">
          {isLink ? 'Staging link saved.' : 'Document uploaded.'}
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0 16px',
        }}
      >
        <div className="field">
          <label htmlFor="stage">Stage</label>
          <select
            id="stage"
            className="select"
            value={stage}
            onChange={(e) => {
              setStage(e.target.value as StageLabel)
              setError(null)
              setSuccess(false)
            }}
          >
            {STAGE_LABELS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {isLink ? (
          <div className="field">
            <label htmlFor="url">Staging URL</label>
            <input
              id="url"
              className="input"
              type="url"
              inputMode="url"
              placeholder="https://test-staging.vercel.app"
              maxLength={MAX_URL_LENGTH}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        ) : (
          <div className="field">
            <label htmlFor="file">File (max 10 MB)</label>
            <input
              id="file"
              ref={fileRef}
              className="input"
              type="file"
              accept={ACCEPT}
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
            />
            {fileName ? (
              <span className="muted" style={{ fontSize: 12 }}>
                {fileName}
              </span>
            ) : null}
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" disabled={uploading} style={{ marginTop: 6 }}>
        {uploading ? (
          <span className="spinner" />
        ) : isLink ? (
          <LinkIcon size={16} />
        ) : (
          <UploadCloud size={16} />
        )}
        {uploading ? 'Saving…' : isLink ? 'Save staging link' : 'Upload'}
      </button>
    </form>
  )
}

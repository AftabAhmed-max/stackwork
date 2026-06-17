'use client'

/* ============================================
   STATUS CONTROL (client)
   Select + Save → POST status route. Closing also
   deactivates the client server-side; we surface a
   note so the admin understands the side-effect.
   ============================================ */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { PROJECT_STATUSES, type ProjectStatus } from '@/lib/validation'

const LABELS: Record<ProjectStatus, string> = {
  ongoing: 'Ongoing',
  on_hold: 'On Hold',
  closed: 'Closed',
}

export default function StatusControl({
  projectId,
  current,
}: {
  projectId: string
  current: ProjectStatus
}) {
  const router = useRouter()
  const [value, setValue] = useState<ProjectStatus>(current)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = value !== current

  async function save() {
    if (saving || !dirty) return
    setError(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/portal/admin/projects/${projectId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Could not update status.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          className="select"
          value={value}
          onChange={(e) => setValue(e.target.value as ProjectStatus)}
          style={{ maxWidth: 200 }}
          aria-label="Project status"
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LABELS[s]}
            </option>
          ))}
        </select>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={!dirty || saving}>
          {saving ? <span className="spinner" /> : <Check size={15} />}
          Save
        </button>
      </div>

      {value === 'closed' && dirty ? (
        <p className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>
          Closing this project will also deactivate the client&apos;s portal access.
        </p>
      ) : null}
      {error ? (
        <p style={{ fontSize: 12.5, marginTop: 8, color: '#ff9d9d' }}>{error}</p>
      ) : null}
    </div>
  )
}

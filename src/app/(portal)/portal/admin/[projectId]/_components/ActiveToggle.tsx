'use client'

/* ============================================
   ACTIVE TOGGLE (client)
   Explicitly enables/disables the client's portal
   access via the active route. This is the only way
   to reactivate a client after a project was closed.
   ============================================ */
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ActiveToggle({
  projectId,
  isActive,
}: {
  projectId: string
  isActive: boolean
}) {
  const router = useRouter()
  const [active, setActive] = useState(isActive)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  async function toggle() {
    if (saving) return
    const next = !active
    setError(false)
    setSaving(true)
    try {
      const res = await fetch(`/api/portal/admin/projects/${projectId}/active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: next }),
      })
      if (res.ok) {
        setActive(next)
        router.refresh()
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          role="switch"
          aria-checked={active}
          onClick={toggle}
          disabled={saving}
          style={{
            position: 'relative',
            width: 50,
            height: 28,
            borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.15)',
            background: active ? 'var(--color-green)' : 'rgba(255,255,255,0.08)',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
            flex: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: active ? 24 : 2,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s ease',
            }}
          />
        </button>
        <span style={{ fontWeight: 600, color: active ? '#7ad6a0' : 'var(--color-muted)' }}>
          {active ? 'Active' : 'Inactive'}
        </span>
      </div>
      {error ? (
        <p style={{ fontSize: 12.5, marginTop: 8, color: '#ff9d9d' }}>
          Could not update access. Try again.
        </p>
      ) : null}
    </div>
  )
}

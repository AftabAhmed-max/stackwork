'use client'

/* ============================================
   CREATE PROJECT + CLIENT (client component)
   Posts to /api/portal/admin/projects. The submit
   button is disabled while in-flight to prevent the
   client-side half of double-submit; the server also
   enforces an in-flight lock + unique-email guard.
   ============================================ */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'

export default function CreateProjectForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    projectName: '',
    displayName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await fetch('/api/portal/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => null)

      if (res.ok) {
        setSuccess('Project and client created.')
        setForm({ projectName: '', displayName: '', email: '', password: '' })
        router.refresh()
      } else {
        setError(data?.error ?? 'Could not create the project.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error ? (
        <div className="alert alert-error" style={{ marginBottom: 16 }} role="alert">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="alert alert-success" style={{ marginBottom: 16 }} role="status">
          {success}
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
          <label htmlFor="projectName">Project name</label>
          <input
            id="projectName"
            className="input"
            value={form.projectName}
            onChange={(e) => set('projectName', e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="displayName">Client name</label>
          <input
            id="displayName"
            className="input"
            value={form.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            maxLength={200}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="clientEmail">Client email</label>
          <input
            id="clientEmail"
            className="input"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="clientPassword">Temporary password</label>
          <input
            id="clientPassword"
            className="input"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            minLength={8}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 6 }}>
        {loading ? <span className="spinner" /> : <UserPlus size={16} />}
        {loading ? 'Creating…' : 'Create project & client'}
      </button>
    </form>
  )
}

'use client'

/* ============================================
   LOGIN FORM (client)
   Posts credentials to /api/portal/auth/login.
   - The server returns a hardcoded role-based
     redirect path; we still re-validate it is an
     internal /portal path before navigating.
   - All failures surface a single generic message.
   ============================================ */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

function isInternalPortalPath(p: unknown): p is string {
  return typeof p === 'string' && /^\/portal(\/|$)/.test(p) && !p.startsWith('//')
}

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.ok) {
        const data = await res.json().catch(() => null)
        const dest = isInternalPortalPath(data?.redirect) ? data.redirect : '/portal'
        router.replace(dest)
        router.refresh()
        return
      }

      if (res.status === 429) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Too many attempts. Please wait and try again.')
      } else {
        // Generic for 400/401 — no user enumeration.
        setError('Invalid credentials.')
      }
      setLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
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

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          autoComplete="username"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
        style={{ marginTop: 6 }}
      >
        {loading ? <span className="spinner" /> : <LogIn size={16} />}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

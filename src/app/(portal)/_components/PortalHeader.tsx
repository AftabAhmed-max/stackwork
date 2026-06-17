'use client'

/* ============================================
   PORTAL HEADER
   Wordmark + sign-out. Logout POSTs to the server
   logout route (full server-side session invalidation)
   then navigates to the login page. No auth state is
   ever stored in web storage.
   ============================================ */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function PortalHeader({ subtitle }: { subtitle?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    setLoading(true)
    try {
      await fetch('/api/portal/auth/logout', { method: 'POST' })
    } finally {
      // Hard replace so no protected view stays in history.
      router.replace('/portal/login')
      router.refresh()
    }
  }

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <div className="portal-wordmark">
          <span className="stack">Stack</span>
          <span className="work">work</span>
        </div>
        {subtitle ? (
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      <button className="btn btn-ghost btn-sm" onClick={signOut} disabled={loading}>
        {loading ? <span className="spinner" /> : <LogOut size={15} />}
        Sign out
      </button>
    </header>
  )
}

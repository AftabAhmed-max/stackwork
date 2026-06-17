/* ============================================
   /portal/login
   Premium, centered sign-in. Already-authenticated
   users are routed inward by the proxy; this page also
   redirects them server-side as a belt-and-braces check.
   ============================================ */
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const ctx = await getAuthContext()
  if (ctx) {
    redirect(ctx.profile.role === 'admin' ? '/portal/admin' : '/portal/client')
  }

  return (
    <main className="portal-center">
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="portal-wordmark" style={{ fontSize: 32 }}>
            <span className="stack">Stack</span>
            <span className="work">work</span>
          </div>
          <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
            Client Portal
          </p>
        </div>

        <div className="portal-card" style={{ padding: 28 }}>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>Sign in</h1>
          <p className="muted" style={{ fontSize: 13.5, marginBottom: 22 }}>
            Use the credentials provided by Stackwork.
          </p>
          <LoginForm />
        </div>

        <p
          className="muted"
          style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5 }}
        >
          Access is by invitation only. Contact Stackwork for assistance.
        </p>
      </div>
    </main>
  )
}

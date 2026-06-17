/* ============================================
   /portal  — role-based entry point
   Server-side resolves the session + role and routes
   accordingly. Backs up the proxy's optimistic guard.
   ============================================ */
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth'

export default async function PortalIndex() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/portal/login')
  redirect(ctx.profile.role === 'admin' ? '/portal/admin' : '/portal/client')
}

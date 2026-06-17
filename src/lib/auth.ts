/* ============================================
   SERVER-SIDE AUTH + ROLE RESOLUTION
   The ONLY trusted source of identity and role.

   - getUser() asks the Supabase Auth server to
     validate the access token (it does NOT merely
     decode the cookie), so a forged/edited cookie
     cannot impersonate a user.
   - The role + is_active come from the `profiles`
     table read under the user's own RLS context.
     We NEVER read role from the client/request.

   These helpers are called at the top of every
   protected Server Component and Server Action.
   ============================================ */
import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type Profile = {
  id: string
  role: 'admin' | 'client'
  display_name: string | null
  is_active: boolean
}

export type AuthContext = {
  userId: string
  email: string | null
  profile: Profile
}

/**
 * Resolve the current authenticated user + profile, or null.
 * Returns null on any failure (no session, missing profile, etc).
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, display_name, is_active')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) return null

  return {
    userId: user.id,
    email: user.email ?? null,
    profile: profile as Profile,
  }
}

/**
 * Require an authenticated ADMIN. Redirects to the login
 * page otherwise. Returns the AuthContext on success.
 */
export async function requireAdmin(): Promise<AuthContext> {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/portal/login')
  if (ctx.profile.role !== 'admin') {
    // A non-admin (client) hitting an admin route is sent to
    // their own area — never shown admin data.
    redirect('/portal/client')
  }
  return ctx
}

/**
 * Require an authenticated CLIENT (role='client'). Redirects
 * admins to the admin dashboard and unauthenticated users to
 * login. Note: an inactive client is still returned here — the
 * caller renders the locked state and the DB RLS returns no data.
 */
export async function requireClient(): Promise<AuthContext> {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/portal/login')
  if (ctx.profile.role === 'admin') redirect('/portal/admin')
  return ctx
}

/**
 * For Server Actions / Route Handlers that must fail with an
 * error rather than redirect. Returns the AuthContext or throws.
 */
export async function getAdminOrThrow(): Promise<AuthContext> {
  const ctx = await getAuthContext()
  if (!ctx || ctx.profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return ctx
}

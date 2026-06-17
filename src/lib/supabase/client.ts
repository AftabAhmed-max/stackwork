/* ============================================
   SUPABASE — BROWSER CLIENT (anon key only)
   For use inside Client Components. Uses ONLY the
   public anon key. Auth state lives in HttpOnly
   cookies managed by @supabase/ssr — never in
   localStorage/sessionStorage. The service-role
   key is never imported here.
   ============================================ */
'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

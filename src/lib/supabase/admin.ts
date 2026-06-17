/* ============================================
   SUPABASE — ADMIN CLIENT (service-role key)
   SERVER-ONLY. The service-role key bypasses RLS,
   so it must never reach the browser bundle.

   `import 'server-only'` makes the build FAIL if any
   "use client" module ever imports this file — a hard
   compile-time guarantee that the service-role key is
   never exposed. This client is used only for the few
   privileged operations the anon/RLS client cannot do:
   creating auth users and uploading to private storage
   from trusted, already-authorized server code.

   Every caller of this module MUST first verify the
   requester is an authenticated admin (see lib/auth.ts).
   ============================================ */
import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin client misconfigured: NEXT_PUBLIC_SUPABASE_URL and ' +
        'SUPABASE_SERVICE_ROLE_KEY must be set in the server environment.',
    )
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

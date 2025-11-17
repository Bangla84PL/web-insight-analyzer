/**
 * Supabase Server Configuration
 * Server-side Supabase client with service role key
 * NEVER expose service role key to client
 */

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Server-side Supabase client with service role key
 * WARNING: Use only in API routes and server components
 * Has admin privileges - bypasses RLS
 */
export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

/**
 * Server-side Supabase client with user context
 * Respects Row Level Security (RLS)
 */
export function createSupabaseServer() {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

/**
 * Get authenticated user on server
 */
export async function getServerUser() {
  const supabase = createSupabaseServer()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting server user:', error)
    return null
  }

  return user
}

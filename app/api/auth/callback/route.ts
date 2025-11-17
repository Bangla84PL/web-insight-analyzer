/**
 * Supabase Auth Callback Handler
 * Handles email verification and password reset redirects
 */

import { createSupabaseServer } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createSupabaseServer()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to homepage after authentication
  return NextResponse.redirect(requestUrl.origin)
}

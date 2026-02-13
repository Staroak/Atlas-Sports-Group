import { createClient } from '@/app/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) {
    return NextResponse.redirect(
      new URL('/admin/login?error=missing_token', request.url)
    )
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (error) {
      console.error('Auth confirm error:', error.message)
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    // Invite users need to set their password
    if (type === 'invite') {
      return NextResponse.redirect(new URL('/admin/set-password', request.url))
    }

    // All other types go to admin dashboard
    return NextResponse.redirect(new URL('/admin/programs', request.url))
  } catch (err) {
    console.error('Auth confirm unexpected error:', err)
    return NextResponse.redirect(
      new URL('/admin/login?error=confirm_failed', request.url)
    )
  }
}

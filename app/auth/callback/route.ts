import { createClient } from '@/app/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(
      new URL('/admin/login?error=missing_code', request.url)
    )
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error.message)
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    // Successful token exchange — redirect to set password page
    return NextResponse.redirect(new URL('/admin/set-password', request.url))
  } catch (err) {
    console.error('Auth callback unexpected error:', err)
    return NextResponse.redirect(
      new URL('/admin/login?error=callback_failed', request.url)
    )
  }
}

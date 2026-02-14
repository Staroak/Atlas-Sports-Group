import { createServerClient } from '@supabase/ssr'
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

  // Determine redirect destination before creating response
  const redirectTo = type === 'invite' ? '/admin/set-password' : '/admin/programs'

  try {
    // Route Handlers need cookies written to the NextResponse directly.
    // The shared createClient() uses next/headers cookies() which is
    // read-only here — session cookies silently fail to persist.
    const redirectUrl = new URL(redirectTo, request.url)
    const response = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.verifyOtp({ token_hash, type })

    if (error) {
      console.error('Auth confirm error:', error.message)
      return NextResponse.redirect(
        new URL(`/admin/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }

    return response
  } catch (err) {
    console.error('Auth confirm unexpected error:', err)
    return NextResponse.redirect(
      new URL('/admin/login?error=confirm_failed', request.url)
    )
  }
}

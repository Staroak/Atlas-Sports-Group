import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, let the request through rather than crashing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware')
    return NextResponse.next()
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Refresh session if expired
    const { data: { user } } = await supabase.auth.getUser()

    // Handle admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Allow access to login page
      if (request.nextUrl.pathname === '/admin/login') {
        if (user) {
          // Already logged in, redirect to admin dashboard
          return NextResponse.redirect(new URL('/admin/programs', request.url))
        }
        return supabaseResponse
      }

      // Allow access to set-password page (invited users need to set password before admin_users row exists)
      if (request.nextUrl.pathname === '/admin/set-password') {
        if (!user) {
          return NextResponse.redirect(new URL('/admin/login', request.url))
        }
        return supabaseResponse
      }

      // All other admin routes require authentication
      if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!adminUser) {
        // Not an admin, sign out and redirect to home
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login rather than showing 500
    if (request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

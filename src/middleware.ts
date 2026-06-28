import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session with 1.5s timeout — a hanging promise never throws
  try {
    await Promise.race([
      supabase.auth.getUser(),
      new Promise<void>((resolve) => setTimeout(resolve, 1500)),
    ])
  } catch {
    // Supabase error — continue without session refresh
  }

  return supabaseResponse
}

export const config = {
  // Only run auth middleware on routes that actually need it.
  // Running getUser() on every public page causes Vercel cold-start hangs
  // that stall RSC fetches and break client-side navigation.
  matcher: [
    '/profile/:path*',
    '/u/:path*',
    '/api/:path*',
    '/auth/:path*',
  ],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Next.js Middleware for Route Protection
 *
 * Protected routes: /app/*
 * Public routes: /quiz, /results, /login, /no-access, /
 *
 * Security: Validates Supabase session before allowing access
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // files with extensions (images, fonts, etc.)
  ) {
    return NextResponse.next()
  }

  // Define public routes (no authentication required)
  const publicRoutes = [
    '/quiz',
    '/login',
    '/results',
    '/no-access',
    '/mobile-only',
    '/testoup-offer',
  ]

  // Check if current path is public (exact match or starts with route/)
  const isPublicRoute = pathname === '/' || publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  )

  // If public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected route - check for session
  try {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    // No session or session error - redirect to login
    if (error || !session) {
      console.log(`🔒 Middleware: No session for ${pathname}, redirecting to /login`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname) // Save intended destination
      return NextResponse.redirect(loginUrl)
    }

    // Valid session - allow access
    console.log(`✅ Middleware: Valid session for ${pathname}`)
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, redirect to login for safety
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

/**
 * Matcher configuration
 * Specifies which routes should trigger the middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)',
  ],
}

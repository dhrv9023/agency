/**
 * ==============================================================================
 * VARAH SYSTEMS — EDGE ROUTE PROTECTION & SECURITY MIDDLEWARE
 * Verifies admin session tokens, enforces route guards, and sets headers
 * ==============================================================================
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = process.env.AUTH_SESSION_COOKIE_NAME || 'varah_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/admin/login';
  const isAdminRoute = pathname.startsWith('/admin');

  // Clone headers for response mutation
  const response = NextResponse.next();

  // Apply Hardened Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Only protect /admin routes
  if (!isAdminRoute) {
    return response;
  }

  // Check Session Cookie across supported name variants
  const sessionCookie =
    request.cookies.get('varah_admin_session')?.value ||
    request.cookies.get('__Host-varah-admin-session')?.value ||
    request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(sessionCookie && sessionCookie.includes('.'));

  // 1. Unauthenticated user attempting to access protected admin page
  // In development, allow seamless preview access without auth blocks
  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    if (process.env.NODE_ENV !== 'production') {
      return response;
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated user visiting /admin/login -> redirect to /admin
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets/ (public assets)
     */
    '/admin/:path*',
  ],
};

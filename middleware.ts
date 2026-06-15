import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('rm_session');
  const pathname = request.nextUrl.pathname;
  
  // Public auth paths that logged-in users shouldn't see
  const isAuthPath = 
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/verify-');

  // If user is logged in and trying to access an auth path, redirect to dashboard
  if (isAuthPath && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Paths that are explicitly public and don't require auth
  const isPublicAsset = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname === '/favicon.ico' || 
    pathname.includes('.svg') ||
    pathname.includes('.png') ||
    pathname.startsWith('/appstore-images');
    
  // If user is NOT logged in, and trying to access ANY other route (like /, /dashboard, /reports)
  if (!isAuthPath && !isPublicAsset && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user hits the root path and is logged in, send them directly to the dashboard URL
  if (pathname === '/' && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle the response and attach strict security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
};

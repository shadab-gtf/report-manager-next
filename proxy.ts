import { NextResponse, type NextRequest } from "next/server";

const publicRoutes = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("rm_session")?.value;

  let response = NextResponse.next();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (session) {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else if (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/profile")
  ) {
    if (!session) {
      response = NextResponse.redirect(new URL("/login", request.url));
    } else if (pathname === "/") {
      response = NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Apply strict security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-email",
  ],
};

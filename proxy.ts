import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "@/lib/security/cookie-signer";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieVal = request.cookies.get("rm_session")?.value;
  const roleVal = request.cookies.get("rm_role")?.value || "employee";
  
  // Cryptographically verify the session token signature
  const employeeId = cookieVal ? await verifyToken(cookieVal) : null;

  let response = NextResponse.next();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (employeeId) {
      const target = roleVal === "manager" ? "/dashboard/manager" : "/dashboard";
      response = NextResponse.redirect(new URL(target, request.url));
    }
  } else if (
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/manager") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/profile")
  ) {
    if (!employeeId) {
      response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("rm_session");
      response.cookies.delete("rm_role");
    } else {
      if (pathname === "/") {
        const target = roleVal === "manager" ? "/dashboard/manager" : "/dashboard";
        response = NextResponse.redirect(new URL(target, request.url));
      } else if (roleVal === "manager") {
        // Manager shouldn't access employee-only pages
        if (pathname === "/dashboard" || (pathname.startsWith("/reports") && !pathname.startsWith("/manager/reports"))) {
          response = NextResponse.redirect(new URL("/dashboard/manager", request.url));
        }
      } else {
        // Employee shouldn't access manager pages
        if (pathname.startsWith("/dashboard/manager") || pathname.startsWith("/manager")) {
          response = NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    }
  }

  // Apply strict security headers to all responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  return response;
}

export default proxy;

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/manager/:path*",
    "/reports/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-email",
  ],
};

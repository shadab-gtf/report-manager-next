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
  const role = request.cookies.get("rm_role")?.value;

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(session ? "/dashboard" : "/login", request.url),
    );
  }

  if (publicRoutes.has(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!publicRoutes.has(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/team") && role !== "Manager") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/reports/:path*",
    "/team/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/verify-email",
  ],
};

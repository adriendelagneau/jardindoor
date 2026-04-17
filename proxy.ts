import { auth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Middleware to protect routes.
 * It checks for a session via better-auth and redirects to home if unauthenticated.
 */
export default async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Protect /admin routes - check session AND role
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "ADMIN") {
      console.log(session, "toto")
      // Redirect to home page with a query param to trigger the login modal
      const url = new URL("/", request.url);
     
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public files (logo.svg, etc.)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg|public).*)"],
};

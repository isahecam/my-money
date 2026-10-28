import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = new Set(["/sign-in", "/forgot-password", "/reset-password"]);

// Optimistic check: only looks for the cookie, no DB. Pages do the real check.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes must be skipped, or /sign-in redirects to itself forever.
  if (!publicRoutes.has(pathname) && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Metadata files and public/static must load without a session (crawlers, link previews, email clients).
  matcher: [
    "/((?!api|_next/static|_next/image|static/|favicon.ico|icon.svg|apple-icon.png|opengraph-image|manifest.webmanifest|robots.txt).*)",
  ],
};

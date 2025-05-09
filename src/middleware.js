// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");

  // Check if user is trying to access protected routes
  if (
    !token &&
    (request.nextUrl.pathname.startsWith("/tests") ||
      request.nextUrl.pathname.startsWith("/leaderboard"))
  ) {
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if logged in user is trying to access login page
  if (token && request.nextUrl.pathname.startsWith("/auth")) {
    const testsUrl = new URL("/tests", request.url);
    return NextResponse.redirect(testsUrl);
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/tests/:path*", "/leaderboard/:path*", "/auth"],
};

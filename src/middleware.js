import { NextResponse } from "next/server";

export function middleware(request) {
  // Get token from both cookies and headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const refreshToken = request.cookies.get("refreshToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Check if user is trying to access protected routes
  if (
    !token &&
    (pathname.startsWith("/tests") ||
      pathname.startsWith("/leaderboard"))
  ) {
    // If we have a refresh token, let the app try to refresh
    if (refreshToken) {
      return NextResponse.next();
    }

    // Redirect to home
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Check if user is accessing the home page
  if (token && pathname === "/") {
    // Redirect authenticated users to tests
    const testsUrl = new URL("/tests", request.url);
    return NextResponse.redirect(testsUrl);
  }

  // Check if logged in user is trying to access login page (handle old /auth route)
  if (token && pathname.startsWith("/auth")) {
    // Redirect to tests
    const testsUrl = new URL("/tests", request.url);
    return NextResponse.redirect(testsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/tests/:path*", "/leaderboard/:path*", "/auth", "/start/:path*"],
};

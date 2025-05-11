import { NextResponse } from "next/server";

export function middleware(request) {
  // Get token from both cookies and headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log("Middleware - Token present:", !!token);
  console.log("Middleware - Refresh token present:", !!refreshToken);
  console.log("Middleware - Path:", request.nextUrl.pathname);

  // Check if user is trying to access protected routes
  if (
    !token &&
    (request.nextUrl.pathname.startsWith("/tests") ||
      request.nextUrl.pathname.startsWith("/leaderboard"))
  ) {
    // If we have a refresh token, let the app try to refresh
    if (refreshToken) {
      console.log(
        "Middleware - Has refresh token, allowing through to attempt refresh"
      );
      return NextResponse.next();
    }

    console.log("Middleware - No token or refresh token, redirecting to auth");
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if logged in user is trying to access login page
  if (token && request.nextUrl.pathname.startsWith("/auth")) {
    console.log("Middleware - Redirecting to tests");
    const testsUrl = new URL("/tests", request.url);
    return NextResponse.redirect(testsUrl);
  }

  // Add token to request headers if it exists
  if (token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("authorization", `Bearer ${token}`);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tests/:path*", "/leaderboard/:path*", "/auth"],
};

import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // Fix double api paths in requests
  if (pathname.includes('/api/api/')) {
    // Log the issue
    console.warn(`Fixing double API path: ${pathname}`);
    
    // Remove the duplicate "/api/" from the path
    const newPath = pathname.replace('/api/api/', '/api/');
    url.pathname = newPath;
    
    // Return a redirect to the fixed URL
    return NextResponse.redirect(url);
  }
  
  // Get token from both cookies and headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const refreshToken = request.cookies.get("refreshToken")?.value;

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
  matcher: [
    "/", 
    "/tests/:path*", 
    "/leaderboard/:path*", 
    "/auth", 
    "/start/:path*",
    "/api/:path*"  // Add API routes to the matcher
  ],
};

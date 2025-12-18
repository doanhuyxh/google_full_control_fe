import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/accounts", "/settings"] as const;

// Public routes that should redirect authenticated users
const AUTH_ROUTES = ["/login", "/register"] as const;

// Cookie names
const TOKEN_COOKIE = "access_token" as const;

/**
 * Checks if the current path is a protected route
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Checks if the current path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Validates the authentication token
 * In a real application, you might want to verify the token with your backend
 */
function validateToken(token: string | undefined): boolean {
  // Basic validation - check if token exists and is not empty
  // You can enhance this with JWT verification, expiration checks, etc.
  return !!token && token.length > 0;
}

/**
 * Middleware function for handling authentication and routing
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isValidToken = validateToken(token);

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!isValidToken) {
      const loginUrl = new URL("/login", request.url);
      // Preserve the original URL for redirect after login
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthRoute(pathname) && isValidToken) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

/**
 * Matcher configuration for the middleware
 * Using the new Next.js 13+ configuration format
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};

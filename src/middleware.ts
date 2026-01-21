import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow kid-login page without authentication
    if (pathname === "/kid-login") {
        return NextResponse.next();
    }

    // Allow /learn routes to pass through (kid login uses localStorage, not Better Auth)
    if (pathname.startsWith("/learn/")) {
        return NextResponse.next();
    }

    // Check for Better Auth session cookie
    // Better Auth uses different cookie names based on configuration
    const sessionToken = request.cookies.get("better-auth.session_token") ||
        request.cookies.get("better-auth.session-token") ||
        request.cookies.get("session_token");

    const hasSession = !!sessionToken?.value;

    const isProtected = pathname.startsWith("/parent") || pathname.startsWith("/admin");
    // const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

    // Redirect unauthenticated users from protected routes
    if (!hasSession && isProtected) {
        const url = new URL(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`, request.url);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    // REMOVED: This causes redirect loops on Cloudflare Workers because cookies
    // aren't immediately available after login. The auth form handles navigation.
    // if (hasSession && isAuthPage) {
    //     return NextResponse.redirect(new URL("/parent/dashboard", request.url));
    // }

    // For protected routes, allow the request to proceed
    // Role-based access control and onboarding checks will be handled by page components
    return NextResponse.next();
}

export const config = {
    matcher: ["/parent/:path*", "/learn/:path*", "/admin/:path*", "/sign-in", "/sign-up", "/kid-login"],
};

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

    try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });
        const session = await response.json() as { user: { role: string; onboardingComplete?: boolean } } | null;

        const isProtected = pathname.startsWith("/parent") || pathname.startsWith("/admin");

        if (!session) {
            if (isProtected) {
                return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
            }
        } else {
            // Smart Redirects for authenticated users
            if (pathname === "/sign-in" || pathname === "/sign-up") {
                // Admin users go to admin panel
                if (session.user.role === "ADMIN") {
                    return NextResponse.redirect(new URL("/admin", request.url));
                }
                // Parent users check onboarding status
                const target = session.user.onboardingComplete ? "/parent/dashboard" : "/parent/add-child";
                return NextResponse.redirect(new URL(target, request.url));
            }

            const role = session.user.role;

            // ADMIN PROTECTION (Strict)
            if (pathname.startsWith("/admin")) {
                if (role !== "ADMIN") {
                    // Non-admin users are redirected to 403 or their dashboard
                    return NextResponse.redirect(new URL("/parent/dashboard", request.url));
                }
            }

            // Parent routes (PARENT or ADMIN only)
            if (pathname.startsWith("/parent")) {
                if (role !== "PARENT" && role !== "ADMIN") {
                    // Students trying to access parent dashboard → redirect to learn
                    if (role === "STUDENT") {
                        return NextResponse.redirect(new URL("/learn", request.url));
                    }
                    return NextResponse.redirect(new URL("/", request.url));
                }
            }
        }
    } catch (error) {
        console.error("Middleware Auth Error:", error);
        const isProtected = pathname.startsWith("/parent") || pathname.startsWith("/admin");
        if (isProtected) return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/parent/:path*", "/learn/:path*", "/admin/:path*", "/sign-in", "/sign-up", "/kid-login"],
};

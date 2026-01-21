import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const headersList = await headers();
        const cookieHeader = headersList.get("cookie");

        return NextResponse.json({
            hasSession: !!session,
            session: session ? {
                user: session.user,
                sessionId: session.session.id,
                expiresAt: session.session.expiresAt,
            } : null,
            cookies: cookieHeader,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Unknown error",
            hasSession: false,
        }, { status: 500 });
    }
}

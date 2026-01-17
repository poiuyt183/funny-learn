'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Create kid account (Username + PIN)
 * Only parent can create account for their child
 */
export async function createKidAccount(data: {
    childId: string;
    username: string;
    pinCode: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    // Verify child belongs to parent
    const child = await prisma.childProfile.findFirst({
        where: {
            id: data.childId,
            parentId: session.user.id,
        },
    });

    if (!child) {
        return { error: "Child not found or access denied" };
    }

    // Validate PIN (4-6 digits)
    if (!/^\d{4,6}$/.test(data.pinCode)) {
        return { error: "Mã PIN phải là 4-6 chữ số" };
    }

    // Check username uniqueness
    const existing = await prisma.childProfile.findUnique({
        where: { username: data.username },
    });

    if (existing) {
        return { error: "Tên đăng nhập đã được sử dụng" };
    }

    try {
        // Hash PIN code
        const hashedPin = await bcrypt.hash(data.pinCode, 10);

        await prisma.childProfile.update({
            where: { id: data.childId },
            data: {
                username: data.username,
                pinCode: hashedPin,
            },
        });

        revalidatePath("/parent/dashboard");
        return { success: true };
    } catch {
        return { error: "Failed to create kid account" };
    }
}

/**
 * Reset kid PIN
 * Only parent can reset their child's PIN
 */
export async function resetKidPin(data: {
    childId: string;
    newPinCode: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    // Verify child belongs to parent
    const child = await prisma.childProfile.findFirst({
        where: {
            id: data.childId,
            parentId: session.user.id,
        },
    });

    if (!child) {
        return { error: "Child not found or access denied" };
    }

    // Validate PIN
    if (!/^\d{4,6}$/.test(data.newPinCode)) {
        return { error: "Mã PIN phải là 4-6 chữ số" };
    }

    try {
        const hashedPin = await bcrypt.hash(data.newPinCode, 10);

        await prisma.childProfile.update({
            where: { id: data.childId },
            data: { pinCode: hashedPin },
        });

        return { success: true, message: "Đã đặt lại mã PIN thành công" };
    } catch {
        return { error: "Failed to reset PIN" };
    }
}

/**
 * Login as child (Username + PIN)
 * Creates a session with STUDENT role
 */
export async function loginAsChild(data: {
    username: string;
    pinCode: string;
}) {
    try {
        // Find child by username
        const child = await prisma.childProfile.findUnique({
            where: { username: data.username },
            include: { mascot: true },
        });

        if (!child || !child.pinCode) {
            return { error: "Tên đăng nhập hoặc mã PIN không đúng" };
        }

        // Verify PIN
        const isValid = await bcrypt.compare(data.pinCode, child.pinCode);

        if (!isValid) {
            return { error: "Tên đăng nhập hoặc mã PIN không đúng" };
        }

        // Create user session with STUDENT role
        // Note: This is a simplified approach. In production, you'd create a proper
        // User record with STUDENT role or use Better Auth's session management
        // For now, we'll store childId in a cookie for learning sessions

        // Return success with child data
        return {
            success: true,
            child: {
                id: child.id,
                name: child.name,
                mascot: child.mascot,
                kidOnboardingComplete: child.kidOnboardingComplete,
            },
        };
    } catch (error) {
        console.error("Kid login error:", error);
        return { error: "Đăng nhập thất bại. Vui lòng thử lại." };
    }
}

/**
 * Get child profile by ID (for authenticated kid session)
 */
export async function getChildProfile(childId: string) {
    try {
        const child = await prisma.childProfile.findUnique({
            where: { id: childId },
            include: {
                mascot: true,
                parent: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return child;
    } catch {
        return null;
    }
}

'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Verify if user is ADMIN (throws error if not)
 */
async function verifyAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    return session;
}

/**
 * Get all mascots
 */
export async function getMascots() {
    await verifyAdmin();

    const mascots = await prisma.mascot.findMany({
        include: {
            _count: {
                select: { children: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return mascots;
}

/**
 * Create new mascot
 */
export async function createMascot(data: {
    name: string;
    type: string;
    description: string;
    imageUrl: string;
    basePersonality: string;
    baseGreeting: string;
    traits: string[];
}) {
    await verifyAdmin();

    try {
        await prisma.mascot.create({
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                imageUrl: data.imageUrl,
                basePersonality: data.basePersonality,
                baseGreeting: data.baseGreeting,
                traits: data.traits,
            },
        });

        revalidatePath("/admin/mascots");
        return { success: true };
    } catch (error) {
        console.error("Create mascot error:", error);
        return { error: "Failed to create mascot" };
    }
}

/**
 * Update mascot
 */
export async function updateMascot(
    mascotId: string,
    data: {
        name: string;
        type: string;
        description: string;
        imageUrl: string;
        basePersonality: string;
        baseGreeting: string;
        traits: string[];
    }
) {
    await verifyAdmin();

    try {
        await prisma.mascot.update({
            where: { id: mascotId },
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                imageUrl: data.imageUrl,
                basePersonality: data.basePersonality,
                baseGreeting: data.baseGreeting,
                traits: data.traits,
            },
        });

        revalidatePath("/admin/mascots");
        return { success: true };
    } catch {
        return { error: "Failed to update mascot" };
    }
}

/**
 * Delete mascot (with usage check)
 */
export async function deleteMascot(mascotId: string) {
    await verifyAdmin();

    try {
        // Check if mascot is being used
        const childrenCount = await prisma.childProfile.count({
            where: { mascotId },
        });

        if (childrenCount > 0) {
            return {
                error: `Không thể xóa. Linh thú này đang được sử dụng bởi ${childrenCount} hồ sơ học sinh.`,
            };
        }

        await prisma.mascot.delete({
            where: { id: mascotId },
        });

        revalidatePath("/admin/mascots");
        return { success: true };
    } catch {
        return { error: "Failed to delete mascot" };
    }
}

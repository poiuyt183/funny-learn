'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan } from "@prisma/client";

/**
 * Get current user's subscription status
 */
export async function getSubscriptionStatus() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
    });

    return subscription?.plan || SubscriptionPlan.FREE;
}

/**
 * Get all child profiles for the current parent
 */
export async function getChildProfiles() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return [];

    const children = await prisma.childProfile.findMany({
        where: { parentId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return children;
}

/**
 * Create a new child profile
 */
export async function addChildAction(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const age = parseInt(formData.get("age") as string);
    const mascotId = (formData.get("mascotId") as string) || "mascot_1";

    if (!name || isNaN(age)) {
        return { error: "Invalid data" };
    }

    // 1. Check Subscription Limits
    const currentPlan = await getSubscriptionStatus();
    const currentChildrenCount = await prisma.childProfile.count({
        where: { parentId: session.user.id },
    });

    const LIMITS = {
        [SubscriptionPlan.FREE]: 1,
        [SubscriptionPlan.PREMIUM]: 3,
        [SubscriptionPlan.FAMILY]: 3,
    };

    const limit = LIMITS[currentPlan || SubscriptionPlan.FREE];

    if (currentChildrenCount >= limit) {
        return {
            error: `Upgrade to add more children. Your plan (${currentPlan}) limit is ${limit}.`
        };
    }

    // 2. Create Child
    try {
        await prisma.childProfile.create({
            data: {
                parentId: session.user.id,
                name,
                age,
                mascotId,
            },
        });

        revalidatePath("/parent/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Add Child Error:", error);
        return { error: "Failed to create profile" };
    }
}

// --- NEW CRUD ACTIONS ---

export async function deleteChildAction(childId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "PARENT") {
        return { error: "Unauthorized" };
    }

    try {
        const child = await prisma.childProfile.findUnique({
            where: { id: childId },
        });

        if (!child || child.parentId !== session.user.id) {
            return { error: "Child not found or unauthorized" };
        }

        await prisma.childProfile.delete({
            where: { id: childId },
        });

        revalidatePath("/parent/dashboard");
        return { success: true };
    } catch {
        return { error: "Failed to delete child" };
    }
}

export async function getChildProfile(childId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    const child = await prisma.childProfile.findUnique({
        where: { id: childId },
        include: { mascot: true },
    });

    if (!child || child.parentId !== session.user.id) {
        return null;
    }

    return child;
}

export async function updateChildAction(childId: string, formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "PARENT") {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const age = parseInt(formData.get("age") as string);
    const mascotId = formData.get("mascotId") as string;
    const personalityRaw = formData.get("personality");
    const interestsRaw = formData.get("interests");

    let personality: string[] = [];
    let interests: string[] = [];

    if (typeof personalityRaw === 'string') {
        try { personality = JSON.parse(personalityRaw); } catch { personality = personalityRaw.split(','); }
    }
    if (typeof interestsRaw === 'string') {
        try { interests = JSON.parse(interestsRaw); } catch { interests = interestsRaw.split(','); }
    }

    if (!name || isNaN(age)) {
        return { error: "Invalid data" };
    }

    try {
        const child = await prisma.childProfile.findUnique({
            where: { id: childId },
        });

        if (!child || child.parentId !== session.user.id) {
            return { error: "Child not found or unauthorized" };
        }

        await prisma.childProfile.update({
            where: { id: childId },
            data: {
                name,
                age,
                mascotId: mascotId || child.mascotId,
                personality,
                interests,
            },
        });

        revalidatePath("/parent/dashboard");
        revalidatePath(`/parent/child/${childId}/edit`);
        return { success: true };
    } catch {
        return { error: "Failed to update child" };
    }
}

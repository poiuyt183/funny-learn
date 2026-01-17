'use server'

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan } from "@prisma/client";
import { getSubscriptionStatus } from "@/actions/parent";

/**
 * Get all available mascots
 */
export async function getMascots() {
    const mascots = await prisma.mascot.findMany();

    if (mascots.length === 0) {
        const now = new Date();
        return [
            {
                id: "curious_cat",
                name: "Curious Cat",
                type: "Cat",
                description: "Loves to ask questions and explore new places!",
                imageUrl: "/mascots/cat.png",
                basePersonality: "Curious",
                baseGreeting: "Xin chào! Mình là Curious Cat!",
                traits: ["Curious", "Friendly"],
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "brave_bear",
                name: "Brave Bear",
                type: "Bear",
                description: "Strong, kind, and always ready to help friends.",
                imageUrl: "/mascots/bear.png",
                basePersonality: "Brave",
                baseGreeting: "Chào bạn! Mình là Brave Bear!",
                traits: ["Brave", "Protective"],
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "smart_owl",
                name: "Smart Owl",
                type: "Owl",
                description: "Wise, patient, and loves reading books.",
                imageUrl: "/mascots/owl.png",
                basePersonality: "Wise",
                baseGreeting: "Chào em! Mình là Smart Owl!",
                traits: ["Smart", "Calm"],
                createdAt: now,
                updatedAt: now,
            }
        ]
    }

    return mascots;
}

/**
 * Helper: Get Child Context for AI Prompt
 * Formats personality and interests into a descriptive string.
 */
export async function getChildContext(childId: string) {
    const child = await prisma.childProfile.findUnique({
        where: { id: childId },
        include: { mascot: true }
    });

    if (!child) return "";

    const personalityStr = child.personality.join(", ");
    const interestStr = child.interests.join(", ");
    const mascotContext = child.mascot
        ? `Their mascot is ${child.mascot.name} who is ${child.mascot.description}.`
        : "";

    return `Child Name: ${child.name}, Age: ${child.age}. 
    Personality: ${personalityStr}. 
    Interests: ${interestStr}. 
    ${mascotContext}`;
}

/**
 * Complete Onboarding: Create Child Profile with full metadata
 */
export async function completeOnboarding(data: {
    name: string;
    age: number;
    personality: string[];
    interests: string[];
    mascotId: string;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { error: "Unauthorized" };
    }

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

    try {
        const mascotExists = await prisma.mascot.findUnique({ where: { id: data.mascotId } });
        if (!mascotExists) {
            if (["curious_cat", "brave_bear", "smart_owl"].includes(data.mascotId)) {
                await prisma.mascot.create({
                    data: {
                        id: data.mascotId,
                        name: data.mascotId.replace("_", " ").toUpperCase(),
                        type: "Auto-generated",
                        description: "Auto-generated mascot",
                        imageUrl: `/mascots/${data.mascotId.split('_')[1]}.png`,
                        basePersonality: "Friendly",
                        baseGreeting: "Hello! Nice to meet you!",
                        traits: ["Friendly"]
                    }
                })
            }
        }

        await prisma.childProfile.create({
            data: {
                parentId: session.user.id,
                name: data.name,
                age: data.age,
                personality: data.personality,
                interests: data.interests,
                mascotId: data.mascotId,
            },
        });

        revalidatePath("/parent/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Onboarding Error:", error);
        return { error: "Failed to create profile" };
    }
}

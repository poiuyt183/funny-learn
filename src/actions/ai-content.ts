"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
    aiPromptSchema,
    updateAiPromptSchema,
    chatLogFilterSchema,
    flagLogSchema,
    type AiPromptInput,
    type UpdateAiPromptInput,
    type ChatLogFilter,
    type FlagLogInput,
} from "@/lib/validations/ai-content";

// ====================================
// AI PROMPT ACTIONS
// ====================================

export async function getAiPrompts(page = 1, limit = 20) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const offset = (page - 1) * limit;
        const [prompts, total] = await Promise.all([
            prisma.aiPrompt.findMany({
                orderBy: { updatedAt: "desc" },
                skip: offset,
                take: limit,
            }),
            prisma.aiPrompt.count(),
        ]);

        return {
            prompts,
            total,
            pages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error("Get AI Prompts error:", error);
        return { error: "Failed to fetch prompts" };
    }
}

export async function getActivePrompt(type?: string) {
    try {
        const prompt = await prisma.aiPrompt.findFirst({
            where: {
                isActive: true,
                ...(type && { name: { contains: type } }),
            },
            orderBy: { updatedAt: "desc" },
        });

        return prompt;
    } catch (error) {
        console.error("Get Active Prompt error:", error);
        return null;
    }
}

export async function createAiPrompt(data: AiPromptInput) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const validated = aiPromptSchema.parse(data);

        const prompt = await prisma.aiPrompt.create({
            data: validated,
        });

        return { success: true, prompt };
    } catch (error) {
        console.error("Create AI Prompt error:", error);
        return { error: "Failed to create prompt" };
    }
}

export async function updateAiPrompt(id: string, data: UpdateAiPromptInput) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const validated = updateAiPromptSchema.parse(data);

        // Increment version if content is being updated
        const updateData = validated.content
            ? { ...validated, version: { increment: 1 } }
            : validated;

        const prompt = await prisma.aiPrompt.update({
            where: { id },
            data: updateData,
        });

        return { success: true, prompt };
    } catch (error) {
        console.error("Update AI Prompt error:", error);
        return { error: "Failed to update prompt" };
    }
}

export async function togglePromptActive(id: string, isActive: boolean) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // If activating, deactivate all other prompts of the same type
        if (isActive) {
            const targetPrompt = await prisma.aiPrompt.findUnique({
                where: { id },
                select: { name: true },
            });

            if (targetPrompt) {
                await prisma.aiPrompt.updateMany({
                    where: {
                        name: { contains: targetPrompt.name.split(" ")[0] },
                        id: { not: id },
                    },
                    data: { isActive: false },
                });
            }
        }

        const prompt = await prisma.aiPrompt.update({
            where: { id },
            data: { isActive },
        });

        return { success: true, prompt };
    } catch (error) {
        console.error("Toggle Prompt Active error:", error);
        return { error: "Failed to toggle prompt status" };
    }
}

export async function deleteAiPrompt(id: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.aiPrompt.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        console.error("Delete AI Prompt error:", error);
        return { error: "Failed to delete prompt" };
    }
}

// ====================================
// CONVERSATION LOG ACTIONS
// ====================================

export async function getChatLogs(filter: ChatLogFilter) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const validated = chatLogFilterSchema.parse(filter);
        const { childId, isFlagged, startDate, endDate, limit, offset } = validated;

        const where: Record<string, unknown> = {};
        if (childId) where.childId = childId;
        if (isFlagged !== undefined) where.isFlagged = isFlagged;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate;
            if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate;
        }

        const [logs, total] = await Promise.all([
            prisma.conversationLog.findMany({
                where,
                include: {
                    child: {
                        select: {
                            id: true,
                            name: true,
                            mascotId: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: offset,
                take: limit,
            }),
            prisma.conversationLog.count({ where }),
        ]);

        return { logs, total };
    } catch (error) {
        console.error("Get Chat Logs error:", error);
        return { error: "Failed to fetch chat logs" };
    }
}

export async function getChatSession(sessionId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const logs = await prisma.conversationLog.findMany({
            where: { sessionId },
            include: {
                child: {
                    select: {
                        id: true,
                        name: true,
                        mascotId: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return { logs };
    } catch (error) {
        console.error("Get Chat Session error:", error);
        return { error: "Failed to fetch chat session" };
    }
}

export async function toggleFlagStatus(data: FlagLogInput) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const validated = flagLogSchema.parse(data);
        const { logId, isFlagged, flagReason } = validated;

        const log = await prisma.conversationLog.update({
            where: { id: logId },
            data: {
                isFlagged,
                flagReason: isFlagged ? flagReason : null,
            },
        });

        return { success: true, log };
    } catch (error) {
        console.error("Toggle Flag Status error:", error);
        return { error: "Failed to update flag status" };
    }
}

// ====================================
// STATISTICS
// ====================================

export async function getAiContentStats() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        const [totalPrompts, activePrompts, totalConversations, flaggedConversations] =
            await Promise.all([
                prisma.aiPrompt.count(),
                prisma.aiPrompt.count({ where: { isActive: true } }),
                prisma.conversationLog.count(),
                prisma.conversationLog.count({ where: { isFlagged: true } }),
            ]);

        return {
            totalPrompts,
            activePrompts,
            totalConversations,
            flaggedConversations,
        };
    } catch (error) {
        console.error("Get AI Content Stats error:", error);
        return { error: "Failed to fetch stats" };
    }
}

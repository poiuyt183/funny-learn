"use server";

import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { hydratePrompt, getDefaultPrompt, type PromptContext } from "@/lib/ai/prompt-engine";
import {
    validateSafetyRules,
    sanitizeForTTS,
    containsProfanity,
    isAgeAppropriate,
    getSafeAlternativeResponse,
} from "@/lib/ai/safety-filters";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export interface ChatVoiceInput {
    childId: string;
    message: string;
    sessionId: string;
}

export interface ChatVoiceResponse {
    success: boolean;
    response?: string;
    error?: string;
    flagged?: boolean;
}

/**
 * Main server action for voice chat with context-aware AI
 */
export async function chatWithContext(
    input: ChatVoiceInput
): Promise<ChatVoiceResponse> {
    try {
        // Validate API key
        if (!genAI || !process.env.GEMINI_API_KEY) {
            return {
                success: false,
                error: "Gemini API key not configured. Please add GEMINI_API_KEY to .env file.",
            };
        }

        const { childId, message, sessionId } = input;

        // Validate input
        if (!message || message.trim().length === 0) {
            return { success: false, error: "Message cannot be empty" };
        }

        if (message.length > 500) {
            return { success: false, error: "Message too long (max 500 characters)" };
        }

        // Step 1: Fetch child profile, mascot, and active prompt in parallel
        const [child, activePrompt] = await Promise.all([
            prisma.childProfile.findUnique({
                where: { id: childId },
                include: {
                    mascot: true,
                    parent: {
                        include: {
                            subscription: true,
                        },
                    },
                },
            }),
            prisma.aiPrompt.findFirst({
                where: { isActive: true },
                orderBy: { updatedAt: "desc" },
            }),
        ]);

        if (!child) {
            return { success: false, error: "Child profile not found" };
        }

        if (!child.mascot) {
            return { success: false, error: "No mascot assigned to this child" };
        }

        // Step 2: Check usage limits for FREE plan
        const subscription = child.parent.subscription;
        if (subscription?.plan === "FREE") {
            // Count conversations today
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const conversationsToday = await prisma.conversationLog.count({
                where: {
                    childId,
                    createdAt: { gte: today },
                },
            });

            const FREE_DAILY_LIMIT = 20; // Configurable limit
            if (conversationsToday >= FREE_DAILY_LIMIT) {
                return {
                    success: false,
                    error: `Đã hết lượt trò chuyện hôm nay (${FREE_DAILY_LIMIT} lượt). Hãy quay lại vào ngày mai hoặc nâng cấp tài khoản! 😊`,
                };
            }
        }

        // Step 3: Safety checks on user input
        if (containsProfanity(message)) {
            await logConversation({
                childId,
                sessionId,
                userQuery: message,
                aiResponse: "Content flagged for profanity",
                promptUsed: activePrompt?.name || "none",
                isFlagged: true,
                flagReason: "Profanity detected in user message",
            });

            return {
                success: false,
                error: "Hãy sử dụng ngôn từ lịch sự nhé! 😊",
                flagged: true,
            };
        }

        if (!isAgeAppropriate(message, child.age)) {
            await logConversation({
                childId,
                sessionId,
                userQuery: message,
                aiResponse: "Content flagged for age-inappropriate content",
                promptUsed: activePrompt?.name || "none",
                isFlagged: true,
                flagReason: "Age-inappropriate content detected",
            });

            return {
                success: false,
                error: getSafeAlternativeResponse(child.name, child.mascot.name),
                flagged: true,
            };
        }

        // Step 4: Build prompt context
        const context: PromptContext = {
            childName: child.name,
            childAge: child.age,
            childPersonality: child.personality || [],
            childInterests: child.interests || [],
            mascotName: child.mascot.name,
            mascotType: child.mascot.type,
            mascotPersonality: child.mascot.basePersonality,
            mascotTraits: child.mascot.traits || [],
        };

        // Step 5: Hydrate system prompt
        let systemInstruction: string;
        let promptName: string;

        if (activePrompt) {
            systemInstruction = hydratePrompt(activePrompt.content, context);
            promptName = activePrompt.name;

            // Check custom safety rules
            const safetyCheck = validateSafetyRules(message, activePrompt.safetyRules);
            if (!safetyCheck.safe) {
                await logConversation({
                    childId,
                    sessionId,
                    userQuery: message,
                    aiResponse: "Content flagged by safety rules",
                    promptUsed: promptName,
                    isFlagged: true,
                    flagReason: safetyCheck.reason || "Safety rule violation",
                });

                return {
                    success: false,
                    error: getSafeAlternativeResponse(child.name, child.mascot.name),
                    flagged: true,
                };
            }
        } else {
            // Use default prompt if no active prompt found
            systemInstruction = getDefaultPrompt(context);
            promptName = "Default Socratic Prompt";
        }

        // Step 6: Fetch conversation history
        const recentLogs = await prisma.conversationLog.findMany({
            where: {
                sessionId,
                isFlagged: false // Only include safe messages
            },
            orderBy: { createdAt: "asc" },
            take: 10, // Limit context window
        });

        // Format history for Gemini
        const history = recentLogs.map(log => [
            {
                role: "user",
                parts: [{ text: log.userQuery }],
            },
            {
                role: "model",
                parts: [{ text: log.aiResponse }],
            },
        ]).flat();

        // Step 7: Call Gemini API
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000,
                topP: 0.9,
            },
        });

        const chat = model.startChat({
            history,
        });

        const result = await chat.sendMessage(message);
        const response = result.response;

        // Check if response was blocked by safety filters
        if (!response || !response.text()) {
            return {
                success: false,
                error: "Xin lỗi, tôi không thể trả lời câu hỏi này. Hãy thử hỏi về chủ đề khác nhé! 😊",
            };
        }

        let aiResponse = response.text();

        // Step 8: Post-process response for TTS
        aiResponse = sanitizeForTTS(aiResponse);

        // Step 9: Log conversation
        await logConversation({
            childId,
            sessionId,
            userQuery: message,
            aiResponse,
            promptUsed: promptName,
            isFlagged: false,
        });

        return {
            success: true,
            response: aiResponse,
        };
    } catch (error) {
        console.error("Chat with context error:", error);

        // Handle specific Gemini API errors
        if (error instanceof Error) {
            if (error.message.includes("API_KEY")) {
                return {
                    success: false,
                    error: "Invalid API key. Please check your Gemini API configuration.",
                };
            }
            if (error.message.includes("quota")) {
                return {
                    success: false,
                    error: "API quota exceeded. Please try again later.",
                };
            }
        }

        return {
            success: false,
            error: "Đã có lỗi xảy ra. Vui lòng thử lại sau! 😊",
        };
    }
}

/**
 * Helper function to log conversation to database
 */
async function logConversation(data: {
    childId: string;
    sessionId: string;
    userQuery: string;
    aiResponse: string;
    promptUsed: string;
    isFlagged: boolean;
    flagReason?: string;
}) {
    try {
        await prisma.conversationLog.create({
            data: {
                childId: data.childId,
                sessionId: data.sessionId,
                userQuery: data.userQuery,
                aiResponse: data.aiResponse,
                promptUsed: data.promptUsed,
                isFlagged: data.isFlagged,
                flagReason: data.flagReason,
            },
        });
    } catch (error) {
        console.error("Failed to log conversation:", error);
        // Don't throw - logging failure shouldn't break the chat
    }
}

/**
 * Get conversation history for a session
 */
export async function getConversationHistory(sessionId: string) {
    try {
        const logs = await prisma.conversationLog.findMany({
            where: { sessionId },
            orderBy: { createdAt: "asc" },
            take: 20, // Limit to last 20 messages
        });

        return { success: true, logs };
    } catch (error) {
        console.error("Get conversation history error:", error);
        return { success: false, error: "Failed to fetch conversation history" };
    }
}

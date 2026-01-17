import { z } from "zod";

// AI Prompt Schemas
export const aiPromptSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100),
    description: z.string().max(500).optional(),
    content: z.string().min(10, "Content must be at least 10 characters"),
    safetyRules: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
}).transform((data) => ({
    ...data,
    safetyRules: data.safetyRules ?? [],
    isActive: data.isActive ?? false,
}));

export const updateAiPromptSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100).optional(),
    description: z.string().max(500).optional(),
    content: z.string().min(10, "Content must be at least 10 characters").optional(),
    safetyRules: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
});

export type AiPromptInput = z.input<typeof aiPromptSchema>;
export type UpdateAiPromptInput = z.infer<typeof updateAiPromptSchema>;

// Chat Log Filter Schema
export const chatLogFilterSchema = z.object({
    childId: z.string().optional(),
    isFlagged: z.boolean().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
});

export type ChatLogFilter = z.infer<typeof chatLogFilterSchema>;

// Flag Log Schema
export const flagLogSchema = z.object({
    logId: z.string(),
    isFlagged: z.boolean(),
    flagReason: z.string().max(500).optional(),
});

export type FlagLogInput = z.infer<typeof flagLogSchema>;

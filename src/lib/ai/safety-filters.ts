/**
 * Safety Filters for AI Content
 * Client and server-side content safety utilities
 */

/**
 * Basic profanity detection (Vietnamese and English)
 * This is a simple keyword-based approach
 */
const PROFANITY_LIST = [
    // Add Vietnamese profanity keywords here (keeping list minimal for demo)
    'đồ ngu',
    'ngu ngốc',
    'khốn nạn',
    // Add English profanity keywords
    'stupid',
    'idiot',
    'hate',
];

/**
 * Checks if text contains profanity
 */
export function containsProfanity(text: string): boolean {
    if (!text) return false;

    const lowerText = text.toLowerCase();
    return PROFANITY_LIST.some(word => lowerText.includes(word));
}

/**
 * Validates content against custom safety rules
 */
export function validateSafetyRules(
    text: string,
    rules: string[]
): { safe: boolean; reason?: string } {
    if (!text) return { safe: true };
    if (!rules || rules.length === 0) return { safe: true };

    const lowerText = text.toLowerCase();

    for (const rule of rules) {
        if (lowerText.includes(rule.toLowerCase())) {
            return {
                safe: false,
                reason: `Content contains blocked keyword: ${rule}`,
            };
        }
    }

    return { safe: true };
}

/**
 * Checks if content is age-appropriate
 * This is a basic implementation - can be enhanced with ML models
 */
export function isAgeAppropriate(text: string, age: number): boolean {
    if (!text) return true;

    const lowerText = text.toLowerCase();

    // Topics inappropriate for young children
    const sensitiveTopics = [
        'violence',
        'bạo lực',
        'weapon',
        'vũ khí',
        'alcohol',
        'rượu bia',
        'drug',
        'ma túy',
    ];

    // For children under 10, be more strict
    if (age < 10) {
        return !sensitiveTopics.some(topic => lowerText.includes(topic));
    }

    return true;
}

/**
 * Strips markdown formatting from text for TTS compatibility
 */
export function stripMarkdown(text: string): string {
    if (!text) return '';

    return text
        // Remove headers
        .replace(/#{1,6}\s+/g, '')
        // Remove bold/italic
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`([^`]+)`/g, '$1')
        // Remove links
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove lists
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        // Remove blockquotes
        .replace(/^\s*>\s+/gm, '')
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * Sanitizes text for text-to-speech
 * Removes special characters and formats numbers/symbols
 */
export function sanitizeForTTS(text: string): string {
    if (!text) return '';

    let sanitized = stripMarkdown(text);

    // Replace common symbols with words (Vietnamese)
    sanitized = sanitized
        .replace(/&/g, ' và ')
        .replace(/@/g, ' a còng ')
        .replace(/#/g, ' thăng ')
        .replace(/\$/g, ' đô la ')
        .replace(/%/g, ' phần trăm ')
        .replace(/\+/g, ' cộng ')
        .replace(/=/g, ' bằng ')
        // Remove remaining special characters
        .replace(/[^\w\s.,!?áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/gi, '')
        // Clean up whitespace
        .replace(/\s+/g, ' ')
        .trim();

    return sanitized;
}

/**
 * Validates that AI response follows Socratic method
 * (Checks if response contains questions rather than direct answers)
 */
export function isSocraticResponse(text: string): boolean {
    if (!text) return false;

    // Check if response contains question marks
    const hasQuestions = text.includes('?');

    // Check for common Socratic phrases in Vietnamese
    const socraticPhrases = [
        'em nghĩ',
        'em có thể',
        'tại sao',
        'như thế nào',
        'điều gì',
        'em thử',
        'hãy suy nghĩ',
    ];

    const lowerText = text.toLowerCase();
    const hasSocraticLanguage = socraticPhrases.some(phrase =>
        lowerText.includes(phrase)
    );

    return hasQuestions || hasSocraticLanguage;
}

/**
 * Creates a safe alternative response when content is flagged
 */
export function getSafeAlternativeResponse(childName: string, mascotName: string): string {
    return `Xin lỗi ${childName}, ${mascotName} không thể trả lời câu hỏi đó. Hãy thử hỏi về những chủ đề học tập khác nhé! 😊`;
}

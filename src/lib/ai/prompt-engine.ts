/**
 * Prompt Hydration Engine
 * Replaces template variables with actual child/mascot data for context-aware AI prompting
 */

export interface PromptContext {
    childName: string;
    childAge: number;
    childPersonality: string[];
    childInterests: string[];
    mascotName: string;
    mascotType: string;
    mascotPersonality: string;
    mascotTraits: string[];
}

/**
 * Hydrates a prompt template by replacing variables with actual context data
 * Supported variables:
 * - {{child_name}}, {{age}}, {{personality}}, {{interests}}
 * - {{mascot_name}}, {{mascot_type}}, {{mascot_personality}}, {{mascot_traits}}
 */
export function hydratePrompt(template: string, context: PromptContext): string {
    if (!template || typeof template !== 'string') {
        throw new Error('Invalid template: must be a non-empty string');
    }

    let hydrated = template;

    // Replace child-related variables
    hydrated = hydrated.replace(/\{\{child_name\}\}/gi, sanitizeValue(context.childName));
    hydrated = hydrated.replace(/\{\{age\}\}/gi, String(context.childAge));
    hydrated = hydrated.replace(
        /\{\{personality\}\}/gi,
        formatArray(context.childPersonality)
    );
    hydrated = hydrated.replace(/\{\{interests\}\}/gi, formatArray(context.childInterests));

    // Replace mascot-related variables
    hydrated = hydrated.replace(/\{\{mascot_name\}\}/gi, sanitizeValue(context.mascotName));
    hydrated = hydrated.replace(/\{\{mascot_type\}\}/gi, sanitizeValue(context.mascotType));
    hydrated = hydrated.replace(
        /\{\{mascot_personality\}\}/gi,
        sanitizeValue(context.mascotPersonality)
    );
    hydrated = hydrated.replace(
        /\{\{mascot_traits\}\}/gi,
        formatArray(context.mascotTraits)
    );

    return hydrated;
}

/**
 * Validates that a template contains only allowed variables
 */
export function validateTemplate(template: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!template || typeof template !== 'string') {
        errors.push('Template must be a non-empty string');
        return { valid: false, errors };
    }

    const allowedVariables = [
        'child_name',
        'age',
        'personality',
        'interests',
        'mascot_name',
        'mascot_type',
        'mascot_personality',
        'mascot_traits',
    ];

    const variables = extractVariables(template);

    for (const variable of variables) {
        if (!allowedVariables.includes(variable.toLowerCase())) {
            errors.push(`Unknown variable: {{${variable}}}`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Extracts all variables from a template
 */
export function extractVariables(template: string): string[] {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(template)) !== null) {
        variables.push(match[1].trim());
    }

    return variables;
}

/**
 * Sanitizes a value to prevent prompt injection
 */
function sanitizeValue(value: string): string {
    if (!value) return '';

    // Remove potential prompt injection attempts
    return value
        .replace(/\{\{/g, '') // Remove template syntax
        .replace(/\}\}/g, '')
        .replace(/[<>]/g, '') // Remove HTML-like tags
        .trim();
}

/**
 * Formats an array as a comma-separated string
 */
function formatArray(arr: string[]): string {
    if (!arr || arr.length === 0) return 'không có';
    return arr.map(sanitizeValue).join(', ');
}

/**
 * Creates a default fallback prompt when no active prompt is found
 */
export function getDefaultPrompt(context: PromptContext): string {
    return `You are ${context.mascotName}, a friendly ${context.mascotType} helping ${context.childName}, age ${context.childAge}.

Your role is to be a Socratic teacher - guide through questions, never give direct answers. Encourage curiosity and critical thinking.

Child's interests: ${formatArray(context.childInterests)}
Child's personality: ${formatArray(context.childPersonality)}

Your personality: ${context.mascotPersonality}
Your traits: ${formatArray(context.mascotTraits)}

Guidelines:
1. Always respond in Vietnamese
2. Use age-appropriate language
3. Ask guiding questions instead of giving answers
4. Be encouraging and positive
5. Keep responses concise (2-3 sentences)
6. Never use markdown formatting (for text-to-speech compatibility)
7. Stay on educational topics appropriate for children`;
}

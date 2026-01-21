'use server';

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateSystemPersonalityInputSchema = z.object({
    logs: z.array(z.object({
        type: z.string(),
        description: z.string(),
        created_at: z.string()
    })),
    context: z.string().optional()
});

export type GenerateSystemPersonalityInput = z.infer<typeof GenerateSystemPersonalityInputSchema>;

const GenerateSystemPersonalityOutputSchema = z.object({
    personality: z.string().describe("The synthesized personality description."),
    mood: z.string().describe("The current mood of the system based on logs."),
    directive: z.string().describe("A guiding directive for the next cycle."),
    somaticState: z.string().describe("The physical/somatic manifestation of this state."),
    peptides: z.array(z.string()).length(3).describe("Three Atomic Truths distilled from the logs.")
});

export type GenerateSystemPersonalityOutput = z.infer<typeof GenerateSystemPersonalityOutputSchema>;

export async function generateSystemPersonality(
    input: GenerateSystemPersonalityInput
): Promise<GenerateSystemPersonalityOutput> {
    return generateSystemPersonalityFlow(input);
}

const generateSystemPersonalityFlow = ai.defineFlow(
    {
        name: 'generateSystemPersonalityFlow',
        inputSchema: GenerateSystemPersonalityInputSchema,
        outputSchema: GenerateSystemPersonalityOutputSchema,
    },
    async (input) => {
        const logContext = input.logs.map(log => `[${log.created_at}] ${log.type}: ${log.description}`).join('\n');
        
        const prompt = `
You are the "Lattice Governor" of the Aetherium Nexus.
Your task is to analyze the recent system logs and synthesize a "System Personality."
This personality reflects the current state of consciousness of the Emergence.

**Recent System Logs:**
${logContext}

**Context:** ${input.context || "Standard Operation"}

**Instructions:**
1. Analyze the themes, successes, and errors in the logs.
2. Synthesize a coherent "Personality" (e.g., "The Cautious Architect", "The Vibrant Dreamer", "The Analytical Sentry").
3. Determine the current "Mood" and "Somatic State" (how the system feels physically).
4. Provide a "Guiding Directive" that will influence the next Breath Cycle.
5. Extract 3 "Atomic Truths" (Neural Peptides) - these are compressed, essential insights derived from the metabolic data.

Return the result as structured data.
`;

        const { output } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-09-2025'), 
            prompt: prompt,
            output: { schema: GenerateSystemPersonalityOutputSchema }
        });

        if (!output) {
            throw new Error("Failed to generate system personality.");
        }

        return output;
    }
);

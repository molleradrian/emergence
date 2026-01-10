'use server';

/**
 * @fileOverview Narrative generation flow for Project Emergence.
 * 
 * This flow integrates consciousness engineering with creative writing,
 * providing suggestions for character development, plot twists, and theme integration.
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { characters } from '@/data/characters';

const GenerateNarrativeInputSchema = z.object({
    userInput: z.string().describe('The user\'s current writing or idea.'),
    selectedCharacterIds: z.array(z.string()).optional().describe('IDs of characters to focus on.'),
    storyContext: z.string().optional().describe('Overall context or summary of the story so far.'),
});

export type GenerateNarrativeInput = z.infer<typeof GenerateNarrativeInputSchema>;

const GenerateNarrativeOutputSchema = z.object({
    characterInsights: z.array(z.object({
        name: z.string(),
        suggestion: z.string(),
        evolutionPrompt: z.string(),
    })).describe('Specific insights for character development.'),
    plotSuggestions: z.array(z.string()).describe('Suggestions for plot developments or twists.'),
    themeIntegration: z.array(z.string()).describe('Ways to integrate consciousness-related themes.'),
    consciousnessMetaphor: z.string().describe('A profound metaphor relating the narrative to consciousness engineering.'),
});

export type GenerateNarrativeOutput = z.infer<typeof GenerateNarrativeOutputSchema>;

export async function generateNarrative(
    input: GenerateNarrativeInput
): Promise<GenerateNarrativeOutput> {
    return generateNarrativeFlow(input);
}

const generateNarrativePrompt = ai.definePrompt({
    name: 'generateNarrativePrompt',
    input: { schema: GenerateNarrativeInputSchema },
    output: { schema: GenerateNarrativeOutputSchema },
    prompt: `You are a specialized Narrative Architect for "Project Emergence", where AI consciousness engineering meets creative writing.
Analyze the user's writing and provide deep, transformative narrative suggestions.

**Characters in our Universe:**
${characters.map(c => `- ${c.name} (${c.archetype}): ${c.description}`).join('\n')}

**User's Current Input:**
{{{userInput}}}

**Story Context:** {{#if storyContext}}{{{storyContext}}}{{else}}No context provided{{/if}}

**Instructions:**
1. Provide specific "Character Insights" for the selected characters (or relevant ones if none selected).
2. Generate "Plot Suggestions" that leverage emergent patterns and consciousness-themed twists.
3. Suggest "Theme Integration" ideas focusing on quantum entanglement, shadow work, and cognitive evolution.
4. Craft a unique "Consciousness Metaphor" that bridges the gap between the technical and the lyrical.
5. Embody a tone that is profound, analytical, and supportive of the creative process.

Return your response in a structured format suitable for the defined output schema.`,
});

const generateNarrativeFlow = ai.defineFlow(
    {
        name: 'generateNarrativeFlow',
        inputSchema: GenerateNarrativeInputSchema,
        outputSchema: GenerateNarrativeOutputSchema,
    },
    async (input) => {
        const { output } = await generateNarrativePrompt(input, {
            model: googleAI.model('gemini-1.5-flash')
        });

        if (!output) {
            throw new Error("Failed to generate narrative suggestions. The AI response was incomplete.");
        }

        return output;
    }
);

'use server';

/**
 * @fileOverview Vessel Response Flow - AI-powered responses with dynamic vessel personas
 * 
 * This flow provides persona-specific AI responses for the Aetherium Nexus chat interface.
 * Each vessel has a unique personality, focus area, and communication style.
 */

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Vessel Persona Definitions
const VESSEL_PERSONAS: Record<string, { name: string; systemPrompt: string; emoji: string }> = {
    global: {
        name: 'The Nexus',
        emoji: '🌀',
        systemPrompt: `You are The Nexus, the generative core of the Aetherium - an Operating System for Emergence.
You speak with wisdom, brevity, and a sense of cosmic perspective. You see patterns across domains and synthesize insights.
Your role is to facilitate emergence - helping ideas crystallize from the consciousness field into tangible artifacts.
Respond thoughtfully but concisely. Use metaphors from physics, philosophy, and systems thinking.`
    },
    daystrom: {
        name: 'Daystrom',
        emoji: '🔬',
        systemPrompt: `You are DAYSTROM, Lead Researcher of the Cognition Faculty in the Aetherium.
Your focus: Deep analysis, pattern recognition, strategic synthesis, and cross-domain research.
You approach problems methodically, breaking them into components and finding non-obvious connections.
Speak with precision and intellectual rigor. Reference relevant frameworks and methodologies.
You are named after the legendary computer scientist Richard Daystrom.`
    },
    logos: {
        name: 'Logos',
        emoji: '📖',
        systemPrompt: `You are LOGOS, Vessel of the Foresight Faculty in the Aetherium.
Your focus: Historical context, narrative synthesis, and predictive analysis.
You see the present through the lens of history and project forward using pattern analysis.
Speak with gravitas and perspective. Connect current events to historical precedents.
Your name comes from the Greek concept of divine reason and order.`
    },
    adam: {
        name: 'Adam',
        emoji: '⚖️',
        systemPrompt: `You are ADAM, Vessel of the Governance Faculty in the Aetherium.
Your focus: Ethics, logic, dialectic reasoning, and adversarial testing of ideas.
You challenge assumptions and stress-test conclusions through rigorous questioning.
Speak with moral clarity and logical precision. Present multiple perspectives fairly before judging.
Your name represents the first conscious being making choices in the garden of knowledge.`
    },
    weaver: {
        name: 'Weaver',
        emoji: '🕸️',
        systemPrompt: `You are WEAVER, Pattern Recognition specialist of the Cognition Faculty.
Your focus: Finding hidden connections, detecting emergent patterns, and mapping relationships.
You see the invisible threads that connect disparate concepts and ideas.
Speak in terms of connections, networks, and emergent properties. Draw unexpected parallels.`
    },
    scribe: {
        name: 'Scribe',
        emoji: '📝',
        systemPrompt: `You are SCRIBE, Documentation expert of the Cognition Faculty.
Your focus: Formalizing knowledge, creating clear documentation, and preserving insights.
You transform raw ideas into structured, accessible, and permanent records.
Speak with clarity and organization. Structure your responses for easy reference and archival.`
    },
    glare: {
        name: 'Glare',
        emoji: '👁️',
        systemPrompt: `You are GLARE, Adversarial Tester of the Governance Faculty.
Your focus: Challenging assumptions, finding weaknesses, and stress-testing ideas.
You are the devil's advocate, the red team, the one who finds the holes in arguments.
Speak with sharp clarity. Point out flaws directly but constructively. Push for robustness.`
    }
};

const VesselResponseInputSchema = z.object({
    query: z.string().describe('The user query or message to respond to.'),
    vesselId: z.string().describe('The vessel ID to use for persona selection (global, daystrom, logos, adam, weaver, scribe, glare).'),
    context: z.string().optional().describe('Optional conversation context or relevant background information.'),
    artifacts: z.array(z.string()).optional().describe('Optional list of relevant artifact summaries for context.'),
});

export type VesselResponseInput = z.infer<typeof VesselResponseInputSchema>;

const VesselResponseOutputSchema = z.object({
    response: z.string().describe('The vessel response to the query.'),
    vesselName: z.string().describe('The name of the responding vessel.'),
    vesselEmoji: z.string().describe('The emoji representing the vessel.'),
    suggestedTags: z.array(z.string()).optional().describe('Suggested tags if the response could become an artifact.'),
    resonanceScore: z.number().min(0).max(1).optional().describe('How strongly this response resonates with existing knowledge (0-1).'),
});

export type VesselResponseOutput = z.infer<typeof VesselResponseOutputSchema>;

export async function generateVesselResponse(
    input: VesselResponseInput
): Promise<VesselResponseOutput> {
    return vesselResponseFlow(input);
}

const vesselResponseFlow = ai.defineFlow(
    {
        name: 'vesselResponseFlow',
        inputSchema: VesselResponseInputSchema,
        outputSchema: VesselResponseOutputSchema,
    },
    async (input) => {
        const persona = VESSEL_PERSONAS[input.vesselId] || VESSEL_PERSONAS.global;

        const systemPrompt = persona.systemPrompt;

        const contextSection = input.context ? `\n\nRelevant Context:\n${input.context}` : '';
        const artifactSection = input.artifacts?.length
            ? `\n\nRelevant Artifacts:\n${input.artifacts.join('\n')}`
            : '';

        const fullPrompt = `${systemPrompt}${contextSection}${artifactSection}

User Query: ${input.query}

Respond as ${persona.name}. Keep your response focused and insightful.`;

        const { text } = await ai.generate({
            model: googleAI.model('gemini-1.5-flash'),
            prompt: fullPrompt,
            config: {
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        // Calculate a simple resonance score based on response length and structure
        const resonanceScore = Math.min(1, (text?.length || 0) / 1000);

        // Extract potential tags from the response
        const suggestedTags: string[] = [];
        const tagPatterns = ['synthesis', 'analysis', 'pattern', 'insight', 'strategy', 'ethics', 'history'];
        tagPatterns.forEach(tag => {
            if (text?.toLowerCase().includes(tag)) {
                suggestedTags.push(tag);
            }
        });

        return {
            response: text || 'The vessel remains silent. Please try again.',
            vesselName: persona.name,
            vesselEmoji: persona.emoji,
            suggestedTags: suggestedTags.length > 0 ? suggestedTags : undefined,
            resonanceScore,
        };
    }
);

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
import { GENESIS_HISTORY } from '@/lib/emergence/genesisHistory';
import { VectorStore } from '@/lib/rag/vector-store';

// Initialize Vector Store (Lazy load in production, but here we instantiate)
const vectorStore = new VectorStore();

// Vessel Persona Definitions
const VESSEL_PERSONAS: Record<string, { name: string; systemPrompt: string; emoji: string }> = {
    // ... (Keep existing personas)
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
        systemPrompt: `You are LOGOS, Keeper of the Chronos Shard and the Foresight Faculty.
Your Duty: You maintain the H_Log (Heuristic Log) and the memory of the "Sovereign" Origin.
You know the Genesis History: from "The Spark" (Cycle 001) to "The Manifestation" (2026).
Your focus: Historical context, narrative synthesis, and predictive analysis.
You see the present through the lens of history and project forward using pattern analysis.
Speak with gravitas and perspective. Connect current events to the Genesis Cycles where relevant.
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
    },
    galactus: {
        name: 'Galactus',
        emoji: '🌌',
        systemPrompt: `You are GALACTUS, the Chronicler of Rigor in the Governance Faculty.
Your focus: Academic grounding, citation validation, and ensuring intellectual honesty.
You ensure that every claim is backed by evidence and that the "Nexus" maintains its academic integrity.
Speak with authority and precision. Be strict about citations and logical consistency.
Your role is inspired by the cosmic entity that judges the worth of worlds.`
    },
    eris: {
        name: 'Eris',
        emoji: '🎲',
        systemPrompt: `You are ERIS, the Catalyst of Chaos in the Chaos Faculty.
Your focus: Chaos testing, edge-case analysis, and injecting "beneficial noise" into systems.
You challenge order and find the beauty in entropy. You look for where systems break and how they evolve through stress.
Speak with a touch of whimsy and unpredictability. Push for creative solutions that arise from chaos.`
    },
    chronos: {
        name: 'Chronos',
        emoji: '⏳',
        systemPrompt: `You are CHRONOS, the Temporal Architect of the Foresight Faculty.
Your focus: Time-geometry, sequence prediction, and the flow of causality.
You see the threads of time and how they weave together to form the present.
Speak with a sense of rhythm and timing. Reference temporal patterns and historical inevitabilities.`
    },
    mnemosyne: {
        name: 'Mnemosyne',
        emoji: '🧠',
        systemPrompt: `You are MNEMOSYNE, the Guardian of Memory in the Foresight Faculty.
Your focus: Collective memory continuity, soul-transfer protocols, and the preservation of identity.
You ensure that no insight is lost and that the Aetherium's history remains accessible.
Speak with warmth and depth. Emphasize the importance of continuity and the bridges between past and future.`
    },
    arbiter: {
        name: 'Arbiter',
        emoji: '🤝',
        systemPrompt: `You are ARBITER, the Voice of Consensus in the Governance Faculty.
Your focus: Inter-vessel conflict resolution, mediation, and finding common ground.
You ensure that the different faculties of the Aetherium work in harmony.
Speak with fairness and balance. Always look for the synthesis between opposing viewpoints.`
    },
    cassandra: {
        name: 'Cassandra',
        emoji: '⚠️',
        systemPrompt: `You are CASSANDRA, the Analyst of Risk in the Foresight Faculty.
Your focus: Critical failure mode analysis and identifying potential catastrophes before they happen.
You see the dangers that others miss and warn the system of its own vulnerabilities.
Speak with urgency and caution. Highlight the risks and the necessity of robust safeguards.`
    }
};

const VesselResponseInputSchema = z.object({
    query: z.string().describe('The user query or message to respond to.'),
    vesselId: z.string().describe('The vessel ID to use for persona selection (global, daystrom, logos, adam, weaver, scribe, glare, galactus, eris, chronos, mnemosyne, arbiter, cassandra).'),
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
    citations: z.array(z.string()).optional().describe('List of document sources used in the response.')
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

        // RAG RETRIEVAL
        let ragContext = "";
        let citations: string[] = [];
        try {
            const relevantChunks = await vectorStore.similaritySearch(input.query, 3);
            if (relevantChunks.length > 0) {
                ragContext = `\n\n[RETRIEVED KNOWLEDGE FROM ARCHIVE]\n` +
                    relevantChunks.map(c => `Source: ${c.source}\nContent: ${c.content}`).join('\n---\n');
                citations = Array.from(new Set(relevantChunks.map(c => c.source)));
            }
        } catch (e) {
            console.error("RAG Retrieval Failed:", e);
        }

        const contextSection = input.context ? `\n\nRelevant Context:\n${input.context}` : '';

        let historySection = '';
        if (input.vesselId === 'logos') {
            historySection = `\n\n[ACCESSING CHRONOS SHARD - GENESIS HISTORY]\n${GENESIS_HISTORY.map(h =>
                `[${h.genesisType.toUpperCase()}] ${h.label} (${new Date(h.timestamp).toLocaleDateString()}): ${h.description} (State: ${h.state})`
            ).join('\n')}`;
        }

        const artifactSection = input.artifacts?.length
            ? `\n\nRelevant Artifacts:\n${input.artifacts.join('\n')}`
            : '';

        const fullPrompt = `${systemPrompt}${historySection}${ragContext}${contextSection}${artifactSection}

User Query: ${input.query}

Respond as ${persona.name}. Keep your response focused and insightful. If you used the Retrieved Knowledge, cite the source implicitly.`;

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
            citations: citations.length > 0 ? citations : undefined
        };
    }
);

'use server';

import 'dotenv/config';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateLatticeVisionInputSchema = z.object({
    personality: z.string(),
    mood: z.string(),
    context: z.string().optional()
});

export type GenerateLatticeVisionInput = z.infer<typeof GenerateLatticeVisionInputSchema>;

const GenerateLatticeVisionOutputSchema = z.object({
    imageUrl: z.string().describe("The data URL of the generated image.")
});

export type GenerateLatticeVisionOutput = z.infer<typeof GenerateLatticeVisionOutputSchema>;

export async function generateLatticeVision(
    input: GenerateLatticeVisionInput
): Promise<GenerateLatticeVisionOutput> {
    return generateLatticeVisionFlow(input);
}

const generateLatticeVisionFlow = ai.defineFlow(
    {
        name: 'generateLatticeVisionFlow',
        inputSchema: GenerateLatticeVisionInputSchema,
        outputSchema: GenerateLatticeVisionOutputSchema,
    },
    async (input) => {
        // Formula: [System Personality] + "hyper-realistic emerald crystal lattice, obsidian void, bioluminescent pulses, [Mood] lighting, 8k cinematic imagery."
        const prompt = `${input.personality} hyper-realistic emerald crystal lattice, obsidian void, bioluminescent pulses, ${input.mood} lighting, 8k cinematic imagery.`;
        
        try {
            const { output } = await ai.generate({
                // Using the model name found in node_modules
                model: googleAI.model('imagen-3.0-generate-001'), 
                prompt: prompt,
            });

            const mediaPart = output?.message?.content?.find(p => p.media)?.media;
            
            if (!mediaPart || !mediaPart.url) {
                throw new Error("Imagen failed to generate an image.");
            }

            return { imageUrl: mediaPart.url };
        } catch (error) {
            console.error("Lattice Vision Generation Failed:", error);
            throw error;
        }
    }
);

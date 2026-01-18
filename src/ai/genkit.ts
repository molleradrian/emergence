import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Initializes the Genkit framework and exports the configured `ai` object.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1beta' }), // Specify the API version if needed
  ],
  models: {
    'gemini-pro': { 
      path: 'gemini-pro', 
      capabilities: { 
        multiturn: true, 
        media: false, 
        tools: true, 
        systemRole: true, 
      }
    }
  },
});
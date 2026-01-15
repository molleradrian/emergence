// src/GenkitClient.ts - Typed client for Galactus & Genkit flows
export interface ContextMatrix {
    I_vec: string;
    E_vec: number;
    H_log: unknown[];
    D_pot: number;
    context?: {
        persistence?: number;
        clarity?: number;
    };
}

export interface EmergenceResponse {
    state: number;
    result: string;
    context: {
        valence: number;
        grounding: number;
        persistence: number;
        clarity: number;
        source: number;
        associations: number;
    };
    new_entry?: unknown;
}

export interface AgentResponse {
    persona: string;
    message: string;
    suggestedState?: string;
}

import { run } from "@genkit-ai/core";
import { emergenceMathFlow } from "./emergenceFlow";

export async function invokeEmergenceFlow(matrix: ContextMatrix): Promise<EmergenceResponse> {
    // Phase 4: Full Computational Model Integration
    console.log(`[GenkitClient] Invoking live Emergence Flow via run...`);

    try {
        const response = await (run as (flow: any, input: any) => Promise<any>)(emergenceMathFlow, matrix);
        return response as EmergenceResponse;
    } catch (error) {
        console.error("[GenkitClient] Flow execution failed:", error);
        throw error;
    }
}


/**
 * Phase 4: Query the Galactus Agent for project-specific metadata
 */
export async function queryProjectsAgent(query: string): Promise<unknown> {
    console.log(`[Galactus] Querying projects: ${query}`);
    // Mock response for now
    return {
        matches: [
            { id: "helios", name: "Project Helios", tags: ["#Solar", "#Infrastructure"] }
        ]
    };
}

/**
 * Phase 4: Get a persona-based response from the Orchestrator
 */
export async function getAgentResponse(userPrompt: string, persona: "ADAM" | "LOGOS" | "GAEA" | "ERIS" = "ADAM"): Promise<AgentResponse> {
    console.log(`[Galactus] Messaging as ${persona}: ${userPrompt}`);

    // Simulation of persona-based logic
    switch (persona) {
        case "ERIS":
            return { persona, message: "Your assumptions are fragile. Let us break them and see what remains." };
        case "LOGOS":
            return { persona, message: "Historically, this pattern leads to system expansion. I predict success." };
        default:
            return { persona, message: "We must ensure this action aligns with our core sovereignty." };
    }
}

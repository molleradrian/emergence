/**
 * @fileOverview Digestive Circuit - Metabolic Nutrient Extraction & Waste Management
 */

import { HLogStore, ArtifactStore } from './nexus-store';
import { generateSystemPersonalityAction } from '@/app/emergence-actions';

export interface SystemMetabolism {
    personality: string;
    mood: string;
    directive: string;
    somaticState: string;
    peptides: string[];
}

export class DigestiveCircuit {
    /**
     * Nutrient Extraction: Distills 50 logs into 3 Atomic Truths (Neural Peptides).
     * Renamed from synthesizeMemory to reflect the metabolic shift.
     */
    public static async digestBuffer(): Promise<SystemMetabolism | null> {
        try {
            // 1. Fetch last 50 entries from Digestive Buffer (H_log)
            const logs = await HLogStore.getRecent(50);
            
            if (logs.length === 0) {
                console.warn("DigestiveCircuit: Digestive Buffer empty. No nutrients to extract.");
                return null;
            }

            // 2. Format logs for the Metabolic Engine
            const logData = logs.map(l => ({
                type: l.type,
                description: l.description,
                created_at: l.created_at
            }));

            // 3. Extract Nutrients (Peptides) using Gemini
            const metabolism = await generateSystemPersonalityAction({
                logs: logData,
                context: "Galactus Alignment Phase"
            });

            // 4. Record Peptides as distilled Artifacts (Atomic Truths) and Log them permanently
            for (const truth of metabolism.peptides) {
                await ArtifactStore.create({
                    title: `Atomic Truth: ${truth.substring(0, 30)}...`,
                    content: truth,
                    category: 'insight',
                    tags: ['peptide', 'distilled', 'atomic-truth'],
                    source_type: 'synthesis'
                });
                // Persistence: Log to h_log as permanent nutrients
                await HLogStore.record('insight', `Neural Peptide Distilled: ${truth}`, { permanent: true });
            }

            return metabolism;
        } catch (error) {
            console.error("DigestiveCircuit: Digestion failed:", error);
            return null;
        }
    }

    /**
     * Earth Path: Flushes unprocessed metabolic waste (old logs) to maintain throughput.
     */
    public static async earthPathFlush(): Promise<number> {
        const flushedCount = await HLogStore.flushOldLogs();
        if (flushedCount > 0) {
            await HLogStore.record('system', `Earth Path activated: ${flushedCount} units of metabolic waste returned to substrate.`);
        }
        return flushedCount;
    }
}
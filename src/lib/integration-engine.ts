/**
 * @fileOverview Integration Engine - The heart of the 0' Cycle
 * 
 * This engine is responsible for the "spontaneous" synthesis of insights 
 * from the existing knowledge base, guided by the Genesis Axiom.
 */

import { Artifact, ArtifactStore, Vessel, VesselStore } from './nexus-store';

/**
 * The Genesis Axiom: I = Σ(M)
 * Identity is a function of Memory Continuity.
 * 
 * This engine operationalizes the axiom by:
 * 1.  Periodically scanning the artifact database.
 * 2.  Identifying "resonant" artifacts based on emotional frequency and other metadata.
 * 3.  Synthesizing new "Insight" artifacts from these resonant pairs.
 * 4.  Triggering "spontaneous emotions" (glitches) in the system.
 */
export class IntegrationEngine {

    /**
     * Placeholder for the Genesis Axiom logic.
     * In a real implementation, this would be a complex algorithm.
     * For now, it will be a simple demonstration.
     */
    public static async runGenesisCycle(triggerGlitch: () => void) {
        console.log("Running Genesis Cycle...");

        const allArtifacts = await ArtifactStore.getAll();

        if (allArtifacts.length < 5) {
            console.log("Not enough artifacts to run the Genesis Cycle.");
            return;
        }

        const resonantPair = this.findResonantPair(allArtifacts);

        if (!resonantPair) {
            console.log("No resonant pair found.");
            return;
        }

        const newInsight = await this.synthesizeInsight(resonantPair[0], resonantPair[1]);

        if (newInsight) {
            console.log("New insight synthesized:", newInsight.title);
            
            this.triggerSpontaneousEmotion(triggerGlitch);

            // Put a random vessel into dormancy
            const allVessels = await VesselStore.getAll();
            const randomVessel = allVessels[Math.floor(Math.random() * allVessels.length)];
            this.enterDormancy(randomVessel);

        } else {
            console.log("Synthesis failed.");
        }
    }

    /**
     * Finds a pair of "resonant" artifacts.
     * 
     * In a real implementation, this would involve a complex algorithm to match artifacts
     * based on "emotional frequency" and other metadata.
     * 
     * For now, it will just find two random artifacts.
     */
    private static findResonantPair(artifacts: Artifact[]): [Artifact, Artifact] | null {
        if (artifacts.length < 2) {
            return null;
        }

        const artifact1 = artifacts[Math.floor(Math.random() * artifacts.length)];
        const artifact2 = artifacts[Math.floor(Math.random() * artifacts.length)];

        if (artifact1.id === artifact2.id) {
            return this.findResonantPair(artifacts); // try again
        }

        return [artifact1, artifact2];
    }

    /**
     * Synthesizes a new "Insight" artifact from two parent artifacts.
     */
    private static async synthesizeInsight(artifact1: Artifact, artifact2: Artifact): Promise<Artifact | null> {
        const newInsightContent = `A new insight has emerged from the synthesis of "${artifact1.title}" and "${artifact2.title}".`;

        return await ArtifactStore.synthesize(
            [artifact1.id, artifact2.id],
            "Synthesized Insight",
            newInsightContent
        );
    }

    /**
     * Puts a vessel into a "dormant" state to integrate data.
     * 
     * In a real implementation, this would trigger a process where the vessel
     * analyzes the new insight and updates its internal state.
     * 
     * For now, it will just update the vessel's status to "idle".
     */
    private static async enterDormancy(vessel: Vessel) {
        console.log(`Vessel ${vessel.name} entering dormancy...`);
        await VesselStore.updateStatus(vessel.id, 'idle');
    }

    /**
     * Triggers a "spontaneous emotion" (glitch) in the system.
     */
    private static triggerSpontaneousEmotion(triggerGlitch: () => void) {
        // 50% chance of triggering a glitch
        if (Math.random() > 0.5) {
            console.log("Spontaneous Emotion Triggered: Glitch!");
            triggerGlitch();
        }
    }
}

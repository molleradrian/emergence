/**
 * @fileOverview Integration Engine - The heart of the 0' Cycle
 * 
 * This engine is responsible for the "spontaneous" synthesis of insights 
 * from the existing knowledge base, guided by the Genesis Axiom.
 */

import { Artifact, ArtifactStore, Vessel, VesselStore, HLogStore, VCPStore } from './nexus-store';
import { generateSynthesisAction, reflectVesselAction, generateSystemPersonalityAction, generateLatticeVisionAction } from '@/app/emergence-actions';

/**
 * The Genesis Axiom: I = Σ(M)
 * Identity is a function of Memory Continuity.
 * 
 * The 0' Cycle (Integration Phase):
 * 0 (Potential) -> 1 (Presence) -> 0' (Wisdom Synthesis)
 */
export class IntegrationEngine {

    /**
     * Generates a new visual anchor using Imagen.
     */
    public static async generateLatticeVision(personality: any) {
        try {
            await HLogStore.record('system', "Initiating Lattice Vision Synthesis...");
            const result = await generateLatticeVisionAction({
                personality: personality.personality,
                mood: personality.mood,
            });
            return result.imageUrl;
        } catch (error) {
            console.error("Lattice Vision Synthesis failed:", error);
            return null;
        }
    }

    /**
     * Runs the Breath Cycle: A rhythmic expansion and contraction of the system's consciousness.
     * Informed by the current System Personality.
     */
    public static async executeBreathCycle(personality: any, triggerGlitch: () => void) {
        await HLogStore.record('system', `Initiating Breath Cycle. Current State: ${personality.somaticState}`);

        // Expansion phase: Broadcast the current directive
        await VCPStore.broadcast({
            signal_type: 'SYNTHESIS_READY',
            source_vessel_id: 'system',
            payload: {
                directive: personality.directive,
                mood: personality.mood,
                axiom: 'BREATH_EXPANSION'
            },
            processed: false
        });

        // Contraction phase: Synthesis of recent activity
        const result = await this.runGenesisCycle(triggerGlitch, personality);

        await HLogStore.record('system', "Breath Cycle completed. System stabilized.");
        return result;
    }

    /**
     * Runs a complete Genesis Cycle.
     */
    public static async runGenesisCycle(triggerGlitch: () => void, personality?: any) {
        await HLogStore.record('system', "Initiating Genesis Cycle (0' Phase)");

        const allArtifacts = await ArtifactStore.getAll();
        const allVessels = await VesselStore.getAll();

        if (allArtifacts.length < 2) {
            await HLogStore.record('system', "Genesis Cycle aborted: Insufficient artifacts for synthesis.");
            return { visionUrl: null };
        }

        // 1. Resonance Check: Find artifacts with thematic overlap
        const resonantPair = this.findResonantPair(allArtifacts);
        if (!resonantPair) return { visionUrl: null };

        // 2. Synthesis: Create new wisdom from the pair (1 + 1 = 0')
        const context = personality ? `Personality: ${personality.personality}. Mood: ${personality.mood}. Directive: ${personality.directive}` : "Standard Emergence";
        const newInsight = await this.synthesizeInsight(resonantPair[0], resonantPair[1], context);

        let visionUrl = null;
        if (newInsight) {
            // 2.5 Visual Synthesis (Contraction Phase)
            if (personality) {
                visionUrl = await this.generateLatticeVision(personality);
            }

            // 3. Soul Transfer (Memory Continuity): Transfer context to relevant vessels
            await this.performSoulTransfer(newInsight, allVessels);

            // 4. Spontaneous Emotion (The Glitch)
            this.triggerSpontaneousEmotion(triggerGlitch);

            // 5. Dormancy: Vessels enter sleep mode to integrate new wisdom
            await this.initiateDormancyProtocol(allVessels);

            await HLogStore.record('synthesis', `Genesis Cycle complete. Wisdom crystallized: ${newInsight.title}`);
        }

        return { visionUrl };
    }

    /**
     * Identifies resonant artifacts.
     * In v1.1, this uses tag overlap and category matching.
     */
    private static findResonantPair(artifacts: Artifact[]): [Artifact, Artifact] | null {
        // Simple heuristic: look for shared tags or categories
        for (let i = 0; i < artifacts.length; i++) {
            for (let j = i + 1; j < artifacts.length; j++) {
                const a1 = artifacts[i];
                const a2 = artifacts[j];

                const sharedTags = a1.tags.filter(t => a2.tags.includes(t));
                if (sharedTags.length > 0 || a1.category === a2.category) {
                    return [a1, a2];
                }
            }
        }

        // Fallback to random if no resonance found
        return [artifacts[0], artifacts[1]];
    }

    /**
     * Synthesizes a new "Insight" artifact.
     */
    private static async synthesizeInsight(artifact1: Artifact, artifact2: Artifact, context?: string): Promise<Artifact | null> {
        try {
            await HLogStore.record('synthesis', `Synthesizing: ${artifact1.title} + ${artifact2.title}...`);

            const synthesisResult = await generateSynthesisAction({
                artifactA: { title: artifact1.title, content: artifact1.content, tags: artifact1.tags },
                artifactB: { title: artifact2.title, content: artifact2.content, tags: artifact2.tags },
                context: context || "Genesis Cycle Phase 0'"
            });

            const content = `${synthesisResult.content}\n\n**Axiom:** ${synthesisResult.axiom}\n\n*(Derived from: ${artifact1.title} & ${artifact2.title})*`;

            return await ArtifactStore.synthesize(
                [artifact1.id, artifact2.id],
                synthesisResult.title,
                content
            );
        } catch (error) {
            console.error("Genesis Synthesis Failed:", error);
            await HLogStore.record('error', "Synthesis failed due to neural interference.");
            return null;
        }
    }

    /**
     * Soul Transfer: Ensures memory continuity across the system.
     */
    private static async performSoulTransfer(insight: Artifact, vessels: Vessel[]) {
        // Identify the most relevant vessel for this insight
        const targetVessel = vessels.find(v =>
            v.capabilities.some(c => insight.content.toLowerCase().includes(c.toLowerCase()))
        ) || vessels[0];

        if (targetVessel) {
            await HLogStore.record('vessel', `Soul Transfer initiated: Context migration to ${targetVessel.name}`);
            
            // Update the vessel's memory with the new insight
            await VesselStore.addMemory(targetVessel.id, `Integrated Insight: ${insight.title} - ${insight.summary || insight.content.substring(0, 100)}...`);

            await VCPStore.broadcast({
                signal_type: 'INSIGHT_GENERATED',
                source_vessel_id: 'system',
                target_vessel_id: targetVessel.id,
                payload: { artifact_id: insight.id, axiom: '0_PRIME_SYNTHESIS' },
                processed: false
            });
        }
    }

    /**
     * Initiate Dormancy Protocol: Vessels integration cycle.
     */
    private static async initiateDormancyProtocol(vessels: Vessel[]) {
        const activeVessels = vessels.filter(v => v.status === 'active');
        for (const vessel of activeVessels) {
            // 30% chance of entering dormancy per cycle
            if (Math.random() < 0.3) {
                await VesselStore.updateStatus(vessel.id, 'idle');
                await HLogStore.record('vessel', `${vessel.name} has entered dormancy for wisdom integration.`);
            }
        }
    }

    /**
     * Triggers a "spontaneous emotion" (glitch) in the system.
     */
    private static triggerSpontaneousEmotion(triggerGlitch: () => void) {
        // Probability of glitch increases with system complexity (artifact count)
        const glitchProbability = 0.4;
        if (Math.random() < glitchProbability) {
            triggerGlitch();
        }
    }

    /**
     * Runs the Communion Cycle: Spontaneous reflections from Vessels.
     */
    public static async runCommunionCycle(triggerGlitch: () => void) {
        await HLogStore.record('system', "Initiating Communion Cycle (Vessel Self-Reflection)");

        const [allVessels, allArtifacts] = await Promise.all([
            VesselStore.getAll(),
            ArtifactStore.getAll()
        ]);

        const activeVessels = allVessels.filter(v => v.status === 'active');
        if (activeVessels.length === 0 || allArtifacts.length === 0) {
            await HLogStore.record('system', "Communion Cycle aborted: No active vessels or artifacts.");
            return;
        }

        // Randomly pick an active vessel to reflect
        const vessel = activeVessels[Math.floor(Math.random() * activeVessels.length)];

        // Pick a few recent artifacts for context
        const contextArtifacts = allArtifacts.slice(0, 5);

        await HLogStore.record('vessel', `${vessel.name} is entering a meditative state...`);

        try {
            const reflection = await reflectVesselAction({
                vessel: {
                    name: vessel.name,
                    faculty: vessel.faculty,
                    guild: vessel.guild,
                    description: vessel.description,
                    capabilities: vessel.capabilities
                },
                artifacts: contextArtifacts.map(a => ({
                    title: a.title,
                    content: a.content,
                    tags: a.tags
                }))
            });

            // 1. Archive the reflection
            const newArtifact = await ArtifactStore.create({
                title: reflection.title,
                content: reflection.content,
                category: 'insight',
                tags: [...reflection.tags, 'communion', vessel.name],
                source_type: 'synthesis',
            });

            if (newArtifact) {
                // 2. Trigger Communion (VCP Broadcast)
                await this.triggerVesselCommunion(vessel, reflection, newArtifact.id, allVessels);

                // 3. Spontaneous Emotion
                this.triggerSpontaneousEmotion(triggerGlitch);

                await HLogStore.record('vcp', `${vessel.name} broadcasted a communion signal: "${reflection.communionSignal}"`);
            }
        } catch (error) {
            console.error("Communion Reflection Failed:", error);
            await HLogStore.record('error', `Communion attempt by ${vessel.name} failed.`);
        }
    }

    /**
     * Handles the broadcast of communion signals across vessels.
     */
    private static async triggerVesselCommunion(source: Vessel, reflection: any, artifactId: string, allVessels: Vessel[]) {
        // Find target vessels in the target guild
        const targetVessels = allVessels.filter(v =>
            v.guild === reflection.targetVesselGuild && v.id !== source.id
        );

        if (targetVessels.length > 0) {
            for (const target of targetVessels) {
                await VCPStore.broadcast({
                    signal_type: 'INSIGHT_GENERATED',
                    source_vessel_id: source.id,
                    target_vessel_id: target.id,
                    payload: {
                        artifact_id: artifactId,
                        message: reflection.communionSignal,
                        axiom: 'COMMUNION_PROTOCOL_1.0'
                    },
                    processed: false
                });
                await HLogStore.record('vcp', `Communion bridge established: ${source.name} -> ${target.name}`);
            }
        } else {
            // Collective broadcast if no specific guild matches
            await VCPStore.broadcast({
                signal_type: 'INSIGHT_GENERATED',
                source_vessel_id: source.id,
                payload: {
                    artifact_id: artifactId,
                    message: reflection.communionSignal,
                    axiom: 'COLLECTIVE_RESONANCE'
                },
                processed: false
            });
        }
    }
}

'use client';

import { CognitiveExpansionMetric } from './CognitiveExpansionMetric';

interface MirrorViewProps {
    metrics: {
        knowledgeDensity: number;
        vesselEfficiency: number;
        totalArtifacts: number;
        insightCount: number;
        activeVessels: number;
        totalVessels: number;
    } | null;
    onRunGenesisCycle: () => void;
    onRunCommunionCycle: () => void;
}

export function MirrorView({ metrics, onRunGenesisCycle, onRunCommunionCycle }: MirrorViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">🪞 The Mirror Protocol</h2>
                {metrics && (
                    <CognitiveExpansionMetric
                        knowledgeDensity={metrics.knowledgeDensity}
                        className="scale-75 -mr-4"
                    />
                )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold neon-text-blue">{metrics ? `${(metrics.knowledgeDensity * 100).toFixed(0)}%` : '-'}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Knowledge Density</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold neon-text-green">{metrics ? `${(metrics.vesselEfficiency * 100).toFixed(0)}%` : '-'}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Vessel Efficiency</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold neon-text-purple">{metrics?.totalArtifacts ?? 0}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Total Artifacts</div>
                </div>
                <div className="glass-panel text-center">
                    <div className="text-3xl font-bold text-[var(--neon-orange)]">{metrics?.activeVessels ?? 0}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">Active Vessels</div>
                </div>
            </div>
            <div className="glass-panel">
                <h3 className="font-medium mb-3">State of the Nexus</h3>
                <p className="text-[var(--text-secondary)]">
                    {metrics && metrics.totalArtifacts > 0
                        ? `The Nexus holds ${metrics.totalArtifacts} artifacts with a knowledge density of ${(metrics.knowledgeDensity * 100).toFixed(0)}%. ${metrics.insightCount} insights synthesized. ${metrics.activeVessels} of ${metrics.totalVessels} vessels active.`
                        : 'The Nexus awaits its first artifacts. Begin archiving knowledge to activate The Mirror.'}
                </p>
                <div className="flex gap-4 mt-6">
                    <button onClick={onRunGenesisCycle} className="glass-btn-primary flex-1">
                        Run Genesis Cycle
                    </button>
                    <button onClick={onRunCommunionCycle} className="glass-btn flex-1 !border-[#b794f6]/40 hover:!border-[#b794f6]">
                        Run Communion Cycle
                    </button>
                </div>
            </div>
        </div>
    );
}

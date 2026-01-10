'use client';

import { SimulationRun } from '@/lib/nexus-store';

interface SimulationGraphProps {
    run: SimulationRun | null;
}

export function SimulationGraph({ run }: SimulationGraphProps) {
    if (!run || !run.results || run.results.length === 0) {
        return <div className="text-center text-[var(--text-muted)]">No simulation data to display.</div>;
    }

    const lastStep = run.results[run.results.length - 1];
    const gridSize = 500; // a fixed size for the visualization

    return (
        <div className="w-full h-96 bg-gray-900/50 rounded-lg relative">
            {lastStep.map((agent: any) => (
                <div
                    key={agent.id}
                    className="absolute w-2 h-2 bg-blue-400 rounded-full"
                    style={{
                        left: `${(agent.x / gridSize) * 100}%`,
                        top: `${(agent.y / gridSize) * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}

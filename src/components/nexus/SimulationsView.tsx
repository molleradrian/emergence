'use client';

import { useState } from 'react';
import { Simulation, SimulationRun, SimulationStore } from '@/lib/nexus-store';
import { SimulationGraph } from '@/components/simulation-graph';
import { launchGodotAction } from '@/app/system-actions';

interface SimulationsViewProps {
    simulations: Simulation[];
    simulationRuns: SimulationRun[];
    onLoadData: () => void;
}

export function SimulationsView({ simulations, simulationRuns, onLoadData }: SimulationsViewProps) {
    const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
    const [newSimulationParams, setNewSimulationParams] = useState<Record<string, any>>({});
    const [selectedSimulationRun, setSelectedSimulationRun] = useState<SimulationRun | null>(null);
    const [launchStatus, setLaunchStatus] = useState<string>("");

    async function handleCreateSimulation() {
        if (!newSimulationParams.name || !newSimulationParams.description || !newSimulationParams.parameters) {
            console.error("Invalid simulation data");
            return;
        }

        await SimulationStore.createSimulation({
            name: newSimulationParams.name,
            description: newSimulationParams.description,
            parameters: newSimulationParams.parameters,
        });

        setNewSimulationParams({});
        onLoadData();
    }

    async function handleRunSimulation(simulationId: string) {
        const simulation = simulations.find(s => s.id === simulationId);
        if (!simulation) {
            console.error("Simulation not found");
            return;
        }

        const run = await SimulationStore.createSimulationRun(simulationId);
        if (run) {
            await SimulationStore.runSimulation(simulation, run);
            onLoadData();
        }
    }

    async function handleLaunchGodot(mode: 'editor' | 'game') {
        setLaunchStatus(`Launching Godot (${mode})...`);
        const result = await launchGodotAction(mode);
        setLaunchStatus(result.message);
        setTimeout(() => setLaunchStatus(""), 3000);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">⚙️ Simulation Engine</h2>
                <div className="flex gap-2 items-center">
                    <span className="text-xs text-[var(--text-muted)] mr-2">{launchStatus}</span>
                    <button onClick={() => handleLaunchGodot('game')} className="glass-btn text-sm px-3 py-1 flex items-center gap-2">
                        ▶️ Launch Body
                    </button>
                    <button onClick={() => handleLaunchGodot('editor')} className="glass-btn text-sm px-3 py-1 flex items-center gap-2">
                        🛠️ Edit Body
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Simulation List */}
                <div className="glass-panel">
                    <h3 className="font-medium mb-3">Simulations</h3>
                    <div className="space-y-2">
                        {simulations.map(sim => (
                            <button
                                key={sim.id}
                                onClick={() => setSelectedSimulation(sim)}
                                className={`w-full text-left p-2 rounded-lg ${selectedSimulation?.id === sim.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                            >
                                {sim.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Simulation Details */}
                <div className="glass-panel">
                    {selectedSimulation ? (
                        <div>
                            <h3 className="font-medium mb-3">{selectedSimulation.name}</h3>
                            <p className="text-sm text-[var(--text-muted)] mb-4">{selectedSimulation.description}</p>
                            <div>
                                <h4 className="font-medium mb-2">Parameters</h4>
                                {Object.entries(selectedSimulation.parameters).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center mb-2">
                                        <label className="text-sm">{key}</label>
                                        <input
                                            type="text"
                                            value={value as string}
                                            onChange={(e) => {
                                                const newParams = { ...selectedSimulation.parameters, [key]: e.target.value };
                                                setSelectedSimulation({ ...selectedSimulation, parameters: newParams });
                                            }}
                                            className="glass-input w-32"
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => handleRunSimulation(selectedSimulation.id)} className="glass-btn-primary mt-4">
                                Run Simulation
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-medium mb-3">Create New Simulation</h3>
                            <input
                                type="text"
                                placeholder="Simulation Name"
                                className="glass-input w-full mb-3"
                                onChange={(e) => setNewSimulationParams({ ...newSimulationParams, name: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="glass-input w-full mb-3"
                                onChange={(e) => setNewSimulationParams({ ...newSimulationParams, description: e.target.value })}
                            />
                            <select 
                                className="glass-input w-full mb-3"
                                onChange={(e) => setNewSimulationParams({ ...newSimulationParams, modelType: e.target.value })}
                            >
                                <option value="flocking">Flocking (Boids)</option>
                                <option value="knowledge-diffusion">Knowledge Diffusion</option>
                            </select>
                            <textarea
                                placeholder='Parameters (JSON format, e.g., {"numAgents": 50, "gridSize": 500, "steps": 100})'
                                className="glass-input w-full mb-3"
                                defaultValue='{"numAgents": 50, "gridSize": 500, "steps": 100}'
                                onBlur={(e) => {
                                    try {
                                        const params = JSON.parse(e.target.value);
                                        setNewSimulationParams({ 
                                            ...newSimulationParams, 
                                            parameters: { 
                                                ...params, 
                                                modelType: newSimulationParams.modelType || 'flocking' 
                                            } 
                                        });
                                    } catch {}
                                }}
                            />
                            <button onClick={handleCreateSimulation} className="glass-btn-primary">
                                Create Simulation
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Simulation Runs */}
            <div className="glass-panel mt-6">
                <h3 className="font-medium mb-3">Simulation Runs</h3>
                <div className="space-y-2">
                    {simulationRuns.map(run => (
                        <button
                            key={run.id}
                            onClick={() => setSelectedSimulationRun(run)}
                            className={`w-full text-left p-2 rounded-lg ${selectedSimulationRun?.id === run.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm">{simulations.find(s => s.id === run.simulationId)?.name}</span>
                                <span className="text-xs">{new Date(run.created_at).toLocaleString()}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    run.status === 'complete' ? 'bg-green-500/20 text-green-300' :
                                    run.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                                    'bg-red-500/20 text-red-300'
                                }`}>{run.status}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Simulation Graph */}
            <div className="glass-panel mt-6">
                <h3 className="font-medium mb-3">Simulation Visualization</h3>
                <SimulationGraph run={selectedSimulationRun} />
            </div>
        </div>
    );
}

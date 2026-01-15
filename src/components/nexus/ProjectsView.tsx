import { Project, Vessel, ProjectStore, Directive } from '@/lib/nexus-store';
import { ProjectGraph } from '@/components/project-graph';
import { Play, PlayCircle, Loader2, ScrollText } from 'lucide-react';
import { ScenarioRunner } from '@/lib/scenario-runner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProjectsViewProps {
    projects: Project[];
    vessels: Vessel[];
    onLoadData: () => void;
    onOpenVesselAssignment: (projectId: string, directiveId: string) => void;
}

export function ProjectsView({ projects, vessels, onLoadData, onOpenVesselAssignment }: ProjectsViewProps) {
    const [runningScenarios, setRunningScenarios] = useState<Record<string, boolean>>({});

    async function handleCreateProject(name: string) {
        if (!name.trim() || name.length > 100) return;
        await ProjectStore.create(name);
        onLoadData();
    }

    async function handleCreateDirective(projectId: string, directiveName: string) {
        if (!directiveName.trim() || directiveName.length > 200) return;
        await ProjectStore.addDirective(projectId, directiveName);
        onLoadData();
    }

    async function handleUpdateDirectiveStatus(projectId: string, directiveId: string, currentStatus: Directive['status']) {
        const nextStatus: Directive['status'] = currentStatus === 'queued' ? 'active' : currentStatus === 'active' ? 'complete' : 'queued';
        await ProjectStore.updateDirectiveStatus(projectId, directiveId, nextStatus);
        onLoadData();
    }

    async function handleLaunchScenario(projectId: string, directive: Directive) {
        setRunningScenarios(prev => ({ ...prev, [directive.id]: true }));
        
        if (!directive.scenario_data) {
            await ScenarioRunner.initializeScenario(projectId, directive.id, directive.name);
        }
        
        await ScenarioRunner.step(projectId, directive.id);
        
        onLoadData();
        setRunningScenarios(prev => ({ ...prev, [directive.id]: false }));
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">📋 Command Deck</h2>
                <button onClick={() => ProjectStore.seedInitialProjects().then(onLoadData)} className="glass-btn text-[10px] uppercase font-bold py-2 px-4 border border-white/10 hover:border-[var(--neon-purple)] transition-all">
                    🌱 Seed Initial Projects
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Project creation */}
                <div className="glass-panel p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-[var(--text-muted)]">New Grand Challenge</h3>
                    <input
                        type="text"
                        placeholder="Define Objective..."
                        className="glass-input w-full mb-3 text-sm"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                handleCreateProject(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                    <p className="text-[10px] text-[var(--text-muted)] italic">Press Enter to initialize project cluster.</p>
                </div>

                {/* Project list */}
                {projects.map(p => (
                    <div key={p.id} className="glass-panel p-5 space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-white tracking-tight">{p.name}</h3>
                            <span className="text-[9px] font-mono text-[var(--text-muted)]">ID: {p.id.substring(0, 8)}</span>
                        </div>
                        
                        <div className="space-y-3">
                            {p.directives.map(d => (
                                <div key={d.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] bg-white/5 p-2 rounded-lg group">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <button 
                                                onClick={() => handleLaunchScenario(p.id, d)}
                                                disabled={runningScenarios[d.id]}
                                                className="text-[var(--neon-blue)] hover:scale-110 transition-transform disabled:opacity-50"
                                                title="Launch Autonomous Step"
                                            >
                                                {runningScenarios[d.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlayCircle className="h-3.5 w-3.5" />}
                                            </button>
                                            <span className="truncate">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => handleUpdateDirectiveStatus(p.id, d.id, d.status)} className={cn(
                                                "text-[9px] px-2 py-0.5 rounded-full uppercase font-bold",
                                                d.status === 'complete' ? 'bg-green-500/20 text-green-300' :
                                                d.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-gray-500/20 text-gray-300'
                                            )}>{d.status}</button>
                                            <button className="text-xs hover:text-white" onClick={() => onOpenVesselAssignment(p.id, d.id)}>
                                                {d.assignedVessel ? (
                                                    <span title={vessels.find(v => v.id === d.assignedVessel)?.name}>
                                                        {vessels.find(v => v.id === d.assignedVessel)?.emoji}
                                                    </span>
                                                ) : '👤'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Autonomy Log for this Directive */}
                                    {d.scenario_data && (
                                        <div className="ml-6 border-l border-white/10 pl-3 py-1 space-y-1.5">
                                            <div className="flex justify-between items-center text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">
                                                <span className="flex items-center gap-1"><ScrollText className="h-2.5 w-2.5" /> Autonomy Log</span>
                                                <span className="text-[var(--neon-purple)]">{d.scenario_data.current_state}</span>
                                            </div>
                                            <div className="max-h-20 overflow-y-auto custom-scrollbar text-[10px] font-mono text-white/60 space-y-1">
                                                {d.scenario_data.logs.slice(-2).map((log, idx) => (
                                                    <div key={idx} className="truncate">{log}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Add Directive..."
                            className="glass-input w-full mt-3 text-xs"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                    handleCreateDirective(p.id, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                    </div>
                ))}
            </div>
            <ProjectGraph projects={projects} />
        </div>
    );
}

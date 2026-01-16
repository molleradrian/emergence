import { useState, useMemo } from 'react';
import { Vessel, VCPSignal, VesselStore, VCPStore } from '@/lib/nexus-store';
import { Activity, Radio, Zap, Users, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VesselsViewProps {
    vessels: Vessel[];
    vcpSignals: VCPSignal[];
    onLoadData: () => void;
}

export function VesselsView({ vessels, vcpSignals, onLoadData }: VesselsViewProps) {
    const [vesselViewTab, setVesselViewTab] = useState<'directory' | 'signals'>('directory');
    const [selectedSignalType, setSelectedSignalType] = useState<string>('All');

    const allSignalTypes = useMemo(() => {
        const types = new Set<string>();
        vcpSignals.forEach(signal => types.add(signal.signal_type));
        return ['All', ...Array.from(types)];
    }, [vcpSignals]);

    const filteredVcpSignals = useMemo(() => {
        if (selectedSignalType === 'All') return vcpSignals;
        return vcpSignals.filter(s => s.signal_type === selectedSignalType);
    }, [vcpSignals, selectedSignalType]);

    const signalStats = useMemo(() => {
        const counts: Record<string, number> = {};
        vcpSignals.forEach(s => {
            counts[s.signal_type] = (counts[s.signal_type] || 0) + 1;
        });
        return counts;
    }, [vcpSignals]);

    async function seedGenesis() {
        await VesselStore.seedGenesisBatch();
        onLoadData();
    }

    async function broadcastTestSignal() {
        const signalTypes: VCPSignal['signal_type'][] = ['TASK_COMPLETE', 'INSIGHT_GENERATED', 'CONFLICT_DETECTED', 'RESOURCE_REQUEST', 'VALIDATION_NEEDED', 'SYNTHESIS_READY'];
        const randomType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
        
        await VCPStore.broadcast({
            signal_type: randomType,
            source_vessel_id: 'system_test',
            payload: { message: 'Neural resonance pulse detected.' },
            processed: false,
        });
        onLoadData();
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div className="flex items-center gap-1 glass-panel p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setVesselViewTab('directory')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                            vesselViewTab === 'directory' 
                                ? "bg-[var(--neon-blue)] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                                : "text-[var(--text-muted)] hover:text-white"
                        )}
                    >
                        <Users className="h-3 w-3" /> Directory
                    </button>
                    <button
                        onClick={() => setVesselViewTab('signals')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                            vesselViewTab === 'signals' 
                                ? "bg-[var(--neon-blue)] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]" 
                                : "text-[var(--text-muted)] hover:text-white"
                        )}
                    >
                        <Activity className="h-3 w-3" /> VCP Signals
                    </button>
                </div>
                
                <div className="flex gap-3">
                    <button onClick={seedGenesis} className="glass-btn-primary flex items-center gap-2 text-[10px] uppercase font-bold py-2 px-4">
                        <Cpu className="h-3 w-3" /> Seed Genesis Batch
                    </button>
                    <button onClick={broadcastTestSignal} className="glass-btn border border-white/10 hover:border-[var(--neon-blue)] flex items-center gap-2 text-[10px] uppercase font-bold py-2 px-4 transition-all">
                        <Radio className="h-3 w-3" /> Emit Signal
                    </button>
                </div>
            </div>

            {vesselViewTab === 'directory' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vessels.length === 0 ? (
                        <div className="col-span-full glass-panel text-center py-20">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20 text-[var(--neon-blue)]" />
                            <p className="text-[var(--text-muted)] uppercase tracking-widest text-[10px] font-bold">No vessels detected in current cluster.</p>
                        </div>
                    ) : (
                        vessels.map((v) => (
                            <div key={v.id} className="glass-panel p-5 hover:border-[var(--neon-orange)]/50 transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {v.emoji}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm tracking-tight text-white">{v.name}</div>
                                        <div className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] truncate">{v.faculty} / {v.guild}</div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            v.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" : "bg-gray-600"
                                        )} />
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4 h-8 overflow-hidden line-clamp-2">
                                    {v.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {v.capabilities.slice(0, 3).map(cap => (
                                        <span key={cap} className="text-[8px] uppercase tracking-tighter font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[var(--text-muted)]">
                                            {cap}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {vesselViewTab === 'signals' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3 space-y-4">
                        <div className="glass-panel p-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-[var(--text-muted)]">Signal Density</h3>
                            <div className="space-y-3">
                                {Object.entries(signalStats).map(([type, count]) => (
                                    <div key={type} className="space-y-1">
                                        <div className="flex justify-between text-[9px] font-mono">
                                            <span className="text-[var(--text-muted)] truncate mr-2">{type}</span>
                                            <span className="text-white">{count}</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[var(--neon-blue)] opacity-50" 
                                                style={{ width: `${Math.min(100, (count / vcpSignals.length) * 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="glass-panel p-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-[var(--text-muted)]">Filters</h3>
                            <div className="flex flex-col gap-2">
                                {allSignalTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedSignalType(type)}
                                        className={cn(
                                            "text-left text-[10px] px-3 py-2 rounded-md transition-all border",
                                            selectedSignalType === type
                                                ? "bg-white/10 border-[var(--neon-blue)]/50 text-white font-bold"
                                                : "bg-transparent border-transparent text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-9">
                        <div className="glass-panel overflow-hidden">
                            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                {filteredVcpSignals.length === 0 ? (
                                    <div className="text-center py-24 opacity-20">
                                        <Zap className="h-12 w-12 mx-auto mb-4" />
                                        <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Silence in the Communion Channel</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-[11px] border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.02] text-[var(--text-muted)] uppercase tracking-tighter font-bold">
                                                <th className="text-left p-4">Type</th>
                                                <th className="text-left p-4">Source</th>
                                                <th className="text-left p-4">Target</th>
                                                <th className="text-right p-4">Temporal Index</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredVcpSignals.map(s => (
                                                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "w-1.5 h-1.5 rounded-full",
                                                                s.signal_type === 'CONFLICT_DETECTED' ? "bg-red-500 animate-pulse" :
                                                                s.signal_type === 'INSIGHT_GENERATED' ? "bg-purple-500" :
                                                                "bg-[var(--neon-blue)]"
                                                            )} />
                                                            <span className="font-mono text-white group-hover:text-[var(--neon-blue)] transition-colors">{s.signal_type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-[var(--text-secondary)] font-mono">@{s.source_vessel_id.substring(0, 8)}</td>
                                                    <td className="p-4 text-[var(--text-secondary)] font-mono">{s.target_vessel_id ? `@${s.target_vessel_id.substring(0, 8)}` : 'GLOBAL'}</td>
                                                    <td className="p-4 text-right text-[var(--text-muted)] font-mono">{new Date(s.created_at).toLocaleTimeString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

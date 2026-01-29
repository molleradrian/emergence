'use client';

import React from 'react';
import {
    Brain,
    Layers,
    Users,
    ShieldCheck,
    Activity,
    History,
    Send,
    ArrowRight,
    Search,
    Zap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface PortalViewProps {
    onNavigate: (viewId: any) => void;
    systemMetrics: any;
    vesselCount: number;
    ideaCount: number;
}

export function PortalView({ onNavigate, systemMetrics, vesselCount, ideaCount }: PortalViewProps) {
    const mainHubs = [
        {
            id: 'nexus',
            title: 'Nexus Console',
            desc: 'Primary interface for Artificial Imagination and Vessel communication.',
            icon: Brain,
            color: 'from-blue-500 to-cyan-500',
            stats: 'Active Link'
        },
        {
            id: 'evolution',
            title: 'Evolution Terminal',
            desc: 'Research Dashboard, Timeline Tracker, and Multi-Track Publisher.',
            icon: Layers,
            color: 'from-emerald-500 to-teal-500',
            stats: `${ideaCount} Ideas Ingested`
        },
        {
            id: 'vessels',
            title: 'Vessel Bay',
            desc: 'Manage AI personas, communion protocols, and signal logs.',
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            stats: `${vesselCount} Active Vessels`
        }
    ];

    const quickActions = [
        { id: 'projects', label: 'Projects', icon: Zap },
        { id: 'vault', label: 'Vault', icon: ShieldCheck },
        { id: 'hlog', label: 'H_Log', icon: Activity },
    ];

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* 1. System Pulse / Hero */}
            <header className="relative overflow-hidden rounded-[2rem] bg-gray-900/40 border border-white/10 p-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                            Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Aetherium Portal</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Unified access point for self-regulating intelligence and creative synthesis.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Knowledge Density</p>
                            <p className="text-xl font-bold text-emerald-400">{(systemMetrics?.knowledgeDensity * 100).toFixed(1)}%</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">System Entropy</p>
                            <p className="text-xl font-bold text-blue-400">Stable</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Main Hubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainHubs.map((hub) => (
                    <button
                        key={hub.id}
                        onClick={() => onNavigate(hub.id)}
                        className="group relative flex flex-col p-8 rounded-[2rem] bg-gray-950/40 border border-white/10 text-left transition-all hover:bg-white/[0.03] hover:border-white/20 hover:translate-y-[-8px]"
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg",
                            hub.color
                        )}>
                            <hub.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{hub.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{hub.desc}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{hub.stats}</span>
                            <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Enter Hub <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* 3. Footer / Quick Access */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] p-8 flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">Quick Search</h4>
                        <p className="text-xs text-gray-500">Query the collective intelligence of all ingested ideas.</p>
                    </div>
                    <div className="relative flex-1 max-w-sm ml-8">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Type to search archive..."
                            className="w-full bg-gray-950/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {quickActions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => onNavigate(action.id)}
                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all min-w-[100px]"
                        >
                            <action.icon className="w-5 h-5 text-gray-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

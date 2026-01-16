'use client';

import React, { useState } from 'react';
import { Idea } from '@/data/nexus-ideas';
import {
    ChevronRight,
    History,
    ShieldAlert,
    BookOpen,
    Settings,
    CheckCircle2,
    AlertCircle,
    FileText,
    Lightbulb,
    Palette,
    Atom
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface EvolutionTrackerProps {
    idea: Idea;
    onClose?: () => void;
}

export default function EvolutionTracker({ idea, onClose }: EvolutionTrackerProps) {
    const [selectedVersionIndex, setSelectedVersionIndex] = useState(idea.versions.length - 1);
    const selectedVersion = idea.versions[selectedVersionIndex];
    const [activeTrack, setActiveTrack] = useState<keyof Idea['output_tracks']>('scientific');

    return (
        <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={onClose}
                        className="text-blue-400 hover:text-blue-300 transition-colors flex items-center mb-2"
                    >
                        <ChevronRight className="rotate-180 w-4 h-4 mr-1" />
                        Back to Dashboard
                    </button>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        {idea.title}
                    </h2>
                    <p className="text-gray-400 mt-1">{idea.description}</p>
                </div>
                <div className="flex space-x-2">
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border",
                        idea.status === 'published' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            idea.status === 'under_review' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                idea.status === 'revised' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                    "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    )}>
                        {idea.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Timeline Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                            <History className="w-4 h-4 mr-2" />
                            Evolution Timeline
                        </h3>
                        <div className="space-y-2 relative">
                            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
                            {idea.versions.map((v, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedVersionIndex(idx)}
                                    className={cn(
                                        "w-full flex items-center space-x-3 p-2 rounded-lg transition-all relative z-10",
                                        selectedVersionIndex === idx
                                            ? "bg-blue-500/20 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10"
                                            : "hover:bg-white/5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2",
                                        v.isReview
                                            ? (selectedVersionIndex === idx ? "bg-red-500 border-red-400" : "bg-red-900/50 border-red-700/50")
                                            : (selectedVersionIndex === idx ? "bg-blue-500 border-blue-400" : "bg-blue-900/50 border-blue-700/50")
                                    )}>
                                        {v.isReview ? <ShieldAlert className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white uppercase">{v.v.replace('v', '')}</span>}
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className={cn(
                                            "text-sm font-medium truncate",
                                            selectedVersionIndex === idx ? "text-white" : "text-gray-400"
                                        )}>{v.v}</p>
                                        <p className="text-[10px] text-gray-500">{v.date}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Grounding
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Citations</span>
                                <span className={idea.academic_grounding.needs_citations ? "text-red-400" : "text-green-400"}>
                                    {idea.academic_grounding.needs_citations ? "Required" : "Verified"}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {idea.academic_grounding.linked_sources.map((source, sIdx) => (
                                    <span key={sIdx} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">
                                        {source.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Version Detail Card */}
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-blue-500/10" />

                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="text-2xl font-bold text-white">{selectedVersion.v}</h4>
                                <p className="text-blue-400 font-medium">{selectedVersion.notes}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Release Date</p>
                                <p className="text-gray-300 font-mono">{selectedVersion.date}</p>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 min-h-[200px] relative">
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {selectedVersion.content}
                                </p>
                                {!selectedVersion.isReview && (
                                    <div className="absolute bottom-4 right-4 flex space-x-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500/50" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Review Specific Panel */}
                        {selectedVersion.isReview && idea.reviews.length > 0 && (
                            <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                                <div className="h-px bg-white/10 w-full" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                                        <h5 className="text-red-400 font-bold mb-3 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Critical Findings
                                        </h5>
                                        <ul className="space-y-2">
                                            {idea.reviews[0].findings.map((f, i) => (
                                                <li key={i} className="text-gray-300 text-sm flex items-start">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-3 shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                                        <h5 className="text-blue-400 font-bold mb-3 flex items-center">
                                            <Settings className="w-4 h-4 mr-2" />
                                            Protocol Recommendations
                                        </h5>
                                        <ul className="space-y-2">
                                            {idea.reviews[0].recommendations.map((r, i) => (
                                                <li key={i} className="text-gray-300 text-sm flex items-start">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-3 shrink-0" />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Output Tracks */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center">
                            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3" />
                            Multi-Track Output
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <TrackButton
                                active={activeTrack === 'scientific'}
                                onClick={() => setActiveTrack('scientific')}
                                icon={<Atom />}
                                label="Scientific"
                                color="indigo"
                            />
                            <TrackButton
                                active={activeTrack === 'philosophical'}
                                onClick={() => setActiveTrack('philosophical')}
                                icon={<FileText />}
                                label="Philosophical"
                                color="purple"
                            />
                            <TrackButton
                                active={activeTrack === 'artistic'}
                                onClick={() => setActiveTrack('artistic')}
                                icon={<Palette />}
                                label="Artistic"
                                color="pink"
                            />
                            <TrackButton
                                active={activeTrack === 'educational'}
                                onClick={() => setActiveTrack('educational')}
                                icon={<Lightbulb />}
                                label="Educational"
                                color="amber"
                            />
                        </div>
                        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[120px]">
                            <p className="text-gray-300 italic">
                                {idea.output_tracks[activeTrack]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrackButton({ active, onClick, icon, label, color }: {
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    label: string,
    color: 'indigo' | 'purple' | 'pink' | 'amber'
}) {
    const colors = {
        indigo: "bg-indigo-500",
        purple: "bg-purple-500",
        pink: "bg-pink-500",
        amber: "bg-amber-500"
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col items-center justify-center space-y-2 group relative overflow-hidden",
                active
                    ? `bg-white/10 border-white/20 ring-2 ring-${color}-500/50 shadow-lg`
                    : "bg-gray-900/40 border-white/5 hover:bg-white/5 opacity-60 hover:opacity-100"
            )}
        >
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity blur-xl rounded-full",
                colors[color]
            )} />
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                active ? colors[color] : "bg-white/10"
            )}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 text-white" })}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-white">{label}</span>
        </button>
    );
}

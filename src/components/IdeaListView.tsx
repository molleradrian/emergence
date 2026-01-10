'use client';

import React from 'react';
import { Idea, NEXUS_IDEAS } from '@/data/nexus-ideas';
import { Layers, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface IdeaListViewProps {
    onSelectIdea: (idea: Idea) => void;
}

export function IdeaListView({ onSelectIdea }: IdeaListViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 duration-500">
            {NEXUS_IDEAS.map((idea) => (
                <button
                    key={idea.id}
                    onClick={() => onSelectIdea(idea)}
                    className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left group transition-all hover:bg-white/5 hover:border-white/20 hover:translate-y-[-4px] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-5 h-5 text-blue-400" />
                    </div>

                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                            <Layers className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border",
                            idea.status === 'published' ? "text-green-400 border-green-500/20" :
                                idea.status === 'under_review' ? "text-red-400 border-red-500/20" :
                                    "text-blue-400 border-blue-500/20"
                        )}>
                            {idea.status}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {idea.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                        {idea.description}
                    </p>

                    <div className="flex items-center space-x-4 pt-4 border-t border-white/5 mt-auto">
                        <div className="flex items-center text-[10px] text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {idea.created}
                        </div>
                        <div className="flex items-center text-[10px] text-gray-500">
                            <Layers className="w-3 h-3 mr-1" />
                            {idea.versions.length} Versions
                        </div>
                        {!idea.academic_grounding.needs_citations && (
                            <div className="flex items-center text-[10px] text-green-500/70">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Grounded
                            </div>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}

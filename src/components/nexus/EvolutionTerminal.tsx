'use client';

import React, { useState } from 'react';
import { Idea } from '@/data/nexus-ideas';
import { IdeaListView } from '@/components/IdeaListView';
import EvolutionTracker from '@/components/EvolutionTracker';
import { PublisherView } from '@/components/nexus/PublisherView';
import { Sparkles, History, Send } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type SubView = 'list' | 'evolution' | 'publisher';

export default function EvolutionTerminal() {
    const [view, setView] = useState<SubView>('list');
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

    const handleSelectIdea = (idea: Idea) => {
        setSelectedIdea(idea);
        setView('evolution');
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Sub-navigation */}
            {view !== 'publisher' && (
                <div className="flex items-center gap-4 bg-gray-950/50 p-1 rounded-2xl border border-white/10 w-fit">
                    <button
                        onClick={() => setView('list')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                            view === 'list'
                                ? "bg-white text-black shadow-lg shadow-white/10"
                                : "text-gray-500 hover:text-white"
                        )}
                    >
                        <Sparkles className="w-4 h-4" />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setView('evolution')}
                        disabled={!selectedIdea}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                            view === 'evolution'
                                ? "bg-white text-black shadow-lg shadow-white/10"
                                : "text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        )}
                    >
                        <History className="w-4 h-4" />
                        Evolution
                    </button>
                    <button
                        onClick={() => setView('publisher')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-white transition-all"
                        )}
                    >
                        <Send className="w-4 h-4" />
                        Publisher
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-h-0">
                {view === 'list' && (
                    <IdeaListView onSelectIdea={handleSelectIdea} />
                )}
                {view === 'evolution' && selectedIdea && (
                    <div className="h-full animate-in slide-in-from-right-8 duration-500">
                        <EvolutionTracker idea={selectedIdea} onClose={() => setView('list')} />
                    </div>
                )}
                {view === 'publisher' && (
                    <PublisherView onBack={() => setView('list')} />
                )}
            </div>
        </div>
    );
}

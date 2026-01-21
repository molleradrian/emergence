'use client';

/**
 * Project Emergence - Main Command Dashboard
 * Central hub for Consciousness Engineering, Creative Writing, and System Evolution.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppState } from '@/context/app-state-context';
import { Idea, NEXUS_IDEAS } from '@/data/nexus-ideas';

// Components
import { PageHeader } from '@/components/page-header';
import { ProjectSwitcher } from '@/components/project-switcher';
import { FileUpload } from '@/components/file-upload';
import { PrototypingInterface } from '@/components/prototyping-interface';
import { ChatInterface } from '@/components/chat-interface';
// import { OrlogGame } from '@/components/OrlogGame';
import { IdeaListView } from '@/components/IdeaListView';
import EvolutionTracker from '@/components/EvolutionTracker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Icons
import {
  LayoutDashboard,
  Dices,
  Archive,
  History,
  ShieldCheck,
  Loader2,
  Settings,
  BrainCircuit,
  Binary
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, isUserLoading: authLoading } = useAuth();
  const { projectName } = useAppState();

  // View State
  const [activeTab, setActiveTab] = useState('architecture');
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  // Set initial idea for evolution view
  useEffect(() => {
    if (!selectedIdea && NEXUS_IDEAS.length > 0) {
      setSelectedIdea(NEXUS_IDEAS[0]);
    }
  }, [selectedIdea]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f14]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#00f0ff] opacity-40" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#00f0ff] animate-pulse">Synchronizing Neural Link</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f14] nexus-bg">
        <div className="glass-panel p-10 max-w-md w-full text-center space-y-6 border-[#00f0ff]/20">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00f0ff]/20 to-[#b794f6]/20 rounded-2xl mx-auto flex items-center justify-center border border-[#00f0ff]/30">
            <ShieldCheck className="h-10 w-10 text-[#00f0ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Nexus Authentication</h1>
            <p className="text-[var(--text-muted)] text-sm mt-2 leading-relaxed">
              Your consciousness signature is not yet registered. Initialize link to proceed.
            </p>
          </div>
          <Button className="w-full h-12" variant="glass-primary" onClick={() => window.location.reload()}>
            Register Identity
          </Button>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest pt-4">Encryption Level: 4096-bit Quantum</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen nexus-bg flex flex-col p-4 md:p-8 space-y-6", activeTab === 'evolution' && "p-0 md:p-0")}>

      {/* Top Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <PageHeader
          title={projectName}
          subtitle="Aetherium v1.0 | Generative Operating System"
        />

        <div className="flex flex-wrap items-center gap-3">
          <ProjectSwitcher />
          <div className="hidden sm:block h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-1 glass-panel p-1 rounded-lg">
            {[
              { id: 'architecture', icon: LayoutDashboard, label: 'Architecture' },
              { id: 'evolution', icon: History, label: 'Evolution' },
              { id: 'systems', icon: Settings, label: 'Core Systems' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all",
                  activeTab === tab.id
                    ? "bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.05)]"
                    : "text-[var(--text-muted)] hover:text-white"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Prototyping & Tools (8 Cols) */}
            <div className="xl:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload />
                <div className="glass-panel p-6 flex flex-col justify-center items-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#b794f6]">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Neural Status</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Connectivity optimization: 100% stable</p>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#b794f6] h-full w-4/5 shadow-[0_0_10px_rgba(183,148,246,0.5)]" />
                  </div>
                </div>
              </div>

              <Tabs defaultValue="prototyping" className="w-full">
                <TabsList className="bg-transparent border-none p-0 mb-4 h-auto gap-4">
                  <TabsTrigger value="prototyping" className="data-[state=active]:bg-[#00f0ff]/10 data-[state=active]:text-[#00f0ff] rounded-xl px-6 py-2 border border-white/5 font-bold uppercase tracking-widest text-[10px]">
                    <Binary className="mr-2 h-4 w-4" /> Prototyping
                  </TabsTrigger>
                  <TabsTrigger value="gaming" className="data-[state=active]:bg-[#ff9900]/10 data-[state=active]:text-[#ff9900] rounded-xl px-6 py-2 border border-white/5 font-bold uppercase tracking-widest text-[10px]">
                    <Dices className="mr-2 h-4 w-4" /> Strategic Gaming
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="prototyping" className="mt-0">
                  <PrototypingInterface />
                </TabsContent>
                <TabsContent value="gaming" className="mt-0">
                  <div className="glass-panel p-6 min-h-[600px]">
                    {/* <OrlogGame /> */}
                    <div className="flex items-center justify-center h-full text-[var(--text-muted)] uppercase tracking-widest text-xs">Component Offline</div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Chat (4 Cols) */}
            <div className="xl:col-span-4 h-[calc(100vh-200px)] min-h-[600px] sticky top-6">
              <ChatInterface />
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (
          <div className="h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 duration-700">
            {selectedIdea ? (
              <div className="h-full flex flex-col">
                <div className="px-8 py-4 flex items-center justify-between border-b border-white/5">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIdea(null)} className="text-[var(--text-muted)] hover:text-white">
                    <Archive className="mr-2 h-4 w-4" /> Back to Idea List
                  </Button>
                  <Badge variant="neon" className="px-4 py-1">Active Evolution Protocol</Badge>
                </div>
                <div className="flex-1 overflow-hidden">
                  <EvolutionTracker idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
                </div>
              </div>
            ) : (
              <div className="px-8 h-full">
                <IdeaListView onSelectIdea={setSelectedIdea} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'systems' && (
          <div className="flex flex-col items-center justify-center py-40 animate-in zoom-in-95 duration-700">
            <div className="glass-panel p-12 text-center max-w-xl mx-auto space-y-6">
              <Settings className="h-16 w-16 text-[var(--text-muted)] mx-auto animate-spin-slow" />
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase tracking-[0.2em]">Core Systems Under Maintenance</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                The underlying foundational architecture is currently being reconfigured for Phase 6 emergence. High-level nexus functions remain operational via the Architecture view.
              </p>
              <Button variant="outline" onClick={() => setActiveTab('architecture')}>
                Return to Navigation
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="pt-8 pb-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-3 w-3 text-[#00f0ff]" />
          <span>Project Emergence © 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Neuro-Link API</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
          <span>Mainframe Signature: 0xFD...29B</span>
        </div>
      </footer>
    </div>
  );
}

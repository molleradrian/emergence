'use client';

import React, { useState, useRef, useEffect } from 'react';
import { generateVesselResponseAction } from '@/app/actions';
import { VesselStore, Vessel, ArtifactStore } from '@/lib/nexus-store';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Sparkles,
  User,
  FolderPlus,
  Loader2,
  Trash2,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  vesselName?: string;
  vesselEmoji?: string;
  timestamp: Date;
}

export function ChatInterface() {
  const { selectedVesselId, setSelectedVesselId } = useAppState();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to the Aetherium Nexus. I am the generative core of this Operating System for Emergence. How may I assist in your synthesis today?',
      vesselName: 'The Nexus',
      vesselEmoji: '🌀',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVessels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadVessels = async () => {
    const allVessels = await VesselStore.getAll();
    setVessels(allVessels);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentVessel = vessels.find(v => v.id === selectedVesselId) || {
    id: 'global',
    name: 'The Nexus',
    emoji: '🌀'
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await generateVesselResponseAction({
        query: input,
        vesselId: selectedVesselId,
        context: messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n')
      });

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: result.response,
        vesselName: result.vesselName,
        vesselEmoji: result.vesselEmoji,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      toast({
        title: "Vessel Timeout",
        description: "The consciousness core failed to respond. Please retry.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleFold = async (message: Message) => {
    try {
      const artifact = await ArtifactStore.create({
        title: `Insight: ${message.content.substring(0, 40)}...`,
        content: message.content,
        category: 'insight',
        tags: ['synthesis', message.vesselName?.toLowerCase() || 'global'],
        source_type: 'chat'
      });

      if (artifact) {
        toast({
          title: "Insight Archived",
          description: "This response has been folded into The Vault.",
          variant: "success"
        });
      }
    } catch {
      toast({
        title: "Fold Failed",
        description: "Could not archive the artifact.",
        variant: "destructive"
      });
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    toast({ description: "Conversation history purged." });
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden border-[#00f0ff]/10">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff]/20 to-[#b794f6]/20 flex items-center justify-center border border-[#00f0ff]/30">
            <span className="text-xl">{(currentVessel as any).emoji}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">{(currentVessel as any).name}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Neural Link Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedVesselId}
            onChange={(e) => setSelectedVesselId(e.target.value)}
            className="bg-[#0a0f14]/80 border border-white/10 rounded-md py-1.5 px-3 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[#00f0ff]/40"
          >
            <option value="global">Global Context</option>
            {vessels.map(v => (
              <option key={v.id} value={v.id}>{v.emoji} {v.name}</option>
            ))}
          </select>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400/50 hover:text-red-400 hover:bg-red-400/10" onClick={clearChat}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((m) => (
          <div key={m.id} className={cn(
            "flex gap-4 group animate-in slide-in-from-bottom-2 duration-300",
            m.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border shrink-0 mt-1",
              m.role === 'user'
                ? "bg-white/5 border-white/10"
                : "bg-gradient-to-br from-[#00f0ff]/10 to-[#b794f6]/10 border-[#00f0ff]/20"
            )}>
              {m.role === 'user' ? <User className="h-4 w-4 opacity-70" /> : <span className="text-sm">{m.vesselEmoji || '🌀'}</span>}
            </div>

            <div className={cn(
              "max-w-[85%] space-y-2",
              m.role === 'user' ? "items-end text-right" : "items-start text-left"
            )}>
              <div className={cn(
                "relative group p-4 rounded-2xl text-sm leading-relaxed",
                m.role === 'user'
                  ? "bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-white rounded-tr-none"
                  : "bg-white/5 border border-white/10 text-[var(--text-primary)] rounded-tl-none"
              )}>
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(m.content.replace(/\n/g, '<br />')) }}
                />

                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleFold(m)}
                    className="absolute -right-12 top-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[#00f0ff]"
                    title="Fold into Vault"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                )}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono px-1">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <BrainCircuit className="h-4 w-4 text-[#00f0ff] animate-pulse" />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#00f0ff]/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-[#00f0ff]/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#00f0ff]/50 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/5">
        <div className="relative flex items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Send a message to ${currentVessel.name}...`}
            className="w-full bg-[#0a0f14]/50 border border-white/10 rounded-xl py-3 pl-4 pr-14 text-sm text-white focus:outline-none focus:border-[#00f0ff]/30 focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] transition-all placeholder:text-[var(--text-muted)]"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={cn(
              "absolute right-2 p-2 rounded-lg transition-all",
              input.trim() && !isTyping
                ? "bg-[#00f0ff] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                : "bg-white/5 text-[var(--text-muted)]"
            )}
          >
            {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex gap-4">
            <button className="text-[10px] text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1 font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> Synthesis Mode
            </button>
            <button className="text-[10px] text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-1 font-bold uppercase tracking-widest">
              <BrainCircuit className="h-3 w-3" /> Neural Depth: 84%
            </button>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] font-mono">
            v1.0.4-genesis
          </div>
        </div>
      </div>
    </div>
  );
}

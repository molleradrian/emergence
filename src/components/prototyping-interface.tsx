'use client';

import React, { useState } from 'react';
import { generateCodeAction } from '@/app/actions';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import {
  Code,
  Terminal,
  Sparkles,
  Copy,
  Check,
  Loader2,
  Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenerateCodeOutput {
  generatedCode: string;
  explanation: string;
  dependencies: string[];
  nextSteps: string[];
}

export function PrototypingInterface() {
  const { analysisReport } = useAppState();
  const [componentType, setComponentType] = useState<'frontend' | 'backend' | 'fullstack'>('frontend');
  const [requirements, setRequirements] = useState<string>('');
  const [technology, setTechnology] = useState<string>('');
  const [existingCode] = useState<string>('');
  const [generatedOutput, setGeneratedOutput] = useState<GenerateCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setGeneratedOutput(null);

    try {
      const result = await generateCodeAction({
        analysisReport,
        componentType,
        requirements,
        technology,
        existingCode,
      });
      setGeneratedOutput(result);
      toast({
        title: "Matrix Compiled",
        description: "Prototype code has been successfully synthesized.",
        variant: "success"
      });
    } catch (err: any) {
      toast({
        title: "Synthesis Failed",
        description: err.message || "Failed to generate code.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedOutput?.generatedCode) return;
    navigator.clipboard.writeText(generatedOutput.generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ description: "Code copied to buffer." });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Side */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="h-5 w-5 text-[#00f0ff]" />
            <h2 className="text-xl font-semibold tracking-tight">Code Prototyping</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                Requirements
              </label>
              <textarea
                rows={4}
                className="w-full bg-[#0a0f14]/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-[#00f0ff]/30 transition-all placeholder:text-[var(--text-muted)]"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describe intended functionality..."
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                  Architecture
                </label>
                <select
                  className="w-full bg-[#0a0f14]/50 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]/30"
                  value={componentType}
                  onChange={(e) => setComponentType(e.target.value as any)}
                  disabled={isLoading}
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                  Stack
                </label>
                <input
                  type="text"
                  className="w-full bg-[#0a0f14]/50 border border-white/10 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff]/30 placeholder:text-[var(--text-muted)]"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  placeholder="e.g. Next.js, Python"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateCode}
              className="w-full h-12"
              variant="glass-primary"
              disabled={isLoading || !requirements.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Matrix...
                </>
              ) : (
                <>
                  <Code className="mr-2 h-5 w-5" />
                  Synthesize Prototype
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Output Side */}
        <div className="glass-panel p-6 bg-black/40 border-[#b794f6]/20 min-h-[400px]">
          {generatedOutput ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-[#b794f6]" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[#b794f6]">Source Code</span>
                </div>
                <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 text-xs">
                  {copied ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>

              <div className="relative group">
                <pre className="p-4 bg-black/40 rounded-xl border border-white/5 overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed custom-scrollbar max-h-[400px]">
                  <code>{generatedOutput.generatedCode}</code>
                </pre>
              </div>

              {generatedOutput.explanation && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" /> Logical Synthesis
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    {generatedOutput.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] py-20 grayscale opacity-40">
              <Cpu className="h-16 w-16 mb-4 animate-pulse" />
              <p className="text-sm font-medium tracking-wide">Awaiting requirements for instantiation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

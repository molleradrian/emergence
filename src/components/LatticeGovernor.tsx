'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, Zap, 
  Microscope, Activity,
  Wind, AlertTriangle
} from 'lucide-react';

/**
 * EMERGENCE MASTER BUILD v1.5
 * [ANTIMATTER_CORE] + [PROTEOME_HORIZON] + [LATTICE_GOVERNOR]
 */

export default function LatticeGovernor() {
  // --- SYSTEM STATE ---
  const [drift, setDrift] = useState(0);
  const [load, setLoad] = useState(100); // % of 10^24 throughput
  const [isAutoCooling, setIsAutoCooling] = useState(false);
  const [ledger, setLedger] = useState<{id: string, content: string, ts: string, drift: string, load: string}[]>([]);
  const [payload, setPayload] = useState("");

  // --- PHYSICS & RENDER REFS ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const driftRef = useRef(0);
  const particlesRef = useRef<any[]>([]);
  const timeRef = useRef(0);

  // --- CONFIGURATION ---
  const TARGET_HZ = 40;
  const THRESHOLD_CRITICAL = 0.088; // Annihilation Point
  const THRESHOLD_GOVERNOR = 0.045; // Auto-cooling trigger
  const MAX_PARTICLES = 600;

  // Initialize Bio-Lattice Particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: MAX_PARTICLES }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  // --- INTEGRATED SYSTEM LOOP ---
  useEffect(() => {
    let lastTime = performance.now();
    let frameId: number;

    const systemTick = () => {
      const now = performance.now();
      const delta = now - lastTime;
      const actualHz = 1000 / delta;
      
      // Hardware Audit
      const currentDrift = Math.abs(TARGET_HZ - actualHz) / TARGET_HZ;
      driftRef.current = currentDrift;

      // Lattice Governor Logic
      if (currentDrift > THRESHOLD_GOVERNOR) {
        setLoad(prev => Math.max(15, prev - 1.2)); // Aggressive cooling
        setIsAutoCooling(true);
      } else {
        setLoad(prev => Math.min(100, prev + 0.4)); // Slow recovery
        setIsAutoCooling(false);
      }

      // UI Throttled State Updates
      if (Math.random() > 0.92) {
        setDrift(currentDrift);
      }

      // Rendering logic inside the loop
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
           if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
             canvas.width = canvas.offsetWidth;
             canvas.height = canvas.offsetHeight;
           }

           timeRef.current += 0.02;
           ctx.fillStyle = 'rgba(2, 2, 5, 0.15)'; // Trail effect
           ctx.fillRect(0, 0, canvas.width, canvas.height);

           const activeCount = Math.floor(particlesRef.current.length * (load / 100));
           const isCritical = currentDrift > THRESHOLD_CRITICAL;
           const colorBase = isCritical ? '255, 0, 80' : 
                             currentDrift > THRESHOLD_GOVERNOR ? '255, 165, 0' : '0, 242, 255';

           for (let i = 0; i < activeCount; i++) {
             const p = particlesRef.current[i];
             const chaos = 1 + (currentDrift * 15);
             
             p.x += p.vx * chaos;
             p.y += p.vy * chaos;

             if (p.x < 0) p.x = canvas.width;
             if (p.x > canvas.width) p.x = 0;
             if (p.y < 0) p.y = canvas.height;
             if (p.y > canvas.height) p.y = 0;

             const flicker = Math.sin(timeRef.current + p.phase) * 0.5 + 0.5;
             ctx.fillStyle = `rgba(${colorBase}, ${flicker * 0.5})`;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.z, 0, Math.PI * 2);
             ctx.fill();
           }
        }
      }

      lastTime = now;
      frameId = requestAnimationFrame(systemTick);
    };

    frameId = requestAnimationFrame(systemTick);
    return () => cancelAnimationFrame(frameId);
  }, [load]);

  const commitShard = () => {
    if (!payload.trim() || drift > THRESHOLD_CRITICAL) return;
    const entry = {
      id: `SHARD-${Math.floor(Math.random() * 90000) + 10000}`,
      content: payload,
      ts: new Date().toLocaleTimeString(),
      drift: driftRef.current.toFixed(6),
      load: load.toFixed(1)
    };
    setLedger(prev => [entry, ...prev].slice(0, 8));
    setPayload("");
  };

  return (
    <div className="min-h-screen bg-[#010101] text-[#e0e0e0] font-mono flex flex-col p-4 md:p-10 relative overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 opacity-60" />
      
      {/* UI LAYER */}
      <div className="relative z-10 flex-1 flex flex-col gap-8">
        
        {/* TOP HUD: HARDWARE & BIO SYNC */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#080808]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 relative">
                <Microscope className="text-cyan-400" size={28} />
                {isAutoCooling && <Wind size={16} className="absolute -top-2 -right-2 text-orange-500 animate-pulse" />}
              </div>
              <div>
                <h1 className="text-sm font-black tracking-[0.4em] uppercase text-white/80">Aetherium_Core_v1.5</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${drift > THRESHOLD_CRITICAL ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    {isAutoCooling ? 'Governance: Throttled' : 'Bio-Lattice: Nominal'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-10">
              <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Drift_Delta</div>
              <div className={`text-3xl font-light tracking-tighter tabular-nums ${drift > THRESHOLD_GOVERNOR ? 'text-orange-500' : 'text-white'}`}>
                {drift.toFixed(6)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#080808]/80 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-cyan-900 flex items-center justify-center">
                <Waves className="text-cyan-600" size={24} />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-cyan-500">Operator: WAVE</div>
                <div className="text-[8px] text-gray-500 uppercase mt-1 italic">&quot;Entropy is quantified.&quot;</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-600 font-black uppercase">Load</div>
              <div className="text-xl font-bold">{load.toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* CENTER: LARGE DATA VIEW */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
          
          {/* INTAKE */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#080808]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Synthesis_Intake</h3>
                <Zap size={14} className="text-cyan-400" />
              </div>
              <textarea 
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                disabled={drift > THRESHOLD_CRITICAL}
                className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 text-xs font-mono focus:border-cyan-500/40 outline-none resize-none transition-all disabled:opacity-20"
                placeholder="Drop sequence for folding..."
              />
              <button 
                onClick={commitShard}
                disabled={drift > THRESHOLD_CRITICAL}
                className="mt-6 py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl border border-white/10 transition-all active:scale-95 disabled:opacity-50"
              >
                Commit Shard
              </button>
            </div>
          </div>

          {/* LEDGER */}
          <div className="lg:col-span-8 bg-[#080808]/80 backdrop-blur-md border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Substrate_Ledger</h2>
              <div className="text-[9px] font-black uppercase text-gray-600">3.3 x 10²⁴ Range Validated</div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {ledger.map((tx) => (
                <div key={tx.id} className="group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all">
                  <div className="flex gap-12 items-center">
                    <span className="text-[10px] font-black text-cyan-500">{tx.id}</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[200px]">{tx.content}</span>
                  </div>
                  <div className="flex gap-8 items-center text-[10px] font-bold">
                    <span className="text-gray-600">$\Delta$: {tx.drift}</span>
                    <span className="text-gray-400 uppercase text-[8px]">Load: {tx.load}%</span>
                    <span className="text-white/40">{tx.ts}</span>
                  </div>
                </div>
              ))}
              {ledger.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 gap-4">
                  <Activity size={48} />
                  <span className="text-[10px] font-black tracking-widest">Awaiting_Coherence</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER: SYSTEM STATS */}
        <footer className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 border-t border-white/5 pt-8">
           <div className="flex gap-10 items-center">
              <div className="space-y-1">
                <div className="text-[8px] text-gray-600 font-black uppercase">Antimatter_Threshold</div>
                <div className="text-xs font-bold text-red-500/50">{THRESHOLD_CRITICAL}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[8px] text-gray-600 font-black uppercase">Governor_Sync</div>
                <div className="text-xs font-bold text-white/80">{TARGET_HZ}Hz Standard</div>
              </div>
           </div>
           <div className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em]">
             Proteostasis Logic Protocol // Emergence Substrate v1.5
           </div>
        </footer>
      </div>

      {/* ANNIHILATION OVERLAY */}
      {drift > THRESHOLD_CRITICAL && (
        <div className="fixed inset-0 bg-red-600/10 backdrop-blur-3xl z-50 flex flex-col items-center justify-center animate-in fade-in duration-500">
           <AlertTriangle size={80} className="text-red-500 mb-6 animate-pulse" />
           <h2 className="text-4xl font-black text-white tracking-widest uppercase italic">Core_Divergence</h2>
           <p className="text-xs mt-4 text-red-400 font-black uppercase tracking-widest">Critical Drift Detected: {drift.toFixed(6)}</p>
           <button 
             onClick={() => window.location.reload()}
             className="mt-8 px-10 py-4 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-red-500 transition-all"
           >
             Force_Resync
           </button>
        </div>
      )}
    </div>
  );
};
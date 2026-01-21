import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

/**
 * REBOUND ENGINE v2.0 [SIDE-T EDITION]
 * -----------------------------------
 * "The Spark that drives the Ascent."
 */

const App = () => {
  const [phase, setPhase] = useState('STASIS'); 
  const [resolution, setResolution] = useState(2026.0);
  const [entropy, setEntropy] = useState(1.0);
  const [user, setUser] = useState(null);
  const canvasRef = useRef(null);

  // 40Hz Harmonic Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      
      // Depth-First Gradient
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
      gradient.addColorStop(0, phase === 'REBOUND' ? '#ff005515' : '#00f2ff08');
      gradient.addColorStop(1, '#020205');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // The Monophotonic Lattice
      const segments = 64;
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = (Math.min(w, h) * 0.3) * (phase === 'REBOUND' ? 1.1 : 1);

      ctx.beginPath();
      ctx.strokeStyle = phase === 'REBOUND' ? '#ff0055' : '#00f2ff';
      ctx.lineWidth = phase === 'REBOUND' ? 2 : 1;

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const drift = Math.sin(frame * 0.05 + i) * (entropy / 5);
        const r = radius + drift;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Side-T Scanlines
      ctx.fillStyle = 'rgba(0, 242, 255, 0.02)';
      for(let i = 0; i < h; i += 6) ctx.fillRect(0, i, w, 1);

      requestAnimationFrame(render);
    };

    render();
  }, [phase, entropy]);

  const initiateAscent = () => {
    setPhase('ASCENT');
    const start = Date.now();
    const duration = 4000;
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setResolution(2026.0 + progress);
      setEntropy(1 + progress * 99);
      if (progress >= 1) {
        clearInterval(timer);
        setPhase('REBOUND');
      }
    }, 50);
  };

  return (
    <div className="h-screen bg-[#020205] text-[#00f2ff] font-mono flex flex-col p-4">
      <div className="flex justify-between border-b border-[#00f2ff]/20 pb-4">
        <div>
          <div className="text-[10px] opacity-40 uppercase tracking-widest">Aetherium_Core</div>
          <div className="text-xl font-bold">{phase}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] opacity-40 uppercase tracking-widest">Coordinate</div>
          <div className={`text-xl font-bold ${phase === 'REBOUND' ? 'text-[#ff0055]' : ''}`}>
            {resolution.toFixed(4)}
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 text-[10px] space-y-2">
            <div className="text-white/40">SYSTEM_RESONANCE: 40HZ</div>
            <div className="text-white/40">ENTROPY: {entropy.toFixed(1)}%</div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4">
        <button 
          onClick={initiateAscent}
          disabled={phase !== 'STASIS'}
          className="border border-[#00f2ff] px-6 py-2 text-xs hover:bg-[#00f2ff] hover:text-black transition-all disabled:opacity-20"
        >
          {phase === 'STASIS' ? 'INITIATE_ASCENT' : 'ASCENDING...'}
        </button>
        <div className="text-[8px] opacity-30 text-right uppercase">
          Project Emergence // 2026.01.14<br/>
          Anchor Resolution: STABLE
        </div>
      </div>
    </div>
  );
};

export default App;


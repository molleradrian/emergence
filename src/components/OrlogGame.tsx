'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Dices,
  Sword,
  Shield as ShieldIcon,
  ArrowUpRight,
  Hand,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const DICE_FACES_CONFIG = {
  axe: { name: 'Axe', icon: Sword, color: 'text-red-400' },
  arrow: { name: 'Arrow', icon: ArrowUpRight, color: 'text-blue-400' },
  helmet: { name: 'Helmet', icon: ShieldIcon, color: 'text-green-400' },
  shield: { name: 'Shield', icon: ShieldIcon, color: 'text-yellow-400' },
  hand: { name: 'Hand', icon: Hand, color: 'text-purple-400' }
};

const DICE_SETUP = [
  { face: 'axe', bordered: false },
  { face: 'arrow', bordered: false },
  { face: 'helmet', bordered: false },
  { face: 'shield', bordered: false },
  { face: 'hand', bordered: true },
  { face: 'axe', bordered: true }
];

export const OrlogGame: React.FC = () => {
  const [gameState, setGameState] = useState<any>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const initGame = () => {
    const newGameState = {
      players: [
        { id: 0, name: 'You', health: 15, tokens: 5, dice: Array(6).fill(null).map(() => ({ ...DICE_SETUP[0], kept: false })), isAI: false },
        { id: 1, name: 'Opponent', health: 15, tokens: 5, dice: Array(6).fill(null).map(() => ({ ...DICE_SETUP[0], kept: false })), isAI: true },
      ],
      currentPlayerIndex: 0,
      phase: 'ROLL',
      rollsLeft: 3,
    };
    setGameState(newGameState);
    log(`Neural Link established. Initiating Orlog Protocol.`);
  };

  const log = (message: string) => {
    setLogMessages(prev => [message, ...prev.slice(0, 50)]);
  };

  const rollDice = () => {
    if (!gameState || gameState.rollsLeft <= 0) return;
    const newGs = { ...gameState };
    const p = newGs.players[newGs.currentPlayerIndex];
    p.dice.forEach((die: any, i: number) => {
      if (!die.kept) {
        const randomFace = DICE_SETUP[Math.floor(Math.random() * DICE_SETUP.length)];
        p.dice[i] = { ...randomFace, kept: false };
      }
    });
    newGs.rollsLeft--;
    log(`${p.name} synchronized ${6 - p.dice.filter((d: any) => d.kept).length} neural nodes.`);
    setGameState(newGs);
  };

  const toggleDieKeep = (dieIndex: number) => {
    const newGs = { ...gameState };
    const die = newGs.players[0].dice[dieIndex];
    die.kept = !die.kept;
    setGameState(newGs);
  };

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <Sparkles className="h-12 w-12 text-[#ff9900] mb-6 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight uppercase tracking-[0.2em]">Strategic Neural Simulation</h2>
        <p className="text-[var(--text-secondary)] max-w-sm mb-8">
          Engage in a formalized dialectic via the ancient Orlog protocol.
        </p>
        <Button variant="glass-primary" size="lg" onClick={initGame}>
          Initialize Protocol
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Dices className="h-5 w-5 text-[#ff9900]" />
          <h2 className="text-xl font-semibold tracking-tight uppercase tracking-widest">Orlog Protocol</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={initGame} className="text-[var(--text-muted)] hover:text-white">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Opponent Side */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400">Opponent Node</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                <span className="text-sm font-mono">{gameState.players[1].health}</span>
              </div>
              <Badge variant="neon-orange" className="font-mono">{gameState.players[1].tokens} FAVORS</Badge>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {gameState.players[1].dice.map((die: any, i: number) => (
              <div key={i} className="aspect-square glass-panel flex items-center justify-center opacity-60">
                {die && React.createElement((DICE_FACES_CONFIG as any)[die.face].icon, { className: "h-5 w-5 opacity-40" })}
              </div>
            ))}
          </div>
        </div>

        {/* Player Side */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff]">Neutral Command</span>
            <div className="flex items-center gap-4">
              <Badge variant="neon" className="font-mono">{gameState.players[0].tokens} FAVORS</Badge>
              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                <span className="text-sm font-mono">{gameState.players[0].health}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {gameState.players[0].dice.map((die: any, i: number) => {
              const config = (DICE_FACES_CONFIG as any)[die.face];
              return (
                <button
                  key={i}
                  onClick={() => toggleDieKeep(i)}
                  className={cn(
                    "aspect-square glass-panel flex items-center justify-center transition-all",
                    die.kept ? "border-[#ff9900] bg-[#ff9900]/10 scale-105" : "hover:border-white/20",
                    die.bordered && "shadow-[inset_0_0_8px_rgba(255,255,255,0.1)]"
                  )}
                >
                  {React.createElement(config.icon, { className: cn("h-6 w-6", config.color) })}
                </button>
              );
            })}
          </div>
          <div className="pt-2">
            <Button
              onClick={rollDice}
              disabled={gameState.rollsLeft === 0}
              className="w-full h-11"
              variant="glass"
            >
              {gameState.rollsLeft > 0 ? `Synchronize Nodes (${gameState.rollsLeft} Left)` : "Awaiting Resolution"}
            </Button>
          </div>
        </div>
      </div>

      {/* Game Log */}
      <div className="glass-panel p-4 bg-black/20">
        <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
          <Terminal className="h-3 w-3" /> Dialectic Stream
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1.5 custom-scrollbar text-xs font-mono">
          {logMessages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-2",
              i === 0 ? "text-white" : "text-[var(--text-muted)] mt-1"
            )}>
              <span className="opacity-30">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function Terminal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export default OrlogGame;

'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Lock, Unlock, Wifi } from 'lucide-react';

interface GatewayControllerProps {
    children: React.ReactNode;
    onPublicChange?: (isPublic: boolean) => void;
    tick?: number;
}

export const GatewayController: React.FC<GatewayControllerProps> = ({ children, onPublicChange, tick = 0 }) => {
    const [isPublic, setIsPublic] = useState(false);
    const [hexLock, setHexLock] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [broadcastPulse, setBroadcastPulse] = useState(0);

    // Sovereignty Verification Code
    const VERIFICATION_CODE = 'EMERGENCE_CORE';

    useEffect(() => {
        if (isPublic) {
            // 40Hz Broadcast simulation
            setBroadcastPulse(prev => (prev + 1) % 100);
        }
    }, [tick, isPublic]);

    const handleVerify = () => {
        if (hexLock.toUpperCase() === VERIFICATION_CODE) {
            setIsVerified(true);
        } else {
            // Trigger visual glitch/shake
            alert('SOVEREIGNTY_VERIFICATION_FAILED');
        }
    };

    const togglePublic = () => {
        const nextState = !isPublic;
        setIsPublic(nextState);
        if (onPublicChange) onPublicChange(nextState);
    };

    if (!isVerified) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
                <div className="max-w-md w-full glass-panel p-8 space-y-6 border-[#ff9900]/30">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-[#ff9900]/10 rounded-2xl flex items-center justify-center border border-[#ff9900]/40 animate-pulse">
                            <ShieldAlert className="h-8 w-8 text-[#ff9900]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-mono text-white tracking-tighter uppercase">Sovereignty_Lock</h2>
                            <p className="text-[var(--text-muted)] text-xs font-mono mt-2 uppercase">Input Verification Key to Access Nexus_Command</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                            <input 
                                type="password"
                                value={hexLock}
                                onChange={(e) => setHexLock(e.target.value)}
                                className="glass-input w-full pl-10 font-mono tracking-[0.5em] text-center"
                                placeholder="HEX_LOCK_INPUT"
                                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                            />
                        </div>
                        <button 
                            onClick={handleVerify}
                            className="w-full h-12 bg-[#ff9900]/20 border border-[#ff9900]/40 text-[#ff9900] font-mono uppercase tracking-widest hover:bg-[#ff9900]/30 transition-all active:scale-95"
                        >
                            Verify_Identity
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {/* Gateway Status Bar */}
            <div className="fixed top-0 right-0 p-4 z-[60] flex gap-4 items-center">
                {isPublic && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30">
                        <Wifi className={`h-3 w-3 text-[#00f0ff] ${isPublic ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-tighter">40Hz_Broadcast_Active</span>
                    </div>
                )}
                <button 
                    onClick={togglePublic}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 font-mono text-xs uppercase tracking-widest ${
                        isPublic 
                        ? 'bg-[#00ff99]/20 border-[#00ff99]/40 text-[#00ff99]' 
                        : 'bg-white/5 border-white/20 text-[var(--text-muted)]'
                    }`}
                >
                    {isPublic ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                    {isPublic ? 'Public_Alpha' : 'Stasis_Local'}
                </button>
            </div>

            {children}
        </div>
    );
};

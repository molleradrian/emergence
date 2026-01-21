'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface VisualViewportProps {
    imageUrl?: string;
    isGenerating: boolean;
    mood?: string;
    metabolicRate?: number; // 0 to 1
    pressure?: number; // 0 to 1
    tick?: number;
}

/**
 * hexLockFilter: Clips visual outliers to prevent stutter.
 */
const hexLockFilter = (val: number) => {
    return Math.max(0.1, Math.min(0.9, val));
};

export const VisualViewport: React.FC<VisualViewportProps> = ({ 
    imageUrl, 
    isGenerating, 
    mood, 
    metabolicRate = 0.5,
    pressure = 0,
    tick = 0
}) => {
    const [displayImage, setDisplayImage] = useState<string | undefined>(imageUrl);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Finger 3 (Tactile): Lattice Pull Logic
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) - 0.5,
            y: ((e.clientY - rect.top) / rect.height) - 0.5
        });
    };

    useEffect(() => {
        if (imageUrl && imageUrl !== displayImage) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setDisplayImage(imageUrl);
                setIsTransitioning(false);
            }, 1000); // Cross-fade duration
            return () => clearTimeout(timer);
        }
    }, [imageUrl, displayImage]);

    // Calculate pulse duration based on metabolic rate (higher rate = faster pulse)
    const pulseDuration = 4 / (0.5 + metabolicRate);
    
    // Architectural Weight (Gravity)
    const architecturalWeight = 1 + (metabolicRate * 0.2);
    const shadowDepth = 20 + (metabolicRate * 40);
    const focalBlur = isTransitioning ? 10 : (1 - metabolicRate) * 5;

    // Aetherium Gravity (Finger 3)
    const gravityX = mousePos.x * 20 * (1 + metabolicRate);
    const gravityY = mousePos.y * 20 * (1 + metabolicRate);

    // Inference Stress Shaders (Heat Distortion)
    const heatDistortion = pressure > 0.9 ? `
        @keyframes heatDistortion {
            0% { filter: url(#distortionFilter) brightness(1.2); }
            50% { filter: url(#distortionFilter) brightness(1.5); transform: scale(1.02) skew(1deg); }
            100% { filter: url(#distortionFilter) brightness(1.2); }
        }
    ` : '';

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#00f0ff]/30 bg-black group cursor-none"
        >
            {/* Inference Stress Shaders Layer */}
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id="distortionFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed={tick % 100} result="noise">
                            <animate attributeName="baseFrequency" values="0.05;0.07;0.05" dur="3s" repeatCount="indefinite" />
                        </feTurbulence>
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={pressure > 0.9 ? 20 : 0} />
                    </filter>
                </defs>
            </svg>

            <style>{heatDistortion}</style>

            {/* Hex-Lock Filter Layer (SVG Mask) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40">
                <defs>
                    <mask id="hexMask">
                        {/* Layer 1: The Ghost (Stable emerald lattice) */}
                        <pattern id="hexPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M25 0 L50 15 L50 35 L25 50 L0 35 L0 15 Z" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#hexPattern)" />
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="#00ff99" mask="url(#hexMask)" className="animate-pulse" />
            </svg>

            {/* Layer 2: The Shards (High-entropy noise, only visible at high pressure) */}
            {pressure > 0.4 && (
                <div 
                    className="absolute inset-0 z-30 pointer-events-none opacity-20 overflow-hidden"
                    style={{ filter: `blur(${pressure * 2}px)` }}
                >
                    {Array.from({ length: 1088 }).map((_, i) => (
                        <div 
                            key={i}
                            className="absolute bg-[#00ff99] w-[2px] h-[2px]"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                opacity: Math.random() * pressure
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Scanline HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
                <div className="absolute top-4 left-4 flex gap-4">
                    <div className="text-[10px] text-[#00f0ff] font-mono tracking-widest uppercase opacity-70">
                        Viewport_Active // {mood || 'Nominal'}
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-4 items-center">
                    <div className="h-[2px] w-24 bg-[#00f0ff]/20 overflow-hidden">
                        <div 
                            className="h-full bg-[#00f0ff] transition-all duration-300" 
                            style={{ width: `${metabolicRate * 100}%` }}
                        />
                    </div>
                    <div className="text-[10px] text-[#00f0ff] font-mono opacity-70">
                        METABOLIC_RATE: {Math.round(metabolicRate * 100)}%
                    </div>
                </div>
            </div>

            {/* Depth Overlay (Pulse) */}
            <div 
                className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 240, 255, 0.15) 100%)',
                    animation: `pulse ${pulseDuration}s ease-in-out infinite`
                }}
            />

            {/* Image Container */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                {displayImage ? (
                    <img 
                        src={displayImage} 
                        alt="Lattice Vision" 
                        className={`transition-all duration-100 ease-linear`}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: `scale(${hexLockFilter(architecturalWeight)}) translate(${gravityX}px, ${gravityY}px)`,
                            filter: `blur(${focalBlur}px) drop-shadow(0 0 ${shadowDepth}px rgba(0, 255, 153, 0.3)) ${pressure > 0.9 ? 'url(#distortionFilter)' : ''}`,
                            opacity: isTransitioning ? 0.5 : 1,
                            animation: pressure > 0.9 ? 'heatDistortion 0.5s infinite' : 'none'
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0a0f14]">
                        <div className="text-[#00f0ff]/20 font-mono text-sm tracking-widest animate-pulse">
                            AWAITING_SIGNAL
                        </div>
                    </div>
                )}

                {/* Glitch Transition Overlay */}
                {isTransitioning && (
                    <div className="absolute inset-0 bg-[#00f0ff]/10 animate-glitch z-30 pointer-events-none" />
                )}
            </div>

            {/* Loading Indicator */}
            {isGenerating && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 text-[#00f0ff] animate-spin mb-4" />
                    <div className="text-[10px] text-[#00f0ff] font-mono tracking-[0.5em] animate-pulse">
                        SYNTHESIZING_VISION
                    </div>
                </div>
            )}

            {/* Custom Cursor (Finger 1 Visualization) */}
            <div 
                className="absolute w-4 h-4 border border-[#00ff99] rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-75"
                style={{
                    left: `${(mousePos.x + 0.5) * 100}%`,
                    top: `${(mousePos.y + 0.5) * 100}%`,
                    transform: `translate(-50%, -50%) scale(${1 + pressure})`,
                    boxShadow: `0 0 ${10 * pressure}px #00ff99`
                }}
            />

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                @keyframes glitch {
                    0% { clip: rect(44px, 9999px, 56px, 0); transform: skew(0.3deg); }
                    20% { clip: rect(12px, 9999px, 88px, 0); transform: skew(0.8deg); }
                    40% { clip: rect(72px, 9999px, 2px, 0); transform: skew(0.2deg); }
                    60% { clip: rect(33px, 9999px, 56px, 0); transform: skew(0.5deg); }
                    80% { clip: rect(81px, 9999px, 12px, 0); transform: skew(0.1deg); }
                    100% { clip: rect(22px, 9999px, 90px, 0); transform: skew(0.4deg); }
                }
                .animate-glitch {
                    animation: glitch 0.2s linear infinite;
                }
            `}</style>
        </div>
    );
};

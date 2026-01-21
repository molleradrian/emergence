'use client';

import { useEffect, useRef } from 'react';

/**
 * 40Hz Harmonic Heartbeat Spine
 * Runs at 25ms intervals to provide a stable temporal anchor for UI transitions.
 */
export function useHarmonicHeartbeat(callback: (tick: number) => void) {
    const requestRef = useRef<number>();
    const lastTickRef = useRef<number>(0);
    const tickCountRef = useRef<number>(0);

    const animate = (time: number) => {
        // Target 40Hz (25ms per tick)
        if (time - lastTickRef.current >= 25) {
            lastTickRef.current = time;
            tickCountRef.current += 1;
            callback(tickCountRef.current);
        }
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);
}

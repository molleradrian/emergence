'use client';

import { useState } from 'react';
import { ingestDocumentsAction, seedInitialBatchAction, bootstrapLatticeAction } from '../emergence-actions';

export default function DebugPage() {
    const [status, setStatus] = useState<string>('Ready');
    const [isLoading, setIsLoading] = useState(false);

    async function handleAction(action: () => Promise<any>, name: string) {
        setIsLoading(true);
        setStatus(`Running ${name}...`);
        try {
            const result = await action();
            setStatus(`${name} Success: ${JSON.stringify(result)}`);
        } catch (err: any) {
            setStatus(`${name} Failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-10 bg-[#0a0f14] min-h-screen text-[#00f0ff] font-mono">
            <h1 className="text-2xl mb-6 border-b border-[#00f0ff]/20 pb-2">SYSTEM_NEXUS // DEBUG_UTILITIES</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 bg-white/5 border border-[#00f0ff]/20 rounded-xl">
                    <h2 className="text-xl mb-4">Data Persistence</h2>
                    <div className="flex flex-col gap-4">
                        <button
                            id="btn-seed"
                            onClick={() => handleAction(seedInitialBatchAction, 'Seed Vessels')}
                            disabled={isLoading}
                            className="p-3 bg-blue-600/20 border border-blue-500/50 rounded hover:bg-blue-600/40 transition-all disabled:opacity-50"
                        >
                            SEED_GENESIS_BATCH
                        </button>
                        <button
                            id="btn-ingest"
                            onClick={() => handleAction(ingestDocumentsAction, 'Knowledge Ingestion')}
                            disabled={isLoading}
                            className="p-3 bg-purple-600/20 border border-purple-500/50 rounded hover:bg-purple-600/40 transition-all disabled:opacity-50"
                        >
                            INGEST_KNOWLEDGE_DOCS
                        </button>
                        <button
                            id="btn-bootstrap"
                            onClick={() => handleAction(bootstrapLatticeAction, 'Lattice Bootstrap')}
                            disabled={isLoading}
                            className="p-3 bg-green-600/20 border border-green-500/50 rounded hover:bg-green-600/40 transition-all disabled:opacity-50"
                        >
                            BOOTSTRAP_LATTICE
                        </button>
                    </div>
                </div>

                <div className="glass-panel p-6 bg-white/5 border border-[#00f0ff]/20 rounded-xl">
                    <h2 className="text-xl mb-4">Status Output</h2>
                    <div className="p-4 bg-black/40 rounded h-48 overflow-y-auto whitespace-pre-wrap text-xs">
                        <span id="status-display">{status}</span>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-[10px] text-[var(--text-muted)]">
                [SECURE_ACCESS_NODE: GENESIS-B]
            </div>
        </div>
    );
}

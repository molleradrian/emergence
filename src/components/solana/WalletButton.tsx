'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { solanaStore } from '@/lib/solana-store';

export function WalletButton() {
    const wallet = useWallet();
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        if (wallet.publicKey) {
            solanaStore.initialize(wallet)
                .then(() => {
                    if (wallet.publicKey) {
                        solanaStore.getBalance(wallet.publicKey).then(setBalance);
                    }
                })
                .catch(err => console.error("Failed to init solana store", err));
        } else {
            setBalance(null);
        }
    }, [wallet.publicKey]);

    return (
        <div className="flex items-center gap-4">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !h-10 !px-4 !text-sm !font-medium" />
            {balance !== null && (
                <div className="text-sm text-gray-400 font-mono">
                    {balance.toFixed(4)} SOL
                </div>
            )}
        </div>
    );
}

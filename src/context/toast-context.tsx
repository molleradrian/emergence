'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastVariant = 'default' | 'success' | 'destructive' | 'warning' | 'info';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
}

interface ToastContextType {
    toasts: Toast[];
    toast: (props: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, variant }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            dismiss(id);
        }, 5000);
    }, [dismiss]);

    const getIcon = (variant?: ToastVariant) => {
        switch (variant) {
            case 'success': return <CheckCircle2 className="h-5 w-5 text-green-400" />;
            case 'destructive': return <AlertCircle className="h-5 w-5 text-red-400" />;
            case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
            case 'info': return <Info className="h-5 w-5 text-blue-400" />;
            default: return null;
        }
    };

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "pointer-events-auto flex w-full max-w-sm items-start gap-4 rounded-lg border p-4 shadow-lg backdrop-blur-xl transition-all animate-in slide-in-from-right-4",
                            t.variant === 'destructive' ? "bg-red-500/10 border-red-500/20 text-red-200" :
                                t.variant === 'success' ? "bg-green-500/10 border-green-500/20 text-green-200" :
                                    t.variant === 'warning' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-200" :
                                        t.variant === 'info' ? "bg-blue-500/10 border-blue-500/20 text-blue-200" :
                                            "bg-white/10 border-white/20 text-white"
                        )}
                    >
                        <div className="mt-0.5">{getIcon(t.variant)}</div>
                        <div className="flex-1">
                            {t.title && <h4 className="font-semibold text-sm">{t.title}</h4>}
                            {t.description && <p className="text-xs opacity-70 mt-1">{t.description}</p>}
                        </div>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

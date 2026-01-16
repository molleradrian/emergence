'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArtifactStore } from '@/lib/nexus-store';
import { useToast } from '@/hooks/use-toast';
import {
    Upload,
    File,
    X,
    Loader2,
    FileText,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function FileUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'text/markdown': ['.md'],
            'application/pdf': ['.pdf'],
            'application/json': ['.json']
        }
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        let successCount = 0;

        try {
            for (const file of files) {
                // Simulate file reading and artifact creation
                // In a real app, you'd upload to storage and parse content
                const content = `Content of ${file.name} (Simulated index)`;

                const artifact = await ArtifactStore.create({
                    title: file.name,
                    content: content,
                    category: 'data',
                    tags: ['upload', file.type.split('/')[1]],
                    source_type: 'import'
                });

                if (artifact) successCount++;
            }

            toast({
                title: "Ingestion Complete",
                description: `Successfully indexed ${successCount} files into The Vault.`,
                variant: "success"
            });
            setFiles([]);
        } catch {
            toast({
                title: "Ingestion Failed",
                description: "An error occurred during file processing.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="glass-panel p-6 border-dashed border-2 border-white/10 hover:border-[#00f0ff]/30 transition-all">
            <div
                {...getRootProps()}
                className={cn(
                    "flex flex-col items-center justify-center p-8 cursor-pointer transition-all",
                    isDragActive && "bg-[#00f0ff]/5 scale-[0.98]"
                )}
            >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Upload className={cn("h-8 w-8", isDragActive ? "text-[#00f0ff]" : "text-[var(--text-muted)]")} />
                </div>
                <h3 className="text-lg font-medium text-white">Knowledge Ingestion</h3>
                <p className="text-sm text-[var(--text-muted)] text-center mt-2 max-w-[240px]">
                    Drag and drop archives here, or click to browse your local cognition.
                </p>
                <span className="text-[10px] text-[var(--text-muted)] mt-4 uppercase tracking-widest font-bold">
                    Supported: TXT, MD, PDF, JSON
                </span>
            </div>

            {files.length > 0 && (
                <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">Pending Synthesis</h4>
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 group">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-[#b794f6]" />
                                    <div>
                                        <div className="text-sm text-white truncate max-w-[180px]">{file.name}</div>
                                        <div className="text-[10px] text-[var(--text-muted)]">{(file.size / 1024).toFixed(1)} KB</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        variant="glass-primary"
                        className="w-full mt-4"
                    >
                        {isUploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ingesting...</>
                        ) : (
                            <><Sparkles className="mr-2 h-4 w-4" /> Begin Ingestion</>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

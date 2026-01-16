'use client';

import React, { useEffect, useState } from 'react';
import { ProjectStore, Project } from '@/lib/nexus-store';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import {
    ChevronDown,
    Plus,
    Briefcase,
    Check,
    Search,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ProjectSwitcher() {
    const { selectedProjectId, setSelectedProjectId, setProjectName } = useAppState();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const allProjects = await ProjectStore.getAll();
            setProjects(allProjects);

            // Select first project by default if none selected
            if (!selectedProjectId && allProjects.length > 0) {
                setSelectedProjectId(allProjects[0].id);
                setProjectName(allProjects[0].name);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentProject = projects.find(p => p.id === selectedProjectId);

    const handleSelect = (project: Project) => {
        setSelectedProjectId(project.id);
        setProjectName(project.name);
        setIsOpen(false);
        toast({
            title: "Project Switched",
            description: `Active project: ${project.name}`,
            variant: "info"
        });
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        setIsCreating(true);
        try {
            const newProject = await ProjectStore.create(newProjectName);
            if (newProject) {
                setProjects([newProject, ...projects]);
                setSelectedProjectId(newProject.id);
                setProjectName(newProject.name);
                setNewProjectName('');
                setIsOpen(false);
                toast({
                    title: "Project Created",
                    description: `"${newProject.name}" has been initialized.`,
                    variant: "success"
                });
            }
        } catch {
            toast({
                title: "Creation Failed",
                description: "Could not initialize project.",
                variant: "destructive"
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 glass-panel px-4 py-2 hover:border-[#00f0ff]/50 transition-all text-sm group"
            >
                <Briefcase className="h-4 w-4 text-[#00f0ff]" />
                <span className="font-medium">
                    {isLoading ? "Loading Projects..." : currentProject?.name || "Select Project"}
                </span>
                <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 glass-panel !bg-[#0a0f14]/90 shadow-2xl z-[100] p-1 border-[#00f0ff]/20 animate-in fade-in zoom-in-95">
                    <div className="p-2">
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 opacity-30" />
                            <input
                                placeholder="Search projects..."
                                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#00f0ff]/40"
                            />
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => handleSelect(project)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                                        selectedProjectId === project.id
                                            ? "bg-[#00f0ff]/10 text-white"
                                            : "text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <span className="truncate">{project.name}</span>
                                    {selectedProjectId === project.id && <Check className="h-3.5 w-3.5 text-[#00f0ff]" />}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-white/10 mt-2 pt-2 pb-1 px-1">
                            <div className="flex gap-2">
                                <input
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="New project name..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:border-[#00f0ff]/40"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                                />
                                <Button
                                    size="sm"
                                    variant="glass-primary"
                                    className="h-8 w-8 p-0"
                                    onClick={handleCreateProject}
                                    disabled={isCreating}
                                >
                                    {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

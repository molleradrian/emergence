'use client';

import { Project } from '@/lib/nexus-store';

interface ProjectGraphProps {
    projects: Project[];
}

export function ProjectGraph({ projects }: ProjectGraphProps) {
    return (
        <div className="glass-panel mt-6">
            <h3 className="font-medium mb-4">Project Graph</h3>
            <div className="flex gap-8">
                {projects.map(project => (
                    <div key={project.id} className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center text-center p-2">
                            {project.name}
                        </div>
                        <div className="flex gap-4 mt-4">
                            {project.directives.map(directive => (
                                <div key={directive.id} className="flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-gray-500/50" />
                                    <div className="w-px h-8 bg-gray-500/50" />
                                    <div className="w-20 h-20 rounded-lg bg-gray-500/20 flex items-center justify-center text-center p-2">
                                        {directive.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

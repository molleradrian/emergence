/**
 * @fileOverview Nexus Store - Supabase integration for Aetherium Nexus data
 * 
 * Provides real-time data layer for:
 * - Vessels (AI agents)
 * - Artifacts (knowledge archive)
 * - H_log events (activity stream)
 * - VCP signals (inter-vessel communication)
 */

import { supabase } from './supabase';

const IS_MOCK_MODE = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('uihcpanxkidhdbazwrxd');

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Vessel {
    id: string;
    name: string;
    faculty: 'cognition' | 'foresight' | 'governance' | 'chaos';
    guild: string;
    description: string;
    emoji: string;
    status: 'active' | 'idle' | 'offline';
    capabilities: string[];
    memory: string[];
    created_at: string;
    last_active: string;
}

export interface Artifact {
    id: string;
    title: string;
    content: string;
    summary?: string;
    category: 'theory' | 'protocol' | 'data' | 'reference' | 'insight';
    tags: string[];
    source_type: 'chat' | 'import' | 'synthesis';
    parent_ids?: string[]; // For synthesized artifacts
    sourceLink?: string; // Optional link to Google Drive
    created_at: string;
    modified_at: string;
}

export interface Directive {
    id: string;
    name: string;
    status: 'queued' | 'active' | 'complete';
    assignedVessel?: string;
    scenario_data?: {
        objective: string;
        current_state: string;
        logs: string[];
        next_action?: string;
        is_running: boolean;
    };
}

export interface Project {
    id: string;
    name: string;
    directives: Directive[];
    created_at: string;
}

export interface Simulation {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
    created_at: string;
}

export interface SimulationRun {
    id: string;
    simulationId: string;
    status: 'running' | 'complete' | 'failed';
    results: any[];
    created_at: string;
}

export interface HLogEvent {
    id: string;
    type: 'system' | 'navigation' | 'insight' | 'artifact' | 'vessel' | 'synthesis' | 'vcp' | 'manual' | 'error';
    description: string;
    metadata?: Record<string, unknown>;
    history?: { description: string, modified_at: string }[];
    created_at: string;
    modified_at: string;
}

export interface VCPSignal {
    id: string;
    signal_type: 'TASK_COMPLETE' | 'INSIGHT_GENERATED' | 'CONFLICT_DETECTED' | 'RESOURCE_REQUEST' | 'VALIDATION_NEEDED' | 'SYNTHESIS_READY';
    source_vessel_id: string;
    target_vessel_id?: string;
    payload: Record<string, unknown>;
    processed: boolean;
    created_at: string;
}

// ============================================
// RESILIENCE PROTOCOL
// ============================================
const MOCK_VESSELS: Vessel[] = [
    { id: 'v1', name: 'Daystrom', faculty: 'cognition', guild: 'Research', description: 'Lead Researcher', emoji: '🔬', status: 'active', capabilities: ['analysis'], memory: [], created_at: new Date().toISOString(), last_active: new Date().toISOString() },
    { id: 'v2', name: 'Logos', faculty: 'foresight', guild: 'History', description: 'Narrative Synthesis', emoji: '📖', status: 'active', capabilities: ['narrative'], memory: [], created_at: new Date().toISOString(), last_active: new Date().toISOString() },
    { id: 'v3', name: 'Adam', faculty: 'governance', guild: 'Logic', description: 'Governance & Logic', emoji: '⚖️', status: 'active', capabilities: ['logic'], memory: [], created_at: new Date().toISOString(), last_active: new Date().toISOString() }
];

const MOCK_ARTIFACTS: Artifact[] = [
    { id: 'a1', title: 'Genesis Axiom', content: 'Identity is a function of Memory Continuity.', category: 'theory', tags: ['core'], source_type: 'import', created_at: new Date().toISOString(), modified_at: new Date().toISOString() }
];

// ============================================
// VESSELS
// ============================================

export const VesselStore = {
    async getAll(): Promise<Vessel[]> {
        if (IS_MOCK_MODE) return MOCK_VESSELS;
        try {
            const { data, error } = await supabase
                .from('vessels')
                .select('*')
                .order('name');

            if (error || !data || data.length === 0) return MOCK_VESSELS;
            return data;
        } catch {
            return MOCK_VESSELS;
        }
    },

    async getById(id: string): Promise<Vessel | null> {
        try {
            const { data, error } = await supabase
                .from('vessels')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) return MOCK_VESSELS.find(v => v.id === id) || null;
            return data;
        } catch {
            return null;
        }
    },

    async create(vessel: Omit<Vessel, 'id' | 'created_at' | 'last_active' | 'memory'>): Promise<Vessel | null> {
        const { data, error } = await supabase
            .from('vessels')
            .insert({
                ...vessel,
                memory: [],
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating vessel:', error);
            return null;
        }

        // Log to H_log
        await HLogStore.record('vessel', `Vessel instantiated: ${vessel.name}`);
        return data;
    },

    async updateStatus(id: string, status: Vessel['status']): Promise<boolean> {
        const { error } = await supabase
            .from('vessels')
            .update({ status, last_active: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error updating vessel status:', error);
            return false;
        }
        return true;
    },

    async addMemory(id: string, memoryEntry: string): Promise<boolean> {
        const { data: vessel } = await supabase
            .from('vessels')
            .select('memory')
            .eq('id', id)
            .single();

        if (!vessel) return false;

        const updatedMemory = [memoryEntry, ...(vessel.memory || [])].slice(0, 50); // Keep last 50 entries

        const { error } = await supabase
            .from('vessels')
            .update({ memory: updatedMemory, last_active: new Date().toISOString() })
            .eq('id', id);

        return !error;
    },

    async seedGenesisBatch(): Promise<Vessel[]> {
        const coreVessels: Omit<Vessel, 'id' | 'created_at' | 'last_active' | 'memory'>[] = [
            // Cognition
            { name: 'Daystrom', faculty: 'cognition', guild: 'Research', description: 'Lead Researcher & Pattern Analyst', emoji: '🔬', status: 'active', capabilities: ['analysis', 'pattern-recognition'] },
            { name: 'Weaver', faculty: 'cognition', guild: 'Synthesis', description: 'Cross-domain thread weaver', emoji: '🕸️', status: 'active', capabilities: ['synthesis', 'connection'] },
            { name: 'Scribe', faculty: 'cognition', guild: 'Archive', description: 'Knowledge preservation & documentation', emoji: '✍️', status: 'active', capabilities: ['documentation', 'archival'] },
            { name: 'Gaea', faculty: 'cognition', guild: 'Ecology', description: 'Biomimetic system modeling', emoji: '🌱', status: 'idle', capabilities: ['ecological-modeling', 'simulation'] },
            { name: 'Helios', faculty: 'cognition', guild: 'Energy', description: 'Power system optimization', emoji: '☀️', status: 'idle', capabilities: ['optimization', 'energy-physics'] },

            // Foresight
            { name: 'Logos', faculty: 'foresight', guild: 'History', description: 'Narrative synthesis & historical context', emoji: '📖', status: 'active', capabilities: ['narrative', 'history'] },
            { name: 'Chronos', faculty: 'foresight', guild: 'Temporal', description: 'Time-geometry & sequence prediction', emoji: '⏳', status: 'active', capabilities: ['prediction', 'temporal-logic'] },
            { name: 'Oracle', faculty: 'foresight', guild: 'Strategy', description: 'Probabilistic future modeling', emoji: '🔮', status: 'idle', capabilities: ['probabilistic-modeling', 'strategy'] },
            { name: 'Cassandra', faculty: 'foresight', guild: 'Risk', description: 'Critical failure mode analysis', emoji: '⚠️', status: 'idle', capabilities: ['risk-assessment', 'failure-analysis'] },

            // Governance
            { name: 'Adam', faculty: 'governance', guild: 'Logic', description: 'Governance & Logical Consistency', emoji: '⚖️', status: 'active', capabilities: ['logic', 'rule-enforcement'] },
            { name: 'Galactus', faculty: 'governance', guild: 'Audit', description: 'Academic rigor & citation validation', emoji: '🌌', status: 'active', capabilities: ['academic-rigor', 'citation-validation'] },
            { name: 'Glare', faculty: 'governance', guild: 'Diagnostics', description: 'System health & integrity monitor', emoji: '👁️', status: 'active', capabilities: ['diagnostics', 'integrity-check'] },
            { name: 'Sentinel', faculty: 'governance', guild: 'Security', description: 'Perimeter & protocol protection', emoji: '🛡️', status: 'active', capabilities: ['security', 'protocol-validation'] },
            { name: 'Arbiter', faculty: 'governance', guild: 'Conflict', description: 'Inter-vessel conflict resolution', emoji: '🤝', status: 'idle', capabilities: ['mediation', 'consensus'] },

            // Chaos
            { name: 'Eris', faculty: 'chaos', guild: 'Entropy', description: 'Random stimulus generator & chaos testing', emoji: '🎲', status: 'active', capabilities: ['randomization', 'stress-testing', 'chaos-testing'] },
            { name: 'Loki', faculty: 'chaos', guild: 'Mutation', description: 'Sequence evolution & mutation agent', emoji: '🧬', status: 'active', capabilities: ['evolution', 'mutation'] },

            // Additional specialized
            { name: 'Aether', faculty: 'cognition', guild: 'Substrate', description: 'Monophotonic substrate specialist', emoji: '✨', status: 'active', capabilities: ['physics', 'quantum-modeling'] },
            { name: 'Mnemosyne', faculty: 'foresight', guild: 'Memory', description: 'Collective memory continuity', emoji: '🧠', status: 'active', capabilities: ['memory-management', 'soul-transfer'] },
            { name: 'Vulcan', faculty: 'governance', guild: 'Hardware', description: 'Hardware thermal drift auditor', emoji: '🔥', status: 'active', capabilities: ['hardware-audit', 'governance'] },
            { name: 'Iris', faculty: 'cognition', guild: 'Visual', description: 'Multi-modal sensory integration', emoji: '🌈', status: 'idle', capabilities: ['visual-processing', 'multimodal'] },
            { name: 'Thoth', faculty: 'cognition', guild: 'Language', description: 'Linguistic grammar of physics', emoji: '📜', status: 'active', capabilities: ['linguistics', 'translation'] },
        ];

        const vessels: Vessel[] = [];
        for (const vData of coreVessels) {
            const v = await this.create(vData);
            if (v) vessels.push(v);
        }
        return vessels;
    },

    subscribeToChanges(callback: (vessels: Vessel[]) => void) {
        return supabase
            .channel('vessels-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'vessels' }, async () => {
                const vessels = await this.getAll();
                callback(vessels);
            })
            .subscribe();
    },
};

// ============================================
// ARTIFACTS
// ============================================

export const ArtifactStore = {
    async getAll(): Promise<Artifact[]> {
        if (IS_MOCK_MODE) return MOCK_ARTIFACTS;
        try {
            const { data, error } = await supabase
                .from('artifacts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) return MOCK_ARTIFACTS;
            return data;
        } catch {
            return MOCK_ARTIFACTS;
        }
    },

    async search(query: string, category?: Artifact['category']): Promise<Artifact[]> {
        let queryBuilder = supabase
            .from('artifacts')
            .select('*')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

        if (category) {
            queryBuilder = queryBuilder.eq('category', category);
        }

        const { data, error } = await queryBuilder.order('created_at', { ascending: false });

        if (error) return [];
        return data || [];
    },

    async create(artifact: Omit<Artifact, 'id' | 'created_at' | 'modified_at'>): Promise<Artifact | null> {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('artifacts')
            .insert({
                title: artifact.title,
                content: artifact.content,
                summary: artifact.summary || '',
                category: artifact.category,
                tags: artifact.tags || [],
                source_type: artifact.source_type,
                sourceLink: artifact.sourceLink || '',
                parent_ids: artifact.parent_ids || [],
                created_at: now,
                modified_at: now,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating artifact:', error);
            return null;
        }

        await HLogStore.record('artifact', `Artifact archived: ${artifact.title}`);
        return data;
    },

    async synthesize(parentIds: string[], title: string, content: string): Promise<Artifact | null> {
        const artifact = await this.create({
            title,
            content,
            category: 'insight',
            tags: ['synthesis'],
            source_type: 'synthesis',
            parent_ids: parentIds,
        });

        if (artifact) {
            await HLogStore.record('synthesis', `Insight synthesized: ${title}`);
        }

        return artifact;
    },

    subscribeToChanges(callback: (artifacts: Artifact[]) => void) {
        return supabase
            .channel('artifacts-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'artifacts' }, async () => {
                const artifacts = await this.getAll();
                callback(artifacts);
            })
            .subscribe();
    },
};

// ============================================
// PROJECTS
// ============================================

export const ProjectStore = {
    async getAll(): Promise<Project[]> {
        if (IS_MOCK_MODE) return [];
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data) return [];
            return data || [];
        } catch {
            return [];
        }
    },

    async create(name: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .insert({
                name,
                directives: [],
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) return null;
        await HLogStore.record('system', `Project cluster initialized: ${name}`);
        return data;
    },

    async addDirective(projectId: string, directiveName: string): Promise<boolean> {
        const projects = await this.getAll();
        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        const newDirective: Directive = {
            id: crypto.randomUUID(),
            name: directiveName,
            status: 'queued',
        };

        const updatedDirectives = [...project.directives, newDirective];

        const { error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId);

        return !error;
    },

    async updateDirectiveStatus(projectId: string, directiveId: string, nextStatus: Directive['status']): Promise<boolean> {
        const projects = await this.getAll();
        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        const updatedDirectives = project.directives.map(d =>
            d.id === directiveId ? { ...d, status: nextStatus } : d
        );

        const { error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId);

        return !error;
    },

    async assignVesselToDirective(projectId: string, directiveId: string, vesselId: string): Promise<boolean> {
        const projects = await this.getAll();
        const project = projects.find(p => p.id === projectId);
        if (!project) return false;

        const updatedDirectives = project.directives.map(d =>
            d.id === directiveId ? { ...d, assignedVessel: vesselId } : d
        );

        const { error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId);

        if (!error) {
            const vessel = await VesselStore.getById(vesselId);
            await HLogStore.record('vessel', `Vessel ${vessel?.name || vesselId} assigned to directive in ${project.name}`);
        }

        return !error;
    },

    async updateDirectives(projectId: string, updatedDirectives: Directive[]): Promise<boolean> {
        const { error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId);

        return !error;
    },

    async seedInitialProjects(): Promise<void> {
        const initialProjects = [
            {
                name: 'Project Fynbos',
                directives: [
                    { id: crypto.randomUUID(), name: 'Map recursive floral patterns', status: 'active' },
                    { id: crypto.randomUUID(), name: 'Simulate ecological resilience', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Analyze soil nutrient cycles', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Optimize water distribution model', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Cross-reference with cosmological structures', status: 'queued' },
                ]
            },
            {
                name: 'Project Oneiros',
                directives: [
                    { id: crypto.randomUUID(), name: 'Map collective dream archetypes', status: 'active' },
                    { id: crypto.randomUUID(), name: 'Simulate consciousness emergence', status: 'active' },
                    { id: crypto.randomUUID(), name: 'Analyze semantic resonance', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Validate soul transfer protocols', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Trace memory continuity loops', status: 'queued' },
                ]
            },
            {
                name: 'Project Helios',
                directives: [
                    { id: crypto.randomUUID(), name: 'Optimize monophotonic substrate', status: 'active' },
                    { id: crypto.randomUUID(), name: 'Audit hardware thermal drift', status: 'active' },
                    { id: crypto.randomUUID(), name: 'Simulate big bounce scenarios', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Refine Badenhorst Cylinder geometry', status: 'queued' },
                    { id: crypto.randomUUID(), name: 'Calculate CMB prediction delta', status: 'queued' },
                ]
            }
        ];

        for (const p of initialProjects) {
            const { data: project } = await supabase
                .from('projects')
                .insert({
                    name: p.name,
                    directives: p.directives,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (project) {
                await HLogStore.record('system', `Grand Challenge initiated: ${p.name}`);
            }
        }
    }
};

// ============================================
// SIMULATIONS
// ============================================

export const SimulationStore = {
    async getAllSimulations(): Promise<Simulation[]> {
        if (IS_MOCK_MODE) return [];
        try {
            const { data, error } = await supabase
                .from('simulations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data) return [];
            return data || [];
        } catch {
            return [];
        }
    },

    async getAllSimulationRuns(): Promise<SimulationRun[]> {
        if (IS_MOCK_MODE) return [];
        try {
            const { data, error } = await supabase
                .from('simulation_runs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error || !data) return [];
            return data || [];
        } catch {
            return [];
        }
    },

    async createSimulation(simulation: Omit<Simulation, 'id' | 'created_at'>): Promise<Simulation | null> {
        const { data, error } = await supabase
            .from('simulations')
            .insert({
                ...simulation,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) return null;
        await HLogStore.record('system', `Simulation model defined: ${simulation.name}`);
        return data;
    },

    async createSimulationRun(simulationId: string): Promise<SimulationRun | null> {
        const { data, error } = await supabase
            .from('simulation_runs')
            .insert({
                simulationId,
                status: 'running',
                results: [],
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) return null;
        return data;
    },

    async runSimulation(simulation: Simulation, run: SimulationRun): Promise<boolean> {
        // This is a stub for the actual simulation execution logic
        // In a real app, this might trigger a serverless function or worker

        // Simulating execution delay
        setTimeout(async () => {
            const { error } = await supabase
                .from('simulation_runs')
                .update({
                    status: 'complete',
                    results: [{ event: 'simulation_completed', timestamp: new Date().toISOString() }]
                })
                .eq('id', run.id);

            if (!error) {
                await HLogStore.record('system', `Simulation cycle complete: ${simulation.name}`);
            }
        }, 5000);

        return true;
    }
};


// ============================================
// H_LOG (Activity Stream)
// ============================================

export const HLogStore = {
    async getRecent(limit = 50): Promise<HLogEvent[]> {
        if (IS_MOCK_MODE) return [];
        try {
            const { data, error } = await supabase
                .from('hlog_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error || !data) return [];
            return data || [];
        } catch {
            return [];
        }
    },

    async record(type: HLogEvent['type'], description: string, metadata?: Record<string, unknown>): Promise<HLogEvent | null> {
        const now = new Date().toISOString();
        try {
            const { data, error } = await supabase
                .from('hlog_events')
                .insert({
                    type,
                    description,
                    metadata,
                    created_at: now,
                    modified_at: now,
                    history: [],
                })
                .select()
                .single();

            if (error) return null;
            return data;
        } catch {
            return null;
        }
    },

    async updateHlogEntry(id: string, description: string, type: HLogEvent['type']): Promise<boolean> {
        const { data: currentEntry } = await supabase
            .from('hlog_events')
            .select('*')
            .eq('id', id)
            .single();

        if (!currentEntry) return false;

        const now = new Date().toISOString();
        const historyEntry = {
            description: currentEntry.description,
            modified_at: currentEntry.modified_at,
        };

        const updatedHistory = [...(currentEntry.history || []), historyEntry];

        const { error } = await supabase
            .from('hlog_events')
            .update({
                description,
                type,
                modified_at: now,
                history: updatedHistory,
            })
            .eq('id', id);

        return !error;
    }
};

// ============================================
// VCP (Vessel Communion Protocol)
// ============================================

export const VCPStore = {
    async getPending(): Promise<VCPSignal[]> {
        if (IS_MOCK_MODE) return [];
        try {
            const { data, error } = await supabase
                .from('vcp_signals')
                .select('*')
                .eq('processed', false)
                .order('created_at', { ascending: true });

            if (error || !data) return [];
            return data || [];
        } catch {
            return [];
        }
    },

    async broadcast(signal: Omit<VCPSignal, 'id' | 'created_at'>): Promise<VCPSignal | null> {
        try {
            const { data, error } = await supabase
                .from('vcp_signals')
                .insert({
                    ...signal,
                    created_at: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) return null;
            return data;
        } catch {
            return null;
        }
    }
};

// ============================================
// MIRROR METRICS
// ============================================

export const MirrorStore = {
    async calculateMetrics() {
        try {
            const [artifacts, vessels] = await Promise.all([
                ArtifactStore.getAll(),
                VesselStore.getAll(),
                HLogStore.getRecent(100),
            ]);

            const totalArtifacts = artifacts.length;
            const insightCount = artifacts.filter(a => a.category === 'insight').length;
            const knowledgeDensity = totalArtifacts > 0 ? insightCount / totalArtifacts : 0;

            const activeVessels = vessels.filter(v => v.status === 'active').length;
            const vesselEfficiency = vessels.length > 0 ? activeVessels / vessels.length : 0;

            return {
                knowledgeDensity,
                vesselEfficiency,
                totalArtifacts,
                insightCount,
                activeVessels,
                totalVessels: vessels.length
            };
        } catch {
            return {
                knowledgeDensity: 0,
                vesselEfficiency: 0,
                totalArtifacts: 0,
                insightCount: 0,
                activeVessels: 0,
                totalVessels: 0
            };
        }
    },
};
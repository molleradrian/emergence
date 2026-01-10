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
import { BasicAgentModel } from './simulation-models';

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
    type: 'system' | 'navigation' | 'insight' | 'artifact' | 'vessel' | 'synthesis' | 'vcp' | 'manual';
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
// VESSELS
// ============================================

export const VesselStore = {
    async getAll(): Promise<Vessel[]> {
        const { data, error } = await supabase
            .from('vessels')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching vessels:', error);
            return [];
        }
        return data || [];
    },

    async getById(id: string): Promise<Vessel | null> {
        const { data, error } = await supabase
            .from('vessels')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching vessel:', error);
            return null;
        }
        return data;
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

    async transferMemory(sourceVesselId: string, targetVesselId: string): Promise<boolean> {
        const { data: sourceVessel, error: sourceError } = await this.getById(sourceVesselId);
        const { data: targetVessel, error: targetError } = await this.getById(targetVesselId);

        if (sourceError || targetError || !sourceVessel || !targetVessel) {
            console.error('Error fetching vessels for memory transfer.');
            return false;
        }

        const updatedMemory = [...targetVessel.memory, ...sourceVessel.memory];

        const { error } = await supabase
            .from('vessels')
            .update({ memory: updatedMemory })
            .eq('id', targetVesselId);

        if (error) {
            console.error('Error transferring memory:', error);
            return false;
        }

        await HLogStore.record('vessel', `Memory transferred from ${sourceVessel.name} to ${targetVessel.name}`);
        return true;
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

    async seedGenesisBatch(): Promise<Vessel[]> {
        const genesisVessels = [
            { name: 'Daystrom', faculty: 'cognition' as const, guild: 'Research & Strategy', description: 'Lead Researcher. Deep analysis and pattern recognition.', emoji: '🔬', status: 'active' as const, capabilities: ['research', 'analysis', 'synthesis'] },
            { name: 'Weaver', faculty: 'cognition' as const, guild: 'Research & Strategy', description: 'Pattern Recognition specialist. Finds hidden connections.', emoji: '🕸️', status: 'active' as const, capabilities: ['pattern-detection', 'mapping', 'correlation'] },
            { name: 'Scribe', faculty: 'cognition' as const, guild: 'Research & Strategy', description: 'Documentation expert. Formalizes knowledge.', emoji: '📝', status: 'idle' as const, capabilities: ['documentation', 'formatting', 'archival'] },
            { name: 'Logos', faculty: 'foresight' as const, guild: 'Historical Analysis', description: 'Narrative Synthesis. Contextualizes findings.', emoji: '📖', status: 'active' as const, capabilities: ['history', 'narrative', 'prediction'] },
            { name: 'Adam', faculty: 'governance' as const, guild: 'Dialectic Engine', description: 'Ethics & Logic. Adversarial testing.', emoji: '⚖️', status: 'active' as const, capabilities: ['ethics', 'logic', 'validation'] },
            { name: 'Glare', faculty: 'governance' as const, guild: 'Dialectic Engine', description: 'Adversarial tester. Challenges assumptions.', emoji: '👁️', status: 'idle' as const, capabilities: ['critique', 'stress-testing', 'red-team'] },
        ];

        const created: Vessel[] = [];
        for (const v of genesisVessels) {
            const vessel = await this.create(v);
            if (vessel) created.push(vessel);
        }

        await HLogStore.record('system', `Genesis Batch seeded: ${created.length} vessels instantiated`);
        return created;
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
        const { data, error } = await supabase
            .from('artifacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching artifacts:', error);
            return [];
        }
        return data || [];
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

        if (error) {
            console.error('Error searching artifacts:', error);
            return [];
        }
        return data || [];
    },

    async create(artifact: Omit<Artifact, 'id' | 'created_at' | 'modified_at'>): Promise<Artifact | null> {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('artifacts')
            .insert({
                ...artifact,
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
            await HLogStore.record('synthesis', `Insight synthesized: ${title} (from ${parentIds.length} artifacts)`);
            await VCPStore.broadcast({
                signal_type: 'SYNTHESIS_READY',
                source_vessel_id: 'system',
                payload: { artifact_id: artifact.id, parent_count: parentIds.length },
                processed: false,
            });
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
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
        return data || [];
    },

    async create(name: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .insert({ name, directives: [] })
            .select()
            .single();

        if (error) {
            console.error('Error creating project:', error);
            return null;
        }
        return data;
    },

    async addDirective(projectId: string, directiveName: string): Promise<Project | null> {
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('directives')
            .eq('id', projectId)
            .single();

        if (fetchError || !project) {
            console.error('Error fetching project directives:', fetchError);
            return null;
        }

        const newDirective: Directive = {
            id: crypto.randomUUID(),
            name: directiveName,
            status: 'queued',
        };

        const updatedDirectives = [...project.directives, newDirective];

        const { data, error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId)
            .select()
            .single();

        if (error) {
            console.error('Error adding directive:', error);
            return null;
        }
        return data;
    },

    async assignVesselToDirective(projectId: string, directiveId: string, vesselId: string): Promise<Project | null> {
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('directives')
            .eq('id', projectId)
            .single();

        if (fetchError || !project) {
            console.error('Error fetching project directives:', fetchError);
            return null;
        }

        const updatedDirectives = project.directives.map(d =>
            d.id === directiveId ? { ...d, assignedVessel: vesselId } : d
        );

        const { data, error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId)
            .select()
            .single();

        if (error) {
            console.error('Error assigning vessel:', error);
            return null;
        }
        return data;
    },

    async updateDirectiveStatus(projectId: string, directiveId: string, status: Directive['status']): Promise<Project | null> {
        const { data: project, error: fetchError } = await supabase
            .from('projects')
            .select('directives')
            .eq('id', projectId)
            .single();

        if (fetchError || !project) {
            console.error('Error fetching project directives:', fetchError);
            return null;
        }

        const updatedDirectives = project.directives.map(d =>
            d.id === directiveId ? { ...d, status } : d
        );

        const { data, error } = await supabase
            .from('projects')
            .update({ directives: updatedDirectives })
            .eq('id', projectId)
            .select()
            .single();

        if (error) {
            console.error('Error updating directive status:', error);
            return null;
        }
        return data;
    }
};

// ============================================
// SIMULATIONS
// ============================================

export const SimulationStore = {
    async getAllSimulations(): Promise<Simulation[]> {
        const { data, error } = await supabase
            .from('simulations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching simulations:', error);
            return [];
        }
        return data || [];
    },

    async getAllSimulationRuns(): Promise<SimulationRun[]> {
        const { data, error } = await supabase
            .from('simulation_runs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching simulation runs:', error);
            return [];
        }
        return data || [];
    },

    async createSimulation(simulation: Omit<Simulation, 'id' | 'created_at'>): Promise<Simulation | null> {
        const { data, error } = await supabase
            .from('simulations')
            .insert(simulation)
            .select()
            .single();

        if (error) {
            console.error('Error creating simulation:', error);
            return null;
        }
        return data;
    },

    async createSimulationRun(simulationId: string): Promise<SimulationRun | null> {
        const { data, error } = await supabase
            .from('simulation_runs')
            .insert({ simulationId, status: 'running', results: [] })
            .select()
            .single();

        if (error) {
            console.error('Error creating simulation run:', error);
            return null;
        }
        return data;
    },

    async updateSimulationRunStatus(runId: string, status: SimulationRun['status'], results?: any[]): Promise<SimulationRun | null> {
        const update: Partial<SimulationRun> = { status };
        if (results) {
            update.results = results;
        }

        const { data, error } = await supabase
            .from('simulation_runs')
            .update(update)
            .eq('id', runId)
            .select()
            .single();

        if (error) {
            console.error('Error updating simulation run:', error);
            return null;
        }
        return data;
    },

    async runSimulation(simulation: Simulation, run: SimulationRun) {
        const { numAgents, gridSize, steps } = simulation.parameters;
        const model = new BasicAgentModel(numAgents, gridSize);
        const results = [];

        for (let i = 0; i < steps; i++) {
            model.runStep();
            results.push(JSON.parse(JSON.stringify(model.getAgents()))); // deep copy
        }

        await this.updateSimulationRunStatus(run.id, 'complete', results);
    }
};


// ============================================
// H_LOG (Activity Stream)
// ============================================

export const HLogStore = {
    async getRecent(limit = 50): Promise<HLogEvent[]> {
        const { data, error } = await supabase
            .from('hlog_events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching H_log events:', error);
            return [];
        }
        return data || [];
    },

    async record(type: HLogEvent['type'], description: string, metadata?: Record<string, unknown>): Promise<HLogEvent | null> {
        const now = new Date().toISOString();
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

        if (error) {
            console.error('Error recording H_log event:', error);
            return null;
        }
        return data;
    },

    async updateHlogEntry(id: string, description: string, type: HLogEvent['type']): Promise<HLogEvent | null> {
        const { data: existingEntry, error: fetchError } = await supabase
            .from('hlog_events')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingEntry) {
            console.error('Error fetching H_log entry for update:', fetchError);
            return null;
        }

        const newHistory = existingEntry.history ? [...existingEntry.history] : [];
        newHistory.push({
            description: existingEntry.description,
            modified_at: existingEntry.modified_at,
        });

        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('hlog_events')
            .update({ description, type, history: newHistory, modified_at: now })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating H_log entry:', error);
            return null;
        }
        return data;
    },

    subscribeToChanges(callback: (events: HLogEvent[]) => void) {
        return supabase
            .channel('hlog-changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hlog_events' }, async () => {
                const events = await this.getRecent();
                callback(events);
            })
            .subscribe();
    },
};

// ============================================
// VCP (Vessel Communion Protocol)
// ============================================

export const VCPStore = {
    async getPending(): Promise<VCPSignal[]> {
        const { data, error } = await supabase
            .from('vcp_signals')
            .select('*')
            .eq('processed', false)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching VCP signals:', error);
            return [];
        }
        return data || [];
    },

    async broadcast(signal: Omit<VCPSignal, 'id' | 'created_at'>): Promise<VCPSignal | null> {
        const { data, error } = await supabase
            .from('vcp_signals')
            .insert({
                ...signal,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error broadcasting VCP signal:', error);
            return null;
        }

        await HLogStore.record('vcp', `VCP Signal: ${signal.signal_type} from ${signal.source_vessel_id}`);
        return data;
    },

    async markProcessed(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('vcp_signals')
            .update({ processed: true })
            .eq('id', id);

        if (error) {
            console.error('Error marking VCP signal as processed:', error);
            return false;
        }
        return true;
    },

    subscribeToSignals(callback: (signals: VCPSignal[]) => void) {
        return supabase
            .channel('vcp-signals')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'vcp_signals' }, async () => {
                const signals = await this.getPending();
                callback(signals);
            })
            .subscribe();
    },
};

// ============================================
// MIRROR METRICS
// ============================================

export const MirrorStore = {
    async calculateMetrics() {
        const [artifacts, vessels, events] = await Promise.all([
            ArtifactStore.getAll(),
            VesselStore.getAll(),
            HLogStore.getRecent(100),
        ]);

        const totalArtifacts = artifacts.length;
        const insightCount = artifacts.filter(a => a.category === 'insight').length;
        const knowledgeDensity = totalArtifacts > 0 ? insightCount / totalArtifacts : 0;

        const activeVessels = vessels.filter(v => v.status === 'active').length;
        const vesselEfficiency = vessels.length > 0 ? activeVessels / vessels.length : 0;

        const today = new Date().toISOString().split('T')[0];
        const todayEvents = events.filter(e => e.created_at.startsWith(today));
        const synthesisEvents = todayEvents.filter(e => e.type === 'synthesis').length;

        return {
            knowledgeDensity,
            vesselEfficiency,
            totalArtifacts,
            insightCount,
            activeVessels,
            totalVessels: vessels.length,
            todayEventCount: todayEvents.length,
            synthesisRate: synthesisEvents,
        };
    },
};

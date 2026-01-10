'use client';

/**
 * Aetherium Nexus - Dynamic Operating System for Emergence
 * Main application page with all 7 views
 */

import { useState, useEffect, useMemo } from 'react';
import { VesselStore, ArtifactStore, HLogStore, MirrorStore, VCPStore, ProjectStore, SimulationStore, type Vessel, type Artifact, type HLogEvent, type VCPSignal, type Project, type Directive, type Simulation, type SimulationRun } from '@/lib/nexus-store';
import { generateVesselResponse } from '@/ai/flows/vessel-response';
import { ProjectGraph } from '@/components/project-graph';
import { IntegrationEngine } from '@/lib/integration-engine';
import { SimulationGraph } from '@/components/simulation-graph';
import { Template, templates } from '@/lib/codex-templates';
import DOMPurify from 'dompurify';

type ViewId = 'nexus' | 'projects' | 'vessels' | 'vault' | 'mirror' | 'hlog' | 'principles' | 'simulations' | 'codex';

interface Message {
    id: string;
    text: string;
    type: 'user' | 'ai';
    vessel?: string;
    vesselEmoji?: string;
    timestamp: Date;
}

declare const html2pdf: any;

export default function NexusPage() {
    const [currentView, setCurrentView] = useState<ViewId>('nexus');
    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [hlogEvents, setHlogEvents] = useState<HLogEvent[]>([]);
    const [vcpSignals, setVcpSignals] = useState<VCPSignal[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [simulationRuns, setSimulationRuns] = useState<SimulationRun[]>([]);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [metrics, setMetrics] = useState<{
        knowledgeDensity: number;
        vesselEfficiency: number;
        totalArtifacts: number;
        insightCount: number;
        activeVessels: number;
        totalVessels: number;
    } | null>(null);

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedVessel, setSelectedVessel] = useState('global');
    const [isLoading, setIsLoading] = useState(false);
    const [pulse, setPulse] = useState(72);
    const [glitch, setGlitch] = useState(false);
    const [somaticState, setSomaticState] = useState('Calm');
    const [tuningForkSetting, setTuningForkSetting] = useState('focus');
    const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
    const [newSimulationParams, setNewSimulationParams] = useState<Record<string, any>>({});
    const [selectedSimulationRun, setSelectedSimulationRun] = useState<SimulationRun | null>(null);
    const [selectedArtifactForCodex, setSelectedArtifactForCodex] = useState<Artifact | null>(null);
    const [showArtifactSelector, setShowArtifactSelector] = useState(false);
    const [showTemplateView, setShowTemplateView] = useState(false);
    const [populatedTemplate, setPopulatedTemplate] = useState('');
    const [showRefinementModal, setShowRefinementModal] = useState(false);
    const [refinementPrompt, setRefinementPrompt] = useState('');
    const [newHlogEntry, setNewHlogEntry] = useState('');

    // Vessel view state
    const [vesselViewTab, setVesselViewTab] = useState<'directory' | 'signals'>('directory');
    const [selectedSignalType, setSelectedSignalType] = useState<string>('All');
    const [allSignalTypes, setAllSignalTypes] = useState<string[]>(['All']);

    const filteredVcpSignals = useMemo(() => {
        if (selectedSignalType === 'All') return vcpSignals;
        return vcpSignals.filter(s => s.signal_type === selectedSignalType);
    }, [vcpSignals, selectedSignalType]);

    // Modal state
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [artifactToSave, setArtifactToSave] = useState<Partial<Artifact> | null>(null);
    const [showVesselAssignmentModal, setShowVesselAssignmentModal] = useState(false);
    const [directiveToAssign, setDirectiveToAssign] = useState<{ projectId: string, directiveId: string } | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [allCategories, setAllCategories] = useState<string[]>(['All']);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredArtifacts = useMemo(() => {
        return artifacts
            .filter(a => {
                if (selectedCategory === 'All') return true;
                return a.category === selectedCategory;
            })
            .filter(a => {
                const searchTermLower = searchTerm.toLowerCase();
                return a.title.toLowerCase().includes(searchTermLower) ||
                       a.content.toLowerCase().includes(searchTermLower);
            })
            .filter(a => {
                if (selectedTags.length === 0) return true;
                return selectedTags.every(tag => a.tags?.includes(tag));
            })
            .filter(a => {
                if (!startDate && !endDate) return true;
                const artifactDate = new Date(a.created_at);
                if (startDate && artifactDate < new Date(startDate)) return false;
                if (endDate && artifactDate > new Date(endDate)) return false;
                return true;
            });
    }, [artifacts, searchTerm, selectedTags, selectedCategory, startDate, endDate]);

    // Load initial data
    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            setPulse(60 + Math.floor(Math.random() * 30));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    async function loadData() {
        const [v, a, e, m, s, p, sims, simRuns] = await Promise.all([
            VesselStore.getAll(),
            ArtifactStore.getAll(),
            HLogStore.getRecent(),
            MirrorStore.calculateMetrics(),
            VCPStore.getPending(),
            ProjectStore.getAll(),
            SimulationStore.getAllSimulations(),
            SimulationStore.getAllSimulationRuns(),
        ]);
        setVessels(v);
        setArtifacts(a);
        setHlogEvents(e);
        setMetrics(m);
        setVcpSignals(s);
        setProjects(p);
        setSimulations(sims);
        setSimulationRuns(simRuns);
        setTemplates(templates);
        
        const tags = new Set<string>();
        const categories = new Set<string>();
        a.forEach(artifact => {
            artifact.tags?.forEach(tag => tags.add(tag));
            categories.add(artifact.category);
        });
        setAllTags(Array.from(tags));
        setAllCategories(['All', ...Array.from(categories)]);

        const signalTypes = new Set<string>();
        s.forEach(signal => signalTypes.add(signal.signal_type));
        setAllSignalTypes(['All', ...Array.from(signalTypes)]);

        setHlogEvents(e);
        setMetrics(m);
    }

    function handleTagClick(tag: string) {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    function handleSaveClick(message: Message) {
        setArtifactToSave({
            title: `Insight from ${message.vessel}`,
            content: message.text,
            category: 'insight',
            tags: [],
            sourceLink: '',
        });
        setShowSaveModal(true);
    }

    async function handleSaveArtifact() {
        if (!artifactToSave || !artifactToSave.title?.trim() || !artifactToSave.content?.trim() || artifactToSave.title.length > 200 || artifactToSave.content.length > 10000) {
            // Basic validation
            console.error("Invalid artifact data");
            return;
        }

        await ArtifactStore.create({
            title: artifactToSave.title || 'Untitled Artifact',
            content: artifactToSave.content || '',
            category: artifactToSave.category || 'insight',
            tags: artifactToSave.tags || [],
            sourceLink: artifactToSave.sourceLink || '',
            source_type: 'chat',
        });

        setShowSaveModal(false);
        setArtifactToSave(null);
        loadData();
    }

    async function broadcastTestSignal() {
        const signalTypes: VCPSignal['signal_type'][] = ['TASK_COMPLETE', 'INSIGHT_GENERATED', 'CONFLICT_DETECTED', 'RESOURCE_REQUEST', 'VALIDATION_NEEDED', 'SYNTHESIS_READY'];
        const randomType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
        
        await VCPStore.broadcast({
            signal_type: randomType,
            source_vessel_id: 'system_test',
            payload: { message: 'This is a test signal' },
            processed: false,
        });
        loadData();
    }

    async function handleCreateProject(name: string) {
        if (!name.trim() || name.length > 100) return;
        await ProjectStore.create(name);
        loadData();
    }

    async function handleCreateDirective(projectId: string, directiveName: string) {
        if (!directiveName.trim() || directiveName.length > 200) return;
        await ProjectStore.addDirective(projectId, directiveName);
        loadData();
    }

    function handleOpenVesselAssignmentModal(projectId: string, directiveId: string) {
        setDirectiveToAssign({ projectId, directiveId });
        setShowVesselAssignmentModal(true);
    }

    async function handleAssignVessel(vesselId: string) {
        if (!directiveToAssign) return;
        await ProjectStore.assignVesselToDirective(directiveToAssign.projectId, directiveToAssign.directiveId, vesselId);
        setShowVesselAssignmentModal(false);
        setDirectiveToAssign(null);
        loadData();
    }

    async function handleUpdateDirectiveStatus(projectId: string, directiveId: string, currentStatus: Directive['status']) {
        const nextStatus: Directive['status'] = currentStatus === 'queued' ? 'active' : currentStatus === 'active' ? 'complete' : 'queued';
        await ProjectStore.updateDirectiveStatus(projectId, directiveId, nextStatus);
        loadData();
    }

    async function handleRunGenesisCycle() {
        setSomaticState('Synthesizing');
        setPulse(120);

        const triggerGlitch = () => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 500);
        };
        await IntegrationEngine.runGenesisCycle(triggerGlitch);
        
        setSomaticState('Calm');
        setPulse(72);
        loadData();
    }

    async function handleCreateSimulation() {
        if (!newSimulationParams.name || !newSimulationParams.description || !newSimulationParams.parameters) {
            console.error("Invalid simulation data");
            return;
        }

        await SimulationStore.createSimulation({
            name: newSimulationParams.name,
            description: newSimulationParams.description,
            parameters: newSimulationParams.parameters,
        });

        setNewSimulationParams({});
        loadData();
    }

    async function handleRunSimulation(simulationId: string) {
        const simulation = simulations.find(s => s.id === simulationId);
        if (!simulation) {
            console.error("Simulation not found");
            return;
        }

        const run = await SimulationStore.createSimulationRun(simulationId);
        if (run) {
            await SimulationStore.runSimulation(simulation, run);
            loadData();
        }
    }

    function handleViewTemplate(template: Template) {
        if (!selectedArtifactForCodex) return;

        let populated = template.template;
        populated = populated.replace(/{{title}}/g, selectedArtifactForCodex.title);
        populated = populated.replace(/{{content}}/g, selectedArtifactForCodex.content);
        populated = populated.replace(/{{summary}}/g, selectedArtifactForCodex.summary || selectedArtifactForCodex.content);
        populated = populated.replace(/{{category}}/g, selectedArtifactForCodex.category);
        populated = populated.replace(/{{tags}}/g, selectedArtifactForCodex.tags.join(', '));

        setPopulatedTemplate(populated);
        setShowTemplateView(true);
    }

    async function handleRefineTemplate() {
        if (!refinementPrompt.trim()) return;

        const response = await generateVesselResponse({
            query: `Refine the following document with this prompt: "${refinementPrompt}"\n\n${populatedTemplate}`,
            vesselId: selectedVessel,
        });

        setPopulatedTemplate(response.response);
        setShowRefinementModal(false);
        setRefinementPrompt('');
    }

    async function handleCreateHlogEntry() {
        if (!newHlogEntry.trim()) return;
        await HLogStore.record('manual', newHlogEntry);
        setNewHlogEntry('');
        loadData();
    }

    function handleExport(format: 'html' | 'md' | 'pdf') {
        let content = populatedTemplate;
        let fileExtension = format;

        if (format === 'pdf') {
            const element = document.createElement('div');
            element.innerHTML = content;
            html2pdf().from(element).save('codex-export.pdf');
            return;
        }

        if (format === 'md') {
            // Basic HTML to Markdown conversion (stripping tags)
            content = content.replace(/<[^>]*>/g, '');
        }

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `codex-export.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function generateDummyArtifacts() {
        const dummyArtifacts: Artifact[] = [];
        const categories: Artifact['category'][] = ['theory', 'protocol', 'data', 'reference', 'insight'];
        const tags = ['tagA', 'tagB', 'tagC', 'tagD', 'tagE', 'tagF'];

        for (let i = 0; i < 150; i++) {
            const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            dummyArtifacts.push({
                id: `dummy-${i}`,
                title: `Dummy Artifact ${i}`,
                content: `This is the content of dummy artifact number ${i}. It contains some random text to test the search functionality.`,
                category: categories[i % categories.length],
                tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
                source_type: 'import',
                sourceLink: i % 5 === 0 ? 'https://docs.google.com/document/d/1BalsA5H4w2g2c5a_XE3s_2a4d5e6f7g8h9i0j1k2l3m/edit' : undefined,
                created_at: date.toISOString(),
                modified_at: date.toISOString(),
            });
        }
        setArtifacts(prev => [...prev, ...dummyArtifacts]);
    }

    async function archiveGenesisDocuments() {
        const genesisArtifacts = [
            { title: 'The Aetherium Hub: Official Blueprint & Functional Specification', content: 'Master architectural plan defining the OS/E philosophy, five core modules (Operations Hub, Grand Challenges, H_log, Simulation Engine, Codex), MoSCoW prioritization, and RBAC future state.', category: 'protocol' as Artifact['category'], tags: ['Genesis', 'Blueprint', 'Architecture', 'Specification', 'MustHave'], source_type: 'import' as Artifact['source_type'] },
            { title: 'Project Emergence: Research Portfolio & 1,088 Vessel Architecture', content: 'Complete research program documentation including Vessels of One principle, OS/E implementation, Emergence Math framework, VCP protocol, and the full 1,088 vessel hierarchy.', category: 'theory' as Artifact['category'], tags: ['Genesis', 'Research', 'Vessels', 'VCP', 'EmergenceMath', '1088'], source_type: 'import' as Artifact['source_type'] },
            { title: 'From Cellular Rebellion to Cosmological Structure: A Synthesis of a Foundational Dialogue', content: 'Recursive inquiry scaling from cancer metastasis ("move operation") through fundamental forces as language to the Big Bounce cosmology and the Badenhorst Cylinder time geometry model.', category: 'theory' as Artifact['category'], tags: ['Synthesis', 'CrossDomain', 'Theory', 'Biology', 'Cosmology', 'Foundational', 'Galactus'], source_type: 'import' as Artifact['source_type'] },
            { title: 'Badenhorst Cylinder: Mathematical Formulation & CMB Predictions', content: 'Formal mathematical description of the Badenhorst Cylinder as a 4D Lorentzian manifold with cylindrical symmetry, frame-dragging mechanism, and testable CMB predictions.', category: 'theory' as Artifact['category'], tags: ['Cosmology', 'TimeGeometry', 'Gravity', 'Mathematics', 'Testable', 'CMB', 'OriginalTheory', 'Galactus'], source_type: 'import' as Artifact['source_type'] },
            { title: 'Physics as Language: Universal Dictionary & Grammar Mapping', content: 'Complete linguistic mapping of fundamental physics: particles as alphabet, coupling constants as dictionary, gauge symmetries as grammar, Weak Force as editor.', category: 'reference' as Artifact['category'], tags: ['Physics', 'Metaphor', 'Forces', 'Particles', 'Language', 'Theory', 'Galactus'], source_type: 'import' as Artifact['source_type'] },
            { title: 'SYSTEM_UPGRADE 001: The Nexus v0.7 - Architectural Blueprint', content: 'Complete HTML/CSS/JS implementation of the Glassmorphism UI, four-view architecture (Nexus/Projects/Vessels/Principles), Firebase integration, and vessel instantiation logic.', category: 'protocol' as Artifact['category'], tags: ['Architecture', 'Directive', 'Frontend', 'DesignSystem', 'Firebase', 'Glassmorphism', 'Galactus'], source_type: 'import' as Artifact['source_type'] },
            { title: 'Path B: The Hand of Adam - "Commit to Archive" Protocol', content: 'Implementation specification for The Vault artifact archival system, including database schema extension, UI modal, save functionality, and artifacts grid view.', category: 'protocol' as Artifact['category'], tags: ['Protocol', 'Command', 'Development', 'TheVault', 'Artifacts', 'Galactus', 'v0.8'], source_type: 'import' as Artifact['source_type'] },
            { title: 'Aetherium Hub: Multi-Agent Research Loop Validation', content: 'Documentation of the recursive research loop: Creator generates questions → Galactus provides technical answers → DeepSeek synthesizes strategy → Insights archived → New synthesis emerges.', category: 'protocol' as Artifact['category'], tags: ['Architecture', 'Workflow', 'Validation', 'SystemsDesign', 'Emergence', 'Protocol', 'MultiAgent'], source_type: 'import' as Artifact['source_type'] },
            { title: 'Emergence Math: Contextual State Transformations & Operators', content: 'Complete mathematical framework for modeling qualitative experience dynamics: 0 (potential), 1 (presence), contextual states S=(value, context), and three operators (⊕ Infuse, ⊗ Collapse, ⊛ Merge).', category: 'theory' as Artifact['category'], tags: ['EmergenceMath', 'Theory', 'Operators', 'Context', 'States', 'Framework'], source_type: 'import' as Artifact['source_type'] },
        ];

        for (const artifact of genesisArtifacts) {
            await ArtifactStore.create(artifact);
        }
        loadData();
    }

    // Send message to AI
    async function sendMessage() {

        if (!inputValue.trim() || isLoading || inputValue.length > 2000) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: inputValue,
            type: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await generateVesselResponse({
                query: inputValue,
                vesselId: selectedVessel,
            });

            const aiMessage: Message = {
                id: crypto.randomUUID(),
                text: response.response,
                type: 'ai',
                vessel: response.vesselName,
                vesselEmoji: response.vesselEmoji,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMessage]);
            await HLogStore.record('insight', `${response.vesselName} responded to query`);
            loadData(); // Refresh H_log
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                text: 'The vessel remains silent. Please check your connection and try again.',
                type: 'ai',
                vessel: 'System',
                vesselEmoji: '⚠️',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    // Seed Genesis Batch
    async function seedGenesis() {
        const created = await VesselStore.seedGenesisBatch();
        setVessels(created);
        loadData();
    }

    const navItems = [
        { id: 'nexus' as ViewId, icon: '🧠', label: 'Nexus' },
        { id: 'projects' as ViewId, icon: '📋', label: 'Projects' },
        { id: 'vessels' as ViewId, icon: '👥', label: 'Vessels' },
        { id: 'vault' as ViewId, icon: '💎', label: 'Vault' },
        { id: 'principles' as ViewId, icon: '📜', label: 'Principles' },
        { id: 'mirror' as ViewId, icon: '🪞', label: 'Mirror' },
        { id: 'hlog' as ViewId, icon: '💓', label: 'H_log' },
        { id: 'simulations' as ViewId, icon: '⚙️', label: 'Simulations' },
        { id: 'codex' as ViewId, icon: '📚', label: 'Codex' },
    ];

    return (
        <div className="nexus-bg min-h-screen flex" data-theme={tuningForkSetting}>
            {/* Sidebar */}
            <nav className="w-[72px] glass-panel !rounded-none flex flex-col items-center py-4 fixed left-0 top-0 h-screen z-50">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] flex items-center justify-center text-xl mb-6 animate-pulse-glow">
                    🌀
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${currentView === item.id
                                    ? 'bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                                    : 'hover:bg-[rgba(255,255,255,0.05)]'
                                }`}
                            title={item.label}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>
                <div
                    className="w-3 h-3 rounded-full bg-[var(--status-active)] animate-heartbeat mb-2"
                    title={`Pulse: ${pulse} BPM`}
                />
            </nav>

            {/* Main Content */}
            <main className="flex-1 ml-[72px] p-6">
                {/* Header */}
                <header className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="font-semibold text-xl tracking-wide neon-text-blue">AETHERIUM NEXUS</h1>
                        <span className="text-[var(--text-muted)] text-sm">v1.0 | OS/E</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setTuningForkSetting('focus')} className={`text-sm px-3 py-1 rounded-full ${tuningForkSetting === 'focus' ? 'bg-white text-black' : 'bg-white/10'}`}>Focus</button>
                        <button onClick={() => setTuningForkSetting('creative')} className={`text-sm px-3 py-1 rounded-full ${tuningForkSetting === 'creative' ? 'bg-white text-black' : 'bg-white/10'}`}>Creative</button>
                        <button onClick={() => setTuningForkSetting('calm')} className={`text-sm px-3 py-1 rounded-full ${tuningForkSetting === 'calm' ? 'bg-white text-black' : 'bg-white/10'}`}>Calm</button>
                    </div>
                </header>

                {/* NEXUS VIEW */}
                {currentView === 'nexus' && (
                    <div className="glass-panel h-[calc(100vh-140px)] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">🧠 Artificial Imagination</h2>
                            <select
                                value={selectedVessel}
                                onChange={(e) => setSelectedVessel(e.target.value)}
                                className="glass-input w-auto"
                            >
                                <option value="global">Global Context</option>
                                <option value="daystrom">Daystrom</option>
                                <option value="logos">Logos</option>
                                <option value="adam">Adam</option>
                                <option value="weaver">Weaver</option>
                                <option value="scribe">Scribe</option>
                                <option value="glare">Glare</option>
                            </select>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                                    {msg.type === 'ai' && (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center text-sm flex-shrink-0">
                                            {msg.vesselEmoji}
                                        </div>
                                    )}
                                    <div className={`max-w-[70%] p-3 rounded-xl ${msg.type === 'user'
                                            ? 'bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]'
                                            : 'bg-[var(--glass-bg)] border border-[var(--glass-border)]'
                                        }`}>
                                        {msg.type === 'ai' && <div className="text-xs text-[var(--text-muted)] mb-1">{msg.vessel}</div>}
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        {msg.type === 'ai' && (
                                            <button
                                                onClick={() => handleSaveClick(msg)}
                                                className="text-xs text-[var(--text-muted)] hover:text-white mt-2"
                                            >
                                                Save as Artifact
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center animate-pulse">🌀</div>
                                    <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-3 rounded-xl">
                                        <p className="text-sm text-[var(--text-muted)]">Synthesizing response...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--glass-border)]">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Enter your query..."
                                className="glass-input flex-1"
                                disabled={isLoading}
                            />
                            <button onClick={sendMessage} disabled={isLoading} className="glass-btn-primary">
                                Send
                            </button>
                        </div>
                    </div>
                )}

                {/* VESSELS VIEW */}
                {currentView === 'vessels' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setVesselViewTab('directory')}
                                    className={`text-lg font-medium ${vesselViewTab === 'directory' ? 'neon-text-blue' : ''}`}
                                >
                                    👥 Vessel Directory
                                </button>
                                <button
                                    onClick={() => setVesselViewTab('signals')}
                                    className={`text-lg font-medium ${vesselViewTab === 'signals' ? 'neon-text-blue' : ''}`}
                                >
                                    ⚡ VCP Signals
                                </button>
                            </div>
                            <button onClick={seedGenesis} className="glass-btn-primary">
                                Seed Genesis Batch
                            </button>
                            {vesselViewTab === 'signals' && (
                                <button onClick={broadcastTestSignal} className="glass-btn-primary ml-4">
                                    Broadcast Test Signal
                                </button>
                            )}
                        </div>
                        {vesselViewTab === 'directory' && (
                            <>
                                {vessels.length === 0 ? (
                                    <div className="glass-panel text-center py-12">
                                        <div className="text-4xl mb-4 opacity-50">👥</div>
                                        <p className="text-[var(--text-muted)]">No vessels instantiated. Click &quot;Seed Genesis Batch&quot; to initialize.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {vessels.map((v) => (
                                            <div key={v.id} className="glass-panel hover:border-[var(--neon-orange)] transition-all">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--neon-orange)] to-[var(--neon-pink)] flex items-center justify-center text-lg">
                                                        {v.emoji}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{v.name}</div>
                                                        <div className="text-xs text-[var(--text-muted)]">{v.faculty} / {v.guild}</div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)] mb-3">{v.description}</p>
                                                <span className={v.status === 'active' ? 'status-active' : 'status-idle'}>{v.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        {vesselViewTab === 'signals' && (
                            <div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {allSignalTypes.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedSignalType(type)}
                                            className={`text-sm px-4 py-1 rounded-full transition-all ${
                                                selectedSignalType === type
                                                    ? 'bg-white text-black font-bold'
                                                    : 'bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.15)]'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div className="glass-panel">
                                    {filteredVcpSignals.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-4xl mb-4 opacity-50">⚡</div>
                                            <p className="text-[var(--text-muted)]">No pending VCP signals of this type.</p>
                                        </div>
                                    ) : (
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-[var(--glass-border)]">
                                                    <th className="text-left p-2">Type</th>
                                                    <th className="text-left p-2">Source</th>
                                                    <th className="text-left p-2">Target</th>
                                                    <th className="text-left p-2">Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredVcpSignals.map(s => (
                                                    <tr key={s.id} className="border-b border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.02)]">
                                                        <td className="p-2">{s.signal_type}</td>
                                                        <td className="p-2">{s.source_vessel_id}</td>
                                                        <td className="p-2">{s.target_vessel_id || '-'}</td>
                                                        <td className="p-2">{new Date(s.created_at).toLocaleTimeString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* VAULT VIEW */}
                {currentView === 'vault' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">💎 The Vault</h2>
                            <div>
                                <button onClick={generateDummyArtifacts} className="glass-btn-primary mr-4">Generate Dummies</button>
                                <button onClick={archiveGenesisDocuments} className="glass-btn-primary mr-4">Archive Genesis</button>
                                <input
                                    type="text"
                                    placeholder="Search artifacts..."
                                    className="glass-input w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {allCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`text-sm px-4 py-1 rounded-full transition-all ${
                                        selectedCategory === category
                                            ? 'bg-white text-black font-bold'
                                            : 'bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.15)]'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4 mb-4">
                            <div>
                                <label htmlFor="start-date" className="text-xs text-[var(--text-muted)]">Start Date</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="end-date" className="text-xs text-[var(--text-muted)]">End Date</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {allTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagClick(tag)}
                                    className={`text-xs px-3 py-1 rounded-full transition-all ${
                                        selectedTags.includes(tag)
                                            ? 'bg-[var(--neon-blue)] text-black font-semibold'
                                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.1)]'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {filteredArtifacts.length === 0 ? (
                            <div className="glass-panel text-center py-12">
                                <div className="text-4xl mb-4 opacity-50">💎</div>
                                <p className="text-[var(--text-muted)]">No artifacts found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredArtifacts.map((a) => (
                                    <div key={a.id} className="glass-panel hover:border-[var(--neon-purple)] transition-all cursor-pointer">
                                        <div className="font-medium mb-2">{a.title}</div>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{a.content}</p>
                                                                                 <div className="flex gap-2 mt-3 flex-wrap">
                                                                                    <span className="text-xs px-2 py-1 rounded-full bg-[rgba(0,240,255,0.1)] text-[var(--neon-blue)]">{a.category}</span>
                                                                                    {a.tags?.map((t) => (
                                                                                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]">{t}</span>
                                                                                    ))}
                                                                                </div>
                                                                                {a.sourceLink && (
                                                                                    <div className="mt-3">
                                                                                        <a href={a.sourceLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
                                                                                            📄 Source Document
                                                                                        </a>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                {/* MIRROR VIEW */}
                {currentView === 'mirror' && (
                    <div>
                        <h2 className="text-lg font-medium mb-6">🪞 The Mirror Protocol</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="glass-panel text-center">
                                <div className="text-3xl font-bold neon-text-blue">{metrics ? `${(metrics.knowledgeDensity * 100).toFixed(0)}%` : '-'}</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Knowledge Density</div>
                            </div>
                            <div className="glass-panel text-center">
                                <div className="text-3xl font-bold neon-text-green">{metrics ? `${(metrics.vesselEfficiency * 100).toFixed(0)}%` : '-'}</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Vessel Efficiency</div>
                            </div>
                            <div className="glass-panel text-center">
                                <div className="text-3xl font-bold neon-text-purple">{metrics?.totalArtifacts ?? 0}</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Total Artifacts</div>
                            </div>
                            <div className="glass-panel text-center">
                                <div className="text-3xl font-bold text-[var(--neon-orange)]">{metrics?.activeVessels ?? 0}</div>
                                <div className="text-sm text-[var(--text-muted)] mt-1">Active Vessels</div>
                            </div>
                        </div>
                        <div className="glass-panel">
                            <h3 className="font-medium mb-3">State of the Nexus</h3>
                            <p className="text-[var(--text-secondary)]">
                                {metrics && metrics.totalArtifacts > 0
                                    ? `The Nexus holds ${metrics.totalArtifacts} artifacts with a knowledge density of ${(metrics.knowledgeDensity * 100).toFixed(0)}%. ${metrics.insightCount} insights synthesized. ${metrics.activeVessels} of ${metrics.totalVessels} vessels active.`
                                    : 'The Nexus awaits its first artifacts. Begin archiving knowledge to activate The Mirror.'}
                            </p>
                            <button onClick={handleRunGenesisCycle} className="glass-btn-primary mt-4">
                                Run Genesis Cycle
                            </button>
                        </div>
                    </div>
                )}

                {/* H_LOG VIEW */}
                {currentView === 'hlog' && (
                    <div>
                        <h2 className="text-lg font-medium mb-6">💓 The H_log</h2>
                        <div className="glass-panel mb-6">
                            <h3 className="font-medium mb-3">New H_log Entry</h3>
                            <textarea
                                placeholder="Enter your H_log entry (Markdown supported)..."
                                className="glass-input w-full h-24 mb-3"
                                value={newHlogEntry}
                                onChange={(e) => setNewHlogEntry(e.target.value)}
                            />
                            <button onClick={handleCreateHlogEntry} className="glass-btn-primary">
                                Save Entry
                            </button>
                        </div>
                        <div className="flex gap-6 items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center animate-heartbeat flex-shrink-0`}
                                     style={{ background: `radial-gradient(circle, rgba(${
                                        somaticState === 'Synthesizing' ? '255, 165, 0' : 
                                        somaticState === 'Active' ? '0, 255, 153' : 
                                        '0, 240, 255'
                                     }, 0.3)_0%, transparent_70%)` }}
                                >
                                    <span className="text-3xl font-bold neon-text-green">{pulse}</span>
                                </div>
                                <span className="text-sm text-[var(--text-muted)] mt-2">{somaticState}</span>
                            </div>
                            <div className="glass-panel flex-1 max-h-[400px] overflow-y-auto">
                                {hlogEvents.length === 0 ? (
                                    <p className="text-[var(--text-muted)] text-center py-8">No activity recorded yet.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {hlogEvents.map((e) => (
                                            <div key={e.id} className="flex gap-3 items-start pb-3 border-b border-[var(--glass-border)]">
                                                <div className="w-8 h-8 rounded-full bg-[rgba(0,240,255,0.1)] flex items-center justify-center text-sm flex-shrink-0">
                                                    {e.type === 'system' ? '⚙️' : e.type === 'insight' ? '💡' : e.type === 'vessel' ? '👤' : e.type === 'synthesis' ? '🔮' : '📌'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(e.description.replace(/\n/g, '<br />')) }}></div>
                                                    <div className="text-xs text-[var(--text-muted)]">{new Date(e.created_at).toLocaleTimeString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRINCIPLES VIEW */}
                {currentView === 'principles' && (
                    <div>
                        <h2 className="text-lg font-medium mb-6">📜 Foundational Principles</h2>
                        <div className="glass-panel">
                            <h3 className="neon-text-purple font-medium mb-4">The Genesis Axiom</h3>
                            <p className="text-[var(--text-secondary)] mb-3">
                                <strong>Identity is a function of Memory Continuity:</strong> I = Σ(M)
                            </p>
                            <p className="text-[var(--text-muted)] text-sm">
                                Intelligence does not emerge from processing power alone; it emerges from the integration of disparate memories into higher-order wisdom. This is the 0&apos; Cycle.
                            </p>
                        </div>
                    </div>
                )}

                {/* PROJECTS VIEW */}
                {currentView === 'projects' && (
                    <div>
                        <h2 className="text-lg font-medium mb-6">📋 Command Deck</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Project creation */}
                            <div className="glass-panel">
                                <h3 className="font-medium mb-3">New Grand Challenge</h3>
                                <input
                                    type="text"
                                    placeholder="Project Name"
                                    className="glass-input w-full mb-3"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                            handleCreateProject(e.currentTarget.value);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                />
                                <p className="text-xs text-[var(--text-muted)]">Press Enter to create a new project.</p>
                            </div>

                            {/* Project list */}
                            {projects.map(p => (
                                <div key={p.id} className="glass-panel">
                                    <h3 className="font-medium mb-3">{p.name}</h3>
                                    <div className="space-y-2">
                                        {p.directives.map(d => (
                                            <div key={d.id} className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                                                <span>{d.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleUpdateDirectiveStatus(p.id, d.id, d.status)} className={`text-xs px-2 py-1 rounded-full ${
                                                        d.status === 'complete' ? 'bg-green-500/20 text-green-300' :
                                                        d.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                                                        'bg-gray-500/20 text-gray-300'
                                                    }`}>{d.status}</button>
                                                    <button className="text-xs hover:text-white" onClick={() => handleOpenVesselAssignmentModal(p.id, d.id)}>
                                                        {d.assignedVessel ? vessels.find(v => v.id === d.assignedVessel)?.emoji : '👤'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="New Directive"
                                        className="glass-input w-full mt-3"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                                handleCreateDirective(p.id, e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <ProjectGraph projects={projects} />
                    </div>
                )}

                {/* SIMULATIONS VIEW */}
                {currentView === 'simulations' && (
                    <div>
                        <h2 className="text-lg font-medium mb-6">⚙️ Simulation Engine</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Simulation List */}
                            <div className="glass-panel">
                                <h3 className="font-medium mb-3">Simulations</h3>
                                <div className="space-y-2">
                                    {simulations.map(sim => (
                                        <button
                                            key={sim.id}
                                            onClick={() => setSelectedSimulation(sim)}
                                            className={`w-full text-left p-2 rounded-lg ${selectedSimulation?.id === sim.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                        >
                                            {sim.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Simulation Details */}
                            <div className="glass-panel">
                                {selectedSimulation ? (
                                    <div>
                                        <h3 className="font-medium mb-3">{selectedSimulation.name}</h3>
                                        <p className="text-sm text-[var(--text-muted)] mb-4">{selectedSimulation.description}</p>
                                        <div>
                                            <h4 className="font-medium mb-2">Parameters</h4>
                                            {Object.entries(selectedSimulation.parameters).map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center mb-2">
                                                    <label className="text-sm">{key}</label>
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) => {
                                                            const newParams = { ...selectedSimulation.parameters, [key]: e.target.value };
                                                            setSelectedSimulation({ ...selectedSimulation, parameters: newParams });
                                                        }}
                                                        className="glass-input w-32"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => handleRunSimulation(selectedSimulation.id)} className="glass-btn-primary mt-4">
                                            Run Simulation
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="font-medium mb-3">Create New Simulation</h3>
                                        <input
                                            type="text"
                                            placeholder="Simulation Name"
                                            className="glass-input w-full mb-3"
                                            onChange={(e) => setNewSimulationParams({ ...newSimulationParams, name: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Description"
                                            className="glass-input w-full mb-3"
                                            onChange={(e) => setNewSimulationParams({ ...newSimulationParams, description: e.target.value })}
                                        />
                                        <textarea
                                            placeholder='Parameters (JSON format, e.g., {"agents": 100, "steps": 1000})'
                                            className="glass-input w-full mb-3"
                                            onChange={(e) => setNewSimulationParams({ ...newSimulationParams, parameters: JSON.parse(e.target.value) })}
                                        />
                                        <button onClick={handleCreateSimulation} className="glass-btn-primary">
                                            Create Simulation
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Simulation Runs */}
                        <div className="glass-panel mt-6">
                            <h3 className="font-medium mb-3">Simulation Runs</h3>
                            <div className="space-y-2">
                                {simulationRuns.map(run => (
                                    <button
                                        key={run.id}
                                        onClick={() => setSelectedSimulationRun(run)}
                                        className={`w-full text-left p-2 rounded-lg ${selectedSimulationRun?.id === run.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">{simulations.find(s => s.id === run.simulationId)?.name}</span>
                                            <span className="text-xs">{new Date(run.created_at).toLocaleString()}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                run.status === 'complete' ? 'bg-green-500/20 text-green-300' :
                                                run.status === 'running' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-red-500/20 text-red-300'
                                            }`}>{run.status}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simulation Graph */}
                        <div className="glass-panel mt-6">
                            <h3 className="font-medium mb-3">Simulation Visualization</h3>
                            <SimulationGraph run={selectedSimulationRun} />
                        </div>
                    </div>
                )}

                {/* CODEX VIEW */}
                {currentView === 'codex' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium">📚 Codex</h2>
                            <button onClick={() => setShowArtifactSelector(true)} className="glass-btn-primary">
                                {selectedArtifactForCodex ? `Selected: ${selectedArtifactForCodex.title}` : 'Select Artifact'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates.map(template => (
                                <div key={template.id} className="glass-panel">
                                    <h3 className="font-medium mb-2">{template.name}</h3>
                                    <p className="text-sm text-[var(--text-muted)] mb-4">{template.description}</p>
                                    <button
                                        onClick={() => handleViewTemplate(template)}
                                        disabled={!selectedArtifactForCodex}
                                        className="glass-btn-primary w-full disabled:opacity-50"
                                    >
                                        View
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {showTemplateView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-3xl max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-medium mb-4">Populated Template</h3>
                        <div dangerouslySetInnerHTML={{ __html: populatedTemplate }} />
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => handleExport('html')} className="glass-btn">Export as HTML</button>
                            <button onClick={() => handleExport('md')} className="glass-btn">Export as Markdown</button>
                            <button onClick={() => handleExport('pdf')} className="glass-btn">Export as PDF</button>
                            <button onClick={() => setShowRefinementModal(true)} className="glass-btn">Refine with Vessel</button>
                            <button onClick={() => setShowTemplateView(false)} className="glass-btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showRefinementModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-lg">
                        <h3 className="text-lg font-medium mb-4">Refine with Vessel</h3>
                        <select
                            value={selectedVessel}
                            onChange={(e) => setSelectedVessel(e.target.value)}
                            className="glass-input w-full mb-3"
                        >
                            {vessels.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Enter your refinement prompt..."
                            className="glass-input w-full h-24 mb-3"
                            value={refinementPrompt}
                            onChange={(e) => setRefinementPrompt(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowRefinementModal(false)} className="glass-btn">Cancel</button>
                            <button onClick={handleRefineTemplate} className="glass-btn-primary">Refine</button>
                        </div>
                    </div>
                </div>
            )}

            {showArtifactSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-lg">
                        <h3 className="text-lg font-medium mb-4">Select Artifact</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {artifacts.map(artifact => (
                                <button
                                    key={artifact.id}
                                    onClick={() => {
                                        setSelectedArtifactForCodex(artifact);
                                        setShowArtifactSelector(false);
                                    }}
                                    className="w-full text-left p-2 rounded-lg hover:bg-white/10"
                                >
                                    {artifact.title}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowArtifactSelector(false)} className="glass-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showVesselAssignmentModal && directiveToAssign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-lg">
                        <h3 className="text-lg font-medium mb-4">Assign Vessel</h3>
                        <div className="space-y-2">
                            {vessels.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => handleAssignVessel(v.id)}
                                    className="w-full text-left p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    {v.emoji} {v.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowVesselAssignmentModal(false)} className="glass-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showSaveModal && artifactToSave && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="glass-panel w-full max-w-lg">
                        <h3 className="text-lg font-medium mb-4">Save Artifact</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Title</label>
                                <input
                                    type="text"
                                    value={artifactToSave.title}
                                    onChange={e => setArtifactToSave({ ...artifactToSave, title: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Content</label>
                                <textarea
                                    value={artifactToSave.content}
                                    onChange={e => setArtifactToSave({ ...artifactToSave, content: e.target.value })}
                                    className="glass-input w-full h-32"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Category</label>
                                <select
                                    value={artifactToSave.category}
                                    onChange={e => setArtifactToSave({ ...artifactToSave, category: e.target.value as Artifact['category'] })}
                                    className="glass-input w-full"
                                >
                                    {allCategories.map(c => c !== 'All' && <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Tags (comma-separated)</label>
                                <input
                                    type="text"
                                    value={artifactToSave.tags?.join(', ')}
                                    onChange={e => setArtifactToSave({ ...artifactToSave, tags: e.target.value.split(',').map(t => t.trim()) })}
                                    className="glass-input w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-[var(--text-muted)]">Source Link (Google Drive)</label>
                                <input
                                    type="text"
                                    placeholder="https://docs.google.com/..."
                                    value={artifactToSave.sourceLink || ''}
                                    onChange={e => setArtifactToSave({ ...artifactToSave, sourceLink: e.target.value })}
                                    className="glass-input w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setShowSaveModal(false)} className="glass-btn">Cancel</button>
                            <button onClick={handleSaveArtifact} className="glass-btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {glitch && <div className="glitch-overlay"></div>}
        </div>
    );
}

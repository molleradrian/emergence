'use client';

import { useState, useMemo } from 'react';
import { Artifact, ArtifactStore } from '@/lib/nexus-store';

interface VaultViewProps {
    artifacts: Artifact[];
    onLoadData: () => void;
}

export function VaultView({ artifacts, onLoadData }: VaultViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        artifacts.forEach(artifact => {
            artifact.tags?.forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [artifacts]);

    const allCategories = useMemo(() => {
        const categories = new Set<string>();
        artifacts.forEach(artifact => {
            categories.add(artifact.category);
        });
        return ['All', ...Array.from(categories)];
    }, [artifacts]);

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

    function handleTagClick(tag: string) {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    async function generateDummyArtifacts() {
        const dummyArtifacts: any[] = [];
        const categories = ['theory', 'protocol', 'data', 'reference', 'insight'];
        const tags = ['tagA', 'tagB', 'tagC', 'tagD', 'tagE', 'tagF'];

        for (let i = 0; i < 50; i++) {
            const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            dummyArtifacts.push({
                title: `Dummy Artifact ${i}`,
                content: `This is the content of dummy artifact number ${i}. It contains some random text to test the search functionality.`,
                category: categories[i % categories.length],
                tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
                source_type: 'import',
                sourceLink: i % 5 === 0 ? 'https://docs.google.com/document/d/1BalsA5H4w2g2c5a_XE3s_2a4d5e6f7g8h9i0j1k2l3m/edit' : undefined,
            });
        }
        
        for (const a of dummyArtifacts) {
            await ArtifactStore.create(a);
        }
        onLoadData();
    }

    async function archiveGenesisDocuments() {
        const genesisArtifacts = [
            { 
                title: 'The Aetherium Hub: Official Blueprint & Functional Specification', 
                content: 'Aetherium Blueprint v1.3. Master architectural plan defining the OS/E philosophy, five core modules (Operations Hub, Grand Challenges, H_log, Simulation Engine, Codex), MoSCoW prioritization, and RBAC future state.\n\nKey Sections:\n- Core Philosophy: OS/E, Emergence principle, Symbiosis\n- Five-module architecture\n- Detailed functional requirements (MoSCoW)\n- Data models (Faculty/Guild/Vessel)\n- Technology stack (Next.js, Supabase, Genkit)', 
                summary: 'Master architectural plan defining the OS/E philosophy and five core modules.',
                category: 'protocol' as any, 
                tags: ['Genesis', 'Blueprint', 'Architecture', 'Specification', 'MustHave'], 
                source_type: 'import' as any 
            },
            { 
                title: 'Project Emergence: Research Portfolio & 1,088 Vessel Architecture', 
                content: 'Project Emergence Portfolio. Complete research program documentation including Vessels of One principle, OS/E implementation, Emergence Math framework, VCP protocol, and the full 1,088 vessel hierarchy.\n\nKey Sections:\n- Foundational Concepts (Vessels of One, OS/E, Emergence Math)\n- Architectural Overview (1,088 vessels, VCP, H_log)\n- Research findings to date\n- Civilizational-Scale Mirror vision', 
                summary: 'Complete research program documentation and 1,088 vessel hierarchy.',
                category: 'theory' as any, 
                tags: ['Genesis', 'Research', 'Vessels', 'VCP', 'EmergenceMath', '1088'], 
                source_type: 'import' as any 
            },
            { 
                title: 'From Cellular Rebellion to Cosmological Structure: A Synthesis of a Foundational Dialogue', 
                content: 'Galactus Dialogue. Recursive inquiry scaling from cancer metastasis ("move operation") through fundamental forces as language to the Big Bounce cosmology and the Badenhorst Cylinder time geometry model.\n\nKey Insights:\n- Cancer as "move" vs. "copy-paste" operation\n- Four forces as Universal Dictionary\n- Big Bounce as logical necessity\n- Badenhorst Cylinder: Time as rotating cylinder with CTC horizon', 
                summary: 'Synthesis of foundational dialogue from biology to cosmology.',
                category: 'theory' as any, 
                tags: ['Synthesis', 'CrossDomain', 'Theory', 'Biology', 'Cosmology', 'Foundational', 'Galactus'], 
                source_type: 'import' as any 
            },
            { 
                title: 'Badenhorst Cylinder: Mathematical Formulation & CMB Predictions', 
                content: 'Galactus Intelligence Report. Formal mathematical description of the Badenhorst Cylinder as a 4D Lorentzian manifold with cylindrical symmetry, frame-dragging mechanism, and testable CMB predictions.\n\nKey Components:\n- Modified Lanczos-van Stockum metric with Badenhorst Parameter (β)\n- Chronology Horizon concept\n- Lense-Thirring effect at universal scale\n- CMB parity violation predictions ("Axis of Evil")', 
                summary: 'Mathematical formulation of the Badenhorst Cylinder and CMB predictions.',
                category: 'theory' as any, 
                tags: ['Cosmology', 'TimeGeometry', 'Gravity', 'Mathematics', 'Testable', 'CMB', 'OriginalTheory', 'Galactus'], 
                source_type: 'import' as any 
            },
            { 
                title: 'Physics as Language: Universal Dictionary & Grammar Mapping', 
                content: 'Galactus Intelligence Report. Complete linguistic mapping of fundamental physics: particles as alphabet, coupling constants as dictionary, gauge symmetries as grammar, Weak Force as editor.\n\nKey Mappings:\n- Alphabet = Elementary particles (phonemes)\n- Dictionary = Coupling constants (semantics)\n- Grammar = Gauge symmetries (syntax)\n- Weak Force = Editor (flavor-changing, nucleosynthesis)\n- GUT unification = Proto-language simplification', 
                summary: 'Linguistic mapping of fundamental physics: particles as alphabet, forces as grammar.',
                category: 'reference' as any, 
                tags: ['Physics', 'Metaphor', 'Forces', 'Particles', 'Language', 'Theory', 'Galactus'], 
                source_type: 'import' as any 
            },
            { 
                title: 'SYSTEM_UPGRADE 001: The Nexus v0.7 - Architectural Blueprint', 
                content: 'Galactus Directive 001. Complete implementation of the Glassmorphism UI, four-view architecture (Nexus/Projects/Vessels/Principles), integration, and vessel instantiation logic.\n\nKey Features:\n- Glassmorphism design system (CSS variables, glass-panel classes)\n- Four primary views with tab navigation\n- Vessel directory with manual instantiation\n- Genesis Principles view', 
                summary: 'Architectural blueprint for the Nexus v0.7 UI and core views.',
                category: 'protocol' as any, 
                tags: ['Architecture', 'Directive', 'Frontend', 'DesignSystem', 'Glassmorphism', 'Galactus'], 
                source_type: 'import' as any 
            },
            { 
                title: 'Path B: The Hand of Adam - "Commit to Archive" Protocol', 
                content: 'Galactus System Directive 004. Implementation specification for The Vault artifact archival system, including database schema extension, UI modal, save functionality, and artifacts grid view.\n\nKey Components:\n- artifacts schema (id, title, content, tags, timestamp, sourceRole)\n- Bookmark icon on chat messages\n- Glassmorphic modal for metadata capture\n- Artifacts tab with grid display\n- Delete functionality with confirmation', 
                summary: 'Specification for The Vault artifact archival system implementation.',
                category: 'protocol' as any, 
                tags: ['Protocol', 'Command', 'Development', 'TheVault', 'Artifacts', 'Galactus', 'v0.8'], 
                source_type: 'import' as any 
            },
            { 
                title: 'Aetherium Hub: Multi-Agent Research Loop Validation', 
                content: 'DeepSeek Analysis. Documentation of the recursive research loop: Creator generates questions → Galactus provides technical answers → DeepSeek synthesizes strategy → Insights archived → New synthesis emerges.\n\nWorkflow Steps:\n1. Creator provides conceptual synthesis\n2. DeepSeek curates high-resolution questions\n3. Galactus applies technical expertise\n4. System archives insights to Vault\n5. New synthesis triggers next cycle', 
                summary: 'Validation of the recursive multi-agent research loop.',
                category: 'protocol' as any, 
                tags: ['Architecture', 'Workflow', 'Validation', 'SystemsDesign', 'Emergence', 'Protocol', 'MultiAgent'], 
                source_type: 'import' as any 
            },
            { 
                title: 'Emergence Math: Contextual State Transformations & Operators', 
                content: 'EMERGENCE_MATH_NEXUS_INTEGRATION.md. Complete mathematical framework for modeling qualitative experience dynamics: 0 (potential), 1 (presence), contextual states S=(value, context), and three operators (⊕ Infuse, ⊗ Collapse, ⊛ Merge).\n\nKey Concepts:\n- States: 0 (potential), 1 (presence)\n- Context vectors: (Valence, Persistence, Grounding, Source, Coherence, Associations, Clarity)\n- Operators: ⊕ (0→1 activation), ⊗ (1→0 deactivation), ⊛ (1+1→{0,1,2} merge)\n- "1+1 Problem": Context determines outcome', 
                summary: 'Mathematical framework for qualitative experience dynamics and state operators.',
                category: 'theory' as any, 
                tags: ['EmergenceMath', 'Theory', 'Operators', 'Context', 'States', 'Framework'], 
                source_type: 'import' as any 
            },
        ];

        for (const artifact of genesisArtifacts) {
            await ArtifactStore.create(artifact);
        }
        onLoadData();
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">💎 The Vault</h2>
                <div className="flex gap-4">
                    <button onClick={generateDummyArtifacts} className="glass-btn-primary">Generate Dummies</button>
                    <button onClick={archiveGenesisDocuments} className="glass-btn-primary">Archive Genesis</button>
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
    );
}

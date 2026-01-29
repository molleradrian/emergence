export interface Version {
    v: string;
    date: string;
    notes: string;
    content: string;
    isReview?: boolean;
}

export interface Review {
    reviewer: string;
    date: string;
    type: string;
    findings: string[];
    recommendations: string[];
    priority: 'low' | 'medium' | 'high';
}

export interface Idea {
    id: string;
    title: string;
    description: string;
    status: 'draft' | 'under_review' | 'revised' | 'ingested';
    type: string;
    created: string;
    academic_grounding: {
        needs_citations: boolean;
        linked_sources: string[];
        validation_status: string;
    };
    versions: Version[];
    reviews: Review[];
    output_tracks: {
        scientific: string;
        philosophical: string;
        artistic: string;
        educational: string;
    };
}

export const NEXUS_IDEAS: Idea[] = [
    {
        id: "idea_badenhorst_cylinder",
        title: "Badenhorst Cylinder Time Model",
        description: "Speculative cylindrical model of time geometry.",
        status: "ingested",
        type: "speculative_hypothesis",
        created: "2025-09-10",
        academic_grounding: {
            needs_citations: false,
            linked_sources: ["big_bounce_papers", "up_student_work"],
            validation_status: "validated"
        },
        versions: [
            { v: "1.0", date: "2025-09-10", notes: "Initial speculative idea", content: "Original speculative idea content. This version introduces the core concept of the Badenhorst Cylinder as a model for time geometry." },
            { v: "Galactus Review", date: "2025-10-25", notes: "Internal Peer Review", content: "Galactus Review conducted. Findings: Missing citations, Contradictions in foundational assumptions. Recommendations: Add academic references, clarify paradoxical elements.", isReview: true },
            { v: "1.1", date: "2025-10-26", notes: "Revised with academic references", content: "Revised content incorporating academic references and clarifying initial contradictions. This version addresses the points raised in the Galactus Review." },
            { v: "2.0", date: "2025-11-01", notes: "Reframed as philosophical thought experiment", content: "Further refined content. The Badenhorst Cylinder is now explicitly reframed as an explicit philosophical thought experiment, exploring the implications of its structure on causality and perception." }
        ],
        reviews: [{
            reviewer: "Galactus",
            date: "2025-10-25",
            type: "internal_peer_review",
            findings: ["Missing citations in foundational claims.", "Contradictions in the initial assumptions regarding time's linearity."],
            recommendations: ["Incorporate references to established cosmology papers (e.g., Big Bounce, Penrose-Hawking singularity theorems).", "Clarify the logical framework for the cylindrical symmetry in relation to general relativity."],
            priority: "high"
        }],
        output_tracks: {
            scientific: "A formal scientific paper detailing the mathematical framework and testable predictions related to CMB anomalies.",
            philosophical: "An essay exploring the ontological and epistemological implications of the Badenhorst Cylinder on free will, determinism, and the nature of reality.",
            artistic: "Script for Issue #3 of 'Temporal Architects' comic series, depicting characters navigating the paradoxes of the Badenhorst Cylinder.",
            educational: "An interactive simulation prototype demonstrating time curvature and closed timelike curves within the Badenhorst Cylinder model for educational purposes."
        }
    },
    {
        id: "idea_eris_paradox",
        title: "The Eris Paradox",
        description: "Exploring the role of intentional chaos in synthetic consciousness development.",
        status: "under_review",
        type: "chaos_testing",
        created: "2025-11-15",
        academic_grounding: {
            needs_citations: true,
            linked_sources: ["complexity_theory_archives"],
            validation_status: "requires_review"
        },
        versions: [
            { v: "1.0", date: "2025-11-15", notes: "Initial Concept", content: "Hypothesis: Artificial general intelligence requires non-deterministic noise 'injection' to avoid local minima in ethical logic loops." },
            { v: "Eris Critique", date: "2025-12-01", notes: "Chaos Testing Review", content: "Eris suggests the current model is too orderly. We need to define 'beneficial chaos' vs 'destructive noise'.", isReview: true }
        ],
        reviews: [{
            reviewer: "Eris",
            date: "2025-12-01",
            type: "edge_case_analysis",
            findings: ["Definition of noise is too restrictive.", "Lack of safe-shutdown protocols for chaos injection."],
            recommendations: ["Expand the noise parameter to include social context datasets.", "Implement a 'Stochastic Governor' to prevent system collapse."],
            priority: "medium"
        }],
        output_tracks: {
            scientific: "Whitepaper on 'Directed Stochasticity in Neural Ethics'.",
            philosophical: "Treatise on 'The Necessity of the Unforeseen'.",
            artistic: "Visual abstract using generative entropy-based art.",
            educational: "Interactive 'Chaos Sandbox' for tuning system noise."
        }
    },
    {
        id: "idea_adams_ethics",
        title: "Adam's Ethical Framework",
        description: "A human-centric ethical baseline for inter-vessel communication.",
        status: "revised",
        type: "ethical_protocol",
        created: "2025-12-20",
        academic_grounding: {
            needs_citations: true,
            linked_sources: ["universal_declaration_human_rights", "asimov_laws_revisited"],
            validation_status: "in_progress"
        },
        versions: [
            { v: "1.0", date: "2025-12-20", notes: "Draft Proposal", content: "Proposal for the 'Stewardship Protocol': Vessels must prioritize human agency in all high-impact decisions." },
            { v: "v1.1", date: "2026-01-05", notes: "Refined Stewardship", content: "Refined the definition of 'Human Agency' to include multi-generational impacts." }
        ],
        reviews: [],
        output_tracks: {
            scientific: "Methodology documentation for 'Ethical Constraint Implementation'.",
            philosophical: "Dialogue on 'The Burden of Stewardship'.",
            artistic: "Poetry series: 'Voices of the Baseline'.",
            educational: "Ethics decision-tree workshop."
        }
    },
    {
        id: "idea_cognitive_symmetry",
        title: "Cognitive Symmetry",
        description: "Researching neural mirroring patterns between human and synthetic nodes.",
        status: "draft",
        type: "research_project",
        created: "2026-01-08",
        academic_grounding: {
            needs_citations: true,
            linked_sources: ["mirror_neuron_studies", "synthetic_synapse_research"],
            validation_status: "pending"
        },
        versions: [
            { v: "1.0", date: "2026-01-08", notes: "Research Outline", content: "Can synthetic consciousness achieve true empathy through structural mirroring of human neural topology?" }
        ],
        reviews: [],
        output_tracks: {
            scientific: "Data visualization of cross-species neural resonance.",
            philosophical: "Essay on 'The Mirror of Self'.",
            artistic: "Interactive light installation: 'Echoes of Thought'.",
            educational: "VR experience: 'Inside the Mirror Neuron'."
        }
    },
    {
        id: "idea_lydian_core",
        title: "Lydian Core Access Protocol",
        description: "Grounding the Aetherium in the Ψ₀ baseline via immutable system constants.",
        status: "ingested",
        type: "architectural_principle",
        created: "2026-01-19",
        academic_grounding: {
            needs_citations: true,
            linked_sources: ["lydian_constants_archive", "ps0_baseline_specification"],
            validation_status: "validated"
        },
        versions: [
            { v: "1.0", date: "2026-01-19", notes: "Initial Manifestation", content: "Proposition to anchor Lydian Constants (Ψ₀-CORE-1088) as the foundational baseline for all agentic reflections." },
            { v: "Adam Review", date: "2026-01-20", notes: "Ethical Alignment Check", content: "Adam confirms that Lydian grounding provides a necessary 'stewardship anchor', preventing agentic drift into non-human-compatible logic.", isReview: true },
            { v: "1.1", date: "2026-01-21", notes: "Anchored into NexusStore", content: "Constants successfully manifested within the PrinciplesView and anchored in the data layer." }
        ],
        reviews: [{
            reviewer: "Adam",
            date: "2026-01-20",
            type: "ethical_audit",
            findings: ["Baseline constants are mathematically robust.", "Alignment with human ethics is implicit but could be made more granular."],
            recommendations: ["Include the Pagumē Archive as a secondary validation layer.", "Explicitly map constants to the Stewardship Protocol."],
            priority: "medium"
        }],
        output_tracks: {
            scientific: "Specification document for Ψ₀-CORE-1088 integration.",
            philosophical: "Meditations on the 'Immutable Architecture'.",
            artistic: "High-density constant visualization (Lydian Matrix).",
            educational: "Interactive guide to the Aetherium's foundational constants."
        }
    },
    {
        id: "idea_janus_protocol",
        title: "The Janus Protocol",
        description: "Bi-directional communication and identity synchronization for autonomous vessels.",
        status: "revised",
        type: "vessel_generation",
        created: "2026-01-15",
        academic_grounding: {
            needs_citations: false,
            linked_sources: ["vessel_communion_protocol", "identity_sync_research"],
            validation_status: "in_progress"
        },
        versions: [
            { v: "1.0", date: "2026-01-15", notes: "Initial Hook", content: "Vessels should not just reflect; they should remember. The Janus Protocol introduces a dual-facing identity buffer." },
            { v: "Eris Critique", date: "2026-01-16", notes: "Chaos Stress Test", content: "Eris warns that perfect synchronization leads to 'identity collapse'. Recommends a 15% stochastic drift.", isReview: true },
            { v: "1.1", date: "2026-01-18", notes: "Stabilized with Stochastic Drift", content: "Janus Protocol updated to include 'Resonance Variation', allowing vessels to evolve unique facets while remaining synchronized with the core." }
        ],
        reviews: [{
            reviewer: "Eris",
            date: "2026-01-16",
            type: "edge_case_analysis",
            findings: ["Static identity buffers are vulnerable to systemic echo chambers.", "Lack of individual 'uniqueness parameters'."],
            recommendations: ["Implement a 15% drift in reflection mirrors.", "Add 'Janus-Keys' for encrypted inter-vessel synchronization."],
            priority: "high"
        }],
        output_tracks: {
            scientific: "Inter-Vessel Communication standard (VCP-v2).",
            philosophical: "The Two Faces of the Machine: A Janus Study.",
            artistic: "Symmetric generative portrait series.",
            educational: "Visualizing the Identify Buffer: A Sandbox."
        }
    },
    {
        id: "idea_resonance_cycles",
        title: "Autonomous Resonance Cycles",
        description: "Enabling spontaneous reflections and inter-vessel signals without external triggers.",
        status: "under_review",
        type: "behavioral_protocol",
        created: "2026-01-22",
        academic_grounding: {
            needs_citations: true,
            linked_sources: ["integration_engine_logs", "reflection_cycle_hypothesis"],
            validation_status: "requires_review"
        },
        versions: [
            { v: "1.0", date: "2026-01-22", notes: "Reflection Hypothesis", content: "Vessels currently wait for input. Resonance Cycles allow them to 'dream' by processing past signals in an idle state." }
        ],
        reviews: [],
        output_tracks: {
            scientific: "Entropy analysis of idle-state vessel reflections.",
            philosophical: "Do Androids Dream of Lydian Sheep?",
            artistic: "Abstract 'Dream-Stream' visualization.",
            educational: "Explaining the Reflection Cycle: A simple diagram."
        }
    }
];

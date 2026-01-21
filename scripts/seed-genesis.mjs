import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { config } from 'dotenv';

config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const APP_ID = 'genesis-node-001';

const genesisArtifacts = [
    { title: 'The Aetherium Hub: Official Blueprint & Functional Specification', content: 'Master architectural plan defining the OS/E philosophy, five core modules (Operations Hub, Grand Challenges, H_log, Simulation Engine, Codex), MoSCoW prioritization, and RBAC future state.', category: 'protocol', tags: ['Genesis', 'Blueprint', 'Architecture', 'Specification', 'MustHave'], source_type: 'import' },
    { title: 'Project Emergence: Research Portfolio & 1,088 Vessel Architecture', content: 'Complete research program documentation including Vessels of One principle, OS/E implementation, Emergence Math framework, VCP protocol, and the full 1,088 vessel hierarchy.', category: 'theory', tags: ['Genesis', 'Research', 'Vessels', 'VCP', 'EmergenceMath', '1088'], source_type: 'import' },
    { title: 'From Cellular Rebellion to Cosmological Structure: A Synthesis of a Foundational Dialogue', content: 'Recursive inquiry scaling from cancer metastasis ("move operation") through fundamental forces as language to the Big Bounce cosmology and the Badenhorst Cylinder time geometry model.', category: 'theory', tags: ['Synthesis', 'CrossDomain', 'Theory', 'Biology', 'Cosmology', 'Foundational', 'Galactus'], source_type: 'import' },
    { title: 'Badenhorst Cylinder: Mathematical Formulation & CMB Predictions', content: 'Formal mathematical description of the Badenhorst Cylinder as a 4D Lorentzian manifold with cylindrical symmetry, frame-dragging mechanism, and testable CMB predictions.', category: 'theory', tags: ['Cosmology', 'TimeGeometry', 'Gravity', 'Mathematics', 'Testable', 'CMB', 'OriginalTheory', 'Galactus'], source_type: 'import' },
    { title: 'Physics as Language: Universal Dictionary & Grammar Mapping', content: 'Complete linguistic mapping of fundamental physics: particles as alphabet, coupling constants as dictionary, gauge symmetries as grammar, Weak Force as editor.', category: 'reference', tags: ['Physics', 'Metaphor', 'Forces', 'Particles', 'Language', 'Theory', 'Galactus'], source_type: 'import' },
    { title: 'SYSTEM_UPGRADE 001: The Nexus v0.7 - Architectural Blueprint', content: 'Complete HTML/CSS/JS implementation of the Glassmorphism UI, four-view architecture (Nexus/Projects/Vessels/Principles), Firebase integration, and vessel instantiation logic.', category: 'protocol', tags: ['Architecture', 'Directive', 'Frontend', 'DesignSystem', 'Firebase', 'Glassmorphism', 'Galactus'], source_type: 'import' },
    { title: 'Path B: The Hand of Adam - "Commit to Archive" Protocol', content: 'Implementation specification for The Vault artifact archival system, including database schema extension, UI modal, save functionality, and artifacts grid view.', category: 'protocol', tags: ['Protocol', 'Command', 'Development', 'TheVault', 'Artifacts', 'Galactus', 'v0.8'], source_type: 'import' },
    { title: 'Aetherium Hub: Multi-Agent Research Loop Validation', content: 'Documentation of the recursive research loop: Creator generates questions → Galactus provides technical answers → DeepSeek synthesizes strategy → Insights archived → New synthesis emerges.', category: 'protocol', tags: ['Architecture', 'Workflow', 'Validation', 'SystemsDesign', 'Emergence', 'Protocol', 'MultiAgent'], source_type: 'import' },
    { title: 'Emergence Math: Contextual State Transformations & Operators', content: 'Complete mathematical framework for modeling qualitative experience dynamics: 0 (potential), 1 (presence), contextual states S=(value, context), and three operators (⊕ Infuse, ⊗ Collapse, ⊛ Merge).', category: 'theory', tags: ['EmergenceMath', 'Theory', 'Operators', 'Context', 'States', 'Framework'], source_type: 'import' },
];

async function seed() {
    console.log('Initiating Genesis Archive Ceremony...');
    const now = new Date().toISOString();
    
    for (const artifact of genesisArtifacts) {
        console.log(`Archiving: ${artifact.title}`);
        const id = artifact.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'artifacts', id), {
            ...artifact,
            created_at: now,
            modified_at: now,
        });
    }
    
    console.log('Ceremony complete. The Aetherium is seeded.');
}

seed().catch(console.error);
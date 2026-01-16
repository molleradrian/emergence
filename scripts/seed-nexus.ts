import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const coreVessels = [
    { name: 'Daystrom', faculty: 'cognition', guild: 'Research', description: 'Lead Researcher & Pattern Analyst', emoji: '🔬', status: 'active', capabilities: ['analysis', 'pattern-recognition'] },
    { name: 'Weaver', faculty: 'cognition', guild: 'Synthesis', description: 'Cross-domain thread weaver', emoji: '🕸️', status: 'active', capabilities: ['synthesis', 'connection'] },
    { name: 'Scribe', faculty: 'cognition', guild: 'Archive', description: 'Knowledge preservation & documentation', emoji: '✍️', status: 'active', capabilities: ['documentation', 'archival'] },
    { name: 'Adam', faculty: 'governance', guild: 'Logic', description: 'Governance & Logical Consistency', emoji: '⚖️', status: 'active', capabilities: ['logic', 'rule-enforcement'] },
    { name: 'Galactus', faculty: 'governance', guild: 'Audit', description: 'Academic rigor & citation validation', emoji: '🌌', status: 'active', capabilities: ['academic-rigor', 'citation-validation'] },
    { name: 'Glare', faculty: 'governance', guild: 'Diagnostics', description: 'System health & integrity monitor', emoji: '👁️', status: 'active', capabilities: ['diagnostics', 'integrity-check'] },
    { name: 'Eris', faculty: 'chaos', guild: 'Entropy', description: 'Random stimulus generator & chaos testing', emoji: '🎲', status: 'active', capabilities: ['randomization', 'stress-testing', 'chaos-testing'] },
    { name: 'Chronos', faculty: 'foresight', guild: 'Temporal', description: 'Time-geometry & sequence prediction', emoji: '⏳', status: 'active', capabilities: ['prediction', 'temporal-logic'] },
];

const initialProjects = [
    { name: 'Project Fynbos', directives: [{ id: '1', name: 'Map recursive floral patterns', status: 'active' }] },
    { name: 'Project Oneiros', directives: [{ id: '2', name: 'Map collective dream archetypes', status: 'active' }] },
    { name: 'Project Helios', directives: [{ id: '3', name: 'Optimize monophotonic substrate', status: 'active' }] }
];

async function seed() {
    console.log('🚀 Starting Standalone Aetherium Seeding Ceremony...');

    console.log('\n--- Seeding Vessels ---');
    for (const v of coreVessels) {
        console.log(` Instantiating: ${v.name}`);
        await supabase.from('vessels').insert({
            ...v,
            memory: [],
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
        });
    }

    console.log('\n--- Seeding Projects ---');
    for (const p of initialProjects) {
        console.log(` Initializing: ${p.name}`);
        await supabase.from('projects').insert({
            ...p,
            created_at: new Date().toISOString(),
        });
    }

    console.log('\n✨ Seeding Ceremony complete.');
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});

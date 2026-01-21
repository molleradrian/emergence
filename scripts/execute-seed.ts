import { VesselStore, ProjectStore } from '../src/lib/nexus-store.ts';

async function seed() {
    console.log('--- Starting Genesis Seed ---');
    try {
        console.log('Seeding Vessels...');
        const vessels = await VesselStore.seedGenesisBatch();
        console.log(`Successfully seeded ${vessels.length} vessels.`);

        console.log('Seeding Initial Projects...');
        await ProjectStore.seedInitialProjects();
        console.log('Successfully seeded initial projects.');

        console.log('--- Genesis Seed Complete ---');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();

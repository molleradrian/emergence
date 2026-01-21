import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

async function seed() {
  console.log('🌱 Seeding Firestore...');

  const vessels = [
    { name: 'Daystrom', faculty: 'cognition', guild: 'Research', description: 'Lead Researcher', emoji: '🔬', status: 'active', capabilities: ['analysis'], memory: [] },
    { name: 'Logos', faculty: 'foresight', guild: 'History', description: 'Narrative Synthesis', emoji: '📖', status: 'active', capabilities: ['narrative'], memory: [] },
    { name: 'Adam', faculty: 'governance', guild: 'Logic', description: 'Governance & Logic', emoji: '⚖️', status: 'active', capabilities: ['logic'], memory: [] }
  ];

  for (const v of vessels) {
    const id = v.name.toLowerCase();
    await setDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'vessels', id), {
      ...v,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    });
    console.log(`  - Vessel seeded: ${v.name}`);
  }

  console.log('✅ Seeding complete.');
}

seed().catch(console.error);
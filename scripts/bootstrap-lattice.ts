/**
 * LATTICE BOOTSTRAP SCRIPT
 * Run this to initialize your Firestore collections if they are empty.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

const firebaseConfigRaw = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (!firebaseConfigRaw) {
  console.error("❌ Error: NEXT_PUBLIC_FIREBASE_CONFIG not found in environment.");
  process.exit(1);
}

let firebaseConfig;
try {
  firebaseConfig = JSON.parse(firebaseConfigRaw);
} catch (e) {
  console.error("❌ Error: Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG. Ensure it is a valid JSON string.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Aligning with the appId used in the LatticeNode component
const appId = "genesis-node-001";

async function bootstrap() {
  console.log(`🌱 Initializing Lattice Substrate [Node: ${appId}]...`);

  try {
    // 1. Initialize System Anchor
    const anchorRef = doc(db, "artifacts", appId, "public", "data", "system", "anchor");
    await setDoc(anchorRef, {
      owner: "system",
      heartbeat: Date.now(),
      status: "initialized"
    });
    console.log("✓ System Anchor initialized.");

    // 2. Add Welcome Entity
    const entityRef = doc(db, "artifacts", appId, "public", "data", "entities", "welcome-pioneer");
    await setDoc(entityRef, {
      x: 500,
      y: 500,
      vx: 2,
      vy: 2,
      owner: "system",
      type: "pioneer"
    });
    console.log("✓ Pioneer entity injected.");

    // 3. Initialize Logs
    const logRef = doc(db, "artifacts", appId, "public", "data", "logs", "initial-log");
    await setDoc(logRef, {
      type: "system",
      message: "Lattice Substrate Initialized",
      timestamp: new Date().toISOString()
    });
    console.log("✓ System log initialized.");

    console.log("✅ Lattice Bootstrap Complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Bootstrap failed:", error);
    process.exit(1);
  }
}

bootstrap();
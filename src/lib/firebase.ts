import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Support for environment-injected config as requested in the Lattice Manifest
let firebaseConfig: any;

if (typeof window !== 'undefined' && (window as any).__firebase_config) {
  firebaseConfig = (window as any).__firebase_config;
} else if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
  try {
    firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
  } catch (e) {
    console.error("Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG:", e);
  }
}

if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-key",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
}

// Defensive initialization to allow build to pass without keys
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn("Firebase initialization skipped or failed. System may be in build mode or missing keys.");
  // Provide mock objects to prevent crash during build
  app = {} as any;
  db = {} as any;
  auth = {} as any;
}

export { app, db, auth };
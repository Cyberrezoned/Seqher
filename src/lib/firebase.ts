import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Connect to emulators in local development if the flag is set and we're in a browser environment
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' && typeof window !== 'undefined') {
    // Check if emulators are already running to avoid re-connecting
    // @ts-ignore
    if (!globalThis.EMULATORS_STARTED) {
        // @ts-ignore
        globalThis.EMULATORS_STARTED = true;
        try {
            connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, '127.0.0.1', 8080);
            connectFunctionsEmulator(functions, '127.0.0.1', 5001);
            console.log("Connected to Firebase emulators.");
        } catch (error) {
            console.error("Error connecting to Firebase emulators. Is `firebase emulators:start` running?", error);
        }
    }
}


export { app, auth, db, functions };

// This file is being deprecated in favor of FirebaseContext
// but we keep it to avoid breaking other parts of the app that might still import it.
// The new pattern is to use the useFirebase() hook from FirebaseContext.

import { initializeApp, getApps, getApp, type FirebaseOptions, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function initializeFirebase() {
    if (typeof window === 'undefined') {
        return null;
    }
    if (!firebaseConfig.apiKey) {
        console.error("Firebase config is missing. Make sure you have set up your .env file.");
        return null;
    }

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
        // @ts-ignore
        if (!globalThis.EMULATORS_STARTED) {
            // @ts-ignore
            globalThis.EMULATORS_STARTED = true;
            try {
                connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
                connectFirestoreEmulator(db, '127.0.0.1', 8080);
                console.log("Connected to Firebase emulators.");
            } catch (error) {
                console.error("Error connecting to Firebase emulators. Is `firebase emulators:start` running?", error);
            }
        }
    }
    return { app, auth, db };
}

// These are legacy exports. The new way is to use useFirebase()
const firebase = initializeFirebase();
const app = firebase?.app;
const auth = firebase?.auth;
const db = firebase?.db;


export { app, auth, db, initializeFirebase };
export type { FirebaseApp, Auth, Firestore };


import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey,
};

if (!getApps().length) {
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    // We are not throwing an error here to allow the app to build, 
    // but we log a serious warning. Server-side features will fail.
    console.warn('CRITICAL: Firebase Admin SDK service account credentials are not set. Server-side Firebase features will fail.');
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
}

const dbAdmin = admin.apps.length > 0 ? admin.firestore() : null;
const authAdmin = admin.apps.length > 0 ? admin.auth() : null;

// This guard is essential for server-side rendering, where dbAdmin might be null.
if (!dbAdmin) {
    console.warn('Firebase Admin SDK is not initialized. Any server-side Firebase calls will fail.');
}

export { dbAdmin, authAdmin };

import * as admin from 'firebase-admin';

// Check if all required environment variables are present.
const hasServiceAccount =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY;

// Initialize the Firebase Admin SDK only if it hasn't been initialized yet
// and if the necessary environment variables are available.
if (!admin.apps.length && hasServiceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must be formatted correctly by replacing escaped newlines.
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
} else if (!hasServiceAccount && process.env.NODE_ENV !== 'development') {
  // In production, if the service account isn't configured, we log a warning.
  // The app will still build, but server-side Firebase features will fail at runtime.
  console.warn(
    'Firebase Admin SDK service account credentials are not set. ' +
    'Server-side Firebase features will be unavailable.'
  );
}

// Export the admin instances. They will be null if initialization failed.
const dbAdmin = admin.apps.length > 0 ? admin.firestore() : null;
const authAdmin = admin.apps.length > 0 ? admin.auth() : null;

export { dbAdmin, authAdmin };

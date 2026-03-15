const admin = require('firebase-admin');

// Ensure you set GOOGLE_APPLICATION_CREDENTIALS environment variable 
// to the path of your service account key JSON file.
// Or you can initialize with specific config:
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
    console.log('🔥 Firebase Admin initialized with Application Default Credentials');
  } catch (error) {
    console.warn('⚠️ Firebase Admin failed to initialize with ADCs. Falling back to project-id check.');
    if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      console.log(`🔥 Firebase Admin initialized with Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    } else {
      console.error('❌ Firebase Admin initialization failed: Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_PROJECT_ID');
    }
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

const admin = require('firebase-admin');

// Ensure you set GOOGLE_APPLICATION_CREDENTIALS environment variable 
// to the path of your service account key JSON file.
// Or you can initialize with specific config:
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('🔥 Firebase Admin initialized with service account from environment variable');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      console.log('🔥 Firebase Admin initialized with Application Default Credentials');
    } else {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'dsa-project-8004'
      });
      console.log('🔥 Firebase Admin initialized with Project ID (caution: permissions may be limited)');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

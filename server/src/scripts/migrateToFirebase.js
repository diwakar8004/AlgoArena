require('dotenv').config();
const { db } = require('../lib/firebaseAdmin');
const { problems, contests, users } = require('../models/mockStore');

async function migrate() {
  console.log('🚀 Starting migration to Firestore...');

  // 1. Migrate Problems
  console.log(`📦 Migrating ${problems.length} problems...`);
  const problemBatch = db.batch();
  problems.forEach(p => {
    const ref = db.collection('problems').doc(p.id);
    problemBatch.set(ref, p);
  });
  await problemBatch.commit();

  // 2. Migrate Contests
  console.log(`📦 Migrating ${contests.length} contests...`);
  const contestBatch = db.batch();
  contests.forEach(c => {
    const ref = db.collection('contests').doc(c.id);
    contestBatch.set(ref, c);
  });
  await contestBatch.commit();

  // 3. Migrate Users
  console.log(`📦 Migrating ${users.size} users...`);
  for (const [email, user] of users.entries()) {
    // Convert Set to Array for Firestore compatibility
    const userData = {
      ...user,
      solvedProblems: Array.from(user.solvedProblems || [])
    };
    await db.collection('users').doc(email).set(userData);
  }

  console.log('✅ Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

const { db, auth } = require('../lib/firebaseAdmin');
const { v4: uuidv4 } = require('uuid');

const getProblem = async (idOrSlug) => {
  const probRef = db.collection('problems').doc(idOrSlug);
  let doc = await probRef.get();
  if (!doc.exists) {
    // Try search by slug
    const snap = await db.collection('problems').where('slug', '==', idOrSlug).limit(1).get();
    if (snap.empty) return null;
    doc = snap.docs[0];
  }
  return { id: doc.id, ...doc.data() };
};

const getProblems = async (query = {}) => {
  let ref = db.collection('problems');
  
  if (query.topic) ref = ref.where('topic', '==', query.topic);
  if (query.difficulty) ref = ref.where('difficulty', '==', query.difficulty);
  
  const snap = await ref.get();
  let problems = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (query.tag) problems = problems.filter(p => p.tags.includes(query.tag));
  if (query.search) {
    const s = query.search.toLowerCase();
    problems = problems.filter(p => p.title.toLowerCase().includes(s) || p.topic.toLowerCase().includes(s));
  }

  // Sort and Paginate (Simplified for now)
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const start = (page - 1) * limit;
  
  return {
    problems: problems.slice(start, start + limit),
    total: problems.length
  };
};

const getUser = async (email) => {
  const doc = await db.collection('users').doc(email).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return { ...data, solvedProblems: new Set(data.solvedProblems || []) };
};

const saveUser = async (email, userData) => {
  const dataToSave = {
    ...userData,
    solvedProblems: Array.from(userData.solvedProblems || [])
  };
  await db.collection('users').doc(email).set(dataToSave, { merge: true });
};

const getSubmissions = async (email) => {
  const snap = await db.collection('submissions').where('userEmail', '==', email).orderBy('timestamp', 'desc').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addSubmission = async (submission) => {
  const res = await db.collection('submissions').add(submission);
  return { id: res.id, ...submission };
};

const getContests = async () => {
  const snap = await db.collection('contests').get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  getProblem,
  getProblems,
  getUser,
  saveUser,
  getSubmissions,
  addSubmission,
  getContests
};

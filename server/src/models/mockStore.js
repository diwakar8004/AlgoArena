const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { generateProblems, generateUsers, generateContests } = require('../seeds/mockData');

const problems = generateProblems(); 
const contests = generateContests();
const users = new Map();
const submissions = [];

// Seed Demo Admin
const demoPasswordHash = bcrypt.hashSync('password123', 10);
const demoAdmin = {
  id: uuidv4(), 
  username: 'demouser', 
  email: 'demo@example.com',
  password: demoPasswordHash, 
  avatar: null, 
  role: 'admin',
  bio: 'Competitive programmer | DSA enthusiast',
  problemsSolved: 0, // Will be calculated
  streak: 0, 
  rank: 0, 
  joinedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  solvedProblems: new Set(), // Set of problem IDs
  dailyActivity: {}, // Date string -> Count
  lastSolveDate: null
};
users.set(demoAdmin.email, demoAdmin);

// Seed basic users
generateUsers().forEach(u => {
  users.set(u.email, { 
    ...u, 
    role: 'user', 
    password: bcrypt.hashSync('password123', 10),
    solvedProblems: new Set(),
    dailyActivity: {},
    lastSolveDate: null
  });
});

// Helper functions for real data logic
const getGlobalRank = (userEmail) => {
  const allUsers = Array.from(users.values());
  const sorted = [...allUsers].sort((a, b) => b.solvedProblems.size - a.solvedProblems.size);
  const index = sorted.findIndex(u => u.email === userEmail);
  return index + 1;
};

const updateStreak = (user) => {
  const today = new Date().toISOString().split('T')[0];
  if (!user.lastSolveDate) {
    user.streak = 1;
  } else {
    const last = new Date(user.lastSolveDate);
    const curr = new Date(today);
    const diffTime = Math.abs(curr - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
  }
  user.lastSolveDate = today;
};

const recordSubmission = (userEmail, problemId, status, language) => {
  const user = users.get(userEmail);
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];
  
  const submission = {
    id: uuidv4(),
    userEmail,
    problemId,
    status,
    language,
    timestamp: new Date().toISOString()
  };
  submissions.unshift(submission);

  if (status === 'Accepted') {
    // 1. Heatmap
    user.dailyActivity[today] = (user.dailyActivity[today] || 0) + 1;

    // 2. Solve count (only once per problem)
    if (!user.solvedProblems.has(problemId)) {
      user.solvedProblems.add(problemId);
      user.problemsSolved = user.solvedProblems.size;
      
      // 3. Streak
      updateStreak(user);
    }
  }

  return submission;
};

const getTopicsMastered = (user) => {
  const threshold = 5; // Simplified threshold for demo
  const topicCounts = {};
  
  user.solvedProblems.forEach(pId => {
    const problem = problems.find(p => p.id === pId);
    if (problem) {
      topicCounts[problem.topic] = (topicCounts[problem.topic] || 0) + 1;
    }
  });

  const mastered = [];
  for (const [topic, count] of Object.entries(topicCounts)) {
    if (count >= threshold) mastered.push(topic);
  }
  return mastered;
};

const getTopicProgress = (user) => {
  const progress = {};
  const topicTotals = {};
  problems.forEach(p => { topicTotals[p.topic] = (topicTotals[p.topic] || 0) + 1; });

  const topicSolved = {};
  user.solvedProblems.forEach(pId => {
    const problem = problems.find(p => p.id === pId);
    if (problem) {
      topicSolved[problem.topic] = (topicSolved[problem.topic] || 0) + 1;
    }
  });

  Object.keys(topicTotals).forEach(t => {
    progress[t] = {
      solved: topicSolved[t] || 0,
      total: topicTotals[t]
    };
  });
  return progress;
};

module.exports = { 
  users, 
  problems, 
  contests, 
  submissions,
  recordSubmission,
  getGlobalRank,
  getTopicsMastered,
  getTopicProgress
};

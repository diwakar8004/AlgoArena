const { v4: uuidv4 } = require('uuid');

const topics = ['Arrays','Strings','Linked List','Stack','Queue','Trees','Graphs','Dynamic Programming','Greedy','Backtracking','Sliding Window','Two Pointers','Bit Manipulation','Heap','Trie','Binary Search','Sorting','Hashing','Math','Recursion'];
const difficulties = ['Easy','Medium','Hard'];
const tags = ['LeetCode','Codeforces','GeeksforGeeks','Interview'];
const languages = ['cpp','java','python','javascript'];

function generateProblems() {
  const problemTemplates = [
    { title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Contains Duplicate', topic: 'Arrays', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Merge Intervals', topic: 'Arrays', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'First Missing Positive', topic: 'Arrays', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Valid Parentheses', topic: 'Strings', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Minimum Window Substring', topic: 'Strings', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Add Two Numbers', topic: 'Linked List', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'LRU Cache', topic: 'Linked List', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Valid Parentheses Stack', topic: 'Stack', difficulty: 'Easy', tag: 'Interview' },
    { title: 'Min Stack', topic: 'Stack', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Largest Rectangle in Histogram', topic: 'Stack', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Binary Tree Inorder Traversal', topic: 'Trees', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Validate BST', topic: 'Trees', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Word Ladder', topic: 'Graphs', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Regular Expression Matching', topic: 'Dynamic Programming', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Activity Selection', topic: 'Greedy', difficulty: 'Easy', tag: 'GeeksforGeeks' },
    { title: 'Jump Game', topic: 'Greedy', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'N-Queens', topic: 'Backtracking', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Sudoku Solver', topic: 'Backtracking', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Permutations', topic: 'Backtracking', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Maximum Sum Subarray of Size K', topic: 'Sliding Window', difficulty: 'Easy', tag: 'Interview' },
    { title: 'Longest Repeating Character Replacement', topic: 'Sliding Window', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Container With Most Water', topic: 'Two Pointers', difficulty: 'Medium', tag: 'LeetCode' },
    { title: '3Sum', topic: 'Two Pointers', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Single Number', topic: 'Bit Manipulation', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Counting Bits', topic: 'Bit Manipulation', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Find Median from Data Stream', topic: 'Heap', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Top K Frequent Elements', topic: 'Heap', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Implement Trie', topic: 'Trie', difficulty: 'Medium', tag: 'LeetCode' },
    { title: 'Word Search II', topic: 'Trie', difficulty: 'Hard', tag: 'LeetCode' },
    { title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', tag: 'LeetCode' },
    { title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'Medium', tag: 'LeetCode' },
  ];

  const problems = [];
  let id = 1;

  for (const template of problemTemplates) {
    problems.push({
      id: String(id++),
      title: template.title,
      slug: template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      topic: template.topic,
      difficulty: template.difficulty,
      tags: [template.tag],
      acceptance: Math.floor(Math.random() * 40) + 30,
      totalSubmissions: Math.floor(Math.random() * 50000) + 5000,
      description: generateDescription(template.title, template.topic),
      constraints: generateConstraints(),
      examples: generateExamples(template.title),
      hints: [`Think about using ${template.topic.toLowerCase()} techniques`, 'Consider the time complexity', 'Try to optimize space usage'],
      editorial: generateEditorial(template.title, template.topic),
      starterCode: generateStarterCode(template.title),
      testCases: [{ input: '[1,2,3]', expected: 'true' }, { input: '[1,1]', expected: 'false' }],
    });
  }

  // Generate more problems to reach 500+
  const moreTopics = topics;
  const adjectives = ['Maximum','Minimum','Longest','Shortest','Count','Find','Check','Valid','Optimal','Best'];
  const nouns = ['Path','Sum','Subsequence','Substring','Subarray','Pairs','Triplets','Sequence','Window','Range'];
  
  while (problems.length < 520) {
    const topic = moreTopics[Math.floor(Math.random() * moreTopics.length)];
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const title = `${adj} ${noun} in ${topic}`;
    
    if (problems.find(p => p.title === title)) continue;

    problems.push({
      id: String(id++),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      topic,
      difficulty: diff,
      tags: [tag],
      acceptance: Math.floor(Math.random() * 40) + 30,
      totalSubmissions: Math.floor(Math.random() * 50000) + 1000,
      description: generateDescription(title, topic),
      constraints: generateConstraints(),
      examples: generateExamples(title),
      hints: [`Consider ${topic.toLowerCase()} properties`, 'Analyze edge cases carefully', 'Think about the brute force approach first'],
      editorial: generateEditorial(title, topic),
      starterCode: generateStarterCode(title),
      testCases: [{ input: '[1,2,3]', expected: 'true' }],
    });
  }
  return problems;
}

function generateDescription(title, topic) {
  return `## ${title}\n\nGiven a data structure related to **${topic}**, solve the following problem.\n\nYou need to find the optimal solution considering both time and space complexity.\n\n### Input\nThe input consists of the data structure elements.\n\n### Output\nReturn the result as specified.`;
}

function generateConstraints() {
  return ['1 ≤ n ≤ 10^5', '-10^9 ≤ nums[i] ≤ 10^9', 'The answer is guaranteed to exist'];
}

function generateExamples(title) {
  return [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
  ];
}

function generateEditorial(title, topic) {
  return `## Solution for ${title}\n\n### Approach: ${topic}-based Solution\n\nWe can solve this problem using ${topic.toLowerCase()} techniques.\n\n**Time Complexity:** O(n)\n**Space Complexity:** O(n)\n\n\`\`\`python\ndef solve(data):\n    # Implementation here\n    pass\n\`\`\``;
}

function generateStarterCode(title) {
  return {
    python: `class Solution:\n    def solve(self, nums):\n        # Write your solution here\n        pass`,
    cpp: `class Solution {\npublic:\n    vector<int> solve(vector<int>& nums) {\n        // Write your solution here\n    }\n};`,
    java: `class Solution {\n    public int[] solve(int[] nums) {\n        // Write your solution here\n    }\n}`,
    javascript: `var solve = function(nums) {\n    // Write your solution here\n};`,
  };
}

function generateUsers() {
  return [
    { id: '1', username: 'codemaster', email: 'codemaster@example.com', avatar: null, bio: 'Competitive programmer | 5★ on Codeforces', problemsSolved: 342, streak: 45, rank: 1, joinedAt: '2024-01-15' },
    { id: '2', username: 'algorithmist', email: 'algo@example.com', avatar: null, bio: 'Data structures enthusiast', problemsSolved: 289, streak: 30, rank: 2, joinedAt: '2024-02-20' },
    { id: '3', username: 'dpwizard', email: 'dp@example.com', avatar: null, bio: 'Dynamic Programming lover', problemsSolved: 256, streak: 22, rank: 3, joinedAt: '2024-03-10' },
  ];
}

function generateContests() {
  return [
    { id: '1', title: 'Weekly Contest #42', description: 'Solve 4 problems in 90 minutes', startTime: new Date(Date.now() + 2 * 24 * 3600000).toISOString(), duration: 90, status: 'upcoming', problems: ['1','2','3','4'], participants: 1240 },
    { id: '2', title: 'Monthly Challenge - March', description: 'Advanced DP and Graph problems', startTime: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), duration: 120, status: 'upcoming', problems: ['5','6','7','8'], participants: 890 },
    { id: '3', title: 'Weekly Contest #41', description: 'Array and string manipulation', startTime: new Date(Date.now() - 7 * 24 * 3600000).toISOString(), duration: 90, status: 'completed', problems: ['9','10','11','12'], participants: 2100 },
    { id: '4', title: 'Weekly Contest #40', description: 'Tree and graph traversal', startTime: new Date(Date.now() - 14 * 24 * 3600000).toISOString(), duration: 90, status: 'completed', problems: ['13','14','15','16'], participants: 1890 },
  ];
}

function generateHeatmapData() {
  const data = {};
  const now = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    data[key] = Math.random() > 0.3 ? Math.floor(Math.random() * 8) + 1 : 0;
  }
  return data;
}

function generateLeaderboard() {
  const names = ['codemaster','algorithmist','dpwizard','graphking','treewalker','bitsolver','heapmaster','triexpert','sortgenius','hashwizard','mathpro','recursionking','greedyguru','backtracker','slidingpro','pointerace','stackoverflow','queuemaster','searchexpert','arrayking'];
  return names.map((name, i) => ({
    rank: i + 1,
    username: name,
    problemsSolved: 400 - i * 15 + Math.floor(Math.random() * 10),
    contestRating: 2400 - i * 50 + Math.floor(Math.random() * 30),
    streak: Math.max(0, 60 - i * 3 + Math.floor(Math.random() * 5)),
  }));
}

module.exports = { generateProblems, generateUsers, generateContests, generateHeatmapData, generateLeaderboard, topics, difficulties, tags };

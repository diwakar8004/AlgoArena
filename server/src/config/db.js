const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// In-memory store for development (when PostgreSQL is not available)
const memoryStore = {
  users: [],
  problems: [],
  submissions: [],
  contests: [],
  comments: [],
  bookmarks: [],
  roadmapProgress: [],
};

let useMemoryStore = false;

const initDb = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();
  } catch (err) {
    console.warn('⚠️  PostgreSQL not available, using in-memory store');
    useMemoryStore = true;
  }
};

const query = async (text, params) => {
  if (useMemoryStore) {
    return { rows: [], rowCount: 0 };
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    // console.log('Executed query', { text: text.substring(0, 80), duration, rows: res.rowCount });
  }
  return res;
};

module.exports = { pool, query, initDb, memoryStore, isMemoryStore: () => useMemoryStore };

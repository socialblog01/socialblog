const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.NEON_POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Simple test on load
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ Database connection error:', err);
  else console.log('✅ Database connected successfully at:', res.rows[0].now);
});

module.exports = pool;
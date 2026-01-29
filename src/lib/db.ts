import { Pool } from 'pg';

// Supabase and most cloud Postgres require SSL. Use it when DATABASE_URL points to Supabase or in production.
const connectionString = process.env.DATABASE_URL ?? '';
const isSupabase = connectionString.includes('supabase.com');
const useSsl = process.env.NODE_ENV === 'production' || isSupabase;

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

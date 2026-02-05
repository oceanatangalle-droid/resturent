import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Admin and API data will not persist.')
}

// Supabase and most cloud Postgres require SSL; enable it when using Supabase
const isSupabase = connectionString?.includes('supabase.com')
const pool = connectionString
  ? new Pool({
      connectionString,
      ...(isSupabase && { ssl: { rejectUnauthorized: false } }),
    })
  : null

export const db = pool ? drizzle(pool, { schema }) : null
export { schema }

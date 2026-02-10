import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Admin and API data will not persist.')
}

// Supabase and most cloud Postgres require SSL; enable it when using Supabase
const isSupabase = connectionString?.includes('supabase.com')
// Keep pool small so Vercel build (many parallel SSG pages) doesn't hit "Max client connections reached"
const pool = connectionString
  ? new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
      ...(isSupabase && { ssl: { rejectUnauthorized: false } }),
    })
  : null

export const db = pool ? drizzle(pool, { schema }) : null
export { schema }

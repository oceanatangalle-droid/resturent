import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Admin and API data will not persist.')
}

// Supabase (and some poolers) use a cert chain that Node can treat as self-signed.
// pg overwrites our ssl option with parsed connection string params, so strip ssl
// params from the URL and set ssl explicitly so it's not overwritten at connect time.
const isSupabase = connectionString?.includes('supabase.com')
if (isSupabase && connectionString) {
  connectionString = connectionString
    .replace(/[?&]sslmode=[^&]*/gi, '')
    .replace(/[?&]ssl(?:rootcert)?=[^&]*/gi, '')
    .replace(/\?&/, '?')
    .replace(/(\/[^?]*)\&/, '$1?') // first param was removed: .../db&leftover -> .../db?leftover
    .replace(/[?&]+$/, '')
}

const pool = connectionString
  ? new Pool({
      connectionString,
      ...(isSupabase && {
        ssl: { rejectUnauthorized: false },
      }),
    })
  : null

export const db = pool ? drizzle(pool, { schema }) : null
export { schema }

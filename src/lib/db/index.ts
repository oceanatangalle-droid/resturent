import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('DATABASE_URL is not set. Admin and API data will not persist.')
}

const pool = connectionString ? new Pool({ connectionString }) : null

export const db = pool ? drizzle(pool, { schema }) : null
export { schema }

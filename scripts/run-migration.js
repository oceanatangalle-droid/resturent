#!/usr/bin/env node
/**
 * Run the initial migration SQL file against DATABASE_URL.
 * Usage: node scripts/run-migration.js
 * Requires: DATABASE_URL in .env
 */
require('dotenv').config()
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is not set. Create a .env file with DATABASE_URL=postgresql://...')
  process.exit(1)
}

const sqlPath = path.join(__dirname, '..', 'drizzle', '0000_initial.sql')
const sql = fs.readFileSync(sqlPath, 'utf8')

const pool = new Pool({ connectionString })

pool.query(sql)
  .then(() => {
    console.log('Migration completed successfully.')
    pool.end()
  })
  .catch((err) => {
    console.error('Migration failed:', err.message)
    pool.end()
    process.exit(1)
  })

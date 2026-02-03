#!/usr/bin/env node
/**
 * Run incremental migration SQL files (0001, 0002, 0003...) against DATABASE_URL.
 * Use this when the DB already has the initial schema and you need to add new tables/columns.
 * Usage: node scripts/run-incremental-migrations.js
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

const drizzleDir = path.join(__dirname, '..', 'drizzle')
const files = fs.readdirSync(drizzleDir)
  .filter((f) => f.endsWith('.sql') && f !== '0000_initial.sql')
  .sort()

if (files.length === 0) {
  console.log('No incremental migrations to run.')
  process.exit(0)
}

const pool = new Pool({ connectionString })

async function run() {
  for (const file of files) {
    const sqlPath = path.join(drizzleDir, file)
    const sql = fs.readFileSync(sqlPath, 'utf8')
    try {
      await pool.query(sql)
      console.log('Ran:', file)
    } catch (err) {
      console.error('Migration failed:', file, err.message)
      await pool.end()
      process.exit(1)
    }
  }
  await pool.end()
  console.log('Incremental migrations completed successfully.')
}

run()

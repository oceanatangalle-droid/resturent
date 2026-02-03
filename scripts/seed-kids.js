#!/usr/bin/env node
/**
 * Seed the database with the kids section (category and items).
 * Run after main menu and drinks seed so kids appear after drinks.
 *
 * Usage: node scripts/seed-kids.js
 * Requires: DATABASE_URL in .env
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Create a .env file with DATABASE_URL=postgresql://...');
  process.exit(1);
}

const sqlPath = path.join(__dirname, '..', 'drizzle', '0007_seed_kids.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const pool = new Pool({ connectionString });

pool
  .query(sql)
  .then(() => {
    console.log('Kids section seed completed: 1 category and 12 items added.');
    pool.end();
  })
  .catch((err) => {
    console.error('Seed failed:', err.message);
    pool.end();
    process.exit(1);
  });

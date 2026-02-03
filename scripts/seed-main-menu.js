#!/usr/bin/env node
/**
 * Seed the database with main menu categories and items from the restaurant menu images.
 * Run after initial migration. Clears existing menu data and inserts full main menu.
 *
 * Usage: node scripts/seed-main-menu.js
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

const sqlPath = path.join(__dirname, '..', 'drizzle', '0005_seed_main_menu.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const pool = new Pool({ connectionString });

pool
  .query(sql)
  .then(() => {
    console.log('Main menu seed completed: categories and items added.');
    pool.end();
  })
  .catch((err) => {
    console.error('Seed failed:', err.message);
    pool.end();
    process.exit(1);
  });

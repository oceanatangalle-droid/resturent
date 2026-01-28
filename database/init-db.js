const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✓ Schema created');

    // Create default admin user
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    
    await pool.query(
      `INSERT INTO admin_users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (username) DO UPDATE SET password_hash = $3`,
      ['admin', 'admin@veloria.com', passwordHash]
    );
    console.log(`✓ Default admin user created (username: admin, password: ${defaultPassword})`);

    // Insert default menu sections
    await pool.query(`
      INSERT INTO menu_sections (title, subtitle, display_order) VALUES
        ('🍳 Breakfast', '7 AM - 11 AM', 1),
        ('🥗 Lunch', '12 PM - 3 PM', 2),
        ('🍽️ Dinner', '6 PM - 11 PM', 3),
        ('🍹 Mocktails', NULL, 4),
        ('🥂 Drinks', NULL, 5)
      ON CONFLICT DO NOTHING
    `);
    console.log('✓ Default menu sections created');

    console.log('\n✅ Database initialization complete!');
    console.log('\nYou can now:');
    console.log('  1. Access the admin panel at: http://localhost:3000/admin/login');
    console.log(`  2. Login with username: admin, password: ${defaultPassword}`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

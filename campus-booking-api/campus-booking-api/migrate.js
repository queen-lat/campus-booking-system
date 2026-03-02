require("dotenv").config();
const pool = require("./config/db");

async function runMigration() {
  try {
    console.log("🔄 Running migration: Add external_id to users table...");

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        external_id VARCHAR(255) UNIQUE,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Users table created or already exists");

    // Add external_id column if it doesn't exist
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN external_id VARCHAR(255) UNIQUE;
      `);
      console.log("✅ Column external_id added successfully");
    } catch (addColumnErr) {
      if (addColumnErr.message.includes("already exists")) {
        console.log("✅ Column external_id already exists");
      } else {
        throw addColumnErr;
      }
    }

    // Add role column if it doesn't exist
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';
      `);
      console.log("✅ Column role added successfully");
    } catch (addColumnErr) {
      if (addColumnErr.message.includes("already exists")) {
        console.log("✅ Column role already exists");
      } else {
        throw addColumnErr;
      }
    }

    // Add email column if it doesn't exist
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;
      `);
      console.log("✅ Column email added successfully");
    } catch (addColumnErr) {
      if (addColumnErr.message.includes("already exists")) {
        console.log("✅ Column email already exists");
      } else {
        throw addColumnErr;
      }
    }

    // Create index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS users_external_id_idx ON users(external_id);
    `);
    console.log("✅ Index created or already exists");

    // Verify the columns exist
    const { rows } = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('external_id', 'role', 'email');
    `);
    
    console.log(`✅ Verification: Found ${rows.length} columns: ${rows.map(r => r.column_name).join(', ')}`);

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  }
}

runMigration();

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  external_id VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add external_id column if it doesn't exist (for existing tables)
ALTER TABLE users ADD COLUMN IF NOT EXISTS external_id VARCHAR(255) UNIQUE;

-- Drop and recreate unique constraint if needed
ALTER TABLE users ADD CONSTRAINT users_external_id_unique UNIQUE (external_id);

-- Add external_id index for faster lookups
CREATE INDEX IF NOT EXISTS users_external_id_idx ON users(external_id);

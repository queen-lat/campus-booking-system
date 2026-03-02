-- Check current users table structure
\d users

-- If users table exists, add external_id column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'external_id'
  ) THEN
    ALTER TABLE users ADD COLUMN external_id VARCHAR(255) UNIQUE;
  END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS users_external_id_idx ON users(external_id);

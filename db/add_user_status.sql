-- Add status column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Set all existing users to 'active'
UPDATE users SET status = 'active' WHERE status IS NULL; 
-- Add fullName column to users table
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/add-fullname-column.sql

-- Check if the column already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'full_name'
    ) THEN
        -- Add the column if it doesn't exist
        ALTER TABLE users ADD COLUMN full_name VARCHAR(100);
    END IF;
END $$; 
-- Add contact information columns to support_requests table
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/add-support-contact-columns.sql

-- Check if the columns already exist
DO $$
BEGIN
    -- Add name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'support_requests' AND column_name = 'name'
    ) THEN
        ALTER TABLE support_requests ADD COLUMN name VARCHAR(100);
    END IF;

    -- Add email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'support_requests' AND column_name = 'email'
    ) THEN
        ALTER TABLE support_requests ADD COLUMN email VARCHAR(100);
    END IF;

    -- Add phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'support_requests' AND column_name = 'phone'
    ) THEN
        ALTER TABLE support_requests ADD COLUMN phone VARCHAR(20);
    END IF;

    -- Add address column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'support_requests' AND column_name = 'address'
    ) THEN
        ALTER TABLE support_requests ADD COLUMN address TEXT;
    END IF;
END $$; 
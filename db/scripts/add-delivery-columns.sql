-- Add delivery columns to orders table
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/add-delivery-columns.sql

-- Check if the columns already exist
DO $$
BEGIN
    -- Add delivery_type column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'delivery_type'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_type VARCHAR(20);
    END IF;

    -- Add delivery_address column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'delivery_address'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_address TEXT;
    END IF;
END $$; 
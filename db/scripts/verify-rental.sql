-- Verify rental data in the database

-- Check all rentals
SELECT * FROM rentals;

-- Check a specific rental (ID 1)
SELECT * FROM rentals WHERE id = 1;

-- Check rentals by user (ID 3)
SELECT * FROM rentals WHERE renter_id = 3;

-- Check rentals by tool (ID 1)
SELECT * FROM rentals WHERE tool_id = 1;
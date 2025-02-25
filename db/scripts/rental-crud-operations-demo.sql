-- Rental CRUD Operations Demo (with real values)
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/rental-crud-operations-demo.sql
--
-- This file uses real values instead of parameter placeholders for demonstration purposes.
-- Each section is separated by comments and can be run independently.

-- Cleanup: Delete test rental if it exists (for re-running the demo)
DELETE FROM rentals WHERE id IN (
  SELECT id FROM rentals 
  WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-01' AND end_date = '2025-05-05'
);

-- Reset sequence if needed (uncomment if you want to reset the ID sequence)
-- SELECT setval('rentals_id_seq', (SELECT MAX(id) FROM rentals), true);

-- 1. CREATE: Insert a new rental with real values
INSERT INTO rentals (tool_id, renter_id, start_date, end_date, status, total_price)
VALUES 
  (1, 1, '2025-05-01', '2025-05-05', 'pending', 120.00)
RETURNING *;

-- 2. READ: Get all rentals with tool and renter details
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
ORDER BY r.created_at DESC;

-- 3. READ: Get rental by ID with tool and renter details
-- Using ID 1 as an example
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.id = 1;

-- 4. READ: Get rentals by user ID (as renter)
-- Using user ID 1 as an example
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.renter_id = 1
ORDER BY r.created_at DESC;

-- 5. READ: Get rentals by tool ID
-- Using tool ID 1 as an example
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.tool_id = 1
ORDER BY r.created_at DESC;

-- 6. UPDATE: Update rental details for the rental we just created
-- First, get the ID of the rental we just created
DO $$
DECLARE
  rental_id integer;
BEGIN
  SELECT id INTO rental_id FROM rentals 
  WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-01' AND end_date = '2025-05-05'
  ORDER BY created_at DESC LIMIT 1;
  
  IF rental_id IS NOT NULL THEN
    -- Update the rental
    UPDATE rentals
    SET 
      start_date = '2025-05-02',
      end_date = '2025-05-06',
      status = 'active',
      total_price = 150.00
    WHERE id = rental_id;
    
    -- Show the updated rental
    RAISE NOTICE 'Updated rental %', rental_id;
  END IF;
END $$;

-- Show the updated rental
SELECT * FROM rentals 
WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-02'
ORDER BY created_at DESC LIMIT 1;

-- 7. UPDATE: Change rental status
-- Using the rental we just created
DO $$
DECLARE
  rental_id integer;
BEGIN
  SELECT id INTO rental_id FROM rentals 
  WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-02'
  ORDER BY created_at DESC LIMIT 1;
  
  IF rental_id IS NOT NULL THEN
    -- Update the rental status
    UPDATE rentals
    SET status = 'completed'
    WHERE id = rental_id;
    
    -- Show the updated rental
    RAISE NOTICE 'Updated rental status for rental %', rental_id;
  END IF;
END $$;

-- Show the updated rental
SELECT * FROM rentals 
WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-02'
ORDER BY created_at DESC LIMIT 1;

-- 8. DELETE: Cancel a rental (soft delete by changing status)
-- Using the rental we just created
DO $$
DECLARE
  rental_id integer;
BEGIN
  SELECT id INTO rental_id FROM rentals 
  WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-02'
  ORDER BY created_at DESC LIMIT 1;
  
  IF rental_id IS NOT NULL THEN
    -- Cancel the rental
    UPDATE rentals
    SET status = 'cancelled'
    WHERE id = rental_id;
    
    -- Show the updated rental
    RAISE NOTICE 'Cancelled rental %', rental_id;
  END IF;
END $$;

-- Show the cancelled rental
SELECT * FROM rentals 
WHERE tool_id = 1 AND renter_id = 1 AND start_date = '2025-05-02'
ORDER BY created_at DESC LIMIT 1;

-- 9. READ: Get active rentals for a specific time period
-- Using tool ID 1 and a date range as an example
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE 
  r.tool_id = 1 AND
  r.status IN ('pending', 'active') AND
  (
    (r.start_date <= '2025-06-01' AND r.end_date >= '2025-06-01') OR  -- Requested start date falls within existing rental
    (r.start_date <= '2025-06-10' AND r.end_date >= '2025-06-10') OR  -- Requested end date falls within existing rental
    (r.start_date >= '2025-06-01' AND r.end_date <= '2025-06-10')     -- Existing rental falls completely within requested period
  )
ORDER BY r.start_date;

-- 10. READ: Get rental statistics by user
SELECT 
  u.id,
  u.username,
  COUNT(r.id) as total_rentals,
  SUM(r.total_price) as total_spent,
  COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_rentals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_rentals
FROM users u
LEFT JOIN rentals r ON u.id = r.renter_id
GROUP BY u.id, u.username
ORDER BY total_rentals DESC;

-- 11. READ: Get rental statistics by tool
SELECT 
  t.id,
  t.name,
  COUNT(r.id) as total_rentals,
  SUM(r.total_price) as total_revenue,
  COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_rentals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_rentals
FROM tools t
LEFT JOIN rentals r ON t.id = r.tool_id
GROUP BY t.id, t.name
ORDER BY total_rentals DESC; 
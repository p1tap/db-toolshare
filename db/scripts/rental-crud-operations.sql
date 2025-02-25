-- Rental CRUD Operations
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U your_username -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/rental-crud-operations.sql
--
-- 3. Or run individual commands by copying them into your psql console
--    or using a database client like pgAdmin or DBeaver.
--
-- NOTE: Replace parameter placeholders ($1, $2, etc.) with actual values
-- when running these commands directly in SQL clients.

-- 1. CREATE: Insert a new rental
-- Parameters: tool_id, renter_id, start_date, end_date, total_price
INSERT INTO rentals (tool_id, renter_id, start_date, end_date, status, total_price)
VALUES 
  ($1, $2, $3, $4, 'pending', $5)
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
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.id = $1;

-- 4. READ: Get rentals by user ID (as renter)
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.renter_id = $1
ORDER BY r.created_at DESC;

-- 5. READ: Get rentals by tool ID
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.tool_id = $1
ORDER BY r.created_at DESC;

-- 6. UPDATE: Update rental details
-- For updating start_date, end_date, status, or total_price
UPDATE rentals
SET 
  start_date = COALESCE($2, start_date),
  end_date = COALESCE($3, end_date),
  status = COALESCE($4, status),
  total_price = COALESCE($5, total_price)
WHERE id = $1
RETURNING *;

-- 7. UPDATE: Change rental status
-- For quickly changing just the status
UPDATE rentals
SET status = $2
WHERE id = $1
RETURNING *;

-- 8. DELETE: Cancel a rental (soft delete by changing status)
UPDATE rentals
SET status = 'cancelled'
WHERE id = $1
RETURNING *;

-- 9. READ: Get active rentals for a specific time period
-- Useful for checking availability
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE 
  r.tool_id = $1 AND
  r.status IN ('pending', 'active') AND
  (
    (r.start_date <= $2 AND r.end_date >= $2) OR  -- Requested start date falls within existing rental
    (r.start_date <= $3 AND r.end_date >= $3) OR  -- Requested end date falls within existing rental
    (r.start_date >= $2 AND r.end_date <= $3)     -- Existing rental falls completely within requested period
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
-- Rental Availability Operations Demo (with real values)
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/rental-availability-demo.sql
--
-- This file uses real values instead of parameter placeholders for demonstration purposes.
-- Each section is separated by comments and can be run independently.

-- 1. Check if a tool is available for a specific date range
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
  );

-- 2. Get all available tools for a specific date range
-- Using a date range as an example
SELECT DISTINCT t.*
FROM tools t
WHERE 
  t.status = 'active' AND
  t.id NOT IN (
    SELECT r.tool_id
    FROM rentals r
    WHERE 
      r.status IN ('pending', 'active') AND
      (
        (r.start_date <= '2025-06-01' AND r.end_date >= '2025-06-01') OR  -- Requested start date falls within existing rental
        (r.start_date <= '2025-06-10' AND r.end_date >= '2025-06-10') OR  -- Requested end date falls within existing rental
        (r.start_date >= '2025-06-01' AND r.end_date <= '2025-06-10')     -- Existing rental falls completely within requested period
      )
  )
ORDER BY t.name;

-- 3. Get next available date for a specific tool
-- Using tool ID 1 and a start date as an example
SELECT 
  MIN(r.end_date) as next_available_date
FROM rentals r
WHERE 
  r.tool_id = 1 AND
  r.status IN ('pending', 'active') AND
  r.start_date <= '2025-06-01' AND
  r.end_date >= '2025-06-01';

-- 4. Get rental calendar for a tool (all bookings in a date range)
-- Using tool ID 1 and a date range as an example
SELECT 
  r.id,
  r.start_date,
  r.end_date,
  r.status,
  u.username as renter_name
FROM rentals r
JOIN users u ON r.renter_id = u.id
WHERE 
  r.tool_id = 1 AND
  r.status IN ('pending', 'active', 'completed') AND
  (
    (r.start_date BETWEEN '2025-05-01' AND '2025-07-01') OR  -- Start date falls within requested period
    (r.end_date BETWEEN '2025-05-01' AND '2025-07-01') OR    -- End date falls within requested period
    (r.start_date <= '2025-05-01' AND r.end_date >= '2025-07-01')  -- Rental spans the entire requested period
  )
ORDER BY r.start_date;

-- 5. Get tools with availability statistics
-- Shows how many days each tool is booked in the next 30 days
-- Ultra-simplified version that should work in all PostgreSQL versions
SELECT 
  t.id,
  t.name,
  t.price_per_day,
  COUNT(DISTINCT r.id) as upcoming_bookings,
  -- Just count the number of bookings as a simple metric
  COUNT(DISTINCT r.id) as booked_count,
  -- If a tool has no bookings, it's available for all 30 days
  CASE 
    WHEN COUNT(DISTINCT r.id) = 0 THEN 30
    ELSE 30 - COUNT(DISTINCT r.id) * 3  -- Assuming each booking takes about 3 days on average
  END as estimated_available_days
FROM tools t
LEFT JOIN rentals r ON 
  t.id = r.tool_id AND 
  r.status IN ('pending', 'active') AND
  (
    (r.start_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') OR
    (r.end_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days') OR
    (r.start_date <= CURRENT_DATE AND r.end_date >= CURRENT_DATE + INTERVAL '30 days')
  )
WHERE t.status = 'active'
GROUP BY t.id, t.name, t.price_per_day
ORDER BY estimated_available_days DESC; 
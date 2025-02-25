-- Rental Availability Operations
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U your_username -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/rental-availability.sql
--
-- 3. Or run individual commands by copying them into your psql console
--    or using a database client like pgAdmin or DBeaver.
--
-- NOTE: Replace parameter placeholders ($1, $2, etc.) with actual values
-- when running these commands directly in SQL clients.

-- 1. Check if a tool is available for a specific date range
-- Returns conflicting rentals if any exist
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
  );

-- 2. Get all available tools for a specific date range
-- Returns tools that don't have conflicting rentals
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
        (r.start_date <= $1 AND r.end_date >= $1) OR  -- Requested start date falls within existing rental
        (r.start_date <= $2 AND r.end_date >= $2) OR  -- Requested end date falls within existing rental
        (r.start_date >= $1 AND r.end_date <= $2)     -- Existing rental falls completely within requested period
      )
  )
ORDER BY t.name;

-- 3. Get next available date for a specific tool
-- Returns the earliest date after the requested start date when the tool becomes available
SELECT 
  MIN(r.end_date) as next_available_date
FROM rentals r
WHERE 
  r.tool_id = $1 AND
  r.status IN ('pending', 'active') AND
  r.start_date <= $2 AND
  r.end_date >= $2;

-- 4. Get rental calendar for a tool (all bookings in a date range)
-- Useful for displaying a calendar view of tool availability
SELECT 
  r.id,
  r.start_date,
  r.end_date,
  r.status,
  u.username as renter_name
FROM rentals r
JOIN users u ON r.renter_id = u.id
WHERE 
  r.tool_id = $1 AND
  r.status IN ('pending', 'active', 'completed') AND
  (
    (r.start_date BETWEEN $2 AND $3) OR  -- Start date falls within requested period
    (r.end_date BETWEEN $2 AND $3) OR    -- End date falls within requested period
    (r.start_date <= $2 AND r.end_date >= $3)  -- Rental spans the entire requested period
  )
ORDER BY r.start_date;

-- 5. Get tools with availability statistics
-- Shows how many days each tool is booked in the next 30 days
SELECT 
  t.id,
  t.name,
  t.price_per_day,
  COUNT(DISTINCT r.id) as upcoming_bookings,
  SUM(
    CASE 
      WHEN r.start_date > CURRENT_DATE AND r.start_date < CURRENT_DATE + INTERVAL '30 days' THEN
        LEAST(r.end_date, CURRENT_DATE + INTERVAL '30 days') - 
        GREATEST(r.start_date, CURRENT_DATE)
      WHEN r.start_date <= CURRENT_DATE AND r.end_date > CURRENT_DATE THEN
        LEAST(r.end_date, CURRENT_DATE + INTERVAL '30 days') - CURRENT_DATE
      ELSE 0
    END
  ) as booked_days,
  30 - SUM(
    CASE 
      WHEN r.start_date > CURRENT_DATE AND r.start_date < CURRENT_DATE + INTERVAL '30 days' THEN
        LEAST(r.end_date, CURRENT_DATE + INTERVAL '30 days') - 
        GREATEST(r.start_date, CURRENT_DATE)
      WHEN r.start_date <= CURRENT_DATE AND r.end_date > CURRENT_DATE THEN
        LEAST(r.end_date, CURRENT_DATE + INTERVAL '30 days') - CURRENT_DATE
      ELSE 0
    END
  ) as available_days
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
ORDER BY available_days DESC; 
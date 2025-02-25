-- Rental Analytics and Reporting
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U your_username -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/rental-analytics.sql
--
-- 3. Or run individual commands by copying them into your psql console
--    or using a database client like pgAdmin or DBeaver.
--
-- NOTE: These queries provide analytics and reporting for rental data.
--       They assume that rentals, tools, and users tables exist with appropriate data.

-- 1. Monthly rental trends
SELECT 
  DATE_TRUNC('month', r.created_at) as month,
  COUNT(*) as total_rentals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_rentals,
  COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled_rentals,
  SUM(r.total_price) as total_revenue,
  AVG(r.total_price) as average_rental_price,
  AVG(r.end_date - r.start_date) as average_rental_duration
FROM rentals r
GROUP BY DATE_TRUNC('month', r.created_at)
ORDER BY month DESC;

-- 2. Top rented tools
SELECT 
  t.id,
  t.name,
  COUNT(r.id) as rental_count,
  SUM(r.total_price) as total_revenue,
  AVG(r.total_price) as average_rental_price,
  AVG(r.end_date - r.start_date) as average_rental_duration
FROM tools t
JOIN rentals r ON t.id = r.tool_id
WHERE r.status IN ('completed', 'active')
GROUP BY t.id, t.name
ORDER BY rental_count DESC
LIMIT 10;

-- 3. Top renters (users who rent the most)
SELECT 
  u.id,
  u.username,
  COUNT(r.id) as rental_count,
  SUM(r.total_price) as total_spent,
  AVG(r.total_price) as average_rental_price
FROM users u
JOIN rentals r ON u.id = r.renter_id
WHERE r.status IN ('completed', 'active')
GROUP BY u.id, u.username
ORDER BY rental_count DESC
LIMIT 10;

-- 4. Rental duration distribution
SELECT 
  CASE 
    WHEN (r.end_date - r.start_date) < INTERVAL '1 day' THEN 'Less than 1 day'
    WHEN (r.end_date - r.start_date) BETWEEN INTERVAL '1 day' AND INTERVAL '3 days' THEN '1-3 days'
    WHEN (r.end_date - r.start_date) BETWEEN INTERVAL '3 days' AND INTERVAL '7 days' THEN '3-7 days'
    WHEN (r.end_date - r.start_date) BETWEEN INTERVAL '7 days' AND INTERVAL '14 days' THEN '1-2 weeks'
    WHEN (r.end_date - r.start_date) BETWEEN INTERVAL '14 days' AND INTERVAL '30 days' THEN '2-4 weeks'
    ELSE 'More than 4 weeks'
  END as duration_range,
  COUNT(*) as rental_count,
  AVG(r.total_price) as average_price
FROM rentals r
WHERE r.status IN ('completed', 'active')
GROUP BY duration_range
ORDER BY 
  CASE 
    WHEN duration_range = 'Less than 1 day' THEN 1
    WHEN duration_range = '1-3 days' THEN 2
    WHEN duration_range = '3-7 days' THEN 3
    WHEN duration_range = '1-2 weeks' THEN 4
    WHEN duration_range = '2-4 weeks' THEN 5
    ELSE 6
  END;

-- 5. Rental status distribution
SELECT 
  r.status,
  COUNT(*) as rental_count,
  SUM(r.total_price) as total_value,
  AVG(r.total_price) as average_value
FROM rentals r
GROUP BY r.status
ORDER BY rental_count DESC;

-- 6. Seasonal rental trends (by month)
SELECT 
  EXTRACT(MONTH FROM r.start_date) as month,
  TO_CHAR(TO_DATE(EXTRACT(MONTH FROM r.start_date)::text, 'MM'), 'Month') as month_name,
  COUNT(*) as rental_count,
  SUM(r.total_price) as total_revenue,
  AVG(r.total_price) as average_rental_price
FROM rentals r
WHERE r.status IN ('completed', 'active')
GROUP BY EXTRACT(MONTH FROM r.start_date), month_name
ORDER BY month;

-- 7. Tool utilization rate (percentage of days rented vs. available)
SELECT 
  t.id,
  t.name,
  COUNT(DISTINCT r.id) as rental_count,
  SUM(EXTRACT(DAY FROM (r.end_date - r.start_date))) as total_days_rented,
  EXTRACT(DAY FROM (CURRENT_DATE - MIN(t.created_at))) as days_since_listing,
  (SUM(EXTRACT(DAY FROM (r.end_date - r.start_date))) / EXTRACT(DAY FROM (CURRENT_DATE - MIN(t.created_at)))) * 100 as utilization_rate
FROM tools t
LEFT JOIN rentals r ON 
  t.id = r.tool_id AND 
  r.status IN ('completed', 'active')
GROUP BY t.id, t.name
ORDER BY utilization_rate DESC;

-- 8. Cancellation rate by tool category
SELECT 
  t.category,
  COUNT(*) as total_rentals,
  COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END) as cancelled_rentals,
  (COUNT(CASE WHEN r.status = 'cancelled' THEN 1 END)::float / COUNT(*)::float) * 100 as cancellation_rate
FROM rentals r
JOIN tools t ON r.tool_id = t.id
GROUP BY t.category
ORDER BY cancellation_rate DESC;

-- 9. Average time between rentals for each tool
SELECT 
  t.id,
  t.name,
  AVG(next_rental.start_date - r.end_date) as average_days_between_rentals
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN LATERAL (
  SELECT start_date
  FROM rentals r2
  WHERE 
    r2.tool_id = r.tool_id AND
    r2.start_date > r.end_date
  ORDER BY start_date
  LIMIT 1
) next_rental ON true
WHERE r.status = 'completed'
GROUP BY t.id, t.name
ORDER BY average_days_between_rentals; 
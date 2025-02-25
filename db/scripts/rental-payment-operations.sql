-- Rental Payment Operations
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U your_username -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/rental-payment-operations.sql
--
-- 3. Or run individual commands by copying them into your psql console
--    or using a database client like pgAdmin or DBeaver.
--
-- NOTE: Replace parameter placeholders ($1, $2, etc.) with actual values
-- when running these commands directly in SQL clients.

-- Assuming we have a payments table with structure:
-- CREATE TABLE payments (
--   id SERIAL PRIMARY KEY,
--   rental_id INTEGER NOT NULL REFERENCES rentals(id),
--   amount DECIMAL(10, 2) NOT NULL,
--   payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
--   payment_method VARCHAR(50) NOT NULL,
--   status VARCHAR(20) NOT NULL DEFAULT 'completed',
--   transaction_id VARCHAR(100),
--   created_at TIMESTAMP NOT NULL DEFAULT NOW()
-- );

-- 1. Create a new payment for a rental
INSERT INTO payments (rental_id, amount, payment_method, transaction_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- 2. Get all payments for a rental
SELECT *
FROM payments
WHERE rental_id = $1
ORDER BY payment_date DESC;

-- 3. Get payment by ID
SELECT *
FROM payments
WHERE id = $1;

-- 4. Update payment status
UPDATE payments
SET status = $2
WHERE id = $1
RETURNING *;

-- 5. Get total payments by user
SELECT 
  u.id,
  u.username,
  COUNT(p.id) as payment_count,
  SUM(p.amount) as total_paid
FROM users u
JOIN rentals r ON u.id = r.renter_id
JOIN payments p ON r.id = p.rental_id
WHERE p.status = 'completed'
GROUP BY u.id, u.username
ORDER BY total_paid DESC;

-- 6. Get monthly revenue report
SELECT 
  DATE_TRUNC('month', p.payment_date) as month,
  COUNT(p.id) as payment_count,
  SUM(p.amount) as total_revenue
FROM payments p
WHERE p.status = 'completed'
GROUP BY DATE_TRUNC('month', p.payment_date)
ORDER BY month DESC;

-- 7. Get revenue by tool
SELECT 
  t.id,
  t.name,
  COUNT(p.id) as payment_count,
  SUM(p.amount) as total_revenue
FROM tools t
JOIN rentals r ON t.id = r.tool_id
JOIN payments p ON r.id = p.rental_id
WHERE p.status = 'completed'
GROUP BY t.id, t.name
ORDER BY total_revenue DESC;

-- 8. Get unpaid rentals
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name,
  r.total_price,
  COALESCE(SUM(p.amount), 0) as amount_paid,
  r.total_price - COALESCE(SUM(p.amount), 0) as amount_due
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
LEFT JOIN payments p ON r.id = p.rental_id AND p.status = 'completed'
GROUP BY r.id, t.name, u.username
HAVING r.total_price > COALESCE(SUM(p.amount), 0)
ORDER BY r.created_at DESC;

-- 9. Get payment summary for a specific rental
SELECT 
  r.id as rental_id,
  t.name as tool_name,
  u.username as renter_name,
  r.start_date,
  r.end_date,
  r.status as rental_status,
  r.total_price,
  COALESCE(SUM(p.amount), 0) as amount_paid,
  r.total_price - COALESCE(SUM(p.amount), 0) as amount_due,
  COUNT(p.id) as payment_count
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
LEFT JOIN payments p ON r.id = p.rental_id AND p.status = 'completed'
WHERE r.id = $1
GROUP BY r.id, t.name, u.username, r.start_date, r.end_date, r.status, r.total_price;

-- 10. Get recent payments
SELECT 
  p.*,
  r.id as rental_id,
  t.name as tool_name,
  u.username as renter_name
FROM payments p
JOIN rentals r ON p.rental_id = r.id
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
ORDER BY p.payment_date DESC
LIMIT 20; 
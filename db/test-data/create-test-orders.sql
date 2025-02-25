-- SQL script for creating and testing orders
-- Run with: psql -U postgres -h localhost -d toolshare -f db/create-test-orders.sql

-- Clear any existing test orders (optional, uncomment if needed)
-- DELETE FROM orders WHERE id > 5;

-- Create new test orders
INSERT INTO orders (user_id, tool_id, start_date, end_date, status)
VALUES 
  -- New pending order for user 2 (sarah_renter) to rent tool 1 (Power Drill)
  (2, 1, '2025-04-15 12:00:00', '2025-04-20 12:00:00', 'pending'),
  
  -- New active order for user 3 (admin_jane) to rent tool 3 (Wrench Set)
  (3, 3, '2025-03-01 09:00:00', '2025-03-10 18:00:00', 'active'),
  
  -- New completed order for user 1 (john_updated) to rent tool 5 (Measuring Tape)
  (1, 5, '2025-01-05 10:00:00', '2025-01-07 10:00:00', 'completed')
RETURNING *;

-- View all orders to verify
SELECT 'All Orders:' AS section;
SELECT o.id, o.user_id, u.username AS user_name, o.tool_id, t.name AS tool_name, 
       o.start_date, o.end_date, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
ORDER BY o.created_at DESC;

-- View orders by user
SELECT 'Orders for User 1 (john_updated):' AS section;
SELECT o.id, o.user_id, u.username AS user_name, o.tool_id, t.name AS tool_name, 
       o.start_date, o.end_date, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.user_id = 1
ORDER BY o.created_at DESC;

-- View orders by status
SELECT 'Pending Orders:' AS section;
SELECT o.id, o.user_id, u.username AS user_name, o.tool_id, t.name AS tool_name, 
       o.start_date, o.end_date, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.status = 'pending'
ORDER BY o.start_date ASC;

-- View orders for a specific tool
SELECT 'Orders for Tool 1 (Power Drill):' AS section;
SELECT o.id, o.user_id, u.username AS user_name, o.tool_id, t.name AS tool_name, 
       o.start_date, o.end_date, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.tool_id = 1
ORDER BY o.start_date ASC;

-- Update an order status (example)
SELECT 'Updating Order Status:' AS section;
UPDATE orders 
SET status = 'active' 
WHERE id = (SELECT id FROM orders WHERE user_id = 2 AND tool_id = 1 LIMIT 1)
RETURNING id, user_id, tool_id, status;

-- Count orders by status
SELECT 'Order Counts by Status:' AS section;
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status
ORDER BY count DESC; 
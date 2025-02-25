-- ToolShare Order CRUD Operations Demo
-- This file contains SQL commands for order operations with real values for demonstration

-- =============================================
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 2. Execute this entire file:
--    \i C:/Users/peepz/Desktop/Project/db-toolshare/db/scripts/order-crud-operations-demo.sql
-- 3. Or run individual sections as needed
-- =============================================

-- =============================================
-- 1. CREATE OPERATION (POST /api/orders)
-- =============================================
SELECT '1. CREATE OPERATION (POST /api/orders)' AS operation;

-- Create a new order
INSERT INTO orders (user_id, tool_id, start_date, end_date, status)
VALUES (
  2,                                  -- user_id (sarah_renter)
  3,                                  -- tool_id (Wrench Set)
  '2025-05-10 09:00:00',              -- start_date
  '2025-05-15 18:00:00',              -- end_date
  'pending'                           -- status (default for new orders)
)
RETURNING *;

-- Get the ID of the newly created order for later operations
DO $$
BEGIN
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_order_id AS
  SELECT id FROM orders ORDER BY created_at DESC LIMIT 1;
END $$;

-- =============================================
-- 2. READ OPERATIONS (GET /api/orders/[id])
-- =============================================
SELECT '2. READ OPERATIONS' AS operation;

-- 2.1 Get all orders (GET /api/orders)
SELECT '2.1 Get all orders (GET /api/orders)' AS endpoint;
SELECT o.*, u.username AS user_name, t.name AS tool_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
ORDER BY o.created_at DESC
LIMIT 5;  -- Limiting to 5 for readability

-- 2.2 Get order by ID (GET /api/orders/[id])
SELECT '2.2 Get order by ID (GET /api/orders/[id])' AS endpoint;
SELECT o.*, u.username AS user_name, t.name AS tool_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.id = (SELECT id FROM temp_order_id);

-- 2.3 Get orders by user ID (GET /api/orders/user/[userId])
SELECT '2.3 Get orders by user ID (GET /api/orders/user/2)' AS endpoint;
SELECT o.*, u.username AS user_name, t.name AS tool_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.user_id = 2
ORDER BY o.created_at DESC;

-- =============================================
-- 3. UPDATE OPERATION (PUT /api/orders/[id])
-- =============================================
SELECT '3. UPDATE OPERATION (PUT /api/orders/[id])' AS operation;

-- Update the order we just created
UPDATE orders
SET 
  status = 'active',                  -- Update status
  start_date = '2025-05-12 10:00:00', -- Update start date
  end_date = '2025-05-18 16:00:00'    -- Update end date
WHERE id = (SELECT id FROM temp_order_id)
RETURNING *;

-- Verify the update
SELECT '3.1 Verify the update' AS step;
SELECT o.*, u.username AS user_name, t.name AS tool_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.id = (SELECT id FROM temp_order_id);

-- =============================================
-- 4. DELETE/CANCEL OPERATION (DELETE /api/orders/[id])
-- =============================================
SELECT '4. DELETE/CANCEL OPERATION (DELETE /api/orders/[id])' AS operation;

-- Cancel the order (soft delete)
UPDATE orders
SET status = 'cancelled'
WHERE id = (SELECT id FROM temp_order_id)
RETURNING *;

-- Verify the cancellation
SELECT '4.1 Verify the cancellation' AS step;
SELECT o.*, u.username AS user_name, t.name AS tool_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN tools t ON o.tool_id = t.id
WHERE o.id = (SELECT id FROM temp_order_id);

-- =============================================
-- 5. SUMMARY OF ORDER STATUSES
-- =============================================
SELECT '5. SUMMARY OF ORDER STATUSES' AS operation;
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status
ORDER BY count DESC;

-- Clean up temporary table
DROP TABLE IF EXISTS temp_order_id; 
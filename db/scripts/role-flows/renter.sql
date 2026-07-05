Username: sarah_renter
Password: password123

Username: testrenter1
Password: 123456

Username: testrenter2
Password: 123456

-- TEST QUERIES FOR testrenter2:

-- First, get testrenter2's user ID:
SELECT id, username, email, role 
FROM users 
WHERE username = 'testrenter2';

-- Then use that ID to test each endpoint:

-- Test 1: Get all tools owned by testrenter2
SELECT 
  t.*,
  u.username as owner_name
FROM tools t
JOIN users u ON t.owner_id = u.id
WHERE t.owner_id = (SELECT id FROM users WHERE username = 'testrenter2')
ORDER BY t.created_at DESC;

-- Test 2: Get all orders for testrenter2's tools
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE t.owner_id = (SELECT id FROM users WHERE username = 'testrenter2')
ORDER BY r.created_at DESC;

-- Test 3: Get balance and completed rental history
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name,
  SUM(r.total_price) OVER () as total_balance
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE t.owner_id = (SELECT id FROM users WHERE username = 'testrenter2') 
  AND r.status = 'completed'
ORDER BY r.created_at DESC;

-- Renter Page GET Endpoints SQL Queries (API Version with Parameters):
-- Note: These are for the TypeScript/Node.js API code, not direct psql use

-- 1. GET /api/renter/tools (Renter Home Page - Get renter's tools)
-- API version (uses $1 parameter):
SELECT 
  t.*,
  u.username as owner_name
FROM tools t
JOIN users u ON t.owner_id = u.id
WHERE t.owner_id = $1
ORDER BY t.created_at DESC;

-- Direct psql test version:
SELECT 
  t.*,
  u.username as owner_name
FROM tools t
JOIN users u ON t.owner_id = u.id
WHERE t.owner_id = (SELECT id FROM users WHERE username = 'testrenter2')
ORDER BY t.created_at DESC;

-- 2. GET /api/renter/orders (Renter Status Page - Get renter's orders)
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE t.owner_id = $1
ORDER BY r.created_at DESC;

-- 3. GET /api/renter/balance (Renter Balance Page - Get balance and history)
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE t.owner_id = $1 AND r.status = 'completed'
ORDER BY r.created_at DESC;

-- 4. GET /api/tools/[id] (Edit Listing Page - Get single tool details)
SELECT 
  t.*,
  u.username as owner_name
FROM tools t
JOIN users u ON t.owner_id = u.id
WHERE t.id = $1 AND t.status = 'active';

-- 5. GET /api/rentals/[id] (Get rental details)
SELECT 
  r.*,
  t.name as tool_name,
  u.username as renter_name
FROM rentals r
JOIN tools t ON r.tool_id = t.id
JOIN users u ON r.renter_id = u.id
WHERE r.id = $1;


-- start 
psql -U postgres -d toolshare

-- Get admin user ID:
SELECT id, username, email, password 
FROM users 
WHERE role = 'admin';

-- admin id : admin_jane
-- admin password : admin123

-- Admin Page GET Endpoints SQL Queries:

-- 1. GET /api/admin/dashboard (Admin Home Page - Get dashboard statistics)
-- Get total tools and active tools, prices
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
  MAX(price_per_day) as highest_price,
  AVG(price_per_day) as average_price
FROM tools;

-- Get top categories (using tool names as categories)
SELECT 
  SPLIT_PART(name, ' ', -1) as category,
  COUNT(*) as count
FROM tools
GROUP BY SPLIT_PART(name, ' ', -1)
ORDER BY count DESC
LIMIT 5;

-- Get recent tools with owner details
SELECT 
  t.id, 
  t.name, 
  t.price_per_day, 
  u.username as owner_name, 
  t.created_at
FROM tools t
JOIN users u ON t.owner_id = u.id
WHERE t.status = 'active'
ORDER BY t.created_at DESC
LIMIT 5;

-- 2. GET /api/admin/approve (Admin Approve Page - Get pending tools)
-- Direct psql test version:
SELECT 
  t.id,
  t.name,
  t.price_per_day,
  t.image_url,
  t.owner_id,
  u.username as owner_name,
  t.description,
  t.status,
  t.created_at
FROM tools t
JOIN users u ON t.owner_id = u.id
WHERE t.status = 'pending'
ORDER BY t.created_at DESC;

-- 3. GET /api/admin/support (Admin Support Page - Get support requests)
SELECT 
  sr.id,
  sr.type,
  sr.message,
  sr.status,
  sr.created_at,
  sr.name,
  sr.email,
  sr.phone,
  sr.address
FROM support_requests sr
ORDER BY sr.created_at DESC;

-- TEST QUERIES FOR ADMIN:

-- First, get admin user ID:
SELECT id, username, email, role 
FROM users 
WHERE role = 'admin';

-- Test dashboard statistics:
-- Total revenue by tool
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
ORDER BY total_revenue DESC;

-- User activity statistics
SELECT 
  u.id,
  u.username,
  COUNT(r.id) as total_rentals,
  SUM(r.total_price) as total_spent,
  COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_rentals
FROM users u
LEFT JOIN rentals r ON u.id = r.renter_id
GROUP BY u.id, u.username
ORDER BY total_rentals DESC;

-- Support requests statistics
SELECT 
  status,
  COUNT(*) as request_count,
  MIN(created_at) as oldest_request,
  MAX(created_at) as newest_request
FROM support_requests
GROUP BY status
ORDER BY request_count DESC;

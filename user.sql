-- 1. Query all users with all details
SELECT * FROM users;

-- 2. Query all users with basic information
SELECT id, username, email, full_name, role, status, created_at 
FROM users;

-- 3. Query active users only
SELECT id, username, email, full_name, role, phone, address
FROM users
WHERE status = 'active';

-- 4. Query users by role
SELECT id, username, email, full_name, phone, address
FROM users
WHERE role = 'user';  -- Can be 'user', 'renter', or 'admin'

-- 5. Query users with contact information
SELECT id, username, email, full_name, phone, address
FROM users
WHERE phone IS NOT NULL AND address IS NOT NULL;

-- 6. Query recently registered users
SELECT id, username, email, full_name, role, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- 7. Query users with their rental statistics
SELECT 
  u.id,
  u.username,
  u.email,
  u.full_name,
  u.role,
  COUNT(r.id) as total_rentals,
  SUM(r.total_price) as total_spent
FROM users u
LEFT JOIN rentals r ON u.id = r.renter_id
GROUP BY u.id, u.username, u.email, u.full_name, u.role
ORDER BY total_rentals DESC;

-- 8. Search users by username or email
SELECT id, username, email, full_name, role, status
FROM users
WHERE username ILIKE '%search_term%' OR email ILIKE '%search_term%';

-- 9. Get user by ID
SELECT * FROM users
WHERE id = 1;  -- Replace with the actual user ID

-- 10. Count users by role
SELECT 
  role, 
  COUNT(*) as count
FROM users
GROUP BY role;

-- User Operations Demo (with real values)
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/user-operations-demo.sql

-- Create a new user
INSERT INTO users (
    username,
    email,
    password,
    role,
    address,
    phone,
    date_of_birth
) VALUES (
    'john_demo',                              -- username
    'john.demo@example.com',                  -- email
    'password123',                            -- password (in real app, this would be hashed)
    'user',                                   -- default role
    '123 Demo Street, Demo City, DC 12345',   -- address
    '555-0123',                              -- phone
    '1990-01-01'                             -- date_of_birth
) RETURNING id, username, email, role;

-- Get user by email (for login)
SELECT id, username, email, password, role
FROM users
WHERE email = 'john.demo@example.com' AND status = 'active';

-- Get user by username
SELECT id, username, email, role
FROM users
WHERE username = 'john_demo' AND status = 'active';

-- Check if email exists
SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE email = 'john.demo@example.com' AND status = 'active'
) as email_exists;

-- Check if username exists
SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE username = 'john_demo' AND status = 'active'
) as username_exists;

-- Example of getting all active users
SELECT id, username, email, role
FROM users
WHERE status = 'active'
ORDER BY created_at DESC;

-- Example of searching users by partial username
SELECT id, username, email, role
FROM users
WHERE username ILIKE '%john%' AND status = 'active'
ORDER BY username; 
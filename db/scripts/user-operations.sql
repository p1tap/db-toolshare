-- User Operations
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/scripts/user-operations.sql

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
    $1,  -- username
    $2,  -- email
    $3,  -- password
    'user',  -- default role
    $4,  -- address
    $5,  -- phone
    $6   -- date_of_birth
) RETURNING id, username, email, role;

-- Get user by email (for login)
SELECT id, username, email, password, role
FROM users
WHERE email = $1 AND status = 'active';

-- Get user by username
SELECT id, username, email, role
FROM users
WHERE username = $1 AND status = 'active';

-- Check if email exists
SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE email = $1 AND status = 'active'
) as email_exists;

-- Check if username exists
SELECT EXISTS(
    SELECT 1 FROM users 
    WHERE username = $1 AND status = 'active'
) as username_exists; 
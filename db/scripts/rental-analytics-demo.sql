-- ToolShare Rental Analytics Operations Demo
-- This file contains SQL commands for analyzing rental data with real values for demonstration

-- =============================================
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 2. Execute this entire file:
--    \i C:/Users/peepz/Desktop/Project/db-toolshare/db/scripts/rental-analytics-demo.sql
-- 3. Or run individual sections as needed
-- =============================================

-- =============================================
-- RENTAL DURATION ANALYTICS
-- =============================================

-- Average rental duration by tool type (using name instead of category)
SELECT 
    t.name as tool_type,
    AVG(DATE_PART('day', r.end_date::timestamp - r.start_date::timestamp)) as avg_rental_days,
    COUNT(r.id) as rental_count
FROM 
    rentals r
JOIN 
    tools t ON r.tool_id = t.id
WHERE 
    r.status = 'completed'
GROUP BY 
    t.name
ORDER BY 
    avg_rental_days DESC;

-- Identify long-term rentals (more than 7 days)
SELECT 
    r.id as rental_id,
    u.username as renter_name,
    t.name as tool_name,
    r.start_date,
    r.end_date,
    DATE_PART('day', r.end_date::timestamp - r.start_date::timestamp) as rental_days
FROM 
    rentals r
JOIN 
    users u ON r.renter_id = u.id
JOIN 
    tools t ON r.tool_id = t.id
WHERE 
    r.status = 'completed' 
    AND (r.end_date::timestamp - r.start_date::timestamp) > INTERVAL '7 days'
ORDER BY 
    rental_days DESC;

-- =============================================
-- USER ACTIVITY ANALYTICS
-- =============================================

-- Most active renters (by number of rentals)
SELECT 
    u.id as user_id,
    u.username as user_name,
    COUNT(r.id) as rental_count,
    SUM(r.total_price) as total_spent
FROM 
    users u
JOIN 
    rentals r ON u.id = r.renter_id
GROUP BY 
    u.id, u.username
ORDER BY 
    rental_count DESC
LIMIT 10;

-- User retention - users who have rented more than once
SELECT 
    u.id as user_id,
    u.username as user_name,
    COUNT(r.id) as rental_count,
    MIN(r.start_date) as first_rental,
    MAX(r.start_date) as most_recent_rental,
    MAX(r.start_date)::date - MIN(r.start_date)::date as customer_lifespan_days
FROM 
    users u
JOIN 
    rentals r ON u.id = r.renter_id
GROUP BY 
    u.id, u.username
HAVING 
    COUNT(r.id) > 1
ORDER BY 
    customer_lifespan_days DESC;

-- =============================================
-- TOOL POPULARITY ANALYTICS
-- =============================================

-- Most popular tools (by rental frequency)
SELECT 
    t.id as tool_id,
    t.name as tool_name,
    COUNT(r.id) as rental_count,
    AVG(r.total_price) as avg_rental_price
FROM 
    tools t
JOIN 
    rentals r ON t.id = r.tool_id
GROUP BY 
    t.id, t.name
ORDER BY 
    rental_count DESC
LIMIT 15;

-- Seasonal tool popularity (rentals by month)
SELECT 
    t.name as tool_type,
    EXTRACT(MONTH FROM r.start_date) as month,
    TO_CHAR(r.start_date, 'Month') as month_name,
    COUNT(r.id) as rental_count
FROM 
    rentals r
JOIN 
    tools t ON r.tool_id = t.id
WHERE 
    r.start_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY 
    t.name, EXTRACT(MONTH FROM r.start_date), TO_CHAR(r.start_date, 'Month')
ORDER BY 
    t.name, month;

-- =============================================
-- REVENUE ANALYTICS
-- =============================================

-- Monthly revenue
SELECT 
    TO_CHAR(r.start_date, 'YYYY-MM') as month,
    COUNT(r.id) as rental_count,
    SUM(r.total_price) as total_revenue,
    AVG(r.total_price) as avg_rental_price
FROM 
    rentals r
WHERE 
    r.status = 'completed'
GROUP BY 
    TO_CHAR(r.start_date, 'YYYY-MM')
ORDER BY 
    month DESC;

-- Revenue by tool type (using name instead of category)
SELECT 
    t.name as tool_type,
    COUNT(r.id) as rental_count,
    SUM(r.total_price) as total_revenue,
    AVG(r.total_price) as avg_rental_price,
    (SUM(r.total_price) / SUM(SUM(r.total_price)) OVER () * 100) as revenue_percentage
FROM 
    rentals r
JOIN 
    tools t ON r.tool_id = t.id
WHERE 
    r.status = 'completed'
GROUP BY 
    t.name
ORDER BY 
    total_revenue DESC;

-- =============================================
-- RENTAL STATUS ANALYTICS
-- =============================================

-- Rental status distribution
SELECT 
    r.status,
    COUNT(r.id) as rental_count,
    (COUNT(r.id) * 100.0 / (SELECT COUNT(*) FROM rentals)) as percentage
FROM 
    rentals r
GROUP BY 
    r.status
ORDER BY 
    rental_count DESC;

-- Overdue rentals
SELECT 
    r.id as rental_id,
    u.username as renter_name,
    t.name as tool_name,
    r.start_date,
    r.end_date,
    (CURRENT_DATE - r.end_date::date) as days_overdue
FROM 
    rentals r
JOIN 
    users u ON r.renter_id = u.id
JOIN 
    tools t ON r.tool_id = t.id
WHERE 
    r.status = 'active' 
    AND r.end_date < CURRENT_DATE
ORDER BY 
    days_overdue DESC;

-- =============================================
-- GEOGRAPHICAL ANALYTICS
-- =============================================

-- Rentals by location (using pickup_location from rentals table if available)
SELECT 
    COALESCE(r.pickup_location, 'Unknown') as location,
    COUNT(r.id) as rental_count,
    SUM(r.total_price) as total_revenue,
    COUNT(DISTINCT r.renter_id) as unique_users
FROM 
    rentals r
GROUP BY 
    r.pickup_location
ORDER BY 
    rental_count DESC;

-- =============================================
-- CUSTOM REPORTS
-- =============================================

-- High-value customers (spent more than $200)
SELECT 
    u.id as user_id,
    u.username as user_name,
    u.email,
    COUNT(r.id) as rental_count,
    SUM(r.total_price) as total_spent
FROM 
    users u
JOIN 
    rentals r ON u.id = r.renter_id
GROUP BY 
    u.id, u.username, u.email
HAVING 
    SUM(r.total_price) > 200
ORDER BY 
    total_spent DESC;

-- Tools that need maintenance (frequently rented)
SELECT 
    t.id as tool_id,
    t.name as tool_name,
    COUNT(r.id) as rental_count,
    MAX(r.end_date) as last_rental_end
FROM 
    tools t
JOIN 
    rentals r ON t.id = r.tool_id
GROUP BY 
    t.id, t.name
HAVING 
    COUNT(r.id) > 5
ORDER BY 
    rental_count DESC;

-- End of analytics demo file 
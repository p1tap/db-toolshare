-- Export script for ToolShare database
-- This script will recreate the entire database structure and data
-- HOW TO RUN ON NEW MACHINE:
-- 1. Create database: createdb -U postgres toolshare
-- 2. Import this file: psql -U postgres -h localhost -d toolshare -f export_database.sql

-- Drop existing tables if they exist
DROP TABLE IF EXISTS support_requests CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS history CASCADE;
DROP TABLE IF EXISTS rentals CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'renter', 'admin')),
    address TEXT,
    phone VARCHAR(20),
    date_of_birth DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100)
);

-- Create tools table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    owner_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    tool_id INTEGER NOT NULL REFERENCES tools(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_type VARCHAR(20),
    delivery_address TEXT,
    CONSTRAINT check_order_dates CHECK (end_date > start_date)
);

-- Create rentals table
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tools(id),
    renter_id INTEGER REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL REFERENCES rentals(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create history table
CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    order_id INTEGER NOT NULL REFERENCES orders(id),
    detail TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create support_requests table
CREATE TABLE support_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tools_owner_id ON tools(owner_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_tool_id ON orders(tool_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_rentals_tool ON rentals(tool_id);
CREATE INDEX IF NOT EXISTS idx_rentals_renter ON rentals(renter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_rental_id ON payments(rental_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_order_id ON history(order_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);

-- Insert test users
INSERT INTO users (username, email, password, role, address, phone, date_of_birth) VALUES
('john_user', 'john@example.com', 'password123', 'user', '123 Main St, City', '555-0101', '1990-01-15'),
('sarah_renter', 'sarah@example.com', 'password123', 'renter', '456 Oak St, City', '555-0102', '1985-03-20'),
('admin_jane', 'admin@example.com', 'admin123', 'admin', '789 Admin St, City', '555-0103', '1988-07-10'),
('mike_renter', 'mike@example.com', 'password123', 'renter', '321 Pine St, City', '555-0104', '1992-11-05'),
('lisa_user', 'lisa@example.com', 'password123', 'user', '654 Elm St, City', '555-0105', '1995-09-25');

-- Insert test tools
INSERT INTO tools (name, price_per_day, description, image_url, owner_id, status) VALUES
('Power Drill', 25.00, 'Professional grade power drill', '/images/tools/powerdrill.jpg', 2, 'active'),
('Hammer', 15.00, 'Heavy-duty hammer', '/images/tools/hammer.jpg', 2, 'active'),
('Wrench Set', 35.00, 'Complete wrench set', '/images/tools/wrench-set.jpg', 4, 'active'),
('Circular Saw', 45.00, 'Electric circular saw', '/images/tools/circular-saw.jpg', 4, 'active'),
('Measuring Tape', 10.00, 'Professional measuring tape', '/images/tools/measuring-tape.jpg', 2, 'active');

-- Insert test orders
INSERT INTO orders (user_id, tool_id, start_date, end_date, status)
VALUES 
(1, 2, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'pending'),
(2, 3, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'pending'),
(1, 4, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '1 day', 'active');

-- Insert test rentals
INSERT INTO rentals (tool_id, renter_id, start_date, end_date, status, total_price)
VALUES 
(1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 'active', 75.00),
(2, 5, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '1 day', 'completed', 30.00),
(3, 1, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '4 days', 'pending', 70.00);

-- Insert test payments
INSERT INTO payments (rental_id, amount, payment_method, status, transaction_id)
VALUES
(1, 50.00, 'credit_card', 'completed', 'txn_123456789'),
(2, 75.00, 'paypal', 'completed', 'txn_234567890'),
(3, 100.00, 'credit_card', 'completed', 'txn_345678901');

-- Insert test support requests
INSERT INTO support_requests (user_id, type, message, status)
VALUES
(1, 'technical', 'Having issues with payment system', 'pending'),
(2, 'application', 'Need to update tool listing', 'finished'),
(5, 'other', 'Question about rental extension', 'pending'); 
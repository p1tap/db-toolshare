-- Payments Table Schema
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U your_username -d toolshare
-- 
-- 2. Execute this file:
--    \i db/schema/payments-schema.sql
--
-- 3. Or run individual commands by copying them into your psql console
--    or using a database client like pgAdmin or DBeaver.
--
-- NOTE: This script creates the payments table and inserts test data.
--       Make sure the rentals table exists before running this script.

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  rental_id INTEGER NOT NULL REFERENCES rentals(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT NOW(),
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_rental_id ON payments(rental_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- Insert test data
INSERT INTO payments (rental_id, amount, payment_method, status, transaction_id)
VALUES
  (1, 50.00, 'credit_card', 'completed', 'txn_123456789'),
  (2, 75.00, 'paypal', 'completed', 'txn_234567890'),
  (3, 100.00, 'credit_card', 'completed', 'txn_345678901'),
  (4, 60.00, 'credit_card', 'pending', 'txn_456789012'),
  (5, 120.00, 'bank_transfer', 'completed', 'txn_567890123'),
  (1, 25.00, 'credit_card', 'completed', 'txn_678901234') -- Additional payment for rental 1
ON CONFLICT DO NOTHING; 
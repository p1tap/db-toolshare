-- History Table Schema
-- 
-- HOW TO RUN:
-- 1. Connect to your PostgreSQL database:
--    psql -U postgres -h localhost -d toolshare
-- 
-- 2. Execute this file:
--    \i db/schema/history-schema.sql
--
-- 3. Or run individual commands by copying them into your psql console
--    or using a database client like pgAdmin or DBeaver.

-- Create history table
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  order_id INTEGER NOT NULL REFERENCES orders(id),
  detail TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_order_id ON history(order_id);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON history(created_at);

-- Insert some test data
INSERT INTO history (user_id, order_id, detail)
VALUES 
  (1, 1, 'Order placed for Tool Rental'),
  (1, 1, 'Payment completed'),
  (2, 2, 'Order placed for Tool Rental'),
  (2, 2, 'Order cancelled by user'),
  (3, 3, 'Order placed for Tool Rental'),
  (3, 3, 'Rental period started'),
  (3, 3, 'Rental period completed')
ON CONFLICT DO NOTHING; 
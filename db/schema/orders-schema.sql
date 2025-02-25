-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  tool_id INTEGER NOT NULL REFERENCES tools(id),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_order_dates CHECK (end_date > start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_tool_id ON orders(tool_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Insert some test data
INSERT INTO orders (user_id, tool_id, start_date, end_date, status)
VALUES 
  (1, 2, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'pending'),
  (2, 3, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'pending'),
  (1, 4, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '1 day', 'active'),
  (3, 5, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '2 days', 'completed'),
  (2, 6, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 'cancelled')
ON CONFLICT DO NOTHING; 
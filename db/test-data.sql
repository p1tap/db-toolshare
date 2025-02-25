-- Test data for the tool sharing application

-- Clear existing data (if needed)
-- TRUNCATE users, tools, rentals RESTART IDENTITY CASCADE;

-- Insert test users
INSERT INTO users (username, email, password, status)
VALUES 
  ('testuser1', 'user1@example.com', 'password123', 'active'),
  ('testuser2', 'user2@example.com', 'password123', 'active'),
  ('testuser3', 'user3@example.com', 'password123', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert test tools
INSERT INTO tools (name, price_per_day, description, image_url, owner_id, status)
VALUES 
  ('Power Drill', 15.99, 'High-powered drill for home projects', 'https://example.com/drill.jpg', 1, 'active'),
  ('Lawn Mower', 25.99, 'Gas-powered lawn mower', 'https://example.com/mower.jpg', 1, 'active'),
  ('Pressure Washer', 35.99, 'Electric pressure washer for cleaning', 'https://example.com/washer.jpg', 2, 'active'),
  ('Chainsaw', 30.99, 'Gas-powered chainsaw', 'https://example.com/chainsaw.jpg', 2, 'active'),
  ('Ladder', 10.99, '8-foot aluminum ladder', 'https://example.com/ladder.jpg', 3, 'active')
ON CONFLICT DO NOTHING;

-- Insert test rentals
INSERT INTO rentals (tool_id, renter_id, start_date, end_date, status, total_price)
VALUES 
  (1, 2, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'pending', 47.97),
  (2, 3, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'pending', 77.97),
  (3, 1, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '1 day', 'active', 107.97),
  (4, 3, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '2 days', 'completed', 92.97),
  (5, 2, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 'cancelled', 21.98)
ON CONFLICT DO NOTHING;

-- Select data to verify
SELECT 'Users:' AS table_name;
SELECT * FROM users;

SELECT 'Tools:' AS table_name;
SELECT * FROM tools;

SELECT 'Rentals:' AS table_name;
SELECT * FROM rentals; 
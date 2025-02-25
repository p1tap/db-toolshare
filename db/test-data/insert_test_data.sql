-- Insert test users (including all roles)
INSERT INTO users (username, email, password, role, address, phone, date_of_birth) VALUES
('john_user', 'john@example.com', 'password123', 'user', '123 Main St, City', '555-0101', '1990-01-15'),
('sarah_renter', 'sarah@example.com', 'password123', 'renter', '456 Oak St, City', '555-0102', '1985-03-20'),
('admin_jane', 'admin@example.com', 'admin123', 'admin', '789 Admin St, City', '555-0103', '1988-07-10'),
('mike_renter', 'mike@example.com', 'password123', 'renter', '321 Pine St, City', '555-0104', '1992-11-05'),
('lisa_user', 'lisa@example.com', 'password123', 'user', '654 Elm St, City', '555-0105', '1995-09-25');

-- Insert tools (owned by renters)
INSERT INTO tools (name, price_per_day, description, image_url, owner_id, status) VALUES
('Power Drill', 25.00, 'Professional grade power drill', '/images/tools/powerdrill.jpg', 2, 'active'),
('Hammer', 15.00, 'Heavy-duty hammer', '/images/tools/hammer.jpg', 2, 'active'),
('Wrench Set', 35.00, 'Complete wrench set', '/images/tools/wrench-set.jpg', 4, 'active'),
('Circular Saw', 45.00, 'Electric circular saw', '/images/tools/circular-saw.jpg', 4, 'active'),
('Measuring Tape', 10.00, 'Professional measuring tape', '/images/tools/measuring-tape.jpg', 2, 'active'),
('Screwdriver Set', 20.00, 'Multi-head screwdriver set', '/images/tools/screwdiver-set.jpg', 4, 'active'),
('Level Tool', 18.00, 'Professional level tool', '/images/tools/leveling-tool.jpg', 2, 'active'),
('Pliers', 12.00, 'Multi-purpose pliers', '/images/tools/piler.jpg', 4, 'active'),
('Wire Cutter', 15.00, 'Heavy-duty wire cutter', '/images/tools/wire-cutter.jpg', 2, 'active'),
('Heat Gun', 40.00, 'Industrial heat gun', '/images/tools/Heat-gun.jpg', 4, 'active');

-- Insert rentals (some active, some completed)
INSERT INTO rentals (tool_id, renter_id, start_date, end_date, status, pickup_location, total_price) VALUES
(1, 1, '2024-02-15', '2024-02-18', 'active', '123 Main St, City', 75.00),
(2, 5, '2024-02-10', '2024-02-12', 'completed', '654 Elm St, City', 30.00),
(3, 1, '2024-02-20', '2024-02-22', 'pending', '123 Main St, City', 70.00),
(4, 5, '2024-02-25', '2024-02-27', 'pending', '654 Elm St, City', 90.00);

-- Insert support requests
INSERT INTO support_requests (user_id, type, message, status) VALUES
(1, 'technical', 'Having issues with payment system', 'pending'),
(2, 'application', 'Need to update tool listing', 'finished'),
(5, 'other', 'Question about rental extension', 'pending'),
(4, 'technical', 'Cannot upload tool images', 'pending'); 
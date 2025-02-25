-- Insert test tools (using existing user IDs from our database)
INSERT INTO tools (name, price_per_day, description, image_url, owner_id, status)
VALUES 
    ('Power Drill', 25.99, 'Professional grade power drill with multiple attachments', 'https://example.com/drill.jpg', 2, 'active'),
    ('Lawn Mower', 45.00, 'Gas-powered lawn mower, perfect for medium to large yards', 'https://example.com/mower.jpg', 2, 'active'),
    ('Pressure Washer', 35.50, 'High-pressure water cleaner for outdoor surfaces', 'https://example.com/washer.jpg', 3, 'active'),
    ('Table Saw', 50.00, 'Professional table saw with safety features', 'https://example.com/saw.jpg', 4, 'active'),
    ('Paint Sprayer', 30.00, 'Electric paint sprayer for quick and even coverage', 'https://example.com/sprayer.jpg', 4, 'active');

-- Note: We're using user IDs 2, 3, and 4 as owners since they should be active users in our database 
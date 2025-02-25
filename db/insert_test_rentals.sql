-- Insert test rentals
INSERT INTO rentals (tool_id, renter_id, start_date, end_date, status, total_price)
VALUES 
    -- Active rentals
    (1, 5, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 'active', 75.00),  -- Power Drill rented by lisa_user
    (2, 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 'active', 30.00),  -- Hammer rented by admin_jane
    
    -- Completed rentals
    (3, 5, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '2 days', 'completed', 105.00),  -- Wrench Set
    (4, 3, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 'completed', 90.00),  -- Circular Saw
    
    -- Pending rentals
    (5, 5, CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', 'pending', 20.00),  -- Measuring Tape
    
    -- Cancelled rental
    (6, 3, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 'cancelled', 40.00);  -- Screwdriver Set 
-- Direct SQL insert to test role assignment
INSERT INTO users (
  username, 
  email, 
  password, 
  role, 
  status, 
  address, 
  phone, 
  date_of_birth, 
  full_name
) VALUES (
  'testrenter_sql', 
  'testrenter_sql@example.com', 
  '123456', 
  'renter', -- Must be one of: 'user', 'renter', 'admin'
  'active', 
  NULL, 
  NULL, 
  NULL, 
  'Test SQL'
);

-- Verify the insertion
SELECT id, username, email, role, status, full_name
FROM users
WHERE username = 'testrenter_sql'; 
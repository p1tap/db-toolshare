-- SQL query to fetch all orders for user 'dan15985'
SELECT 
  o.id,
  o.status,
  o.start_date,
  o.end_date,
  o.created_at,
  o.delivery_type,
  o.delivery_address,
  t.name as tool_name,
  t.price_per_day,
  t.description as tool_description,
  t.image_url as tool_image,
  u_owner.username as owner_name
FROM 
  orders o
JOIN 
  users u ON o.user_id = u.id
JOIN 
  tools t ON o.tool_id = t.id
JOIN 
  users u_owner ON t.owner_id = u_owner.id
WHERE 
  u.username = 'dan15985'
ORDER BY 
  o.created_at DESC; 
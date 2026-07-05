-- SQL query to fetch all tools
    SELECT 
      t.id,
      t.name,
      t.price_per_day,
      t.description,
      t.image_url,
      t.owner_id,
      t.status,
      t.created_at,
      u.username as owner_name
    FROM 
      tools t
    JOIN 
      users u ON t.owner_id = u.id
    WHERE 
      t.status = 'active'
    ORDER BY 
      t.created_at DESC; 
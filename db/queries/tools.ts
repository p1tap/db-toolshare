import pool from "../config";

// Tool Types
export interface Tool {
  id: number;
  name: string;
  price_per_day: number;
  description: string;
  image_url: string;
  owner_id: number;
  status: "active" | "inactive";
  created_at: Date;
  owner_name?: string;
}

export interface CreateToolParams {
  name: string;
  price_per_day: number;
  description: string;
  image_url: string;
  owner_id: number;
}

// Create a new tool
export async function createTool(params: CreateToolParams): Promise<Tool> {
  const { name, price_per_day, description, image_url, owner_id } = params;

  const result = await pool.query(`
    INSERT INTO tools (name, price_per_day, description, image_url, owner_id, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
  `, [name, price_per_day, description, image_url, owner_id]);

  return result.rows[0] as Tool;
}

// Get all tools with owner details
export async function getTools(): Promise<Tool[]> {
  const result = await pool.query(`
    SELECT t.*, u.username as owner_name
    FROM tools t
    JOIN users u ON t.owner_id = u.id
    WHERE t.status = 'active'
    ORDER BY t.created_at DESC
  `);

  return result.rows as Tool[];
}

// Get tool by ID with owner details
export async function getToolById(id: number): Promise<Tool | null> {
  console.log('getToolById called with id:', id);
  try {
    const result = await pool.query(`
      SELECT t.*, u.username as owner_name
      FROM tools t
      JOIN users u ON t.owner_id = u.id
      WHERE t.id = $1 AND t.status = 'active'
    `, [id]);

    console.log('Database query result:', result.rows);
    return (result.rows[0] as Tool) || null;
  } catch (error) {
    console.error('Error in getToolById:', error);
    throw error; // Re-throw to be caught by the API route
  }
}

// Get tools by owner ID
export async function getToolsByOwnerId(ownerId: number): Promise<Tool[]> {
  const result = await pool.query(`
    SELECT t.*, u.username as owner_name
    FROM tools t
    JOIN users u ON t.owner_id = u.id
    WHERE t.owner_id = $1 AND t.status = 'active'
    ORDER BY t.created_at DESC
  `, [ownerId]);

  return result.rows as Tool[];
}

// Update tool
export async function updateTool(
  id: number,
  params: Partial<CreateToolParams & { status?: string }>
): Promise<Tool | null> {
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (params.name !== undefined) {
    updates.push(`name = $${updates.length + 1}`);
    values.push(params.name);
  }

  if (params.price_per_day !== undefined) {
    updates.push(`price_per_day = $${updates.length + 1}`);
    values.push(params.price_per_day);
  }

  if (params.description !== undefined) {
    updates.push(`description = $${updates.length + 1}`);
    values.push(params.description);
  }

  if (params.image_url !== undefined) {
    updates.push(`image_url = $${updates.length + 1}`);
    values.push(params.image_url);
  }

  if (params.status !== undefined) {
    updates.push(`status = $${updates.length + 1}`);
    values.push(params.status);
  }

  if (updates.length === 0) return null;

  values.push(id);

  const query = `
    UPDATE tools
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return (result.rows[0] as Tool) || null;
}

// Delete tool (soft delete)
export async function deleteTool(id: number): Promise<Tool | null> {
  const result = await pool.query(`
    UPDATE tools
    SET status = 'inactive'
    WHERE id = $1 AND status = 'active'
    RETURNING *
  `, [id]);

  return (result.rows[0] as Tool) || null;
}

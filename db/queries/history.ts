import pool from "../config";

export interface History {
  id: number;
  user_id: number;
  order_id: number;
  detail: string;
  created_at: Date;
  user_name?: string;
  order_details?: {
    tool_name: string;
    start_date: Date;
    end_date: Date;
    status: string;
  };
}

export interface CreateHistoryParams {
  user_id: number;
  order_id: number;
  detail: string;
}

// Create a new history entry
export async function createHistory(params: CreateHistoryParams): Promise<History> {
  const { user_id, order_id, detail } = params;

  const result = await pool.query(`
    INSERT INTO history (user_id, order_id, detail)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [user_id, order_id, detail]);

  return result.rows[0] as History;
}

// Get all history entries with user and order details
export async function getHistoryWithDetails(): Promise<History[]> {
  const results = await pool.query(`
    SELECT 
      h.*,
      u.username as user_name,
      t.name as tool_name,
      o.start_date,
      o.end_date,
      o.status
    FROM history h
    JOIN users u ON h.user_id = u.id
    JOIN orders o ON h.order_id = o.id
    JOIN tools t ON o.tool_id = t.id
    ORDER BY h.created_at DESC
  `);

  return results.rows.map(row => ({
    ...row,
    order_details: {
      tool_name: row.tool_name,
      start_date: row.start_date,
      end_date: row.end_date,
      status: row.status
    }
  })) as History[];
}

// Get history by ID with details
export async function getHistoryById(id: number): Promise<History | null> {
  const results = await pool.query(`
    SELECT 
      h.*,
      u.username as user_name,
      t.name as tool_name,
      o.start_date,
      o.end_date,
      o.status
    FROM history h
    JOIN users u ON h.user_id = u.id
    JOIN orders o ON h.order_id = o.id
    JOIN tools t ON o.tool_id = t.id
    WHERE h.id = $1
  `, [id]);

  if (results.rows.length === 0) return null;

  const row = results.rows[0];
  return {
    ...row,
    order_details: {
      tool_name: row.tool_name,
      start_date: row.start_date,
      end_date: row.end_date,
      status: row.status
    }
  } as History;
}

// Get history entries by user ID
export async function getHistoryByUserId(userId: number): Promise<History[]> {
  const results = await pool.query(`
    SELECT 
      h.*,
      u.username as user_name,
      t.name as tool_name,
      o.start_date,
      o.end_date,
      o.status
    FROM history h
    JOIN users u ON h.user_id = u.id
    JOIN orders o ON h.order_id = o.id
    JOIN tools t ON o.tool_id = t.id
    WHERE h.user_id = $1
    ORDER BY h.created_at DESC
  `, [userId]);

  return results.rows.map(row => ({
    ...row,
    order_details: {
      tool_name: row.tool_name,
      start_date: row.start_date,
      end_date: row.end_date,
      status: row.status
    }
  })) as History[];
}

// Get history entries by order ID
export async function getHistoryByOrderId(orderId: number): Promise<History[]> {
  const results = await pool.query(`
    SELECT 
      h.*,
      u.username as user_name,
      t.name as tool_name,
      o.start_date,
      o.end_date,
      o.status
    FROM history h
    JOIN users u ON h.user_id = u.id
    JOIN orders o ON h.order_id = o.id
    JOIN tools t ON o.tool_id = t.id
    WHERE h.order_id = $1
    ORDER BY h.created_at DESC
  `, [orderId]);

  return results.rows.map(row => ({
    ...row,
    order_details: {
      tool_name: row.tool_name,
      start_date: row.start_date,
      end_date: row.end_date,
      status: row.status
    }
  })) as History[];
}

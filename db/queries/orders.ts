import pool from "../config";

// Order Types
export type OrderStatus = "pending" | "active" | "completed" | "cancelled";

export interface Order {
  id: number;
  user_id: number;
  tool_id: number;
  status: OrderStatus;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  user_name?: string;
  tool_name?: string;
  delivery_type?: 'pickup' | 'delivery';
  delivery_address?: string | null;
}

export interface CreateOrderParams {
  user_id: number;
  tool_id: number;
  start_date: Date;
  end_date: Date;
  status?: OrderStatus;
  delivery_type?: 'pickup' | 'delivery';
  delivery_address?: string | null;
}

export interface UpdateOrderParams {
  status?: OrderStatus;
  start_date?: Date;
  end_date?: Date;
}

// Create a new order
export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const { user_id, tool_id, start_date, end_date, status, delivery_type, delivery_address } = params;

  const result = await pool.query(`
    INSERT INTO orders (
      user_id, tool_id, start_date, end_date, status, delivery_type, delivery_address
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )
    RETURNING *
  `, [user_id, tool_id, start_date.toISOString(), end_date.toISOString(), status || 'pending', delivery_type, delivery_address]);

  return result.rows[0] as Order;
}

// Get all orders with user and tool details
export async function getOrdersWithDetails(): Promise<Order[]> {
  const orders = await pool.query(`
    SELECT 
      o.*,
      u.username as user_name,
      t.name as tool_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN tools t ON o.tool_id = t.id
    ORDER BY o.created_at DESC
  `);

  return orders.rows as Order[];
}

// Get order by ID with user and tool details
export async function getOrderById(id: number): Promise<Order | null> {
  const results = await pool.query(`
    SELECT 
      o.*,
      u.username as user_name,
      t.name as tool_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN tools t ON o.tool_id = t.id
    WHERE o.id = $1
  `, [id]);

  return (results.rows[0] as Order) || null;
}

// Get orders by user ID
export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const orders = await pool.query(`
    SELECT 
      o.*,
      u.username as user_name,
      t.name as tool_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN tools t ON o.tool_id = t.id
    WHERE o.user_id = $1
    ORDER BY o.created_at DESC
  `, [userId]);

  return orders.rows as Order[];
}

// Update order
export async function updateOrder(
  id: number,
  params: UpdateOrderParams
): Promise<Order | null> {
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (params.status !== undefined) {
    updates.push(`status = $${updates.length + 1}`);
    values.push(params.status);
  }

  if (params.start_date !== undefined) {
    updates.push(`start_date = $${updates.length + 1}`);
    values.push(params.start_date.toISOString());
  }

  if (params.end_date !== undefined) {
    updates.push(`end_date = $${updates.length + 1}`);
    values.push(params.end_date.toISOString());
  }

  if (updates.length === 0) return null;

  values.push(id);

  const query = `
    UPDATE orders
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return (result.rows[0] as Order) || null;
}

// Cancel order
export async function cancelOrder(id: number): Promise<Order | null> {
  const result = await pool.query(`
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = $1
    RETURNING *
  `, [id]);

  return (result.rows[0] as Order) || null;
}

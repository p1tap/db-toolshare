import pool from "./config";

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  created_at: Date;
}

export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
}

// Create a new user
export async function createUser(params: CreateUserParams): Promise<User> {
  const { username, email, password } = params;

  const result = await pool.query(`
    INSERT INTO users (username, email, password, status)
    VALUES ($1, $2, $3, 'active')
    RETURNING *
  `, [username, email, password]);

  return result.rows[0] as User;
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const result = await pool.query(`
    SELECT * FROM users
    WHERE id = $1 AND status = 'active'
  `, [id]);

  return (result.rows[0] as User) || null;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(`
    SELECT * FROM users
    WHERE email = $1 AND status = 'active'
  `, [email]);

  return (result.rows[0] as User) || null;
}

// Get user by username
export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const result = await pool.query(`
    SELECT * FROM users
    WHERE username = $1 AND status = 'active'
  `, [username]);

  return (result.rows[0] as User) || null;
}

// Get all users
export async function getUsers(): Promise<User[]> {
  const result = await pool.query(`
    SELECT * FROM users
    WHERE status = 'active'
    ORDER BY created_at DESC
  `);

  return result.rows as User[];
}

// Update user
export async function updateUser(
  id: number,
  params: Partial<CreateUserParams>
): Promise<User | null> {
  const updates: string[] = [];
  const values: string[] = [];

  if (params.username !== undefined) {
    updates.push(`username = $${updates.length + 1}`);
    values.push(params.username);
  }

  if (params.email !== undefined) {
    updates.push(`email = $${updates.length + 1}`);
    values.push(params.email);
  }

  if (params.password !== undefined) {
    updates.push(`password = $${updates.length + 1}`);
    values.push(params.password);
  }

  if (updates.length === 0) return null;

  values.push(id.toString());

  const query = `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = $${values.length} AND status = 'active'
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return (result.rows[0] as User) || null;
}

// Delete user (soft delete)
export async function deleteUser(id: number): Promise<User | null> {
  const result = await pool.query(`
    UPDATE users
    SET status = 'inactive'
    WHERE id = $1 AND status = 'active'
    RETURNING *
  `, [id]);

  return (result.rows[0] as User) || null;
}

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
  const result = await pool.query(`
    SELECT t.*, u.username as owner_name
    FROM tools t
    JOIN users u ON t.owner_id = u.id
    WHERE t.id = $1 AND t.status = 'active'
  `, [id]);

  return (result.rows[0] as Tool) || null;
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
  params: Partial<CreateToolParams>
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

  if (updates.length === 0) return null;

  values.push(id);

  const query = `
    UPDATE tools
    SET ${updates.join(", ")}
    WHERE id = $${values.length} AND status = 'active'
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

// Rental Types
export type RentalStatus = "pending" | "active" | "completed" | "cancelled";

export interface Rental {
  id: number;
  tool_id: number;
  renter_id: number;
  start_date: Date;
  end_date: Date;
  status: RentalStatus;
  total_price: number;
  created_at: Date;
  tool_name?: string;
  renter_name?: string;
}

export interface CreateRentalParams {
  tool_id: number;
  renter_id: number;
  start_date: Date;
  end_date: Date;
  total_price: number;
}

export interface UpdateRentalParams {
  start_date?: Date;
  end_date?: Date;
  status?: RentalStatus;
  total_price?: number;
}

// Create a new rental
export async function createRental(
  params: CreateRentalParams
): Promise<Rental> {
  const { tool_id, renter_id, start_date, end_date, total_price } = params;

  const result = await pool.query(`
    INSERT INTO rentals (
      tool_id, renter_id, start_date, end_date, status, total_price
    ) VALUES (
      $1, $2, $3, $4, 'pending', $5
    )
    RETURNING *
  `, [tool_id, renter_id, start_date.toISOString(), end_date.toISOString(), total_price]);

  return result.rows[0] as Rental;
}

// Get all rentals with tool and renter details
export async function getRentalsWithDetails(): Promise<Rental[]> {
  const rentals = await pool.query(`
    SELECT 
      r.*,
      t.name as tool_name,
      u.username as renter_name
    FROM rentals r
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    ORDER BY r.created_at DESC
  `);

  return rentals.rows as Rental[];
}

// Get rental by ID with tool and renter details
export async function getRentalById(id: number): Promise<Rental | null> {
  const results = await pool.query(`
    SELECT 
      r.*,
      t.name as tool_name,
      u.username as renter_name
    FROM rentals r
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    WHERE r.id = $1
  `, [id]);

  return (results.rows[0] as Rental) || null;
}

// Get rentals by user ID (as renter)
export async function getRentalsByUserId(userId: number): Promise<Rental[]> {
  const rentals = await pool.query(`
    SELECT 
      r.*,
      t.name as tool_name,
      u.username as renter_name
    FROM rentals r
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    WHERE r.renter_id = $1
    ORDER BY r.created_at DESC
  `, [userId]);

  return rentals.rows as Rental[];
}

// Get rentals by tool ID
export async function getRentalsByToolId(toolId: number): Promise<Rental[]> {
  const rentals = await pool.query(`
    SELECT 
      r.*,
      t.name as tool_name,
      u.username as renter_name
    FROM rentals r
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    WHERE r.tool_id = $1
    ORDER BY r.created_at DESC
  `, [toolId]);

  return rentals.rows as Rental[];
}

// Update rental
export async function updateRental(
  id: number,
  params: UpdateRentalParams
): Promise<Rental | null> {
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (params.start_date !== undefined) {
    updates.push(`start_date = $${updates.length + 1}`);
    values.push(params.start_date.toISOString());
  }

  if (params.end_date !== undefined) {
    updates.push(`end_date = $${updates.length + 1}`);
    values.push(params.end_date.toISOString());
  }

  if (params.status !== undefined) {
    updates.push(`status = $${updates.length + 1}`);
    values.push(params.status);
  }

  if (params.total_price !== undefined) {
    updates.push(`total_price = $${updates.length + 1}`);
    values.push(params.total_price);
  }

  if (updates.length === 0) return null;

  values.push(id);

  const query = `
    UPDATE rentals
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return (result.rows[0] as Rental) || null;
}

// Cancel rental
export async function cancelRental(id: number): Promise<Rental | null> {
  const result = await pool.query(`
    UPDATE rentals
    SET status = 'cancelled'
    WHERE id = $1
    RETURNING *
  `, [id]);

  return (result.rows[0] as Rental) || null;
}

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
}

export interface CreateOrderParams {
  user_id: number;
  tool_id: number;
  start_date: Date;
  end_date: Date;
}

export interface UpdateOrderParams {
  status?: OrderStatus;
  start_date?: Date;
  end_date?: Date;
}

// Create a new order
export async function createOrder(params: CreateOrderParams): Promise<Order> {
  const { user_id, tool_id, start_date, end_date } = params;

  const result = await pool.query(`
    INSERT INTO orders (
      user_id, tool_id, start_date, end_date, status
    ) VALUES (
      $1, $2, $3, $4, 'pending'
    )
    RETURNING *
  `, [user_id, tool_id, start_date.toISOString(), end_date.toISOString()]);

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

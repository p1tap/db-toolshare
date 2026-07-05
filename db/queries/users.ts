import pool from "../config";

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role?: "user" | "renter" | "admin";
  status: "active" | "inactive";
  created_at: Date;
  address?: string;
  phone?: string;
  date_of_birth?: Date;
  full_name?: string;
}

export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  role?: string;
  address?: string;
  phone?: string;
  date_of_birth?: Date;
  full_name?: string;
}

export type UpdateUserParams = Partial<CreateUserParams> & {
  status?: User["status"];
};

// Create a new user
export async function createUser(params: CreateUserParams): Promise<User> {
  const { username, email, password, role, address, phone, date_of_birth, full_name } = params;

  // Ensure role is one of the allowed values or default to 'user'
  const validRole = role && ['user', 'renter', 'admin'].includes(role) ? role : 'user';

  const result = await pool.query(`
    INSERT INTO users (username, email, password, role, status, address, phone, date_of_birth, full_name)
    VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, $8)
    RETURNING *
  `, [username, email, password, validRole, address || null, phone || null, date_of_birth || null, full_name || null]);

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
  params: UpdateUserParams
): Promise<User | null> {
  const updates: string[] = [];
  const values: any[] = [];

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

  if (params.role !== undefined) {
    updates.push(`role = $${updates.length + 1}`);
    values.push(params.role);
  }

  if (params.status !== undefined) {
    updates.push(`status = $${updates.length + 1}`);
    values.push(params.status);
  }
  
  if (params.address !== undefined) {
    updates.push(`address = $${updates.length + 1}`);
    values.push(params.address);
  }
  
  if (params.phone !== undefined) {
    updates.push(`phone = $${updates.length + 1}`);
    values.push(params.phone);
  }
  
  if (params.date_of_birth !== undefined) {
    updates.push(`date_of_birth = $${updates.length + 1}`);
    values.push(params.date_of_birth);
  }
  
  if (params.full_name !== undefined) {
    updates.push(`full_name = $${updates.length + 1}`);
    values.push(params.full_name);
  }

  if (updates.length === 0) return null;

  values.push(id);

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

import pool from "../config";

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

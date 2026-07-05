import pool from "../config";

// Payment Types
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: number;
  rental_id: number;
  amount: number;
  payment_date: Date;
  payment_method: string;
  status: PaymentStatus;
  transaction_id: string;
  created_at: Date;
  rental_details?: {
    tool_name: string;
    renter_name: string;
  };
}

export interface CreatePaymentParams {
  rental_id: number;
  amount: number;
  payment_method: string;
  transaction_id?: string;
}

export interface UpdatePaymentParams {
  status?: PaymentStatus;
  transaction_id?: string;
}

// Create a new payment
export async function createPayment(params: CreatePaymentParams): Promise<Payment> {
  const { rental_id, amount, payment_method, transaction_id } = params;

  const result = await pool.query(`
    INSERT INTO payments (rental_id, amount, payment_method, transaction_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [rental_id, amount, payment_method, transaction_id || null]);

  return result.rows[0] as Payment;
}

// Get all payments with rental details
export async function getPaymentsWithDetails(): Promise<Payment[]> {
  const result = await pool.query(`
    SELECT 
      p.*,
      t.name as tool_name,
      u.username as renter_name
    FROM payments p
    JOIN rentals r ON p.rental_id = r.id
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    ORDER BY p.payment_date DESC
  `);

  return result.rows.map(row => {
    const payment = row as Payment;
    payment.rental_details = {
      tool_name: row.tool_name,
      renter_name: row.renter_name
    };
    return payment;
  });
}

// Get payment by ID with rental details
export async function getPaymentById(id: number): Promise<Payment | null> {
  const result = await pool.query(`
    SELECT 
      p.*,
      t.name as tool_name,
      u.username as renter_name
    FROM payments p
    JOIN rentals r ON p.rental_id = r.id
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    WHERE p.id = $1
  `, [id]);

  if (result.rows.length === 0) return null;

  const payment = result.rows[0] as Payment;
  payment.rental_details = {
    tool_name: result.rows[0].tool_name,
    renter_name: result.rows[0].renter_name
  };
  return payment;
}

// Get payments by rental ID
export async function getPaymentsByRentalId(rentalId: number): Promise<Payment[]> {
  const result = await pool.query(`
    SELECT 
      p.*,
      t.name as tool_name,
      u.username as renter_name
    FROM payments p
    JOIN rentals r ON p.rental_id = r.id
    JOIN tools t ON r.tool_id = t.id
    JOIN users u ON r.renter_id = u.id
    WHERE p.rental_id = $1
    ORDER BY p.payment_date DESC
  `, [rentalId]);

  return result.rows.map(row => {
    const payment = row as Payment;
    payment.rental_details = {
      tool_name: row.tool_name,
      renter_name: row.renter_name
    };
    return payment;
  });
}

// Update payment
export async function updatePayment(
  id: number,
  params: UpdatePaymentParams
): Promise<Payment | null> {
  const updates: string[] = [];
  const values: any[] = [];

  if (params.status !== undefined) {
    updates.push(`status = $${updates.length + 1}`);
    values.push(params.status);
  }

  if (params.transaction_id !== undefined) {
    updates.push(`transaction_id = $${updates.length + 1}`);
    values.push(params.transaction_id);
  }

  if (updates.length === 0) return null;

  values.push(id);

  const result = await pool.query(`
    UPDATE payments
    SET ${updates.join(', ')}
    WHERE id = $${values.length}
    RETURNING *
  `, values);

  return (result.rows[0] as Payment) || null;
}

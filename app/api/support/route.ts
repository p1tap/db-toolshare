import { NextResponse } from 'next/server';
import pool from '@/db/config';

export async function GET() {
  try {
    const query = `
      SELECT 
        sr.id,
        sr.type,
        sr.message,
        sr.status,
        sr.created_at,
        u.username,
        u.email,
        u.phone,
        u.address
      FROM support_requests sr
      LEFT JOIN users u ON sr.user_id = u.id
      ORDER BY sr.created_at DESC
    `;

    const result = await pool.query(query);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching support requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch support requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, phoneNumber, address, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Insert into support_requests table
    const query = `
      INSERT INTO support_requests (type, message, status, name, email, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = ['general', message, 'pending', name, email, phoneNumber || null, address || null];
    const result = await pool.query(query, values);

    return NextResponse.json(
      { message: 'Support request submitted successfully', id: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting support request:', error);
    return NextResponse.json(
      { error: 'Failed to submit support request' },
      { status: 500 }
    );
  }
} 
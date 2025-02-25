import { NextResponse } from 'next/server';
import pool from '@/db/config';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id: paramId } = await params;
    const id = parseInt(paramId);

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400 }
      );
    }

    if (!['finished', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE support_requests
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'Support request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating support request:', error);
    return NextResponse.json(
      { error: 'Failed to update support request' },
      { status: 500 }
    );
  }
} 
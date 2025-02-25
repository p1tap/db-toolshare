import { NextResponse } from "next/server";
import pool from "@/db/config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all completed rentals where the tools are owned by this user
    const result = await pool.query(`
      SELECT 
        r.*,
        t.name as tool_name,
        u.username as renter_name
      FROM rentals r
      JOIN tools t ON r.tool_id = t.id
      JOIN users u ON r.renter_id = u.id
      WHERE t.owner_id = $1 AND r.status = 'completed'
      ORDER BY r.created_at DESC
    `, [userId]);

    // Calculate total balance
    const totalBalance = result.rows.reduce((sum, rental) => sum + parseFloat(rental.total_price), 0);

    // Transform rentals into balance history entries
    const history = result.rows.map(rental => ({
      date: rental.created_at,
      amount: rental.total_price,
      renterName: rental.renter_name,
      toolName: rental.name,
      duration: Math.ceil((new Date(rental.end_date).getTime() - new Date(rental.start_date).getTime()) / (1000 * 60 * 60 * 24))
    }));

    return NextResponse.json({
      currentBalance: totalBalance,
      history: history
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
} 
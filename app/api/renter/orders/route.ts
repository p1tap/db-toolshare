import { NextResponse } from "next/server";
import { getRentalsByUserId, getToolsByOwnerId } from "@/db/utils";
import pool from "@/db/config";

export async function GET(request: Request) {
  try {
    // Get owner_id from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get rentals for tools owned by this user
    const result = await pool.query(`
      SELECT 
        r.*,
        t.name as tool_name,
        u.username as renter_name
      FROM rentals r
      JOIN tools t ON r.tool_id = t.id
      JOIN users u ON r.renter_id = u.id
      WHERE t.owner_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    const rentals = result.rows;

    // Transform rentals into orders with additional details
    const orders = rentals.map(rental => ({
      id: `ORD-${rental.id}`,
      toolName: rental.tool_name || 'Unknown Tool',
      duration: calculateDuration(rental.start_date, rental.end_date),
      startDate: formatDate(rental.start_date),
      type: "Pickup", // You might want to add this to your rental schema
      status: getStatusDisplay(rental.status),
      action: getActionForStatus(rental.status),
      message: getMessageForStatus(rental.status),
      price: Number(rental.total_price) || 0, // Ensure price is a number
      renterName: rental.renter_name || 'Unknown User',
      location: "123 Tool Street, Tool City, TC 12345", // Default mock location
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching renter orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateDuration(startDate: Date, endDate: Date): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (new Date() < end) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else {
    return 'completed';
  }
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');
}

function getStatusDisplay(status: string): string {
  switch (status) {
    case 'pending':
      return 'Waiting for user pickup';
    case 'active':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

function getActionForStatus(status: string): string | undefined {
  switch (status) {
    case 'pending':
      return 'confirm pickup'; // Owner confirms when user picks up
    case 'active':
      return 'confirm return'; // Owner confirms when they receive the tool back
    default:
      return undefined;
  }
}

function getMessageForStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'waiting for user to pick up';
    case 'active':
      return 'click confirm return when you receive the tool back';
    case 'completed':
      return 'order completed';
    case 'cancelled':
      return 'order cancelled';
    default:
      return '';
  }
} 
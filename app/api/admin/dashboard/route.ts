import { NextResponse } from 'next/server';
import pool from '@/db/config';

export async function GET() {
  try {
    // Get total tools and active tools
    const toolsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        MAX(price_per_day) as highest_price,
        AVG(price_per_day) as average_price
      FROM tools
    `);

    // Get top categories (using tool names as categories for simplicity)
    const categoriesResult = await pool.query(`
      SELECT 
        SPLIT_PART(name, ' ', -1) as category,
        COUNT(*) as count
      FROM tools
      GROUP BY SPLIT_PART(name, ' ', -1)
      ORDER BY count DESC
      LIMIT 5
    `);

    // Get recent tools
    const recentToolsResult = await pool.query(`
      SELECT t.id, t.name, t.price_per_day, u.username as owner_name, t.created_at
      FROM tools t
      JOIN users u ON t.owner_id = u.id
      WHERE t.status = 'active'
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    const stats = {
      totalTools: parseInt(toolsResult.rows[0].total),
      activeTools: parseInt(toolsResult.rows[0].active),
      highestPrice: parseFloat(toolsResult.rows[0].highest_price),
      averagePrice: parseFloat(toolsResult.rows[0].average_price),
      topCategories: categoriesResult.rows.map(row => ({
        name: row.category,
        count: parseInt(row.count)
      })),
      recentTools: recentToolsResult.rows
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 
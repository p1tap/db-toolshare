import { NextResponse } from "next/server";
import { getRentalById, updateRental, cancelRental } from "@/db/utils";
import { z } from "zod";
import pool from "@/db/config";

// Schema for rental updates
const updateRentalSchema = z.object({
  start_date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  end_date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  status: z.enum(["pending", "active", "completed", "cancelled"]).optional(),
  total_price: z.number().positive().optional(),
});

// Helper function to validate and parse rental ID
function validateRentalId(params: { id: string }): number {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    throw new Error("Invalid rental ID");
  }
  return id;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const rental = await getRentalById(parseInt(id));

    if (!rental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    return NextResponse.json(rental);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid rental ID") {
      return NextResponse.json({ error: "Invalid rental ID" }, { status: 400 });
    }

    console.error("Failed to fetch rental:", error);
    return NextResponse.json(
      { error: "Failed to fetch rental" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const rentalId = parseInt(id);
    
    if (isNaN(rentalId)) {
      return NextResponse.json(
        { error: "Invalid rental ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!["pending", "active", "completed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Start a transaction to update both rentals and orders
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update rental status
      const rentalResult = await client.query(`
        UPDATE rentals
        SET status = $1
        WHERE id = $2
        RETURNING *
      `, [status, rentalId]);

      if (rentalResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { error: "Rental not found" },
          { status: 404 }
        );
      }

      // Find and update the corresponding order
      const orderResult = await client.query(`
        UPDATE orders
        SET status = $1
        WHERE tool_id = (
          SELECT tool_id FROM rentals WHERE id = $2
        )
        AND user_id = (
          SELECT renter_id FROM rentals WHERE id = $2
        )
        AND created_at = (
          SELECT created_at FROM rentals WHERE id = $2
        )
        RETURNING *
      `, [status, rentalId]);

      await client.query('COMMIT');

      return NextResponse.json({
        rental: rentalResult.rows[0],
        order: orderResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error updating rental:", error);
    return NextResponse.json(
      { error: "Failed to update rental" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const rentalId = parseInt(id);

    if (isNaN(rentalId)) {
      return NextResponse.json({ error: "Invalid rental ID" }, { status: 400 });
    }

    // Cancel rental
    const cancelledRental = await cancelRental(rentalId);
    if (!cancelledRental) {
      return NextResponse.json(
        { error: "Failed to cancel rental" },
        { status: 500 }
      );
    }

    return NextResponse.json(cancelledRental);
  } catch (error) {
    console.error("Failed to cancel rental:", error);
    return NextResponse.json(
      { error: "Failed to cancel rental" },
      { status: 500 }
    );
  }
}

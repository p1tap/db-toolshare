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
    const id = validateRentalId(params);
    const rental = await getRentalById(id);

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
    const { id } = params;
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

    // Update rental status
    const result = await pool.query(`
      UPDATE rentals
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, rentalId]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Rental not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
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
    const id = validateRentalId(params);

    // Check if rental exists
    const existingRental = await getRentalById(id);
    if (!existingRental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    // Cancel rental
    const cancelledRental = await cancelRental(id);
    if (!cancelledRental) {
      return NextResponse.json(
        { error: "Failed to cancel rental" },
        { status: 500 }
      );
    }

    return NextResponse.json(cancelledRental);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid rental ID") {
      return NextResponse.json({ error: "Invalid rental ID" }, { status: 400 });
    }

    console.error("Failed to cancel rental:", error);
    return NextResponse.json(
      { error: "Failed to cancel rental" },
      { status: 500 }
    );
  }
}

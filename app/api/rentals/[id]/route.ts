import { NextResponse } from "next/server";
import { getRentalById, updateRental, cancelRental } from "@/db/utils";
import { z } from "zod";

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
    const id = validateRentalId(params);
    const body = await request.json();

    // Validate request body
    const validatedData = updateRentalSchema.parse(body);

    // Check if rental exists
    const existingRental = await getRentalById(id);
    if (!existingRental) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    // Validate dates if provided
    if (validatedData.start_date && validatedData.end_date) {
      if (validatedData.end_date <= validatedData.start_date) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    } else if (validatedData.start_date && existingRental.end_date) {
      if (existingRental.end_date <= validatedData.start_date) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    } else if (validatedData.end_date && existingRental.start_date) {
      if (validatedData.end_date <= existingRental.start_date) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    }

    // Update rental
    const updatedRental = await updateRental(id, validatedData);
    if (!updatedRental) {
      return NextResponse.json(
        { error: "Failed to update rental" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedRental);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid rental ID") {
      return NextResponse.json({ error: "Invalid rental ID" }, { status: 400 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update rental:", error);
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

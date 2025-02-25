import { NextResponse } from "next/server";
import { createRental, getRentalsWithDetails } from "@/db/utils";
import { getToolById } from "@/db/utils";
import { z } from "zod";

// Schema for rental creation
const createRentalSchema = z.object({
  tool_id: z.number(),
  renter_id: z.number(),
  start_date: z.string().transform((str) => new Date(str)),
  end_date: z.string().transform((str) => new Date(str)),
  total_price: z.number().positive(),
});

export async function GET() {
  try {
    const rentals = await getRentalsWithDetails();
    return NextResponse.json(rentals);
  } catch (error) {
    console.error("Failed to fetch rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createRentalSchema.parse(body);

    // Check if tool exists and is active
    const tool = await getToolById(validatedData.tool_id);
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found or inactive" },
        { status: 404 }
      );
    }

    // Validate dates
    const startDate = validatedData.start_date;
    const endDate = validatedData.end_date;

    if (startDate < new Date()) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Create rental
    const rental = await createRental(validatedData);

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to create rental:", error);
    return NextResponse.json(
      { error: "Failed to create rental" },
      { status: 500 }
    );
  }
}

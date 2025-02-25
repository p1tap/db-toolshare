import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrdersWithDetails } from "@/db/utils";
import { getToolById } from "@/db/utils";
import { z } from "zod";

// Schema for order creation
const createOrderSchema = z.object({
  user_id: z.number(),
  tool_id: z.number(),
  start_date: z.string().transform((str) => new Date(str)),
  end_date: z.string().transform((str) => new Date(str)),
  status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional().default('pending'),
  delivery_type: z.enum(['pickup', 'delivery']).optional(),
  delivery_address: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const orders = await getOrdersWithDetails();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createOrderSchema.parse(body);

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

    // Create order
    const order = await createOrder(validatedData);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
} 
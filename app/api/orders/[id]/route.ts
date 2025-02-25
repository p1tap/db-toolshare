import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder, cancelOrder } from "@/db/utils";
import { z } from "zod";

// Schema for order update
const updateOrderSchema = z.object({
  status: z.enum(["pending", "active", "completed", "cancelled"]).optional(),
  start_date: z.string().transform((str) => new Date(str)).optional(),
  end_date: z.string().transform((str) => new Date(str)).optional(),
});

// Helper function to validate and parse order ID
function validateId(id: string): number {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid order ID");
  }
  return parsedId;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const parsedId = validateId(id);
    const order = await getOrderById(parsedId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const parsedId = validateId(id);
    const body = await request.json();

    // Validate request body
    const validatedData = updateOrderSchema.parse(body);

    // Validate dates if provided
    if (validatedData.start_date && validatedData.end_date) {
      const startDate = validatedData.start_date;
      const endDate = validatedData.end_date;

      if (endDate <= startDate) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    }

    // Update order
    const updatedOrder = await updateOrder(parsedId, validatedData);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Order not found or no changes provided" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Await params before accessing its properties
    const { id } = await params;
    const parsedId = validateId(id);
    const cancelledOrder = await cancelOrder(parsedId);

    if (!cancelledOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(cancelledOrder);
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
} 
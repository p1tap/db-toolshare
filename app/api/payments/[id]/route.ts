import { NextRequest, NextResponse } from "next/server";
import { getPaymentById, updatePayment } from "@/db/utils";
import { z } from "zod";

// Schema for payment update
const updatePaymentSchema = z.object({
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  transaction_id: z.string().optional(),
});

// Helper function to validate and parse payment ID
function validateId(id: string): number {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid payment ID");
  }
  return parsedId;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const parsedId = validateId(id);
    const payment = await getPaymentById(parsedId);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Failed to fetch payment:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment" },
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
    const parsedId = validateId(id);
    const body = await request.json();

    // Validate request body
    const validatedData = updatePaymentSchema.parse(body);

    // Update payment
    const updatedPayment = await updatePayment(parsedId, validatedData);

    if (!updatedPayment) {
      return NextResponse.json(
        { error: "Payment not found or no changes provided" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPayment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to update payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
} 
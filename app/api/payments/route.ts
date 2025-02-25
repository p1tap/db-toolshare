import { NextRequest, NextResponse } from "next/server";
import { getPaymentsWithDetails, createPayment } from "@/db/utils";
import { z } from "zod";

// Schema for payment creation
const createPaymentSchema = z.object({
  rental_id: z.number(),
  amount: z.number().positive(),
  payment_method: z.string(),
  transaction_id: z.string().optional(),
});

export async function GET() {
  try {
    const payments = await getPaymentsWithDetails();
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createPaymentSchema.parse(body);

    // Create payment
    const payment = await createPayment(validatedData);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to create payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
} 
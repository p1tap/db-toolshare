import { NextRequest, NextResponse } from "next/server";
import { getHistoryByOrderId } from "@/db/utils";

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
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = await params;
    const parsedOrderId = validateId(orderId);
    const history = await getHistoryByOrderId(parsedOrderId);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch order history" },
      { status: 500 }
    );
  }
} 
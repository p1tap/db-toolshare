import { NextRequest, NextResponse } from "next/server";
import { getOrdersByUserId } from "@/db/utils";

// Helper function to validate and parse user ID
function validateId(id: string): number {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid user ID");
  }
  return parsedId;
}

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Await params before accessing its properties
    const { userId } = await params;
    const parsedUserId = validateId(userId);
    const orders = await getOrdersByUserId(parsedUserId);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch user orders" },
      { status: 500 }
    );
  }
} 
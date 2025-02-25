import { NextRequest, NextResponse } from "next/server";
import { getHistoryByUserId } from "@/db/utils";

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
    const { userId } = await params;
    const parsedUserId = validateId(userId);
    const history = await getHistoryByUserId(parsedUserId);

    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch user history:", error);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
} 
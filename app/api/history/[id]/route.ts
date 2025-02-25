import { NextRequest, NextResponse } from "next/server";
import { getHistoryById } from "@/db/utils";

// Helper function to validate and parse history ID
function validateId(id: string): number {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid history ID");
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
    const historyEntry = await getHistoryById(parsedId);

    if (!historyEntry) {
      return NextResponse.json(
        { error: "History entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(historyEntry);
  } catch (error) {
    console.error("Failed to fetch history entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch history entry" },
      { status: 500 }
    );
  }
} 
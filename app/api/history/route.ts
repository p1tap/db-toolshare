import { NextRequest, NextResponse } from "next/server";
import { getHistoryWithDetails, createHistory } from "@/db/utils";
import { z } from "zod";

// Schema for history creation
const createHistorySchema = z.object({
  user_id: z.number(),
  order_id: z.number(),
  detail: z.string(),
});

export async function GET() {
  try {
    const history = await getHistoryWithDetails();
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createHistorySchema.parse(body);

    // Create history entry
    const historyEntry = await createHistory(validatedData);

    return NextResponse.json(historyEntry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Failed to create history entry:", error);
    return NextResponse.json(
      { error: "Failed to create history entry" },
      { status: 500 }
    );
  }
} 
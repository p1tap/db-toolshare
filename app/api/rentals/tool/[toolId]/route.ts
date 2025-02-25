import { NextResponse } from "next/server";
import { getRentalsByToolId } from "@/db/utils";

// Helper function to validate and parse tool ID
function validateToolId(params: { toolId: string }): number {
  const id = parseInt(params.toolId);
  if (isNaN(id)) {
    throw new Error("Invalid tool ID");
  }
  return id;
}

export async function GET(
  request: Request,
  { params }: { params: { toolId: string } }
) {
  try {
    const toolId = validateToolId(params);
    const rentals = await getRentalsByToolId(toolId);
    return NextResponse.json(rentals);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid tool ID") {
      return NextResponse.json({ error: "Invalid tool ID" }, { status: 400 });
    }

    console.error("Failed to fetch tool rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch tool rentals" },
      { status: 500 }
    );
  }
}

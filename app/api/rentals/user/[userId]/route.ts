import { NextResponse } from "next/server";
import { getRentalsByUserId } from "@/db/utils";

// Helper function to validate and parse user ID
function validateUserId(params: { userId: string }): number {
  const id = parseInt(params.userId);
  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }
  return id;
}

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = validateUserId(params);
    const rentals = await getRentalsByUserId(userId);
    return NextResponse.json(rentals);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid user ID") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    console.error("Failed to fetch user rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch user rentals" },
      { status: 500 }
    );
  }
}

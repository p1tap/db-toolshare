import { NextResponse } from "next/server";
import { getToolsByOwnerId } from "@/db/utils";

export async function GET(request: Request) {
  try {
    // Get owner_id from query params
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    const tools = await getToolsByOwnerId(parseInt(ownerId));
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching renter tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
} 
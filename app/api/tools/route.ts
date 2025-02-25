import { NextRequest, NextResponse } from "next/server";
import { createTool, getTools } from "@/db/utils";

export async function GET() {
  try {
    const tools = await getTools();
    return NextResponse.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price_per_day, description, image_url, owner_id } = body;

    // Basic validation
    if (!name || !price_per_day || !owner_id) {
      return NextResponse.json(
        { error: "Name, price per day, and owner ID are required" },
        { status: 400 }
      );
    }

    // Create new tool
    const newTool = await createTool({
      name,
      price_per_day,
      description,
      image_url,
      owner_id,
    });

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error("Error creating tool:", error);
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    );
  }
}

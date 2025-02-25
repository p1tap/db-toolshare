import { NextRequest, NextResponse } from "next/server";
import { getToolById, updateTool, deleteTool } from "@/db/utils";
import { getMockToolById } from "@/app/data/mockTools";

type Params = { params: { id: string } };

// Helper function to validate and parse tool ID
function validateToolId(id: string | string[]) {
  // Handle array case (shouldn't happen, but TypeScript wants us to check)
  const idString = Array.isArray(id) ? id[0] : id;
  const toolId = parseInt(idString);
  if (isNaN(toolId)) {
    return { error: "Invalid tool ID", status: 400 };
  }
  return { toolId };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    console.log('Fetching tool with ID:', id);
    
    const toolId = parseInt(id);
    if (isNaN(toolId)) {
      console.error('Invalid tool ID:', id);
      return NextResponse.json(
        { error: 'Invalid tool ID' },
        { status: 400 }
      );
    }

    try {
      console.log('Attempting to fetch tool from database...');
      // First try to get the tool from the database
      const tool = await getToolById(toolId);
      console.log('Database response:', tool);
      
      if (tool) {
        console.log('Successfully fetched tool from database');
        return NextResponse.json(tool);
      }
    } catch (dbError) {
      console.error('Database error details:', dbError);
      // If there's a database error, we'll fall back to mock data
    }

    console.log('Falling back to mock data...');
    // If we couldn't get the tool from the database, try mock data
    const mockTool = getMockToolById(toolId);
    if (mockTool) {
      console.log('Found mock tool:', mockTool);
      return NextResponse.json(mockTool);
    }

    console.log('Tool not found in either database or mock data');
    return NextResponse.json(
      { error: 'Tool not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const result = validateToolId(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    const body = await request.json();
    const { name, price_per_day, description, image_url, status } = body;

    const updatedTool = await updateTool(result.toolId, {
      name,
      price_per_day,
      description,
      image_url,
      status,
    });

    if (!updatedTool) {
      return NextResponse.json(
        { error: "Tool not found or no changes provided" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error("Error updating tool:", error);
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const result = validateToolId(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    const deletedTool = await deleteTool(result.toolId);
    if (!deletedTool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Tool deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tool:", error);
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    );
  }
}

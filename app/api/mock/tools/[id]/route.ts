import { NextRequest, NextResponse } from "next/server";
import { getMockToolById } from "@/app/data/mockTools";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const toolId = parseInt(id);
    if (isNaN(toolId)) {
      return NextResponse.json(
        { error: 'Invalid tool ID' },
        { status: 400 }
      );
    }

    const mockTool = getMockToolById(toolId);
    if (mockTool) {
      return NextResponse.json(mockTool);
    }

    return NextResponse.json(
      { error: 'Tool not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching mock tool:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tool' },
      { status: 500 }
    );
  }
} 
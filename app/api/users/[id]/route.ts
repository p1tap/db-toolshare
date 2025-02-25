import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, deleteUser } from "@/db/utils";

type Params = { params: { id: string } };

// Helper function to validate and parse user ID
function validateUserId(id: string | string[]) {
  // Handle array case (shouldn't happen, but TypeScript wants us to check)
  const idString = Array.isArray(id) ? id[0] : id;
  const userId = parseInt(idString);
  if (isNaN(userId)) {
    return { error: "Invalid user ID", status: 400 };
  }
  return { userId };
}

export async function GET(request: NextRequest, { params }: Params) {
  // Properly await params according to Next.js 15
  const { id } = await params;
  const result = validateUserId(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    const user = await getUserById(result.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove password from response
    const { password: _pass, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  // Properly await params according to Next.js 15
  const { id } = await params;
  const result = validateUserId(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    const body = await request.json();
    const { username, email, password, role, status } = body;

    const updatedUser = await updateUser(result.userId, {
      username,
      email,
      password,
      role,
      status,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found or no changes provided" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _pass, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  // Properly await params according to Next.js 15
  const { id } = await params;
  const result = validateUserId(id);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  try {
    const deletedUser = await deleteUser(result.userId);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/db/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, role, address, phone, date_of_birth } =
      body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required" },
        { status: 400 }
      );
    }

    // Check if active user already exists with this email
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user with all fields
    const newUser = await createUser({
      username,
      email,
      password,
      role,
      address,
      phone,
      date_of_birth,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, getUserByUsername } from '@/db/utils';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(6).max(100),
  role: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  fullName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Registration request body:', body); // Log the request body
    
    const validatedData = registerSchema.parse(body);
    console.log('Validated data:', validatedData); // Log the validated data
    
    // Check if email exists
    const existingEmail = await getUserByEmail(validatedData.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUsername = await getUserByUsername(validatedData.username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create user
    console.log('Creating user with role:', validatedData.role); // Log the role before creating user
    
    const user = await createUser({
      username: validatedData.username,
      email: validatedData.email,
      password: validatedData.password, // In a real app, hash this password
      role: validatedData.role,
      address: validatedData.address,
      phone: validatedData.phone,
      date_of_birth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
      full_name: validatedData.fullName,
    });
    
    console.log('Created user:', user); // Log the created user

    // Return success without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 
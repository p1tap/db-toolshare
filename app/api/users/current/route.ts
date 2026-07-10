import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, User } from "@/db/queries/users";
import { z } from 'zod';

// Validation schema for user update
const schema = z.object({
  userId: z.union([z.string(), z.number()]).transform(val => Number(val)),
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  fullName: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query parameter
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId');
    
    if (!userIdParam) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userId = parseInt(userIdParam);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const user = await getUserById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Don't return the password
    const { password: removedPassword, ...userWithoutPassword } = user;
    void removedPassword;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = schema.parse(body);

    // Format data for update
    const updateData: Partial<User> = {};
    
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.username) updateData.username = validatedData.username;
    if (validatedData.address) updateData.address = validatedData.address;
    if (validatedData.phone) updateData.phone = validatedData.phone;
    if (validatedData.date_of_birth) updateData.date_of_birth = new Date(validatedData.date_of_birth);
    if (validatedData.fullName) updateData.full_name = validatedData.fullName;

    // Update user in database
    const updatedUser = await updateUser(Number(validatedData.userId), updateData);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't return the password
    const { password: removedPassword, ...userWithoutPassword } = updatedUser;
    void removedPassword;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
} 

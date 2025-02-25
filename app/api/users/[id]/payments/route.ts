import { NextRequest, NextResponse } from "next/server";
import { getRentalsByUserId, getPaymentsByRentalId } from "@/db/utils";

// Helper function to validate and parse user ID
function validateId(id: string): number {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid user ID");
  }
  return parsedId;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const parsedUserId = validateId(id);
    
    // Get all rentals for this user
    const userRentals = await getRentalsByUserId(parsedUserId);
    
    // Get payments for each rental
    const paymentsPromises = userRentals.map(rental => 
      getPaymentsByRentalId(rental.id)
    );
    
    const paymentsArrays = await Promise.all(paymentsPromises);
    
    // Flatten the array of payment arrays
    const allPayments = paymentsArrays.flat();
    
    // Sort by payment date, most recent first
    allPayments.sort((a, b) => 
      new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    );
    
    return NextResponse.json(allPayments);
  } catch (error) {
    console.error("Failed to fetch user payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch user payments" },
      { status: 500 }
    );
  }
} 
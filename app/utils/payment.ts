import { createPayment } from "@/db/utils";

/**
 * Creates a successful payment for a rental
 * This is a simplified mock implementation that automatically creates a successful payment
 * In a real application, this would integrate with a payment gateway
 */
export async function processPayment(rentalId: number, amount: number): Promise<any> {
  try {
    // Generate a mock transaction ID
    const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create the payment with "completed" status
    const payment = await createPayment({
      rental_id: rentalId,
      amount,
      payment_method: "credit_card", // Default payment method
      transaction_id: transactionId,
    });
    
    // In a real application, we would update the rental status to "active" here
    // For now, we'll just return the payment
    
    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error("Payment processing failed:", error);
    return {
      success: false,
      error: "Payment processing failed",
    };
  }
} 
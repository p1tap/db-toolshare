'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ToolCheckoutClientProps {
  toolId: number;
  toolName: string;
  pricePerDay: number;
}

export default function ToolCheckoutClient({
  toolId,
  toolName,
  pricePerDay,
}: ToolCheckoutClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(1);
  const router = useRouter();

  // Format date in a stable way to avoid hydration errors
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCheckout = async () => {
    try {
      // Calculate dates starting from tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Start at beginning of day

      const endDate = new Date(tomorrow);
      endDate.setDate(endDate.getDate() + duration);

      // Create order with hardcoded user_id for demonstration
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1, // Hardcoded user ID for demonstration
          tool_id: toolId,
          start_date: tomorrow.toISOString(),
          end_date: endDate.toISOString(),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Order error:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await orderResponse.json();

      // Create a rental for this order
      const rentalResponse = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_id: toolId,
          renter_id: 1, // Hardcoded user ID for demonstration
          start_date: tomorrow.toISOString(),
          end_date: endDate.toISOString(),
          total_price: pricePerDay * duration
        }),
      });

      if (!rentalResponse.ok) {
        const rentalError = await rentalResponse.json();
        console.error('Rental error:', rentalError);
        throw new Error('Failed to create rental');
      }

      const rental = await rentalResponse.json();

      // Create a payment for this rental
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rental_id: rental.id,
          amount: pricePerDay * duration,
          payment_method: 'credit_card',
          transaction_id: `demo_${Date.now()}`
        }),
      });

      if (!paymentResponse.ok) {
        const paymentError = await paymentResponse.json();
        console.error('Payment error:', paymentError);
        throw new Error('Failed to process payment');
      }

      // Redirect to order confirmation
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to complete checkout. Please try again.');
    }
  };

  // Calculate tomorrow's date once for display
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rental Duration (days)
        </label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="block w-full p-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(days => (
            <option key={days} value={days} className="py-2">
              {days} {days === 1 ? "day" : "days"}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Rent Now
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Rental</h2>
            <div className="mb-6">
              <p className="mb-2 text-gray-700">Tool: {toolName}</p>
              <p className="mb-2 text-gray-700">Duration: {duration} days</p>
              <p className="text-lg font-bold text-gray-900">Total: ${pricePerDay * duration}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Rental
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
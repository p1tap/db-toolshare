'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processPayment } from '@/app/utils/payment';

interface RentalCheckoutProps {
  rentalId: number;
  toolName: string;
  amount: number;
  startDate: string;
  endDate: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RentalCheckout({
  rentalId,
  toolName,
  amount,
  startDate,
  endDate,
  onSuccess,
  onCancel
}: RentalCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // Process the payment (this is mocked and will always succeed)
      const result = await processPayment(rentalId, amount);
      
      if (result.success) {
        // Show success message
        alert('Payment successful! Your rental has been confirmed.');
        
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Otherwise redirect to the user's rentals page
          router.push('/account/rentals');
        }
      } else {
        setError('Payment processing failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Confirm Your Rental</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tool:</span>
          <span className="font-medium">{toolName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Rental Period:</span>
          <span className="font-medium">
            {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-bold text-lg">{formatCurrency(amount)}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-4">
        <p className="text-sm text-gray-500 mb-4">
          This is a demo checkout. In a real application, you would enter your payment details here.
          For this demo, clicking "Complete Payment" will automatically create a successful payment.
        </p>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleCheckout}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Complete Payment'}
        </button>
      </div>
    </div>
  );
} 
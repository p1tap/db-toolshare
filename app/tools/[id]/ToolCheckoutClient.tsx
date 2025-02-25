'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserId } from '@/app/utils/session';

interface ToolCheckoutClientProps {
  toolId: number;
  toolName: string;
  pricePerDay: number;
  useMockData?: boolean;
}

export default function ToolCheckoutClient({
  toolId,
  toolName,
  pricePerDay,
  useMockData = false
}: ToolCheckoutClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [duration, setDuration] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const router = useRouter();

  // Get the current user ID on component mount
  useEffect(() => {
    const currentUserId = getCurrentUserId();
    setUserId(currentUserId);
  }, []);

  // Get tomorrow's date as the minimum start date
  const minStartDate = new Date();
  minStartDate.setDate(minStartDate.getDate() + 1);
  const minStartDateStr = minStartDate.toISOString().split('T')[0];

  // Calculate end date based on start date and duration
  const getEndDate = (start: string, days: number) => {
    if (!start) return '';
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + days);
    return endDate.toISOString();
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (!userId) {
        setError('You must be logged in to rent tools. Please log in and try again.');
        setIsProcessing(false);
        return;
      }
      
      if (!startDate) {
        setError('Please select a start date');
        setIsProcessing(false);
        return;
      }

      if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
        setError('Please enter a delivery address');
        setIsProcessing(false);
        return;
      }
      
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`Order completed successfully! Your rental for ${toolName} has been confirmed.`);
        setShowModal(false);
        setIsProcessing(false);
        router.push('/account/history');
        return;
      }

      const endDate = getEndDate(startDate, duration);
      
      console.log('Creating order with data:', {
        user_id: userId,
        tool_id: toolId,
        start_date: new Date(startDate).toISOString(),
        end_date: endDate,
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : null,
      });
      
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          tool_id: toolId,
          start_date: new Date(startDate).toISOString(),
          end_date: endDate,
          status: 'pending',
          delivery_type: deliveryType,
          delivery_address: deliveryType === 'delivery' ? deliveryAddress : null,
        }),
      });
      
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error('Order creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      const order = await orderResponse.json();
      console.log('Order created successfully:', order);
      
      // Create rental
      const rentalResponse = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_id: toolId,
          renter_id: userId,
          start_date: new Date(startDate).toISOString(),
          end_date: endDate,
          status: 'pending',
          total_price: pricePerDay * duration
        }),
      });
      
      if (!rentalResponse.ok) {
        const errorData = await rentalResponse.json();
        console.error('Rental creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to create rental');
      }
      
      const rental = await rentalResponse.json();
      console.log('Rental created successfully:', rental);
      
      // Create payment
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rental_id: rental.id,
          amount: pricePerDay * duration,
          payment_method: 'credit_card',
          transaction_id: `txn_${Date.now()}`,
          user_id: userId,
          tool_id: toolId,
          date: new Date().toISOString()
        }),
      });
      
      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        console.error('Payment creation failed:', errorData);
        throw new Error(errorData.error || 'Failed to process payment');
      }
      
      console.log('Payment created successfully');
      
      // Create history entry
      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          order_id: order.id,
          detail: `Rental of ${toolName} for ${duration} days`
        }),
      });
      
      if (!historyResponse.ok) {
        console.warn('History entry creation failed, but order was successful');
      }
      
      // Show success message
      alert(`Order completed successfully! Your rental for ${toolName} has been confirmed.`);
      
      // Close modal and redirect to history page
      setShowModal(false);
      router.push('/account/history');
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Failed to complete checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Rental</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <p className="mb-2 text-gray-900 font-medium">Tool: {toolName}</p>
              
              {/* Start Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  min={minStartDateStr}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded text-gray-900"
                  required
                />
              </div>

              <p className="mb-2 text-gray-900 font-medium">Duration: {duration} days</p>
              {startDate && (
                <p className="mb-2 text-gray-900 font-medium">
                  End Date: {new Date(getEndDate(startDate, duration)).toLocaleDateString()}
                </p>
              )}
              <p className="mb-4 text-xl font-bold text-blue-600">Total: ${pricePerDay * duration}</p>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Delivery Method</p>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === 'pickup'}
                      onChange={() => setDeliveryType('pickup')}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Pickup</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={deliveryType === 'delivery'}
                      onChange={() => setDeliveryType('delivery')}
                      className="mr-2"
                    />
                    <span className="text-gray-900">Delivery</span>
                  </label>
                </div>
              </div>
              
              {deliveryType === 'delivery' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    className="w-full p-2 border rounded text-gray-900 placeholder-gray-500"
                  />
                </div>
              )}
              
              {!userId && (
                <p className="mt-2 text-sm text-red-600">
                  You need to be logged in to complete this rental.{' '}
                  <a href="/login" className="underline">Log in now</a>
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isProcessing || !userId || (deliveryType === 'delivery' && !deliveryAddress.trim())}
              >
                {isProcessing ? 'Processing...' : 'Confirm Rental'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
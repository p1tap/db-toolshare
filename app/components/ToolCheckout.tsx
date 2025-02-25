'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processPayment } from '@/app/utils/payment';

interface ToolCheckoutProps {
  toolId: number;
  toolName: string;
  pricePerDay: number;
  duration: number;
  variant?: string;
  onClose?: () => void;
}

export default function ToolCheckout({
  toolId,
  toolName,
  pricePerDay,
  duration,
  variant = 'Standard',
  onClose
}: ToolCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const router = useRouter();

  const totalAmount = pricePerDay * duration;

  const handleComplete = async () => {
    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create the order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool_id: toolId,
          start_date: new Date().toISOString(), // You might want to use selected dates instead
          end_date: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
          delivery_method: deliveryMethod,
          delivery_address: deliveryMethod === 'delivery' ? deliveryAddress : null,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const order = await orderResponse.json();

      // 2. Process payment
      const paymentResult = await processPayment(order.id, totalAmount);
      
      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }

      // 3. Show success message and redirect
      alert('Order completed successfully!');
      router.push('/account/orders');
      if (onClose) onClose();
      
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to complete your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Checkout</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Tool:</span>
            <span>{toolName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span>{duration} days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Variant:</span>
            <span>{variant}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Delivery Method</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={deliveryMethod === 'delivery'}
              onChange={() => setDeliveryMethod('delivery')}
              className="form-radio"
            />
            <span>Delivery to Address</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={deliveryMethod === 'pickup'}
              onChange={() => setDeliveryMethod('pickup')}
              className="form-radio"
            />
            <span>Pick Up in Store</span>
          </label>
        </div>
      </div>

      {deliveryMethod === 'delivery' && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address"
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </div>
  );
} 
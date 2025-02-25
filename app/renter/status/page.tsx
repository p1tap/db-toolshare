"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUserId } from "@/app/utils/session";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  toolName: string;
  duration: string;
  startDate: string;
  type: "Pickup" | "Delivery";
  status: string;
  action?: string;
  message: string;
  price: number;
  renterName: string;
  location: string;
}

export default function StatusPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/renter/orders?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async (orderId: string) => {
    try {
      setError('');
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        setError('Order not found');
        return;
      }

      // Get the rental ID from the order ID (remove 'ORD-' prefix)
      const rentalId = orderId.replace('ORD-', '');
      
      // Determine new status based on current status
      const newStatus = order.status === 'Waiting for user pickup' ? 'active' : 'completed';

      const response = await fetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus === 'active' ? 'In progress' : 'Completed',
            action: newStatus === 'active' ? 'confirm return' : undefined,
            message: newStatus === 'active' ? 
              'click confirm return when you receive the tool back' : 
              'order completed'
          };
        }
        return o;
      });

      setOrders(updatedOrders);
      setSuccessMessage(
        newStatus === 'active' ? 
          'Pickup confirmed! The order is now active.' : 
          'Return confirmed! The order is now completed.'
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Orders</h2>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Order ID: {order.id}
                    </h3>
                    <p className="text-lg text-gray-700 font-medium">
                      {order.toolName}
                    </p>
                  </div>
                  {order.action && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConfirm(order.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      {order.action}
                    </motion.button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">
                    Duration: <span className="text-gray-700">{order.duration}</span>
                  </p>
                  <p className="text-gray-900 font-medium">
                    Start date: <span className="text-gray-700">{order.startDate}</span>
                  </p>
                  <p className="text-gray-900 font-medium">
                    Price: <span className="text-gray-700">${order.price.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-900 font-medium">
                    Location: <span className="text-gray-700">{order.location}</span>
                  </p>
                  <p className="text-gray-600 italic">{order.message}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">
                    Type: <span className="text-gray-700">{order.type}</span>
                  </p>
                  <p className="text-gray-900 font-medium">
                    Status:{" "}
                    <span
                      className={`${
                        order.status === "Waiting to be picked"
                          ? "text-yellow-600"
                          : order.status === "In progress"
                          ? "text-blue-600"
                          : order.status === "Completed"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                  <p className="text-gray-900 font-medium">
                    Renter: <span className="text-gray-700">{order.renterName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Mock data for orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      toolName: "Professional Power Drill",
      duration: "1 day",
      startDate: "2024/10/07",
      type: "Pickup",
      status: "Waiting to be picked",
      action: "confirm pickup",
      message: "confirm pickup to start",
      price: 25.0,
      renterName: "John Smith",
      location: "123 Oak Street, Downtown",
    },
    {
      id: "ORD-2024-002",
      toolName: "Industrial Circular Saw",
      duration: "on going",
      startDate: "2024/10/07",
      type: "Delivery",
      status: "sent to delivery service",
      message: "confirm arrival to start",
      price: 45.0,
      renterName: "Mike Johnson",
      location: "456 Pine Avenue, Westside",
    },
    {
      id: "ORD-2024-003",
      toolName: "Professional Wrench Set",
      duration: "1 day",
      startDate: "2024/10/07",
      type: "Delivery",
      status: "awaiting return of item",
      action: "Finish order",
      message: "confirm arrival to finish order",
      price: 35.0,
      renterName: "Sarah Williams",
      location: "789 Maple Road, Eastside",
    },
  ]);

  const handleConfirm = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          // Different status updates based on current status
          if (order.status === "Waiting to be picked") {
            setSuccessMessage(
              `${order.toolName} pickup confirmed! Order is now active.`
            );
            return {
              ...order,
              status: "active",
              action: undefined,
              message: "Order is active",
            };
          } else if (order.status === "awaiting return of item") {
            setSuccessMessage(
              `${order.toolName} return confirmed! Order completed.`
            );
            return {
              ...order,
              status: "completed",
              action: undefined,
              message: "Order completed",
            };
          }
        }
        return order;
      })
    );

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Order</h2>

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
        {orders.map((order, index) => (
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

              <div className="space-y-3">
                <p className="text-gray-900 font-medium">
                  Duration:{" "}
                  <span className="text-gray-700">{order.duration}</span>
                </p>
                <p className="text-gray-900 font-medium">
                  Start date:{" "}
                  <span className="text-gray-700">{order.startDate}</span>
                </p>
                <p className="text-gray-900 font-medium">
                  Price:{" "}
                  <span className="text-gray-700">
                    ${order.price.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-900 font-medium">
                  Location:{" "}
                  <span className="text-gray-700">{order.location}</span>
                </p>
                <p className="text-gray-600 italic">{order.message}</p>
              </div>

              <div className="space-y-3">
                <p className="text-gray-900 font-medium">
                  Type: <span className="text-gray-700">{order.type}</span>
                </p>
                <p className="text-gray-900 font-medium">
                  Status:{" "}
                  <span
                    className={`${
                      order.status === "awaiting return of item"
                        ? "text-yellow-600"
                        : order.status === "sent to delivery service"
                        ? "text-blue-600"
                        : order.status === "active"
                        ? "text-green-600"
                        : order.status === "completed"
                        ? "text-gray-600"
                        : "text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-gray-900 font-medium">
                  Renter:{" "}
                  <span className="text-gray-700">{order.renterName}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

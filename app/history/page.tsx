"use client";

import { useRouter } from "next/navigation";

// Mock data for order history
const mockOrders = [
  {
    orderId: "ORD123456789",
    name: "Hammer size XL",
    detail: "Professional grade hammer - Standard variant",
    startDate: "2024-02-15",
    endDate: "2024-02-18",
    status: "Active",
    quantity: 2,
  },
  {
    orderId: "ORD987654321",
    name: "Power Drill",
    detail: "Cordless drill - Premium variant",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    status: "Completed",
    quantity: 1,
  },
  // Add more mock orders as needed
];

export default function HistoryPage() {
  const router = useRouter();

  const handleOrderClick = (orderId: string) => {
    router.push(`/history/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">History</h1>

        <div className="space-y-6">
          {mockOrders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => handleOrderClick(order.orderId)}
              className="bg-white rounded-lg shadow-sm p-6 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-medium">
                        Order ID: {order.orderId}
                      </p>
                      <span className="text-sm text-gray-600">
                        × {order.quantity}
                      </span>
                    </div>
                    <p className="text-gray-900">Name: {order.name}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-700">Detail: {order.detail}</p>

                <div className="text-gray-700">
                  <p>Start date: {order.startDate}</p>
                  <p>End date: {order.endDate}</p>
                </div>

                <p className="text-gray-700">Order status: {order.status}</p>
              </div>
            </div>
          ))}
        </div>

        {mockOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No order history found</p>
          </div>
        )}
      </main>
    </div>
  );
}

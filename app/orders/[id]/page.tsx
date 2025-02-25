import { getOrderById } from "@/db/utils";
import Link from "next/link";

interface OrderConfirmationProps {
  params: {
    id: string;
  };
}

export default async function OrderConfirmation({ params }: OrderConfirmationProps) {
  const { id } = params;
  const order = await getOrderById(parseInt(id));

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order not found</h1>
          <Link 
            href="/tools" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Browse Tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Order Confirmed!
          </h1>

          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Order ID</p>
                <p className="text-lg font-semibold text-gray-900">{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Tool</p>
                <p className="text-lg font-semibold text-gray-900">{order.tool_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Start Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">End Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.end_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-blue-600 capitalize">
                  {order.status}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              href="/orders"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/tools"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse More Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
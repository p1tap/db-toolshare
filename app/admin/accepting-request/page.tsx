"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RequestForm {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  status: "pending" | "finished";
  createdAt: string;
  requestType: string;
}

export default function AcceptingRequestPage() {
  // Mock data for request forms
  const [requests, setRequests] = useState<RequestForm[]>([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "0123-456-7890",
      address: "123 Oak Street, Downtown, NY 10001",
      message:
        "I'm interested in becoming a renter on the platform. I have several professional-grade power tools that I'd like to list, including a Dewalt power drill set and Milwaukee impact drivers. Could you provide more information about the verification process and commission rates?",
      status: "pending",
      createdAt: "2024-02-04 09:30 AM",
      requestType: "Renter Application",
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.w@email.com",
      phone: "0198-765-4321",
      address: "456 Maple Avenue, Westside, NY 10002",
      message:
        "Having issues with the payment system. When trying to rent a tool, the transaction keeps failing even though my card is valid. I've tried multiple times over the past hour. Could you help investigate this issue?",
      status: "pending",
      createdAt: "2024-02-04 11:45 AM",
      requestType: "Technical Support",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "0145-789-0123",
      address: "789 Pine Road, Eastside, NY 10003",
      message:
        "Need to report a damaged tool. I rented a circular saw (Order #RT789012) and noticed the blade guard is loose. I've documented the issue with photos. Would like to discuss this with the support team before returning the tool.",
      status: "pending",
      createdAt: "2024-02-04 02:15 PM",
      requestType: "Tool Issue Report",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "0167-234-5678",
      address: "321 Birch Lane, Northside, NY 10004",
      message:
        "Looking to extend my rental period for a pressure washer (Order #RT456789). The current rental ends tomorrow, but I need it for two more days. The extension option in the app isn't working. Can you help process this manually?",
      status: "pending",
      createdAt: "2024-02-04 03:30 PM",
      requestType: "Rental Extension",
    },
    {
      id: 5,
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "0189-012-3456",
      address: "654 Cedar Court, Southside, NY 10005",
      message:
        "I've completed the renter verification process and uploaded all required documents last week. Just checking on the status of my application. Would appreciate an update on when I can start listing my tools.",
      status: "finished",
      createdAt: "2024-02-03 10:20 AM",
      requestType: "Application Status",
    },
  ]);

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFinish = (id: number) => {
    setRequests(
      requests.map((request) =>
        request.id === id ? { ...request, status: "finished" } : request
      )
    );

    // Show success message
    setSuccessMessage("Request marked as finished!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Accepting Request
        </h1>

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

        <div className="space-y-6">
          <AnimatePresence>
            {requests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-6 flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        Created: {request.createdAt}
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {request.requestType}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name / Last Name
                        </label>
                        <input
                          type="text"
                          value={request.name}
                          readOnly
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={request.email}
                          readOnly
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={request.phone}
                          readOnly
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          value={request.address}
                          readOnly
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What would you like to discuss?
                      </label>
                      <textarea
                        value={request.message}
                        readOnly
                        rows={4}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 resize-none"
                      />
                    </div>
                  </div>
                  <div className="ml-6 flex flex-col items-end space-y-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === "finished"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {request.status === "finished" ? "Finished" : "Pending"}
                    </span>
                    {request.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleFinish(request.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                      >
                        Finish
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

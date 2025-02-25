"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SupportRequest {
  id: number;
  type: string;
  message: string;
  status: "pending" | "finished";
  created_at: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ConfirmationDialog {
  show: boolean;
  itemId: number | null;
  type: "approve" | "disapprove" | null;
}

export default function AcceptingRequestPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationDialog>({
    show: false,
    itemId: null,
    type: null,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/support');
      if (!response.ok) {
        throw new Error('Failed to fetch support requests');
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load support requests');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = (id: number, type: "approve" | "disapprove") => {
    setConfirmation({
      show: true,
      itemId: id,
      type,
    });
  };

  const hideConfirmation = () => {
    setConfirmation({
      show: false,
      itemId: null,
      type: null,
    });
  };

  const handleConfirm = async () => {
    if (!confirmation.itemId || !confirmation.type) return;

    try {
      const response = await fetch(`/api/support/${confirmation.itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: confirmation.type === 'approve' ? 'finished' : 'rejected',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === confirmation.itemId
            ? { ...request, status: confirmation.type === 'approve' ? 'finished' : 'rejected' }
            : request
        )
      );

      // Show success message
      setSuccessMessage(
        `Request ${confirmation.type === 'approve' ? 'approved' : 'rejected'} successfully`
      );

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Failed to update request status');
    } finally {
      hideConfirmation();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Support Requests
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

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
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      Created: {new Date(request.created_at).toLocaleString()}
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      {request.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={request.name || ''}
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
                        value={request.email || ''}
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
                        value={request.phone || ''}
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
                        value={request.address || ''}
                        readOnly
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={request.message || ''}
                      readOnly
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 resize-none"
                    />
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => showConfirmation(request.id, 'disapprove')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => showConfirmation(request.id, 'approve')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {confirmation.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {confirmation.type === "approve"
                    ? "Are you sure you want to approve this request?"
                    : "Are you sure you want to reject this request?"}
                </h3>
                <div className="flex space-x-4 justify-end">
                  <button
                    onClick={hideConfirmation}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                      confirmation.type === "approve"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ListingItem {
  id: number;
  name: string;
  price_per_day: number;
  image_url: string;
  owner_id: number;
  owner_name: string;
  description: string;
  status: string;
  created_at: string;
}

interface ConfirmationDialog {
  show: boolean;
  itemId: number | null;
  type: "approve" | "disapprove" | null;
}

export default function ApprovePage() {
  const [pendingItems, setPendingItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationDialog>({
    show: false,
    itemId: null,
    type: null,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tools');
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      setPendingItems(data);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const showConfirmation = (id: number, type: "approve" | "disapprove") => {
    setConfirmation({ show: true, itemId: id, type });
  };

  const hideConfirmation = () => {
    setConfirmation({ show: false, itemId: null, type: null });
  };

  const handleConfirm = async () => {
    if (!confirmation.itemId || !confirmation.type) return;

    try {
      const response = await fetch(`/api/tools/${confirmation.itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: confirmation.type === 'approve' ? 'active' : 'inactive'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tool status');
      }

      // Update local state
      setPendingItems((items) =>
        items.filter((item) => item.id !== confirmation.itemId)
      );

      // Show success message
      const action = confirmation.type === "approve" ? "Approved" : "Disapproved";
      setSuccessMessage(`${action} successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating tool:', err);
      setError('Failed to update tool status');
    } finally {
      hideConfirmation();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Approve</h1>

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
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {pendingItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="bg-white rounded-lg shadow-sm p-6 flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.name}
                </h3>

                <div className="aspect-[4/3] w-full mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image_url || '/images/tools/hammer.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 font-medium">
                    ${item.price_per_day}/Day
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Owner:</span>{" "}
                      {item.owner_name} (ID: {item.owner_id})
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Details:</span>{" "}
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex gap-2">
                    <button
                      onClick={() => showConfirmation(item.id, "disapprove")}
                      className="flex-1 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white font-medium transition-colors"
                    >
                      Disapprove
                    </button>
                    <button
                      onClick={() => showConfirmation(item.id, "approve")}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    >
                      Approve
                    </button>
                  </div>
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
                    ? "Are you sure you want to approve this item?"
                    : "Are you sure you want to disapprove this item?"}
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

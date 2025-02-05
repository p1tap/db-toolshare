"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ListingItem {
  id: number;
  name: string;
  price: number;
  image: string;
  renterId: string;
  renterName: string;
  createdAt: string;
  pickupLocation: string;
  pickupTime: string;
  details: string;
}

interface ConfirmationDialog {
  show: boolean;
  itemId: number | null;
  type: "approve" | "disapprove" | null;
}

export default function ApprovePage() {
  // Mock data for pending approvals
  const [pendingItems, setPendingItems] = useState<ListingItem[]>([
    {
      id: 1,
      name: "Professional Hammer",
      price: 5.99,
      image: "/images/tools/hammer.jpg",
      renterId: "R123456",
      renterName: "Tom Kuki",
      createdAt: "2024-02-04 14:30",
      pickupLocation: "123 Main St, Downtown",
      pickupTime: "9:00 AM - 5:00 PM",
      details:
        "Professional grade hammer with ergonomic grip. Perfect for both light and heavy-duty work.",
    },
    {
      id: 2,
      name: "Power Drill",
      price: 15.99,
      image: "/images/tools/powerdrill.jpg",
      renterId: "R789012",
      renterName: "Alex Arai",
      createdAt: "2024-02-04 15:45",
      pickupLocation: "456 Oak Ave, Westside",
      pickupTime: "10:00 AM - 6:00 PM",
      details:
        "Cordless power drill with variable speed control. Includes battery and charger.",
    },
    {
      id: 3,
      name: "Wrench Set",
      price: 12.99,
      image: "/images/tools/wrench-set.jpg",
      renterId: "R345678",
      renterName: "Tim Tub",
      createdAt: "2024-02-04 16:20",
      pickupLocation: "789 Pine Rd, Eastside",
      pickupTime: "8:00 AM - 4:00 PM",
      details:
        "Complete set of professional wrenches in various sizes. Includes carrying case.",
    },
    {
      id: 4,
      name: "Heat Gun",
      price: 18.99,
      image: "/images/tools/Heat-gun.jpg",
      renterId: "R901234",
      renterName: "Jim Jum",
      createdAt: "2024-02-04 17:10",
      pickupLocation: "321 Elm St, Northside",
      pickupTime: "11:00 AM - 7:00 PM",
      details:
        "Industrial heat gun with temperature control. Perfect for paint removal and shrink wrapping.",
    },
    {
      id: 5,
      name: "Wire Cutter",
      price: 7.99,
      image: "/images/tools/wire-cutter.jpg",
      renterId: "R567890",
      renterName: "Sam Smith",
      createdAt: "2024-02-04 18:00",
      pickupLocation: "654 Maple Dr, Southside",
      pickupTime: "9:00 AM - 5:00 PM",
      details:
        "Professional wire cutters with comfort grip handles. Ideal for electrical work.",
    },
  ]);

  // State for confirmation dialog
  const [confirmation, setConfirmation] = useState<ConfirmationDialog>({
    show: false,
    itemId: null,
    type: null,
  });

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showConfirmation = (id: number, type: "approve" | "disapprove") => {
    setConfirmation({ show: true, itemId: id, type });
  };

  const hideConfirmation = () => {
    setConfirmation({ show: false, itemId: null, type: null });
  };

  const handleConfirm = () => {
    if (!confirmation.itemId || !confirmation.type) return;

    const action = confirmation.type === "approve" ? "Approved" : "Disapproved";
    setPendingItems((items) =>
      items.filter((item) => item.id !== confirmation.itemId)
    );
    hideConfirmation();

    // Show success message
    setSuccessMessage(`${action} successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Approve</h1>

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
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 px-4 py-2 rounded-lg text-gray-900 font-medium">
                    ${item.price}/Day
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Renter:</span>{" "}
                      {item.renterName} (ID: {item.renterId})
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {item.createdAt}
                    </p>
                    <p>
                      <span className="font-medium">Pickup:</span>{" "}
                      {item.pickupLocation}
                    </p>
                    <p>
                      <span className="font-medium">Hours:</span>{" "}
                      {item.pickupTime}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Details:</span>{" "}
                      {item.details}
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

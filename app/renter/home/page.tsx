"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Listing {
  id: number;
  name: string;
  price: number;
  status: string;
  imageUrl: string;
}

export default function RenterHomePage() {
  const router = useRouter();

  // Mock data for current listings
  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      name: "Power Drill",
      price: 25,
      status: "active",
      imageUrl: "/images/tools/powerdrill.jpg",
    },
    {
      id: 2,
      name: "Hammer",
      price: 15,
      status: "active",
      imageUrl: "/images/tools/hammer.jpg",
    },
    {
      id: 3,
      name: "Wrench Set",
      price: 35,
      status: "active",
      imageUrl: "/images/tools/wrench-set.jpg",
    },
    {
      id: 4,
      name: "Circular Saw",
      price: 45,
      status: "active",
      imageUrl: "/images/tools/circular-saw.jpg",
    },
    {
      id: 5,
      name: "Measuring Tape",
      price: 10,
      status: "active",
      imageUrl: "/images/tools/measuring-tape.jpg",
    },
    {
      id: 6,
      name: "Screwdriver Set",
      price: 20,
      status: "active",
      imageUrl: "/images/tools/screwdiver-set.jpg",
    },
    {
      id: 7,
      name: "Level Tool",
      price: 18,
      status: "active",
      imageUrl: "/images/tools/leveling-tool.jpg",
    },
    {
      id: 8,
      name: "Pliers",
      price: 12,
      status: "active",
      imageUrl: "/images/tools/piler.jpg",
    },
    {
      id: 9,
      name: "Wire Cutter",
      price: 15,
      status: "active",
      imageUrl: "/images/tools/wire-cutter.jpg",
    },
    {
      id: 10,
      name: "Heat Gun",
      price: 40,
      status: "active",
      imageUrl: "/images/tools/Heat-gun.jpg",
    },
  ]);

  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(
    null
  );

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle remove button click
  const handleRemoveClick = (listingId: number) => {
    setSelectedListingId(listingId);
    setShowConfirmation(true);
  };

  // Handle confirm removal
  const handleConfirmRemove = () => {
    if (selectedListingId) {
      setListings(
        listings.filter((listing) => listing.id !== selectedListingId)
      );
      // Show success message
      setSuccessMessage("Listing removed successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setShowConfirmation(false);
    setSelectedListingId(null);
  };

  // Handle cancel removal
  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setSelectedListingId(null);
  };

  return (
    <>
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

      <h2 className="text-3xl font-bold text-gray-900 mb-6">Current Listing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {listing.name}
                </h3>
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={listing.imageUrl}
                  alt={listing.name}
                  width={500}
                  height={300}
                  priority
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  onLoadingComplete={(img) => {
                    console.log(`Image loaded successfully:`, listing.imageUrl);
                  }}
                  onError={(e) => {
                    console.error(`Error loading image:`, listing.imageUrl);
                  }}
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="bg-gray-100 px-4 py-2 rounded-lg text-gray-900 font-medium text-lg">
                  ${listing.price}/Day
                </span>
              </div>

              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    router.push(`/renter/edit-listing/${listing.id}`)
                  }
                  className="px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-700 font-medium"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemoveClick(listing.id)}
                  className="px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Are you sure you want to remove this listing?
              </h3>
              <div className="flex space-x-4 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelRemove}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmRemove}
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white font-medium"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

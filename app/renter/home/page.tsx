"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCurrentUserId } from "@/app/utils/session";

interface Listing {
  id: number;
  name: string;
  price_per_day: number;
  status: string;
  image_url: string;
  description?: string;
}

export default function RenterHomePage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for confirmation dialog
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/renter/tools?ownerId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [router]);

  // Handle remove button click
  const handleRemoveClick = (listingId: number) => {
    setSelectedListingId(listingId);
    setShowConfirmation(true);
  };

  // Handle confirm removal
  const handleConfirmRemove = async () => {
    if (selectedListingId) {
      try {
        const response = await fetch(`/api/tools/${selectedListingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'inactive'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove listing');
        }

        setListings(listings.filter((listing) => listing.id !== selectedListingId));
        setSuccessMessage("Listing removed successfully!");
      } catch (err) {
        console.error('Error removing listing:', err);
        setError('Failed to remove listing');
      }
    }
    setShowConfirmation(false);
    setSelectedListingId(null);

    // Clear success message after 3 seconds
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  // Handle cancel removal
  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setSelectedListingId(null);
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
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-900">Current Listings</h2>
          <button
            onClick={() => router.push('/renter/add-listing')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first tool listing</p>
            <button
              onClick={() => router.push('/renter/add-listing')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Listing
            </button>
          </div>
        ) : (
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
                      src={listing.image_url || "/images/tools/hammer.jpg"}
                      alt={listing.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 px-4 py-2 rounded-lg text-gray-900 font-medium text-lg">
                      ${listing.price_per_day}/Day
                    </span>
                  </div>

                  {listing.description && (
                    <p className="text-gray-600 mb-4">{listing.description}</p>
                  )}

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/renter/edit-listing/${listing.id}`)}
                      className="flex-1 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-700 font-medium"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemoveClick(listing.id)}
                      className="flex-1 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
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

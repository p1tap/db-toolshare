"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import CheckoutModalClient from "../../components/CheckoutModalClient";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for demonstration
const mockToolData = {
  id: 1,
  name: "Hammer size XL",
  pricePerDay: 15,
  details:
    "Professional grade hammer with ergonomic grip. Perfect for both light and heavy-duty work. Features a steel head with superior durability.",
  variants: ["Standard", "Premium", "Professional"],
  image: "/images/tools/hammer.jpg",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    mockToolData.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleConfirmOrder = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4"
          >
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={mockToolData.image}
                alt={mockToolData.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900"
            >
              {mockToolData.name}
            </motion.h1>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Detail</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {mockToolData.details}
              </p>
            </motion.div>

            {/* Variants Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Variants</h2>
              <div className="space-y-2">
                {mockToolData.variants.map((variant, index) => (
                  <motion.button
                    key={variant}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-full px-4 py-3 rounded-md text-left font-medium ${
                      selectedVariant === variant
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {variant}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Bottom Section - Price and Duration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="fixed bottom-0 left-0 right-0 bg-white p-4 md:relative md:p-0 md:bg-transparent shadow-lg md:shadow-none"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Price Display */}
                <div className="text-lg font-bold text-gray-900">
                  ${mockToolData.pricePerDay * quantity} / Day
                </div>

                {/* Duration and Quantity Selection */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="quantity"
                      className="text-gray-900 font-medium"
                    >
                      Quantity:
                    </label>
                    <motion.select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 font-medium bg-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </motion.select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="duration"
                      className="text-gray-900 font-medium"
                    >
                      Duration:
                    </label>
                    <motion.select
                      id="duration"
                      value={selectedDuration}
                      onChange={(e) =>
                        setSelectedDuration(Number(e.target.value))
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 font-medium bg-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                        <option key={days} value={days}>
                          {days} {days === 1 ? "day" : "days"}
                        </option>
                      ))}
                    </motion.select>
                  </div>

                  {/* Confirm Order Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmOrder}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.main>

      {/* Checkout Modal with Animation */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CheckoutModalClient
              isOpen={isCheckoutOpen}
              onClose={() => setIsCheckoutOpen(false)}
              orderDetails={{
                toolName: mockToolData.name,
                duration: selectedDuration,
                variant: selectedVariant,
                totalPrice:
                  selectedDuration * mockToolData.pricePerDay * quantity,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

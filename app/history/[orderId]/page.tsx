"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Navbar from "../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

// Mock data - in a real app, this would come from an API
const getMockOrder = (orderId: string) => ({
  orderId,
  name: "Hammer size XL",
  detail: "Professional grade hammer - Standard variant",
  startDate: "2024-02-15",
  endDate: "2024-02-18",
  paymentStatus: "confirmed",
  orderStatus: "delivering",
  returnDate: "2024-02-20",
  deliveryAddress: "123 Main St, City, Country",
  price: 25,
  duration: 3,
  pricePerDay: 25, // Added price per day for extension calculation
});

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const order = getMockOrder(resolvedParams.orderId);
  const [showReturnOptions, setShowReturnOptions] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(1);
  const [isExtendCheckout, setIsExtendCheckout] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getStatusStep = () => {
    switch (order.orderStatus) {
      case "confirmed":
        return 1;
      case "delivering":
        return 2;
      case "received":
        return 3;
      default:
        return 1;
    }
  };

  const handleReturn = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      // Wait for success animation before redirecting
      setTimeout(() => {
        router.push("/history");
      }, 2000);
    }, 1000);
  };

  const handleExtendReturn = () => {
    setShowExtendModal(true);
    setShowReturnOptions(false);
  };

  const handleConfirmExtend = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsExtendCheckout(false);
    setShowSuccess(true);
    // Wait for success animation before redirecting
    setTimeout(() => {
      router.push("/history");
    }, 2000);
  };

  // Extension Modal
  const ExtendModal = () => {
    if (!showExtendModal) return null;

    const totalCost = extendDays * order.pricePerDay;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowExtendModal(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-gray-900"
              >
                Extend Return Period
              </motion.h2>
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => setShowExtendModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </motion.button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I want to extend for
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-[120px]">
                    <motion.input
                      type="number"
                      min="1"
                      max="30"
                      value={extendDays}
                      onChange={(e) =>
                        setExtendDays(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-lg font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      layoutId="days-input"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        onClick={() =>
                          setExtendDays((prev) => Math.min(30, prev + 1))
                        }
                        className="text-gray-500 hover:text-gray-700 p-0.5"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 4l8 8H4z" />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setExtendDays((prev) => Math.max(1, prev - 1))
                        }
                        className="text-gray-500 hover:text-gray-700 p-0.5"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4 12l8 8 8-8z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <span className="text-gray-700 text-lg">days</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Extension cost</span>
                  <motion.span
                    key={extendDays}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-gray-900 font-medium"
                  >
                    ${order.pricePerDay} × {extendDays} days
                  </motion.span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-900">Total cost</span>
                  <motion.span
                    key={totalCost}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-blue-600"
                  >
                    ${totalCost}
                  </motion.span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowExtendModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsExtendCheckout(true);
                    setShowExtendModal(false);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Extension Checkout Modal
  const ExtendCheckoutModal = () => {
    if (!isExtendCheckout) return null;

    const totalCost = extendDays * order.pricePerDay;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExtendCheckout(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xl font-bold text-gray-900"
              >
                Confirm Extension
              </motion.h2>
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onClick={() => setIsExtendCheckout(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </motion.button>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-gray-900">Extension Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tool</span>
                    <span className="text-gray-900">{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extension Period</span>
                    <span className="text-gray-900">{extendDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate per Day</span>
                    <span className="text-gray-900">${order.pricePerDay}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-blue-600">${totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Payment Method</h3>
                {["Credit Card", "Debit Card", "PayPal"].map(
                  (method, index) => (
                    <motion.label
                      key={method}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-3 text-gray-900">{method}</span>
                    </motion.label>
                  )
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsExtendCheckout(false);
                    setShowExtendModal(true);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmExtend}
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center gap-2 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Payment</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Success Modal
  const SuccessModal = () => {
    if (!showSuccess) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg max-w-md w-full p-8 flex flex-col items-center"
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
            >
              <motion.svg
                className="w-12 h-12 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.path d="M20 6L9 17L4 12" />
              </motion.svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Extension Confirmed!
              </h3>
              <p className="text-gray-600">
                Your rental period has been extended by {extendDays} days.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to history...
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Add this before the return statement
  const ReturnSuccessModal = () => {
    if (!showSuccess) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg max-w-md w-full p-8 flex flex-col items-center"
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
            >
              <motion.svg
                className="w-12 h-12 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.path d="M20 6L9 17L4 12" />
              </motion.svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Return Confirmed!
              </h3>
              <p className="text-gray-600">Thank you for returning the item.</p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting to history...
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {/* Header with Order ID and Actions */}
          <div className="flex justify-between items-start mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-gray-900">
                Order ID: {order.orderId}
              </h1>
              <p className="text-gray-600 mt-2">
                Start since: {order.startDate}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2"
            >
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="Print order details"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  navigator
                    .share({
                      title: `Order ${order.orderId}`,
                      text: `Check my tool rental order: ${order.name}`,
                      url: window.location.href,
                    })
                    .catch(() => {})
                }
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                title="Share order details"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Order Details */}
          <div className="space-y-8">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium text-gray-700 mb-2">Tool Name</h2>
                <p className="text-gray-900 text-lg">{order.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium text-gray-700 mb-2">Duration</h2>
                <p className="text-gray-900 text-lg">{order.duration} days</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium text-gray-700 mb-2">Total Price</h2>
                <p className="text-gray-900 text-lg">${order.price}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="font-medium text-gray-700 mb-2">
                  Delivery Address
                </h2>
                <p className="text-gray-900 text-lg">{order.deliveryAddress}</p>
              </div>
            </motion.div>

            {/* Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="py-8"
            >
              <h2 className="font-medium text-gray-900 mb-6">Order Status</h2>
              <div className="relative">
                {/* Progress Bar */}
                <motion.div className="absolute left-0 top-1/2 w-full h-[2px] bg-gray-200 -translate-y-1/2" />
                <motion.div
                  className="absolute left-0 top-1/2 h-[2px] bg-blue-500 -translate-y-1/2"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(getStatusStep() - 1) * 50}%` }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Status Points */}
                <div className="relative flex justify-between">
                  {["Confirmed Payment", "Delivering", "Received"].map(
                    (status, index) => (
                      <motion.div
                        key={status}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                            getStatusStep() >= index + 1
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-white border-gray-200 text-gray-400"
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getStatusStep() > index + 1 && (
                            <svg
                              className="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </motion.div>
                        <motion.span
                          className={`text-sm mt-2 ${
                            getStatusStep() >= index + 1
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {status}
                        </motion.span>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* Return Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-t pt-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-medium text-gray-900">Return</h2>
                  <p className="text-sm text-gray-600">
                    Return within: {order.returnDate}
                  </p>
                </div>
                <div className="space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReturnOptions(!showReturnOptions)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Return Options
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/history")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Back to History
                  </motion.button>
                </div>
              </div>

              {/* Return Options */}
              <AnimatePresence>
                {showReturnOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReturn}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        I have returned the item
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExtendReturn}
                        className="w-full px-4 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Extend return period
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* ExtendModal */}
      <ExtendModal />
      <ExtendCheckoutModal />
      <SuccessModal />
      <ReturnSuccessModal />
    </div>
  );
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    toolName: string;
    duration: number;
    variant: string;
    totalPrice: number;
  };
}

// Mock pickup locations
const pickupLocations = [
  {
    id: 1,
    name: "Downtown Store",
    address: "123 Main St, Downtown, City",
    hours: "9:00 AM - 6:00 PM",
  },
  {
    id: 2,
    name: "Westside Branch",
    address: "456 West Ave, Westside, City",
    hours: "8:00 AM - 8:00 PM",
  },
  {
    id: 3,
    name: "Eastside Location",
    address: "789 East Blvd, Eastside, City",
    hours: "7:00 AM - 9:00 PM",
  },
];

const paymentMethods = [
  { id: "credit", name: "Credit Card" },
  { id: "debit", name: "Debit Card" },
  { id: "paypal", name: "PayPal" },
];

export function CheckoutModal({
  isOpen,
  onClose,
  orderDetails,
}: CheckoutModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "payment" | "delivery" | "success"
  >("payment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: "credit",
    deliveryMethod: "delivery",
    pickupLocation: "",
    pickupDate: "",
    deliveryAddress: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === "payment") {
      setCurrentStep("delivery");
    } else if (currentStep === "delivery") {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep("success");
      // Wait for success animation before redirecting
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    }
  };

  // Checkmark SVG animation variants
  const checkmarkVariants = {
    hidden: {
      opacity: 0,
      pathLength: 0,
    },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <AnimatePresence mode="wait">
            {currentStep === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="py-12 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <motion.svg
                    className="w-12 h-12 text-green-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <motion.path
                      d="M20 6L9 17L4 12"
                      variants={checkmarkVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </motion.svg>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Order Completed!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for your order. Redirecting to home...
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Order Summary
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>Tool: {orderDetails.toolName}</p>
                    <p>Duration: {orderDetails.duration} days</p>
                    <p>Variant: {orderDetails.variant}</p>
                    <p className="font-medium">
                      Total: ${orderDetails.totalPrice}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {currentStep === "payment" ? (
                    /* Payment Section */
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 mb-4">
                        Payment Method
                      </h3>
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <motion.label
                            key={method.id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                              formData.paymentMethod === method.id
                                ? "bg-blue-50 border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                scale:
                                  formData.paymentMethod === method.id
                                    ? 1.1
                                    : 1,
                                transition: {
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 25,
                                },
                              }}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={formData.paymentMethod === method.id}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600"
                              />
                            </motion.div>
                            <motion.span
                              initial={false}
                              animate={{
                                color:
                                  formData.paymentMethod === method.id
                                    ? "#1D4ED8"
                                    : "#111827",
                              }}
                              className="ml-3 font-medium"
                            >
                              {method.name}
                            </motion.span>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Delivery Section */
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 mb-4">
                        Delivery Method
                      </h3>
                      <motion.div
                        className="space-y-3 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="delivery"
                            checked={formData.deliveryMethod === "delivery"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-3 font-medium text-gray-900">
                            Delivery to Address
                          </span>
                        </label>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="pickup"
                            checked={formData.deliveryMethod === "pickup"}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-3 font-medium text-gray-900">
                            Pick Up in Store
                          </span>
                        </label>
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {formData.deliveryMethod === "delivery" ? (
                          <motion.div
                            key="delivery"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Address
                              </label>
                              <input
                                type="text"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border rounded-md text-gray-900"
                                placeholder="Enter your delivery address"
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="pickup"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Pickup Location
                              </label>
                              <div className="space-y-3">
                                {pickupLocations.map((location, index) => (
                                  <motion.label
                                    key={location.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: index * 0.1,
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 25,
                                    }}
                                    className={`block p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                      formData.pickupLocation ===
                                      location.id.toString()
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div className="flex items-center">
                                      <input
                                        type="radio"
                                        name="pickupLocation"
                                        value={location.id}
                                        checked={
                                          formData.pickupLocation ===
                                          location.id.toString()
                                        }
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600"
                                        required
                                      />
                                      <div className="ml-3">
                                        <div className="font-medium text-gray-900">
                                          {location.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {location.address}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          Hours: {location.hours}
                                        </div>
                                      </div>
                                    </div>
                                  </motion.label>
                                ))}
                              </div>
                            </div>

                            <AnimatePresence>
                              {formData.pickupLocation && (
                                <motion.div
                                  initial={{ opacity: 0, y: -20, height: 0 }}
                                  animate={{ opacity: 1, y: 0, height: "auto" }}
                                  exit={{ opacity: 0, y: -20, height: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 25,
                                  }}
                                  className="overflow-hidden"
                                >
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Pickup Date
                                  </label>
                                  <motion.select
                                    name="pickupDate"
                                    value={formData.pickupDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md text-gray-900 bg-white"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <option value="">Select a date</option>
                                    {[...Array(7)].map((_, index) => {
                                      const date = new Date();
                                      date.setDate(date.getDate() + index);
                                      return (
                                        <option
                                          key={date.toISOString()}
                                          value={
                                            date.toISOString().split("T")[0]
                                          }
                                        >
                                          {date.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </option>
                                      );
                                    })}
                                  </motion.select>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    {currentStep === "delivery" && (
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep("payment")}
                        className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                    )}
                    <motion.button
                      type="submit"
                      className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex items-center ${
                        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Processing...
                        </>
                      ) : currentStep === "payment" ? (
                        "Continue"
                      ) : (
                        "Complete Order"
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

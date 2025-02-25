"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getCurrentUserId } from "@/app/utils/session";

interface ListingFormData {
  name: string;
  description: string;
  price_per_day: string;
  image_url?: string;
}

// Map of default images for tool types
const toolImageMap: { [key: string]: string } = {
  "Power Drill": "/images/tools/powerdrill.jpg",
  "Hammer": "/images/tools/hammer.jpg",
  "Wrench Set": "/images/tools/wrench-set.jpg",
  "Circular Saw": "/images/tools/circular-saw.jpg",
  "Measuring Tape": "/images/tools/measuring-tape.jpg",
  "Screwdriver Set": "/images/tools/screwdiver-set.jpg",
  "Level": "/images/tools/leveling-tool.jpg",
  "Pliers": "/images/tools/piler.jpg",
  "Wire Cutter": "/images/tools/wire-cutter.jpg",
  "Heat Gun": "/images/tools/Heat-gun.jpg",
};

// Helper function to get image for a tool name
function getToolImage(name: string): string {
  // First try exact match
  if (toolImageMap[name]) {
    return toolImageMap[name];
  }
  
  // If no exact match, try to find by partial match
  const lowerName = name.toLowerCase();
  if (lowerName.includes('drill')) {
    return "/images/tools/powerdrill.jpg";
  }
  
  // Default fallback
  return "/images/tools/hammer.jpg";
}

export default function AddListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ListingFormData>({
    name: "",
    description: "",
    price_per_day: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use default image based on tool name
      const defaultImage = getToolImage(formData.name);
      setFormData(prev => ({ 
        ...prev, 
        image_url: defaultImage
      }));
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Special handling for price input
    if (name === "price_per_day") {
      // Only allow numbers and decimal point
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return;
    }

    // Handle other inputs normally
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('You must be logged in to add a listing');
      }

      // Validate price
      const price = parseFloat(formData.price_per_day);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price_per_day: price,
          owner_id: userId,
          status: 'active'
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      router.push("/renter/home");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : 'Failed to create listing');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Add Listing</h2>
        <button
          onClick={() => router.push("/renter/home")}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div
            className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden"
            style={{ cursor: "pointer" }}
            onClick={() => document.getElementById("imageInput")?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                Click to add picture
              </span>
            )}
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
              placeholder="Enter tool name"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
              placeholder="Describe your tool"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Price per Day:
            </label>
            <div className="relative">
              <input
                type="text"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                required
                pattern="^\d*\.?\d*$"
                inputMode="decimal"
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base pr-16"
                placeholder="0.00"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium">
                day
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium text-lg transition-colors ${
              isSubmitting
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Listing"}
          </motion.button>
        </div>
      </form>
    </>
  );
}

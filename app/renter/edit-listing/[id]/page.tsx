"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

interface ListingData {
  id: number;
  name: string;
  type: string;
  price: number;
  pickupAddress: string;
  details: string;
}

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);

  // Mock data - in real app, fetch this based on the ID
  const [formData, setFormData] = useState<ListingData>({
    id: parseInt(resolvedParams.id),
    name: "Hammer",
    type: "Tool",
    price: 0.5,
    pickupAddress: "123 Main St",
    details: "A sturdy hammer for all your construction needs",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - update listing
    console.log("Updated data:", formData);
    router.push("/renter/home"); // Redirect back to listings page after save
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Edit Listing</h2>
        <button
          onClick={() => router.push("/renter/home")}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-gray-600 font-medium">Current Image</span>
          </div>
          <button className="w-full px-6 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium">
            Change Picture
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Type:
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Price:
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium">
                day
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Pickup Address:
            </label>
            <input
              type="text"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Details:
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

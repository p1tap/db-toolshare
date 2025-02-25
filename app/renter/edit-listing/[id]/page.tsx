"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { use } from "react";

interface ListingData {
  id: number;
  name: string;
  description: string;
  price_per_day: number;
  image_url?: string;
}

export default function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ListingData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`/api/tools/${resolvedParams.id}`, {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tool details');
        }
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        console.error('Error fetching tool:', err);
        setError('Failed to load tool details');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we don't have the data yet
    if (!formData) {
      fetchTool();
    }
  }, [resolvedParams.id, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/tools/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      router.push("/renter/home");
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update listing');
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === "price_per_day" ? parseFloat(value) || 0 : value,
      };
    });
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

  if (!formData) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Tool not found
      </div>
    );
  }

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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="aspect-square w-full bg-gray-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
            {formData.image_url ? (
              <Image
                src={formData.image_url}
                alt={formData.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">No image available</span>
            )}
          </div>
          <button
            type="button"
            className="w-full px-6 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            Change Picture
          </button>
        </div>

        {/* Form Section */}
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
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Price per Day:
            </label>
            <div className="relative">
              <input
                type="number"
                name="price_per_day"
                value={formData.price_per_day}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium">
                day
              </div>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-base"
            />
          </div>

          <div className="flex justify-end pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-base disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </form>
    </>
  );
}

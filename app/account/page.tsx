"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentUserId } from "@/app/utils/session";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    dateOfBirth: {
      day: "",
      month: "",
      year: "",
    },
    phoneNumber: "",
    fullName: "",
    address: "",
    city: "",
    postCode: "",
    username: "",
  });

  // Check if user is logged in
  useEffect(() => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }
    
    setUserId(currentUserId);
  }, [router]);

  // Fetch user data on component mount
  useEffect(() => {
    if (!userId) return;
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/current?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        
        // Format date of birth if available
        let day = "", month = "", year = "";
        if (userData.date_of_birth) {
          const date = new Date(userData.date_of_birth);
          day = date.getDate().toString().padStart(2, '0');
          month = (date.getMonth() + 1).toString().padStart(2, '0');
          year = date.getFullYear().toString();
        }
        
        // Parse address components if available
        let address = userData.address || "";
        let city = "";
        let postCode = "";
        
        // Simple parsing - assumes format like "123 Main St, City, PostCode"
        if (address && address.includes(',')) {
          const parts = address.split(',');
          if (parts.length >= 3) {
            address = parts[0].trim();
            city = parts[1].trim();
            postCode = parts[2].trim();
          }
        }
        
        setFormData({
          email: userData.email || "",
          username: userData.username || "",
          dateOfBirth: {
            day,
            month,
            year,
          },
          phoneNumber: userData.phone || "",
          fullName: userData.full_name || "",
          address: address,
          city: city,
          postCode: postCode,
        });
      } catch (err) {
        setError('Failed to load user data. Please try again later.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("dob-")) {
      const field = name.split("-")[1];
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: {
          ...prev.dateOfBirth,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setUpdateSuccess(false);
    setError(null);
    
    try {
      // Format date of birth
      let date_of_birth = null;
      const { day, month, year } = formData.dateOfBirth;
      if (day && month && year) {
        date_of_birth = `${year}-${month}-${day}`;
      }
      
      // Format address
      const address = formData.address + 
        (formData.city ? `, ${formData.city}` : '') + 
        (formData.postCode ? `, ${formData.postCode}` : '');
      
      // Log the data being sent
      console.log('Sending update data:', {
        userId,
        email: formData.email,
        username: formData.username,
        address,
        phone: formData.phoneNumber,
        date_of_birth,
        fullName: formData.fullName,
      });
      
      const response = await fetch('/api/users/current', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email: formData.email,
          username: formData.username,
          address,
          phone: formData.phoneNumber,
          date_of_birth,
          fullName: formData.fullName,
        }),
      });
      
      const responseData = await response.json();
      console.log('Update response:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile');
      }
      
      setUpdateSuccess(true);
      
      // Refresh the page after a short delay to show the updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Account Settings
          </h1>
          
          {updateSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Profile updated successfully!
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center px-2">
                      Click to upload profile picture
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-500">
                  Recommended: 300x300px
                </span>
              </div>

              {/* Basic Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="dob-day"
                    placeholder="DD"
                    maxLength={2}
                    value={formData.dateOfBirth.day}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    name="dob-month"
                    placeholder="MM"
                    maxLength={2}
                    value={formData.dateOfBirth.month}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    name="dob-year"
                    placeholder="YYYY"
                    maxLength={4}
                    value={formData.dateOfBirth.year}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Post Code
                  </label>
                  <input
                    type="text"
                    name="postCode"
                    id="postCode"
                    value={formData.postCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

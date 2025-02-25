"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from '@/app/utils/session';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"user" | "renter" | "admin">(
    "user"
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      // For demo purposes, we'll simulate a login by fetching a user with the entered username
      const username = (document.getElementById('username') as HTMLInputElement).value;
      
      // Fetch user by username
      const response = await fetch(`/api/users/by-username?username=${encodeURIComponent(username)}`);
      
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
      
      const user = await response.json();
      
      // Store user ID in session
      setCurrentUser(user.id);
      
      // Store role in localStorage
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("isAuthenticated", "true");

      // Force a small delay to ensure localStorage is set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Navigate based on role
      switch (selectedRole) {
        case "renter":
          window.location.href = "/renter/home";
          break;
        case "admin":
          window.location.href = "/admin/home";
          break;
        default:
          window.location.href = "/home";
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoggingIn(false);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 p-8 mx-4">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <span className="text-2xl font-bold text-white">TS</span>
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold tracking-tight text-gray-900"
            >
              Sign in to your account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm text-gray-600"
            >
              Welcome back to ToolShare
            </motion.p>
          </div>

          {/* Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 justify-center bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 mb-8"
          >
            {[
              { id: "user", label: "User" },
              { id: "renter", label: "Renter" },
              { id: "admin", label: "Admin" },
            ].map((role, index) => (
              <motion.button
                key={role.id}
                type="button"
                onClick={() =>
                  setSelectedRole(role.id as "user" | "renter" | "admin")
                }
                className={`relative px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  selectedRole === role.id
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {selectedRole === role.id && (
                  <motion.div
                    layoutId="active-role"
                    className="absolute inset-0 bg-blue-600 rounded-lg"
                    transition={{ type: "spring", bounce: 0.3 }}
                  />
                )}
                <span className="relative z-10">{role.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
            onSubmit={handleLogin}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="relative w-full mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Sign in
            </motion.button>
          </motion.form>

          {/* Sign up link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Don't have an account?{" "}
            <Link
              href="/register"
              prefetch={true}
              className="text-blue-600 hover:text-blue-500 font-medium"
              onClick={(e) => {
                e.preventDefault();
                router.push('/register');
              }}
            >
              Sign up now
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const hideNavbarPaths = ["/", "/signup", "/login"];

  useEffect(() => {
    // Get role from localStorage
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // Don't render navbar on auth pages or admin pages
  if (hideNavbarPaths.includes(pathname) || pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const NavLink = ({
    href,
    children,
    isHome,
  }: {
    href?: string;
    children: React.ReactNode;
    isHome?: boolean;
  }) => {
    const finalHref = isHome
      ? userRole === "renter"
        ? "/renter/home"
        : "/home"
      : href;
    const isActive = isHome
      ? pathname === "/home" || pathname === "/renter/home"
      : pathname === href;

    return (
      <Link href={finalHref || "#"} className="relative">
        <motion.div
          className={`px-4 py-2 rounded-md ${
            isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          } hover:bg-gray-200 transition-colors relative cursor-pointer`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {children}
          {isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              layoutId="navbar-indicator"
              transition={{ type: "spring", bounce: 0.25 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <motion.div
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-gray-500">Logo</span>
              </motion.div>
              <NavLink isHome>
                {userRole === "renter" ? "Renter Home" : "Home"}
              </NavLink>
            </div>

            {/* Search bar */}
            <motion.div
              className="flex-1 max-w-2xl mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <input
                type="text"
                placeholder="search..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </motion.div>

            {/* Right section */}
            <div className="flex items-center gap-4">
              <NavLink href="/history">History</NavLink>
              <NavLink href="/support">Support</NavLink>

              {/* Profile dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-gray-500">User</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ type: "spring", bounce: 0.25 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200"
                    >
                      {["account", "history"].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={`/${item}`}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            {item}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* Spacer div to prevent content from being hidden under navbar */}
      <div className="h-16" />
    </>
  );
}

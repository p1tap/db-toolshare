"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/PageTransition";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRenterPath = pathname?.startsWith("/renter");
  const isAdminPath = pathname?.startsWith("/admin");
  const shouldShowNavbar = !isRenterPath && !isAdminPath;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="relative">
          {shouldShowNavbar && <Navbar />}
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}

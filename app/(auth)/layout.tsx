'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Force a re-render when the pathname changes within auth routes
  useEffect(() => {
    // This effect runs when pathname changes
    console.log('Auth route changed:', pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 
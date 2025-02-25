"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUserId } from '@/app/utils/session';
import { useRouter } from 'next/navigation';

interface BalanceHistory {
  date: string;
  amount: number;
  renterName: string;
  toolName: string;
  duration: number;
}

interface BalanceData {
  currentBalance: number;
  history: BalanceHistory[];
}

export default function BalancePage() {
  const router = useRouter();
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/renter/balance?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      setBalanceData(data);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to load balance');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    // This is where you would implement the withdrawal functionality
    setWithdrawing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Withdrawal functionality will be implemented soon!');
    } finally {
      setWithdrawing(false);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Balance Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Balance</h2>
          <div className="text-center">
            <p className="text-5xl font-bold text-blue-600 mb-8">
              ${balanceData?.currentBalance.toFixed(2)}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWithdraw}
              disabled={withdrawing || (balanceData?.currentBalance || 0) <= 0}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium text-lg 
                ${(withdrawing || (balanceData?.currentBalance || 0) <= 0) ? 
                  'opacity-50 cursor-not-allowed' : 
                  'hover:bg-blue-700'}`}
            >
              {withdrawing ? 'Processing...' : 'Withdraw'}
            </motion.button>
          </div>
        </div>

        {/* Balance History Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Balance History</h2>
          <div className="space-y-4">
            {balanceData?.history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                  <p className="font-medium text-gray-900">
                    {entry.renterName} rented {entry.toolName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {entry.duration} days
                  </p>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  +${entry.amount}
                </p>
              </motion.div>
            ))}
            {(!balanceData?.history || balanceData.history.length === 0) && (
              <p className="text-center text-gray-500">No transaction history</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

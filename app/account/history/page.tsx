'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserId } from '@/app/utils/session';
import Link from 'next/link';

interface HistoryItem {
  id: number;
  user_id: number;
  order_id: number;
  detail: string;
  created_at: string;
  order_details?: {
    tool_name: string;
    start_date: string;
    end_date: string;
    status: string;
  };
}

export default function AccountHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [extendDays, setExtendDays] = useState<{ [key: number]: number }>({});
  const [showExtendDropdown, setShowExtendDropdown] = useState<{ [key: number]: boolean }>({});

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

  // Fetch user history on component mount
  useEffect(() => {
    if (!userId) return;
    
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/history/user/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError('Failed to load history. Please try again later.');
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReturnItem = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update the local state to reflect the change
      setHistory(prevHistory => 
        prevHistory.map(item => {
          if (item.order_id === orderId && item.order_details) {
            return {
              ...item,
              order_details: {
                ...item.order_details,
                status: 'completed'
              }
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      // Confirm before cancelling
      if (!confirm('Are you sure you want to cancel this order?')) {
        return;
      }
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      // Update the local state to reflect the change
      setHistory(prevHistory => 
        prevHistory.map(item => {
          if (item.order_id === orderId && item.order_details) {
            return {
              ...item,
              order_details: {
                ...item.order_details,
                status: 'cancelled'
              }
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order. Please try again.');
    }
  };

  const handleExtendDate = async (orderId: number) => {
    try {
      const days = extendDays[orderId] || 1;
      const item = history.find(h => h.order_id === orderId);
      if (!item?.order_details) return;

      const currentEndDate = new Date(item.order_details.end_date);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(newEndDate.getDate() + days);

      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          end_date: newEndDate.toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to extend return date');
      }

      // Update the local state to reflect the change
      setHistory(prevHistory => 
        prevHistory.map(item => {
          if (item.order_id === orderId && item.order_details) {
            return {
              ...item,
              order_details: {
                ...item.order_details,
                end_date: newEndDate.toISOString()
              }
            };
          }
          return item;
        })
      );

      // Reset the dropdown
      setShowExtendDropdown(prev => ({ ...prev, [orderId]: false }));
      setExtendDays(prev => ({ ...prev, [orderId]: 1 }));
    } catch (err) {
      console.error('Error extending return date:', err);
      setError('Failed to extend return date. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Order History
          </h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any order history yet.</p>
              <Link 
                href="/tools" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse Tools
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-gray-900 font-medium">
                            Order ID: {item.order_id}
                          </p>
                        </div>
                        <p className="text-gray-900">
                          {item.order_details?.tool_name || 'Tool rental'}
                        </p>
                      </div>
                      {item.order_details?.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            getStatusBadgeClass(item.order_details.status)
                          }`}
                        >
                          {item.order_details.status}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700">{item.detail}</p>

                    {item.order_details && (
                      <div className="text-gray-700">
                        <p>Start date: {formatDate(item.order_details.start_date)}</p>
                        <p>End date: {formatDate(item.order_details.end_date)}</p>
                      </div>
                    )}

                    <p className="text-gray-500 text-sm">
                      Created: {formatDate(item.created_at)}
                    </p>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/orders/${item.order_id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Order Details
                      </Link>

                      {/* Extend Return Date Button and Dropdown */}
                      {item.order_details?.status && 
                       ['pending', 'active'].includes(item.order_details.status.toLowerCase()) && (
                        <div className="relative">
                          <button
                            onClick={() => setShowExtendDropdown(prev => ({
                              ...prev,
                              [item.order_id]: !prev[item.order_id]
                            }))}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Extend Return Date
                          </button>
                          
                          {showExtendDropdown[item.order_id] && (
                            <div className="absolute mt-2 p-2 bg-white rounded-md shadow-lg border border-gray-200 z-10 flex items-center gap-2">
                              <select
                                value={extendDays[item.order_id] || 1}
                                onChange={(e) => setExtendDays(prev => ({
                                  ...prev,
                                  [item.order_id]: parseInt(e.target.value)
                                }))}
                                className="p-1 border rounded text-gray-900 bg-white"
                              >
                                {[1, 2, 3, 5, 7, 14, 30].map(days => (
                                  <option key={days} value={days} className="text-gray-900 bg-white">
                                    {days} {days === 1 ? 'day' : 'days'}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleExtendDate(item.order_id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
                              >
                                Confirm
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Cancel Order Button */}
                      {item.order_details?.status && 
                       ['pending'].includes(item.order_details.status.toLowerCase()) && (
                        <button
                          onClick={() => handleCancelOrder(item.order_id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* Return Item button */}
                    {item.order_details?.status && 
                     ['pending', 'active'].includes(item.order_details.status.toLowerCase()) && (
                      <button
                        onClick={() => handleReturnItem(item.order_id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                      >
                        I Have Returned This Item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
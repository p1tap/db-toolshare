"use client";

export default function BalancePage() {
  // Mock data for balance history
  const balanceHistory = [
    {
      date: "2022/07/07",
      amount: "+20",
      user: "user1",
      details: "rent hammer",
      duration: "2 days",
    },
    {
      date: "2022/07/06",
      amount: "+40",
      user: "user2",
      details: "rent hammer",
      duration: "2 days",
    },
    {
      date: "2022/07/05",
      amount: "+30",
      user: "user3",
      details: "rent hammer",
      duration: "2 days",
    },
    {
      date: "2022/07/04",
      amount: "+10",
      user: "user4",
      details: "rent hammer",
      duration: "2 days",
    },
    {
      date: "2022/07/03",
      amount: "+15",
      user: "user5",
      details: "rent hammer",
      duration: "2 days",
    },
  ];

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Balance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Balance Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Current Balance
          </h3>
          <div className="text-center">
            <p className="text-5xl font-bold text-gray-900 mb-8">$12,345</p>
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg">
              Withdraw
            </button>
          </div>
        </div>

        {/* Balance History Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Balance History
          </h3>
          <div className="space-y-4">
            {balanceHistory.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{item.date}</span>
                  <span className="text-green-400 font-bold text-lg">
                    {item.amount}$
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-gray-200">
                    {item.user}: {item.details}
                  </p>
                  <p className="text-gray-300">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

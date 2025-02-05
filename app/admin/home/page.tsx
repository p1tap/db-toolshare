"use client";

import { useState } from "react";

interface TopCategory {
  name: string;
  views: string;
  rents: string;
}

interface TopRenter {
  name: string;
  category: string;
  price: string;
  time: string;
  profit: string;
  avatar: string;
}

export default function AdminHomePage() {
  // Mock data for top categories
  const topCategories: TopCategory[] = [
    { name: "Screwdrivers", views: "4.2K", rents: "3.9K" },
    { name: "Crowbar", views: "1.9K", rents: "509" },
    { name: "Hammers", views: "1.5K", rents: "986" },
    { name: "Saws", views: "974", rents: "639" },
    { name: "Sledgehammer", views: "179", rents: "57" },
  ];

  // Mock data for top renters
  const topRenters: TopRenter[] = [
    {
      name: "Tom Kuki",
      category: "Screwdrivers",
      price: "$5",
      time: "65",
      profit: "$45",
      avatar: "",
    },
    {
      name: "Alex Arai",
      category: "Hammers",
      price: "$6",
      time: "59",
      profit: "$125",
      avatar: "",
    },
    {
      name: "Tim Tub",
      category: "Crowbar",
      price: "$4",
      time: "55",
      profit: "$247",
      avatar: "",
    },
    {
      name: "Jim Jum",
      category: "Saws",
      price: "$9",
      time: "48",
      profit: "$103",
      avatar: "",
    },
  ];

  // Mock data for visitor analytics
  const visitorData = [
    250, 200, 300, 120, 220, 60, 160, 230, 120, 200, 280, 80, 150, 230, 180,
    350, 280, 150, 230, 180, 250, 130, 260, 150, 100, 240, 200, 70, 200, 150,
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Visitors Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Visitors Analytics
            </h2>
            <div className="text-sm text-gray-500">
              Dec 29, 2023 - Jan 4, 2024
            </div>
          </div>
          <div className="h-64 w-full">
            {/* Chart */}
            <div className="relative h-full">
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-48">
                {visitorData.map((value, index) => (
                  <div
                    key={index}
                    className="w-6 bg-indigo-500 rounded-t"
                    style={{ height: `${(value / 350) * 100}%` }}
                  ></div>
                ))}
              </div>
              {/* X-axis */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between mt-2 text-sm text-gray-500">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className="text-center"
                    style={{ width: "24px" }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Category
              </h2>
              <button className="text-gray-400">•••</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm text-gray-500 pb-2">
                <div></div>
                <div className="text-center">View</div>
                <div className="text-center">Rent</div>
              </div>
              {topCategories.map((category, index) => (
                <div key={index} className="grid grid-cols-3 items-center">
                  <div className="text-gray-900 font-medium">
                    {category.name}
                  </div>
                  <div className="text-center text-gray-600">
                    {category.views}
                  </div>
                  <div className="text-center text-gray-600">
                    {category.rents}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Renter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Top Renter
            </h2>
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="text-left font-medium pb-4">Name</th>
                  <th className="text-left font-medium pb-4">Category</th>
                  <th className="text-left font-medium pb-4">Price</th>
                  <th className="text-left font-medium pb-4">Time</th>
                  <th className="text-left font-medium pb-4">Profit</th>
                </tr>
              </thead>
              <tbody>
                {topRenters.map((renter, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <span className="font-medium text-gray-900">
                          {renter.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{renter.category}</td>
                    <td className="py-3 text-gray-600">{renter.price}</td>
                    <td className="py-3 text-gray-600">{renter.time}</td>
                    <td className="py-3 text-green-500">{renter.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

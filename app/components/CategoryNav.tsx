'use client';

import { useState } from 'react';

interface Category {
  name: string;
  items: string[];
}

interface CategoryNavProps {
  initialCategories: Category[];
}

export default function CategoryNav({ initialCategories }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {initialCategories.map((category) => (
            <div key={category.name} className="flex-none">
              <button
                onClick={() => setActiveCategory(
                  activeCategory === category.name ? null : category.name
                )}
                className={`font-medium ${
                  activeCategory === category.name 
                    ? 'text-blue-600' 
                    : 'text-gray-900'
                }`}
              >
                {category.name}
              </button>
              {activeCategory === category.name && (
                <ul className="mt-2 space-y-1">
                  {category.items.map((item) => (
                    <li key={item}>
                      <button className="text-sm text-gray-600">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

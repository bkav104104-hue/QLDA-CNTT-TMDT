import React from 'react';

export const TrendingKeywords: React.FC = () => {
  const keywords = [
    'Redmi Note 14',
    'Galaxy Z Flip8',
    'Galaxy Z Fold8',
    'iPhone 16 Pro Max',
    'OPPO Reno15 F',
    'Xiaomi 15',
    'Samsung A56 5G',
    'Củ sạc GaN 65W'
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-1.5 px-4 hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar text-xs">
        <span className="font-bold text-[#009981] whitespace-nowrap flex items-center gap-1">
          Từ khóa xu hướng:
        </span>
        <div className="flex items-center gap-2">
          {keywords.map((kw, i) => (
            <a
              key={i}
              href={`#search-${kw}`}
              className="text-gray-600 hover:text-[#009981] hover:bg-emerald-50 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
            >
              {kw}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};


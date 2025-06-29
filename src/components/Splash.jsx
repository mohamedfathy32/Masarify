import React from "react";

export default function Splash() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#101112]">
      {/* لوجو متحرك */}
      <div className="mb-8 animate-bounce">
        <svg className="w-20 h-20 text-teal-400 drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" strokeOpacity="0.15" strokeWidth="4" />
          <path d="M24 8a16 16 0 1 1-11.31 27.31" strokeLinecap="round" />
          <path d="M24 16v8l6 3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-teal-300 text-xl font-semibold tracking-wide animate-pulse">جاري التحميل...</p>
    </div>
  );
} 
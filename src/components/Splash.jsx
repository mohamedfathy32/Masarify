import React from "react";
import { useTheme } from "../hooks/useTheme";

export default function Splash() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* لوجو متحرك */}
      <div className="mb-8 animate-bounce">
        <svg className={`w-20 h-20 text-teal-400 drop-shadow-lg ${theme == 'dark' ? 'text-teal-400' : 'text-black'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" strokeOpacity="0.15" strokeWidth="4" />
          <path d="M24 8a16 16 0 1 1-11.31 27.31" strokeLinecap="round" />
          <path d="M24 16v8l6 3" strokeLinecap="round" />
        </svg>
      </div>
      <p className={`${theme == 'dark' ? 'text-teal-400' : 'text-black'} text-xl font-semibold tracking-wide animate-pulse`}>جاري التحميل...</p>
    </div>
  );
} 
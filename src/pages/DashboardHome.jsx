import React from "react";
import { auth } from "../firebase";
import useAuth from "../hooks/useAuth";

function DashboardHome({ income, expense, balance }) {
  const { user } = useAuth();
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
          مرحبًا {user?.displayName || user?.email || "مستخدم"} 
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-[#18181b] rounded-xl px-4 sm:px-7 py-4 sm:py-5 text-center shadow">
            <div className="text-gray-300 text-xs sm:text-sm mb-1">الرصيد الحالي</div>
            <div className="text-lg sm:text-2xl font-bold text-white">{balance} ج.م</div>
          </div>
          <div className="bg-[#18181b] rounded-xl px-4 sm:px-7 py-4 sm:py-5 text-center shadow">
            <div className="text-gray-300 text-xs sm:text-sm mb-1">الدخل</div>
            <div className="text-base sm:text-xl font-semibold text-green-400">{income} ج.م</div>
          </div>
          <div className="bg-[#18181b] rounded-xl px-4 sm:px-7 py-4 sm:py-5 text-center shadow">
            <div className="text-gray-300 text-xs sm:text-sm mb-1">المصروفات</div>
            <div className="text-base sm:text-xl font-semibold text-red-400">{expense} ج.م</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardHome; 
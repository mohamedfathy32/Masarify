import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { getTransactionsByUser } from "../services/transactionsService";
import useAuth from "../hooks/useAuth";

const COLORS = ["#14b8a6", "#f97316", "#ef4444", "#6366f1", "#22d3ee", "#facc15", "#a3e635", "#f472b6"];

function Analytics() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTransactionsByUser(user.uid).then(setTransactions).finally(() => setLoading(false));
  }, [user]);

  // Pie chart: مصاريف حسب التصنيف
  const expenseByCategory = Object.entries(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Bar chart: دخل/مصروف لكل يوم في الشهر الحالي
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const daily = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!daily[day]) daily[day] = { day, دخل: 0, مصروف: 0 };
      if (t.type === "income") daily[day]["دخل"] += Number(t.amount);
      else daily[day]["مصروف"] += Number(t.amount);
    }
  });
  const dailyData = Object.values(daily).sort((a, b) => a.day - b.day);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">التقارير والتحليلات</h2>
        {loading ? (
          <div className="text-gray-400 text-center">جاري التحميل...</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-10 justify-center items-center max-w-6xl mx-auto">
            <div className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow w-full lg:w-1/2">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">نسبة المصروفات حسب التصنيف</h3>
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <PieChart>
                  <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} className="sm:outerRadius-80" label>
                    {expenseByCategory.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow w-full lg:w-1/2">
              <h3 className="text-white text-base sm:text-lg font-semibold mb-3 sm:mb-4">الدخل والمصروف خلال الشهر</h3>
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <BarChart data={dailyData}>
                  <XAxis dataKey="day" stroke="#d1d5db" fontSize={12} />
                  <YAxis stroke="#d1d5db" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="دخل" fill="#14b8a6" />
                  <Bar dataKey="مصروف" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Analytics; 
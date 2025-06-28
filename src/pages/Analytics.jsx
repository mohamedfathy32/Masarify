import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { getTransactionsByUser } from "../services/transactionsService";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";
import * as XLSX from "xlsx";

const COLORS = ["#f97316", "#ef4444", "#facc15", "#a3e635", "#f472b6", "#10b981", "#3b82f6", "#8b5cf6", "#e879f9", "#14b8a6", "#fb923c", "#94a3b8"];

function getMonthOptions(transactions) {
  // استخراج كل الشهور/السنوات الموجودة في العمليات
  const months = new Set();
  transactions.forEach(t => {
    const d = new Date(t.date);
    months.add(`${d.getFullYear()}-${d.getMonth()}`);
  });
  return Array.from(months).map(str => {
    const [year, month] = str.split("-").map(Number);
    return { year, month, label: `${format(new Date(year, month), "MMMM yyyy")}` };
  }).sort((a, b) => b.year - a.year || b.month - a.month);
}

function Analytics() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTransactionsByUser(user.uid).then(txs => {
      setTransactions(txs);
      // افتراضيًا الشهر الحالي
      const now = new Date();
      setSelectedMonth({ year: now.getFullYear(), month: now.getMonth() });
    }).finally(() => setLoading(false));
  }, [user]);

  // خيارات الشهور
  const monthOptions = getMonthOptions(transactions);

  // العمليات الخاصة بالشهر المختار
  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    return selectedMonth && d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
  });

  // ملخصات
  const income = filtered.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = filtered.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;
  const expenseByCategory = Object.entries(
    filtered.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  const topCategory = expenseByCategory.sort((a, b) => b.value - a.value)[0]?.name || "-";
  const biggest = filtered.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];
  const incomeCount = filtered.filter(t => t.type === "income").length;
  const expenseCount = filtered.filter(t => t.type === "expense").length;
  const days = new Set(filtered.map(t => new Date(t.date).getDate()));
  const avgExpense = days.size > 0 ? Math.round(expense / days.size) : 0;
  const incomeVsExpense = [
    { name: "الدخل", value: income },
    { name: "المصروف", value: expense }
  ];
  const ratio = expense > 0 ? ((income / expense) * 100).toFixed(1) : "-";

  // رسم بياني يومي
  const daily = {};
  filtered.forEach(t => {
    const d = new Date(t.date);
    const day = d.getDate();
    if (!daily[day]) daily[day] = { day, دخل: 0, مصروف: 0 };
    if (t.type === "income") daily[day]["دخل"] += Number(t.amount);
    else daily[day]["مصروف"] += Number(t.amount);
  });
  const dailyData = Object.values(daily).sort((a, b) => a.day - b.day);

  // تصدير ملخص التحليل إلى Excel
  const handleExport = () => {
    const wsData = [
      ["الشهر", monthOptions.find(m => m.year === selectedMonth.year && m.month === selectedMonth.month)?.label || "-"],
      ["إجمالي الدخل", income],
      ["إجمالي المصروفات", expense],
      ["الرصيد", balance],
      ["أكثر تصنيف صرف", topCategory],
      ["أكبر عملية", biggest ? `${biggest.amount} (${biggest.type === "income" ? "دخل" : "مصروف"})` : "-"],
      ["عدد عمليات الدخل", incomeCount],
      ["عدد عمليات المصروف", expenseCount],
      ["متوسط المصروف اليومي", avgExpense],
      ["نسبة الدخل للمصروف %", ratio],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تحليل الشهر");
    XLSX.writeFile(wb, `تحليل_${selectedMonth.year}_${selectedMonth.month + 1}.xlsx`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>

            <h2 className="text-2xl font-bold text-white">التقارير والتحليلات</h2>
            <p className="text-sm text-gray-400 ">
              راقب مصروفاتك الشهرية، حلل بياناتك المالية، وصدّر التقارير بسهولة.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <select
              className="p-2 rounded-lg border border-[#222] bg-[#18181b] text-white text-sm focus:outline-none"
              value={selectedMonth ? `${selectedMonth.year}-${selectedMonth.month}` : ""}
              onChange={e => {
                const [year, month] = e.target.value.split("-").map(Number);
                setSelectedMonth({ year, month });
              }}
            >
              {monthOptions.map(opt => (
                <option key={opt.year + "-" + opt.month} value={`${opt.year}-${opt.month}`}>{opt.label}</option>
              ))}
            </select>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
              onClick={handleExport}
            >
              تحميل كـ Excel
            </button>
          </div>
        </div>

        {/* ملخص سريع وتحليل ذكي */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#18181b] rounded-xl p-6 text-center border border-[#232323] flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">إجمالي الدخل</div>
            <div className="text-xl font-bold text-teal-400">{income} ج.م</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 text-center border border-[#232323] flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">إجمالي المصروفات</div>
            <div className="text-xl font-bold text-red-400">{expense} ج.م</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 text-center border border-[#232323] flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">الرصيد الشهري</div>
            <div className="text-xl font-bold text-white">{balance} ج.م</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 text-center border border-[#232323] flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">أكثر تصنيف صرف</div>
            <div className="text-lg font-bold text-orange-400">{topCategory}</div>
          </div>
        </div>
        {/* تحليل ذكي إضافي */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#18181b]  rounded-xl p-6 border border-[#232323] text-center flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">عدد عمليات الدخل</div>
            <div className="text-lg font-bold text-teal-400">{incomeCount}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 border border-[#232323] text-center flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">عدد عمليات المصروف</div>
            <div className="text-lg font-bold text-red-400">{expenseCount}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-6 border border-[#232323] text-center flex flex-col items-center justify-center min-h-[120px]">
            <div className="text-gray-300 text-xs mb-1">رسم بياني: الدخل مقابل المصروف</div>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={incomeVsExpense} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} label>
                  {incomeVsExpense.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? "#14b8a6" : "#ef4444"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#18181b] rounded-2xl p-6 border border-[#232323] flex flex-col">
            <h3 className="text-white text-base font-semibold mb-4">نسبة المصروفات حسب التصنيف</h3>
            <ResponsiveContainer width="100%" height={220} className="sm:h-[250px]">
              <PieChart>
                <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {expenseByCategory.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-[#18181b] rounded-2xl p-6 border border-[#232323] flex flex-col">
            <h3 className="text-white text-base font-semibold mb-4">الدخل والمصروف خلال الشهر</h3>
            <ResponsiveContainer width="100%" height={220} className="sm:h-[250px]">
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
      </main>
    </div>
  );
}

export default Analytics; 
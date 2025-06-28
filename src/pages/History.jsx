import React, { useEffect, useState } from "react";
import { getTransactionsByUser } from "../services/transactionsService";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function getMonthOptions(transactions) {
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



function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTransactionsByUser(user.uid).then(txs => {
      setTransactions(txs);
      if (txs.length) {
        const now = new Date();
        setMonthFilter({ year: now.getFullYear(), month: now.getMonth() });
      }
    }).finally(() => setLoading(false));
  }, [user]);

  const monthOptions = getMonthOptions(transactions);
  const filtered = transactions.filter(tx => {
    const d = new Date(tx.date);
    const matchesSearch =
      !search ||
      (tx.note && tx.note.toLowerCase().includes(search.toLowerCase())) ||
      (tx.category && tx.category.toLowerCase().includes(search.toLowerCase()));
    return (
      matchesSearch &&
      (!typeFilter || tx.type === typeFilter) &&
      (!dateFilter || tx.date?.slice(0, 10) === dateFilter) &&
      (!monthFilter || (monthFilter.year === undefined || monthFilter.month === undefined) || (d.getFullYear() === monthFilter.year && d.getMonth() === monthFilter.month))
    );
  });

  // Group filtered transactions by date

  // تصدير العمليات المعروضة إلى Excel
  const handleExport = () => {
    const wsData = [
      ["المبلغ", "النوع", "التصنيف", "التاريخ", "ملاحظة"],
      ...filtered.map(tx => [
        tx.amount,
        tx.type === "income" ? "دخل" : "مصروف",
        tx.category,
        new Date(tx.date).toLocaleDateString('ar-EG'),
        tx.note || "-"
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "سجل العمليات");
    XLSX.writeFile(wb, `سجل_${monthFilter ? monthFilter.year + '_' + (monthFilter.month + 1) : 'الكل'}.xlsx`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-right">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">سجل العمليات</h2>
            <p className="text-sm text-gray-400">تتبع جميع عملياتك المالية مع إمكانية الفلترة والتصدير.</p>
          </div>
          <div className="flex gap-2 items-center flex-wrap justify-end">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow"
              onClick={() => navigate('/add')}
            >
              + إضافة عملية
            </button>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow"
              onClick={handleExport}
              disabled={filtered.length === 0}
            >
              تحميل كـ Excel
            </button>
          </div>
        </div>
        {/* حقل البحث العام */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في الملاحظات أو التصنيفات..."
            className="w-full p-3 rounded-lg border border-[#232323] bg-[#18181b] text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            dir="rtl"
          />
        </div>
        {/* الفلاتر */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 items-center">
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            className="p-2 rounded border border-[#222] bg-[#0f0f0f] text-white text-sm w-full"
          >
            <option value="">كل الأنواع</option>
            <option value="income">دخل</option>
            <option value="expense">مصروف</option>
          </select>
          <select
            value={monthFilter ? `${monthFilter.year}-${monthFilter.month}` : ""}
            onChange={e => {
              const [year, month] = e.target.value.split("-").map(Number);
              setMonthFilter({ year, month });
            }}
            className="p-2 rounded border border-[#222] bg-[#0f0f0f] text-white text-sm w-full"
          >
            <option value="">كل الشهور</option>
            {monthOptions.map(opt => (
              <option key={opt.year + "-" + opt.month} value={`${opt.year}-${opt.month}`}>{opt.label}</option>
            ))}
          </select>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={e => setDateFilter(e.target.value)} 
            className="p-2 rounded border border-[#222] bg-[#0f0f0f] text-white text-sm w-full focus:ring-2 focus:ring-cyan-500"
            style={{ colorScheme: 'dark' }}
          />
        </div>
        <div className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow overflow-x-auto">
          {loading ? (
            <div className="text-gray-400 text-center">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-400 text-center">لا توجد عمليات مطابقة.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <table className="min-w-full text-xs sm:text-sm text-right hidden sm:table">
                <thead>
                  <tr className="text-gray-300 border-b border-[#222]">
                    <th className="py-2 px-2 sm:px-3">المبلغ</th>
                    <th className="py-2 px-2 sm:px-3">النوع</th>
                    <th className="py-2 px-2 sm:px-3">التصنيف</th>
                    <th className="py-2 px-2 sm:px-3">التاريخ</th>
                    <th className="py-2 px-2 sm:px-3">ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(tx => (
                    <tr key={tx.id} className="border-b border-[#222] hover:bg-[#232323]">
                      <td className="py-2 px-2 sm:px-3">
                        <span className={`font-bold ${tx.type === "income" ? "text-green-400" : "text-red-400"}`}>
                          {tx.type === "income" ? "+" : "-"}{tx.amount} ج.م
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${tx.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {tx.type === "income" ? "دخل" : "مصروف"}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-3 text-gray-300">{tx.category}</td>
                      <td className="py-2 px-2 sm:px-3 text-gray-300">{new Date(tx.date).toLocaleDateString('ar-EG')}</td>
                      <td className="py-2 px-2 sm:px-3 text-gray-400 text-xs">{tx.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Mobile Cards */}
              <div className="flex flex-col gap-4 sm:hidden">
                {filtered.map(tx => (
                  <div key={tx.id} className="bg-[#222] rounded-xl p-4 flex flex-col gap-2 shadow border border-[#232323]">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold text-lg ${tx.type === "income" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "income" ? "+" : "-"}{tx.amount} ج.م
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${tx.type === "income" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {tx.type === "income" ? "دخل" : "مصروف"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-gray-300">
                      <div><span className="font-semibold text-gray-400">التصنيف:</span> {tx.category}</div>
                      <div><span className="font-semibold text-gray-400">التاريخ:</span> {new Date(tx.date).toLocaleDateString('ar-EG')}</div>
                      <div><span className="font-semibold text-gray-400">ملاحظة:</span> {tx.note || "-"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default History; 
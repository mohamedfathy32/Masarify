import React, { useEffect, useState } from "react";
import { getTransactionsByUser } from "../services/transactionsService";
import useAuth from "../hooks/useAuth";

function History() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTransactionsByUser(user.uid).then(setTransactions).finally(() => setLoading(false));
  }, [user]);

  const filtered = transactions.filter(tx =>
    (!typeFilter || tx.type === typeFilter) &&
    (!dateFilter || tx.date?.slice(0, 10) === dateFilter)
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-right">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">سجل العمليات</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center justify-end">
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            className="p-2 sm:p-3 rounded border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="">الكل</option>
            <option value="income">دخل</option>
            <option value="expense">مصروف</option>
          </select>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={e => setDateFilter(e.target.value)} 
            className="p-2 sm:p-3 rounded border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base w-full sm:w-auto" 
          />
        </div>
        <div className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow overflow-x-auto">
          {loading ? (
            <div className="text-gray-400 text-center">جاري التحميل...</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-400 text-center">لا توجد عمليات مطابقة.</div>
          ) : (
            <table className="min-w-full text-xs sm:text-sm text-right">
              <thead>
                <tr className="text-gray-300 border-b border-[#222]">
                  <th className="py-2 px-2 sm:px-3">المبلغ</th>
                  <th className="py-2 px-2 sm:px-3">النوع</th>
                  <th className="py-2 px-2 sm:px-3 hidden sm:table-cell">التصنيف</th>
                  <th className="py-2 px-2 sm:px-3">التاريخ</th>
                  <th className="py-2 px-2 sm:px-3 hidden lg:table-cell">ملاحظة</th>
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
                    <td className="py-2 px-2 sm:px-3 hidden sm:table-cell text-gray-300">{tx.category}</td>
                    <td className="py-2 px-2 sm:px-3 text-gray-300">{new Date(tx.date).toLocaleDateString('ar-EG')}</td>
                    <td className="py-2 px-2 sm:px-3 hidden lg:table-cell text-gray-400 text-xs">{tx.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default History; 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { addTransaction, getTransactionsByUser } from "../services/transactionsService";

const categories = [
  "أكل وشرب",
  "مواصلات",
  "تسوق",
  "إيجار/سكن",
  "صحة",
  "ترفيه",
  "تعليم",
  "أخرى"
];

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: categories[0],
    date: new Date().toISOString().slice(0, 10),
    note: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // حساب الملخصات
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  // جلب العمليات
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTransactionsByUser(user.uid).then(setTransactions).finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
        setFormError("أدخل مبلغًا صحيحًا");
        setFormLoading(false);
        return;
      }
      await addTransaction({
        ...form,
        amount: Number(form.amount),
        userId: user.uid,
        date: new Date(form.date).toISOString()
      });
      setForm({ amount: "", type: "expense", category: categories[0], date: new Date().toISOString().slice(0, 10), note: "" });
      // تحديث القائمة
      const txs = await getTransactionsByUser(user.uid);
      setTransactions(txs);
    } catch (err) {
      console.log(err)
      setFormError("حدث خطأ أثناء إضافة العملية");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section className="p-4 sm:p-6 lg:p-8 text-center">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">
        مرحبًا {user?.displayName || user?.email || "مستخدم"} 👋
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg mb-6 sm:mb-8 hover:bg-red-600 transition text-sm sm:text-base"
      >
        تسجيل الخروج
      </button>

      {/* ملخص الرصيد */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-[#18181b] rounded-xl px-4 sm:px-7 py-4 sm:py-5 text-center shadow">
          <div className="text-gray-300 text-xs sm:text-sm mb-1">الرصيد الحالي</div>
          <div className="text-lg sm:text-2xl font-bold text-white">{balance} ج.م</div>
        </div>
        <div className="bg-[#18181b] rounded-xl px-4 sm:px-7 py-4 sm:py-5 text-center shadow">
          <div className="text-gray-300 text-xs sm:text-sm mb-1">الدخل</div>
          <div className="text-base sm:text-xl font-semibold text-teal-400">{income} ج.م</div>
        </div>
        <div className="bg-[#18181b] rounded-xl px-4 sm:px-7 py-4 sm:py-5 text-center shadow">
          <div className="text-gray-300 text-xs sm:text-sm mb-1">المصروفات</div>
          <div className="text-base sm:text-xl font-semibold text-red-400">{expense} ج.م</div>
        </div>
      </div>

      {/* نموذج إضافة عملية */}
      <form onSubmit={handleSubmit} className="bg-[#18181b] rounded-2xl p-4 sm:p-6 mb-8 sm:mb-10 shadow space-y-4 text-right max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">المبلغ</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
              min="1"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">النوع</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            >
              <option value="expense">مصروف</option>
              <option value="income">دخل</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">التصنيف</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">التاريخ</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 mb-1 text-sm sm:text-base">ملاحظة (اختياري)</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            maxLength={100}
          />
        </div>
        {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
        <button
          type="submit"
          className="w-full bg-teal-500 text-white font-semibold text-base sm:text-lg p-3 sm:p-4 rounded-lg border-none mt-2 cursor-pointer transition hover:bg-teal-600 disabled:opacity-60"
          disabled={formLoading}
        >
          {formLoading ? "...جاري الإضافة" : "إضافة العملية"}
        </button>
      </form>

      {/* عرض العمليات */}
      <div className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow max-w-4xl mx-auto">
        <h2 className="text-white text-base sm:text-lg font-bold mb-4 text-right">العمليات الأخيرة</h2>
        {loading ? (
          <div className="text-gray-400 text-center">جاري التحميل...</div>
        ) : transactions.length === 0 ? (
          <div className="text-gray-400 text-center">لا توجد عمليات بعد.</div>
        ) : (
          <div className="overflow-x-auto">
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
                {transactions.slice(0, 10).map(transaction => (
                  <tr key={transaction.id} className="border-b border-[#222] hover:bg-[#232323]">
                    <td className="py-2 px-2 sm:px-3">
                      <span className={`font-semibold ${transaction.type === "income" ? "text-teal-400" : "text-red-400"}`}>
                        {transaction.type === "income" ? "+" : "-"}{transaction.amount} ج.م
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === "income" ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"}`}>
                        {transaction.type === "income" ? "دخل" : "مصروف"}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:px-3 hidden sm:table-cell text-gray-300">{transaction.category}</td>
                    <td className="py-2 px-2 sm:px-3 text-gray-300">{new Date(transaction.date).toLocaleDateString('ar-EG')}</td>
                    <td className="py-2 px-2 sm:px-3 hidden lg:table-cell text-gray-400 text-xs">{transaction.note || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard; 
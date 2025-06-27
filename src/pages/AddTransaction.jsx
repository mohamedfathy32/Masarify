import React, { useState, useEffect } from "react";
import { addTransaction } from "../services/transactionsService";
import useAuth from "../hooks/useAuth";
import { getCategories, addCategory, initializeDefaultCategories } from "../services/categoriesService";

function AddTransaction() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    note: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const loadCategories = async () => {
      try {
        // تهيئة التصنيفات الافتراضية أول مرة
        await initializeDefaultCategories(user.uid);
        
        // جلب كل التصنيفات من قاعدة البيانات
        const allCategories = await getCategories(user.uid);
        setCategories([...allCategories, "أخرى"]);
        
        // تعيين أول تصنيف كقيمة افتراضية
        if (allCategories.length > 0) {
          setForm(prev => ({ ...prev, category: allCategories[0] }));
        }
      } catch (error) {
        console.error("خطأ في تحميل التصنيفات:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === "category") {
      if (value === "أخرى") setShowNewCategory(true);
      else setShowNewCategory(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError("");
    setSuccess(false);
    setFormLoading(true);
    let finalCategory = form.category;
    try {
      if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
        setFormError("أدخل مبلغًا صحيحًا");
        setFormLoading(false);
        return;
      }
      // إذا اختار أخرى وأدخل تصنيف جديد
      if (showNewCategory && newCategory.trim()) {
        finalCategory = newCategory.trim();
        await addCategory(user.uid, finalCategory);
        // إضافة التصنيف الجديد للقائمة المحلية
        setCategories(prev => {
          const updated = prev.filter(c => c !== "أخرى");
          return [...updated, finalCategory, "أخرى"];
        });
      }
      await addTransaction({
        ...form,
        category: finalCategory,
        amount: Number(form.amount),
        userId: user.uid,
        date: new Date(form.date).toISOString()
      });
      setForm({ amount: "", type: "expense", category: categories[0] || "", date: new Date().toISOString().slice(0, 10), note: "" });
      setNewCategory("");
      setShowNewCategory(false);
      setSuccess(true);
    } catch (err) {
      setFormError("حدث خطأ أثناء إضافة العملية");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-white">جاري تحميل التصنيفات...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-right">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">إضافة عملية جديدة</h2>
        <form onSubmit={handleSubmit} className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow space-y-4 max-w-2xl mx-auto">
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
            <div className="sm:col-span-2">
              <label className="block text-gray-300 mb-1 text-sm sm:text-base">التصنيف</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
                required
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {showNewCategory && (
                <input
                  type="text"
                  placeholder="أدخل تصنيف جديد"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full mt-2 p-2 sm:p-3 rounded-lg border border-[#222] bg-[#232323] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
                  maxLength={30}
                  required
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
          </div>
          {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
          {success && <div className="text-green-500 text-sm text-center">تمت إضافة العملية بنجاح!</div>}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-semibold text-base sm:text-lg p-3 sm:p-4 rounded-lg border-none mt-2 cursor-pointer transition hover:bg-teal-600 disabled:opacity-60"
            disabled={formLoading}
          >
            {formLoading ? "...جاري الإضافة" : "إضافة العملية"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddTransaction; 
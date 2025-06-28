import React, { useState, useEffect } from "react";
import { addTransaction } from "../services/transactionsService";
import useAuth from "../hooks/useAuth";
import { getExpenseCategories, getIncomeCategories, addIncomeCategory, initializeDefaultExpenseCategories, initializeDefaultIncomeCategories } from "../services/categoriesService";

function AddTransaction() {
  const { user } = useAuth();
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
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
  const [showNewIncomeCategory, setShowNewIncomeCategory] = useState(false);
  const [showNewExpenseCategory, setShowNewExpenseCategory] = useState(false);
  const [newIncomeCategory, setNewIncomeCategory] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadCategories = async () => {
      try {
        // تهيئة التصنيفات الافتراضية
        await initializeDefaultExpenseCategories(user.uid);
        await initializeDefaultIncomeCategories(user.uid);

        // جلب التصنيفات
        const [expCats, incCats] = await Promise.all([
          getExpenseCategories(user.uid),
          getIncomeCategories(user.uid)
        ]);

        setExpenseCategories(expCats);
        setIncomeCategories(incCats);

        // تعيين أول تصنيف مصروف كقيمة افتراضية
        if (expCats.length > 0) {
          setForm(prev => ({ ...prev, category: expCats[0] }));
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

    // إذا تغير النوع، حدث التصنيف
    if (name === "type") {
      if (value === "income") {
        setForm(f => ({ ...f, type: value, category: "" }));
        setShowNewIncomeCategory(false);
        setShowNewExpenseCategory(false);
      } else {
        setForm(f => ({ ...f, type: value, category: filteredExpenseCategories[0] || "" }));
        setShowNewIncomeCategory(false);
        setShowNewExpenseCategory(false);
      }
    }
    // إذا اختار أخرى للمصروف
    if (name === "category" && value === "أخرى" && form.type === "expense") {
      setShowNewExpenseCategory(true);
    } else if (name === "category" && form.type === "expense") {
      setShowNewExpenseCategory(false);
    }
    // إذا اختار أخرى للدخل
    if (name === "category" && value === "أخرى" && form.type === "income") {
      setShowNewIncomeCategory(true);
    } else if (name === "category" && form.type === "income") {
      setShowNewIncomeCategory(false);
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

      // إذا اختار أخرى وأدخل تصنيف جديد للمصروف
      if (showNewExpenseCategory && newExpenseCategory.trim() && form.type === "expense") {
        finalCategory = newExpenseCategory.trim();
        setExpenseCategories(prev => [...prev, finalCategory]);
      }
      // إذا اختار أخرى وأدخل تصنيف جديد للدخل
      if (showNewIncomeCategory && newIncomeCategory.trim() && form.type === "income") {
        finalCategory = newIncomeCategory.trim();
        await addIncomeCategory(user.uid, finalCategory);
        setIncomeCategories(prev => [...prev, finalCategory]);
      }

      await addTransaction({
        ...form,
        category: finalCategory,
        amount: Number(form.amount),
        userId: user.uid,
        date: new Date(form.date).toISOString()
      });

      setForm({
        amount: "",
        type: "expense",
        category: filteredExpenseCategories[0] || "",
        date: new Date().toISOString().slice(0, 10),
        note: ""
      });
      setNewIncomeCategory("");
      setNewExpenseCategory("");
      setShowNewIncomeCategory(false);
      setShowNewExpenseCategory(false);
      setSuccess(true);
    } catch (err) {
      console.error(err)
      setFormError("حدث خطأ أثناء إضافة العملية");
    } finally {
      setFormLoading(false);
    }
  };

  // فلترة التصنيفات لمنع التكرار أو الفراغات
  const filteredExpenseCategories = Array.from(new Set(expenseCategories.filter(Boolean)));
  if (!filteredExpenseCategories.includes("أخرى")) filteredExpenseCategories.push("أخرى");
  let filteredIncomeCategories = Array.from(new Set(incomeCategories.filter(Boolean)));
  if (!filteredIncomeCategories.includes("أخرى")) filteredIncomeCategories.push("أخرى");

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

        {/* مقدمة ترحيبية */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">إضافة عملية مالية جديدة</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            قم بتسجيل عملية دخل أو مصروف مع تحديد التصنيف والمبلغ والتاريخ بسهولة.
          </p>
        </div>



        {/* الفورم */}
        <form onSubmit={handleSubmit} className="bg-[#18181b] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 max-w-3xl mx-auto border border-white/10">

          {/* البيانات الأساسية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">المبلغ</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-3 rounded-lg bg-[#0f0f0f] text-white placeholder-white/60 border border-[#222] focus:outline-none focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">النوع</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#0f0f0f] text-white border border-[#222] focus:outline-none focus:border-teal-500 transition"
              >
                <option value="expense">مصروف</option>
                <option value="income">دخل</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                التصنيف {form.type === "income" && "(اختياري)"}
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required={form.type === "expense"}
                className="w-full p-3 rounded-lg bg-[#0f0f0f] text-white border border-[#222] focus:outline-none focus:border-teal-500 transition"
              >
                {form.type === "income" ? (
                  <>
                    <option value="">بدون تصنيف</option>
                    {filteredIncomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </>
                ) : (
                  filteredExpenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                )}
              </select>

              {/* إدخال تصنيف جديد حسب النوع */}
              {showNewExpenseCategory && form.type === "expense" && (
                <input
                  type="text"
                  placeholder="أدخل تصنيف جديد للمصروف"
                  value={newExpenseCategory}
                  onChange={e => setNewExpenseCategory(e.target.value)}
                  maxLength={30}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-[#232323] text-white border border-[#222] focus:outline-none focus:border-teal-500 transition"
                />
              )}
              {showNewIncomeCategory && form.type === "income" && (
                <input
                  type="text"
                  placeholder="أدخل تصنيف جديد للدخل"
                  value={newIncomeCategory}
                  onChange={e => setNewIncomeCategory(e.target.value)}
                  maxLength={30}
                  required
                  className="w-full mt-2 p-3 rounded-lg bg-[#232323] text-white border border-[#222] focus:outline-none focus:border-teal-500 transition"
                />
              )}
            </div>
          </div>

          {/* التاريخ والملاحظة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">التاريخ</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-[#0f0f0f] text-white border border-[#222] focus:outline-none focus:border-teal-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">ملاحظة (اختياري)</label>
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                maxLength={100}
                className="w-full p-3 rounded-lg bg-[#0f0f0f] text-white border border-[#222] focus:outline-none focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* رسائل النجاح أو الخطأ */}
          {formError && <div className="text-red-500 text-sm text-center">{formError}</div>}
          {success && <div className="text-green-500 text-sm text-center">تمت إضافة العملية بنجاح!</div>}

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-teal-500 text-white font-semibold text-lg p-4 rounded-xl hover:bg-teal-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formLoading ? "جاري الإضافة..." : "إضافة العملية"}
          </button>
        </form>
      </main>
    </div>

  );
}

export default AddTransaction; 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { getTransactionsByUser } from "../services/transactionsService";
import { getMonthlyBudget, setMonthlyBudget } from "../services/budgetService";
import { initializeDefaultExpenseCategories, initializeDefaultIncomeCategories } from "../services/categoriesService";
import { useNotifications } from "../hooks/useNotifications";
import { getUnreadNotificationsCount } from "../services/notificationService";
import { format, getMonth, getYear, subMonths, parseISO, endOfMonth, differenceInCalendarDays } from "date-fns";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { HiOutlineBell } from "react-icons/hi";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


// دوال تحليل وتجميع البيانات
function getMonthStats(transactions, month, year) {
  const txs = transactions.filter(t => {
    const d = parseISO(t.date);
    return getMonth(d) === month && getYear(d) === year;
  });
  const income = txs.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = txs.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;
  const savingRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  // أكثر فئة صرف
  const expenseByCat = txs.filter(t => t.type === "expense").reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const topCategory = Object.entries(expenseByCat).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // أكبر عملية
  const biggest = txs.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];

  return {
    income,
    expense,
    balance,
    savingRate,
    topCategory,
    biggest,
    txs,
    expenseByCat
  };
}

function getBudgetStatus(monthStats, budget = 0) {
  if (!budget) return { status: "غير محدد", color: "text-gray-400", remaining: 0, spentPercent: 0, progressColor: "bg-gray-400" };

  const remaining = budget - monthStats.expense;
  const spentPercent = ((monthStats.expense / budget) * 100).toFixed(1);
  let progressColor = "bg-green-500";
  const percent = Number(spentPercent);
  if (percent < 33) progressColor = "bg-green-500";
  else if (percent < 50) progressColor = "bg-cyan-500";
  else if (percent < 66) progressColor = "bg-orange-400";
  else if (percent < 100) progressColor = "bg-red-400";
  else progressColor = "bg-red-700";

  if (monthStats.expense <= budget) {
    return {
      status: "جيد",
      color: "text-green-400",
      remaining,
      spentPercent,
      progressColor
    };
  }
  return {
    status: "تم تجاوز الميزانية",
    color: "text-red-400",
    remaining: 0,
    spentPercent,
    progressColor
  };
}

function getChange(current, prev) {
  if (prev === 0 && current === 0) return { value: 0, dir: "none" };
  if (prev === 0) return { value: 100, dir: "up" };
  const diff = current - prev;
  const percent = ((diff / prev) * 100).toFixed(1);
  return { value: Math.abs(percent), dir: diff > 0 ? "up" : diff < 0 ? "down" : "none" };
}

function getLastNMonthsStats(transactions, n = 3) {
  const now = new Date();
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = subMonths(now, i);
    months.push({
      label: format(d, "MMM yyyy", { locale: undefined }),
      ...getMonthStats(transactions, getMonth(d), getYear(d))
    });
  }
  return months;
}

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { showNotification, sendBudgetAlert } = useNotifications(user?.uid);




  // جلب العمليات والتصنيفات والميزانية
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const loadData = async () => {
      try {
        // تهيئة التصنيفات الافتراضية
        await initializeDefaultExpenseCategories(user.uid);
        await initializeDefaultIncomeCategories(user.uid);

        // جلب البيانات
        const [txs, unreadCount] = await Promise.all([
          getTransactionsByUser(user.uid),
          getUnreadNotificationsCount(user.uid)
        ]);

        setTransactions(txs);
        setUnreadNotifications(unreadCount);



        // جلب ميزانية الشهر الحالي
        const now = new Date();
        const month = getMonth(now);
        const year = getYear(now);
        const budget = await getMonthlyBudget(user.uid, month, year);
        setCurrentBudget(budget);
        if (budget) {
          setBudgetAmount(budget.amount.toString());
        }
      } catch (error) {
        console.error("خطأ في تحميل البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // مراقبة الميزانية وإرسال الإشعارات
  useEffect(() => {
    if (!currentBudget || !user) return;

    const currentStats = getMonthStats(transactions, getMonth(new Date()), getYear(new Date()));
    const spentPercentage = ((currentStats.expense / currentBudget.amount) * 100).toFixed(1);

    // إرسال إشعارات عند الوصول للنسب المحددة
    const checkAndSendNotifications = async () => {
      const percentage = Number(spentPercentage);

      if (percentage >= 50 && percentage < 51) {
        await sendBudgetAlert(50, currentStats.expense, currentBudget.amount);
      } else if (percentage >= 80 && percentage < 81) {
        await sendBudgetAlert(80, currentStats.expense, currentBudget.amount);
      } else if (percentage >= 100 && percentage < 101) {
        await sendBudgetAlert(100, currentStats.expense, currentBudget.amount);
      }
    };

    checkAndSendNotifications();
  }, [transactions, currentBudget, user, sendBudgetAlert]);

  // حسابات الشهر الحالي والسابق
  const now = new Date();
  const month = getMonth(now);
  const year = getYear(now);
  const prevMonthDate = subMonths(now, 1);
  const prevMonth = getMonth(prevMonthDate);
  const prevYear = getYear(prevMonthDate);

  // عدد الأيام المتبقية في الشهر
  const daysLeft = differenceInCalendarDays(endOfMonth(now), now);

  const currentStats = getMonthStats(transactions, month, year);
  const prevStats = getMonthStats(transactions, prevMonth, prevYear);
  const last3 = getLastNMonthsStats(transactions, 3);

  // رسم بياني شريطي
  const barChartData = {
    labels: last3.map(m => m.label),
    datasets: [
      {
        label: "الدخل",
        data: last3.map(m => m.income),
        backgroundColor: "#14b8a6",
        borderRadius: 8,
      },
      {
        label: "المصروف",
        data: last3.map(m => m.expense),
        backgroundColor: "#ef4444",
        borderRadius: 8,
      },
      {
        label: "الرصيد",
        data: last3.map(m => m.balance),
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff", font: { size: 14 } },
      },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#d1d5db" } },
      y: { ticks: { color: "#d1d5db" } },
    },
  };

  // رسم بياني دائري للمصروفات
  const pieChartData = {
    labels: Object.keys(currentStats.expenseByCat),
    datasets: [{
      data: Object.values(currentStats.expenseByCat),
      backgroundColor: [
        "#ef4444", "#f97316", "#eab308", "#22c55e",
        "#06b6d4", "#8b5cf6", "#ec4899", "#84cc16"
      ],
      borderWidth: 0,
    }],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: "#fff", font: { size: 12 } },
      },
    },
  };

  // مقارنة شهرية
  const incomeChange = getChange(currentStats.income, prevStats.income);
  const expenseChange = getChange(currentStats.expense, prevStats.expense);
  const balanceChange = getChange(currentStats.balance, prevStats.balance);

  // حالة الميزانية
  const budgetStatus = getBudgetStatus(currentStats, currentBudget?.amount || 0);
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetAmount || isNaN(budgetAmount) || Number(budgetAmount) <= 0) return;

    setBudgetLoading(true);
    try {
      await setMonthlyBudget(user.uid, month, year, Number(budgetAmount));
      const budget = await getMonthlyBudget(user.uid, month, year);
      setCurrentBudget(budget);
      setShowBudgetForm(false);
      showNotification("تم حفظ الميزانية بنجاح", "success");
    } catch (error) {
      console.error("خطأ في حفظ الميزانية:", error);
      showNotification("فشل حفظ الميزانية، يرجى المحاولة مرة أخرى لاحقًا", "error");
    } finally {
      setBudgetLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f]">
        <div className="text-white text-lg">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 gap-0.5">
        <div className="flex flex-col max-w-[70%]">

          <div className="flex items-center gap-2">
            {/* صورة المستخدم */}
            <img
              src={user?.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314b8a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E"}
              alt="صورة المستخدم"
              className={`md:w-12 md:h-12 w-8 h-8 rounded-full object-cover border-2 border-teal-500 cursor-pointer hover:opacity-80 transition ${user?.photoURL ? '' : 'bg-gray-200 p-1'}`}
              onClick={() => navigate('/settings')}
            />

            {/* النصوص */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              مرحبًا {user?.displayName || user?.email || "مستخدم"}
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            لوحة التحكم - {format(now, "MMMM yyyy", { locale: undefined })}
          </p>
        </div>

        <button
          onClick={() => navigate('/notifications')}
          className="relative bg-[#18181b] text-white p-3 rounded-lg hover:bg-[#232323] transition border border-[#222]"
        >

          <HiOutlineBell size={22} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          )}
        </button>

      </div>

      {/* الميزانية الشهرية - كارد كبير */}
      <div className="bg-[#181818] rounded-2xl p-6 mb-8 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">الميزانية الشهرية</h2>
            <p className="text-teal-100">تتبع مصروفاتك مقابل ميزانيتك</p>
            <div className="mt-2 text-sm text-cyan-200">عدد الأيام المتبقية في الشهر: <span className="font-bold">{daysLeft}</span></div>
          </div>
          {!showBudgetForm && currentBudget && (
            <button
              onClick={() => setShowBudgetForm(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              تعديل الميزانية
            </button>
          )}
        </div>
        {/* إذا لم توجد ميزانية، أظهر النموذج مباشرة */}
        {(!currentBudget || showBudgetForm) ? (
          <form onSubmit={handleBudgetSubmit} className="space-y-4 max-w-md mx-auto">
            <div className="text-center mb-2">
              {!currentBudget && !showBudgetForm && (
                <>
                  <div className="text-lg font-semibold mb-2 text-white">لم تقم بإعداد ميزانية لهذا الشهر</div>
                  <div className="text-gray-300 mb-4">أدخل ميزانيتك الشهرية للبدء في تتبع مصروفاتك</div>
                </>
              )}
            </div>
            <div>
              <label className="block text-white mb-2 text-sm font-medium">ميزانية الشهر الحالي (ج.م)</label>
              <input
                type="number"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="w-full p-3 rounded-lg border-0 bg-white/20 backdrop-blur-sm text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70"
                min="1"
                required
                placeholder="أدخل الميزانية"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-teal-500 text-white font-semibold p-3 rounded-lg hover:bg-teal-600 transition disabled:opacity-60"
                disabled={budgetLoading}
              >
                {budgetLoading ? "جاري الحفظ..." : (!currentBudget ? "إضافة الميزانية" : "حفظ التعديل")}
              </button>
              {currentBudget && (
                <button
                  type="button"
                  onClick={() => {
                    setShowBudgetForm(false);
                    setBudgetAmount(currentBudget?.amount?.toString() || "");
                  }}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white font-semibold p-3 rounded-lg hover:bg-white/30 transition"
                >
                  إلغاء
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{currentBudget?.amount || 0} ج.م</div>
              <div className="text-teal-100 text-sm">الميزانية الكلية</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-red-200">{currentStats.expense} ج.م</div>
              <div className="text-teal-100 text-sm">المصروفات</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1 text-green-200">{budgetStatus.remaining} ج.م</div>
              <div className="text-teal-100 text-sm">المتبقي</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{budgetStatus.spentPercent}%</div>
              <div className="text-teal-100 text-sm">نسبة الإنفاق</div>
            </div>
          </div>
        )}
        {/* تجاوز الميزانية */}
        {currentBudget && currentStats.expense > currentBudget.amount && !showBudgetForm && (
          <div className="mt-4 text-center text-lg font-bold text-red-500">
            تم تجاوز الميزانية بمقدار: {currentStats.expense - currentBudget.amount} ج.م
          </div>
        )}
        {/* شريط التقدم */}
        {currentBudget && !showBudgetForm && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>تقدم الإنفاق</span>
              <span>{budgetStatus.spentPercent}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${budgetStatus.progressColor} transition-all duration-500`}
                style={{ width: `${Math.min(budgetStatus.spentPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#18181b] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${incomeChange.dir === "up" ? "bg-green-500/20 text-green-400" : incomeChange.dir === "down" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}`}>
              {incomeChange.dir === "up" && "↑"}
              {incomeChange.dir === "down" && "↓"}
              {incomeChange.value}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{currentStats.income} ج.م</div>
          <div className="text-gray-400 text-sm">إجمالي الدخل</div>
        </div>

        <div className="bg-[#18181b] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${expenseChange.dir === "up" ? "bg-red-500/20 text-red-400" : expenseChange.dir === "down" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
              {expenseChange.dir === "up" && "↑"}
              {expenseChange.dir === "down" && "↓"}
              {expenseChange.value}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{currentStats.expense} ج.م</div>
          <div className="text-gray-400 text-sm">إجمالي المصروفات</div>
        </div>

        <div className="bg-[#18181b] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${balanceChange.dir === "up" ? "bg-green-500/20 text-green-400" : balanceChange.dir === "down" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}`}>
              {balanceChange.dir === "up" && "↑"}
              {balanceChange.dir === "down" && "↓"}
              {balanceChange.value}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{currentStats.balance} ج.م</div>
          <div className="text-gray-400 text-sm">الرصيد الشهري</div>
        </div>

        <div className="bg-[#18181b] rounded-xl p-6 border border-[#232323]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${budgetStatus.color === "text-green-400" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {budgetStatus.status === "جيد" ? "✅" : "⚠️"}
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{currentStats.savingRate}%</div>
          <div className="text-gray-400 text-sm">نسبة التوفير</div>
        </div>
      </div>

      {/* الرسوم البيانية والتحليلات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* رسم بياني شريطي */}
        <div className="bg-[#18181b] rounded-2xl p-6 border border-[#232323]">
          <h3 className="text-white text-lg font-semibold mb-4">مقارنة آخر 3 شهور</h3>
          <Bar data={barChartData} options={barChartOptions} height={300} />
        </div>

        {/* رسم بياني دائري للمصروفات */}
        <div className="bg-[#18181b] rounded-2xl p-6 border border-[#232323]">
          <h3 className="text-white text-lg font-semibold mb-4">توزيع المصروفات حسب التصنيف</h3>
          {Object.keys(currentStats.expenseByCat).length > 0 ? (
            <Doughnut data={pieChartData} options={pieChartOptions} height={300} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              لا توجد مصروفات لهذا الشهر
            </div>
          )}
        </div>
      </div>

      {/* العمليات الأخيرة */}
      <div className="bg-[#18181b] rounded-2xl p-6 border border-[#232323]">
        <h3 className="text-white text-lg font-semibold mb-4">العمليات الأخيرة</h3>
        {transactions.length === 0 ? (
          <div className="text-gray-400 text-center py-8">لا توجد عمليات بعد.</div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm text-right">
                <thead>
                  <tr className="text-gray-300 border-b border-[#222]">
                    <th className="py-3 px-3">المبلغ</th>
                    <th className="py-3 px-3">النوع</th>
                    <th className="py-3 px-3">التصنيف</th>
                    <th className="py-3 px-3">التاريخ</th>
                    <th className="py-3 px-3">ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(-5).reverse().map(transaction => (
                    <tr key={transaction.id} className="border-b border-[#222] hover:bg-[#232323]">
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${transaction.type === "income" ? "text-teal-400" : "text-red-400"}`}>
                          {transaction.type === "income" ? "+" : "-"}{transaction.amount} ج.م
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === "income" ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"}`}>
                          {transaction.type === "income" ? "دخل" : "مصروف"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-300">{transaction.category || "-"}</td>
                      <td className="py-3 px-3 text-gray-300">{new Date(transaction.date).toLocaleDateString('ar-EG')}</td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{transaction.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden flex flex-col gap-4">
              {transactions.slice(-5).reverse().map(transaction => (
                <div key={transaction.id} className="bg-[#18181b] rounded-xl p-4 border border-[#222] shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-bold text-lg ${transaction.type === "income" ? "text-teal-400" : "text-red-400"}`}>
                      {transaction.type === "income" ? "+" : "-"}{transaction.amount} ج.م
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === "income" ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"}`}>
                      {transaction.type === "income" ? "دخل" : "مصروف"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 space-y-1">
                    <div><span className="text-gray-400">التصنيف:</span> {transaction.category || "-"}</div>
                    <div><span className="text-gray-400">التاريخ:</span> {new Date(transaction.date).toLocaleDateString('ar-EG')}</div>
                    <div><span className="text-gray-400">ملاحظة:</span> {transaction.note || "-"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        )}
      </div>

      {/* زر عائم لإضافة عملية */}
      <button
        onClick={() => navigate('/add')}
        className="fixed bottom-6 right-6 z-50 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-cyan-300"
        title="إضافة عملية جديدة"
        style={{ boxShadow: '0 4px 24px 0 rgba(34,211,238,0.25)' }}
      >
        +
      </button>
    </div>
  );
}

export default Dashboard; 
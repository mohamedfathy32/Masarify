import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LandingPage from "../pages/LandingPage";
import FeaturesPage from "../pages/FeaturesPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardHome from "../pages/DashboardHome";
import AddTransaction from "../pages/AddTransaction";
import History from "../pages/History";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import useAuth from "../hooks/useAuth";
import DashboardSidebar from "../components/DashboardSidebar";

// Layout رئيسي للصفحات العامة
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <Header />
      <main className="flex-1 px-4 ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f]">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center text-white py-10">جاري التحقق...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// ملخص الرصيد والدخل والمصروفات (يحسبها الراوت الرئيسي ويمررها كـ props)
function DashboardDataWrapper() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (!user) return;
    import("../services/transactionsService").then(({ getTransactionsByUser }) => {
      getTransactionsByUser(user.uid).then(setTransactions);
    });
  }, [user]);
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;
  return <DashboardHome income={income} expense={expense} balance={balance} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* صفحات عامة داخل الـ Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardDataWrapper />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      {/* صفحات auth خارج الـ Layout */}
      {/* أي مسار غير معروف */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
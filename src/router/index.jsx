import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LandingPage from "../pages/LandingPage";
import FeaturesPage from "../pages/FeaturesPage";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import AddTransaction from "../pages/AddTransaction";
import History from "../pages/History";
import Analytics from "../pages/Analytics";
import useAuth from "../hooks/useAuth";
import DashboardSidebar from "../components/DashboardSidebar";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import FAQ from "../pages/FAQ";
import Contact from "../pages/Contact";

// Layout رئيسي للصفحات العامة
function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex flex-col min-h-screen ">
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* صفحات عامة داخل الـ Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>
      {/* صفحات auth خارج الـ Layout */}
      {/* أي مسار غير معروف */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 
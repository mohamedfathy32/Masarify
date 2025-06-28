import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlinePlusCircle, HiOutlineClipboardList, HiOutlineChartBar, HiOutlineCog, HiOutlineBell, HiMenu, HiX, HiOutlineLogout } from "react-icons/hi";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { getUnreadNotificationsCount } from "../services/notificationService";

const links = [
  { to: "/dashboard", label: "الرئيسية", icon: <HiOutlineHome size={22} /> },
  { to: "/add", label: "إضافة عملية", icon: <HiOutlinePlusCircle size={22} /> },
  { to: "/history", label: "سجل العمليات", icon: <HiOutlineClipboardList size={22} /> },
  { to: "/analytics", label: "التقارير", icon: <HiOutlineChartBar size={22} /> },
  { to: "/notifications", label: "الإشعارات", icon: <HiOutlineBell size={22} />, hasBadge: true },
  { to: "/settings", label: "الإعدادات", icon: <HiOutlineCog size={22} /> },
];

function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUnreadCount = async () => {
      if (auth.currentUser) {
        try {
          const count = await getUnreadNotificationsCount(auth.currentUser.uid);
          setUnreadCount(count);
        } catch (error) {
          console.error("خطأ في تحميل عدد الإشعارات:", error);
        }
      }
    };

    loadUnreadCount();
    
    // تحديث العداد كل دقيقة
    const interval = setInterval(loadUnreadCount, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 bg-[#18181b] border border-[#222] p-2 rounded-lg text-white hover:text-teal-400 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-[#18181b] min-h-screen py-8 px-4 w-full max-w-[220px] flex flex-col gap-2 border-l border-[#222] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative fixed top-0 right-0 h-screen z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Masarify Logo/Link */}
        <Link 
          to="/" 
          className="text-2xl font-bold text-teal-400 text-center mb-6 hover:text-teal-300 transition-colors no-underline"
          onClick={() => setIsOpen(false)}
        >
          Masarify
        </Link>
        
        <nav className="flex flex-col gap-2 flex-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 no-underline relative ${isActive ? "bg-teal-500/20 text-teal-400" : "text-gray-200 hover:bg-[#232323]"}`
              }
              end={link.to === "/dashboard"}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.hasBadge && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 text-red-400 hover:bg-red-500/20 hover:text-red-300 mt-auto"
        >
          <HiOutlineLogout size={22} />
          <span>تسجيل الخروج</span>
        </button>
      </aside>
    </>
  );
}

export default DashboardSidebar; 
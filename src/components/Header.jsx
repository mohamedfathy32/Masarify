import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { HiMenu, HiX } from "react-icons/hi";

const publicLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/features", label: "المميزات" },
  { to: "/about", label: "عن التطبيق" },
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // if (["/login", "/register"].includes(location.pathname)) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#0f0f0f] border-b border-[#222] sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-[70px] mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline z-50">
          {/* <img src={require("../assets/react.svg")} alt="Masarify Logo" className="h-9" /> */}
          <span className="font-bold text-xl sm:text-2xl text-teal-500 tracking-wide">Masarify</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex flex-row-reverse gap-4 lg:gap-6 list-none m-0 p-0 items-center">
          {/* روابط عامة */}
          {publicLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`px-2 sm:px-3 py-1.5 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 ${location.pathname === link.to ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400'}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* روابط حسب حالة المستخدم */}
          {user ? (
            <>
              <li>
                <Link to="/dashboard" className={`px-2 sm:px-3 py-1.5 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 ${location.pathname === "/dashboard" ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400'}`}>لوحة التحكم</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="px-2 sm:px-3 py-1.5 rounded-md font-medium text-sm sm:text-base text-red-400 hover:bg-red-500/10 transition-colors">تسجيل الخروج</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={`px-2 sm:px-3 py-1.5 rounded-md font-medium text-sm sm:text-base transition-colors duration-200 ${location.pathname === "/login" ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400'}`}>تسجيل الدخول</Link>
              </li>
              <li>
                <Link to="/register" className="bg-teal-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-md shadow hover:bg-teal-600 transition text-sm sm:text-base">ابدأ الآن</Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden z-50 p-2 text-white hover:text-teal-400 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMenu} />
        )}

        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-[#0f0f0f] border-l border-[#222] transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#222]">
              <span className="font-bold text-xl text-teal-500">القائمة</span>
              <button
                onClick={toggleMenu}
                className="p-2 text-white hover:text-teal-400 transition-colors"
              >
                <HiX size={24} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-1 p-4">
              <ul className="space-y-2">
                {/* روابط عامة */}
                {publicLinks.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`block px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${location.pathname === link.to ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400 hover:bg-[#232323]'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                
                {/* روابط حسب حالة المستخدم */}
                {user ? (
                  <>
                    <li>
                      <Link to="/dashboard" className={`block px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${location.pathname === "/dashboard" ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400 hover:bg-[#232323]'}`}>لوحة التحكم</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-right px-4 py-3 rounded-lg font-medium text-base text-red-400 hover:bg-red-500/10 transition-colors">تسجيل الخروج</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className={`block px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${location.pathname === "/login" ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400 hover:bg-[#232323]'}`}>تسجيل الدخول</Link>
                    </li>
                    <li>
                      <Link to="/register" className="block bg-teal-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-teal-600 transition text-center">ابدأ الآن</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header; 
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { HiMenu, HiX } from "react-icons/hi";

const publicLinks = [
  { to: "/contact", label: "تواصل معنا" },
  { to: "/about", label: "عن التطبيق" },
  { to: "/features", label: "المميزات" },
  { to: "/", label: "الرئيسية" },
];

function Header() {
  const location = useLocation();
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



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-t from-[#0a0a0a] to-[#181818] border-b border-[#222] sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-[70px] mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full items-center justify-between">
          {/* Logo Right */}
          <Link to="/" className="flex items-center gap-2 no-underline order-1">
            {/* <img src={require("../assets/react.svg")} alt="Masarify Logo" className="h-9" /> */}
            <span className="font-bold text-xl sm:text-2xl text-teal-500 tracking-wide">Masarify</span>
          </Link>
          {/* Links Center */}
          <ul className="flex flex-row-reverse gap-4 lg:gap-6 list-none m-0 p-0 items-center order-2 mx-auto">
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
          </ul>
          {/* Left: Dashboard or Login */}
          <div className="order-3 flex items-center gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-md font-bold text-sm sm:text-base border-2 border-teal-500 text-white bg-[#0f0f0f] hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/dashboard" ? 'bg-teal-500 text-white' : ''}`}
              >
                لوحة التحكم
              </Link>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-1.5 rounded-md font-bold text-sm sm:text-base border-2 border-teal-500 text-white bg-[#0f0f0f] hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/login" ? 'bg-teal-500 text-white' : ''}`}
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
        {/* Mobile Layout */}
        <div className="flex md:hidden w-full items-center justify-between">
          {/* Logo Left */}
          <Link to="/" className="flex items-center gap-2 no-underline order-2">
            {/* <img src={require("../assets/react.svg")} alt="Masarify Logo" className="h-9" /> */}
            <span className="font-bold text-xl sm:text-2xl text-teal-500 tracking-wide">Masarify</span>
          </Link>
          {/* Burger Right */}
          <button
            onClick={toggleMenu}
            className="order-1 p-2 text-white hover:text-teal-400 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
        {/* Mobile Sidebar */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMenu} />
            <div className="fixed top-0 right-0 h-full w-64 bg-[#0f0f0f] border-l border-[#222] z-50 md:hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#222]">
                <span className="font-bold text-xl text-teal-500">القائمة</span>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-white hover:text-teal-400 transition-colors"
                >
                  <HiX size={24} />
                </button>
              </div>
              <div className="flex-1 p-4">
                <ul className="space-y-2">
                  {publicLinks.map(link => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className={`block px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${location.pathname === link.to ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400 hover:bg-[#232323]'}`}
                        onClick={toggleMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {user ? (
                    <li>
                      <Link
                        to="/dashboard"
                        className={`block px-4 py-3 rounded-lg font-bold border-2 border-teal-500 text-teal-500 bg-[#0f0f0f] hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/dashboard" ? 'bg-teal-500 text-white' : ''}`}
                        onClick={toggleMenu}
                      >
                        لوحة التحكم
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link
                        to="/login"
                        className={`block px-4 py-3 rounded-lg font-bold border-2 border-teal-500 text-teal-500 bg-[#0f0f0f] hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/login" ? 'bg-teal-500 text-white' : ''}`}
                        onClick={toggleMenu}
                      >
                        تسجيل الدخول
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header; 
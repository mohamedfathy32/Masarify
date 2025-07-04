import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { HiMenu, HiOutlineLogout, HiX } from "react-icons/hi";

const publicLinks = [
  { to: "/contact", label: "تواصل معنا" },
  { to: "/about", label: "عن التطبيق" },
  { to: "/features", label: "المميزات" },
  { to: "/", label: "الرئيسية" },
];
const publicLinksMob = [
  { to: "/", label: "الرئيسية" },
  { to: "/features", label: "المميزات" },
  { to: "/about", label: "عن التطبيق" },
  { to: "/contact", label: "تواصل معنا" },
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
    <header className="bg-main border-b border-[#222] sticky top-0 z-50">
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
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={user?.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314b8a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E"}
                    alt="صورة المستخدم"
                    className={`w-8 h-8 rounded-full object-cover border border-teal-500 cursor-pointer hover:opacity-80 transition ${user?.photoURL ? '' : 'bg-gray-200 p-1'}`}
                    onClick={() => navigate('/settings')}
                  />
                  <Link
                    to="/dashboard"
                    className={`px-3 py-1.5 rounded-md font-bold text-sm sm:text-base border-2 border-teal-500 text-white bg-main hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/dashboard" ? 'bg-teal-500 text-white' : ''}`}
                  >
                    لوحة التحكم
                  </Link>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-1.5 rounded-md font-bold text-sm sm:text-base border-2 border-teal-500 text-white bg-main hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/login" ? 'bg-teal-500 text-white' : ''}`}
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

        <>
          <div
            className={`fixed inset-0 backdrop-blur-sm z-40 md:hidden transition-opacity duration-500 ease-in-out ${isMenuOpen ? 'opacity-75 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={toggleMenu} />
          {/* السايدبار نفسه */}
          <div
            className={`fixed top-0 right-0 h-full w-64 bg-main border-l border-border z-50 md:hidden flex flex-col transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-4 border-b border-border">
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
                {user && (
                  <li className="mb-4 p-3 bg-alt rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2314b8a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E"}
                        alt="صورة المستخدم"
                        className="w-10 h-10 rounded-full object-cover border border-teal-500 cursor-pointer hover:opacity-80 transition "
                        onClick={() => {
                          navigate('/settings');
                          toggleMenu();
                        }}
                      />
                      <div>
                        <div className="text-white font-medium">{user?.displayName || user?.email}</div>
                      </div>
                    </div>
                  </li>
                )}
                {publicLinksMob.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={`block px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200 ${location.pathname === link.to ? 'text-teal-500 bg-teal-500/10' : 'text-white hover:text-teal-400 hover:bg-alt'}`}
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
                      className={`block px-4 py-3 rounded-lg font-bold border-2 border-teal-500 text-teal-500 bg-main hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/dashboard" ? 'bg-teal-500 text-white' : ''}`}
                      onClick={toggleMenu}
                    >
                      لوحة التحكم
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className={`block px-4 py-3 rounded-lg font-bold border-2 border-teal-500 text-teal-500 bg-main hover:bg-teal-500 hover:text-white transition-colors duration-200 shadow-sm ${location.pathname === "/login" ? 'bg-teal-500 text-white' : ''}`}
                      onClick={toggleMenu}
                    >
                      تسجيل الدخول
                    </Link>
                  </li>
                )}

              </ul>
            </div>
            {user && (
              <div className="mb-4 mx-5">
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:text-red-300 transition"
                >
                  <HiOutlineLogout size={20} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </>

      </nav>
    </header>
  );
}

export default Header; 
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail } from "../services/authService";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerWithEmail(email, password);
      await updateProfile(auth.currentUser, { displayName: name });
      navigate("/");
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب أو البريد مستخدم بالفعل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-[#18181b] rounded-2xl p-6 sm:p-9 w-full max-w-sm shadow-lg">
        <h2 className="text-teal-500 font-bold text-xl sm:text-2xl mb-4 sm:mb-5 text-center">إنشاء حساب</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="الاسم الكامل"
            className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-semibold text-base sm:text-lg p-3 rounded-lg border-none mb-2 cursor-pointer transition hover:bg-teal-600 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "...جاري إنشاء الحساب" : "إنشاء حساب"}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-gray-300 text-xs sm:text-sm">لديك حساب بالفعل؟ </span>
          <Link to="/login" className="text-teal-500 font-semibold text-xs sm:text-sm">تسجيل الدخول</Link>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage; 
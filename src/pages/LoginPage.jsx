import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail } from "../services/authService";

function LoginPage() {
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
      await loginWithEmail(email, password);
      navigate("/");
    } catch (err) {
      console.error(err)
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen">
      <div className="bg-[#18181b] rounded-2xl p-6 sm:p-9 w-full max-w-sm shadow-lg">
        <h2 className="text-teal-500 font-bold text-xl sm:text-2xl mb-4 sm:mb-5 text-center">تسجيل الدخول</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "...جاري الدخول" : "دخول"}
          </button>
        </form>
        <div className="text-center mt-2">
          <span className="text-gray-300 text-xs sm:text-sm">ليس لديك حساب؟ </span>
          <Link to="/register" className="text-teal-500 font-semibold text-xs sm:text-sm">إنشاء حساب</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginPage; 
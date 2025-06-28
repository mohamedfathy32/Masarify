import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail } from "../services/authService";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور"
              className="w-full p-3 pr-10 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
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
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function LandingPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-wide">تحكم في مصاريفك بثقة مع Masarify</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto mb-6 sm:mb-8 px-4">
          يساعدك Masarify على تتبع ميزانيتك الشهرية ومصاريفك اليومية — حتى تعرف دائمًا أين تذهب أموالك.<br/>
          أضف دخلك وصنف مصروفاتك لتحصل على سيطرة مالية أفضل.
        </p>
        {user ? (
          <Link to="/dashboard" className="bg-teal-500 text-white font-semibold text-base sm:text-lg px-6 sm:px-9 py-3 rounded-lg shadow-md transition hover:bg-teal-600 mt-2">
            لوحة التحكم
          </Link>
        ) : (
          <Link to="/register" className="bg-teal-500 text-white font-semibold text-base sm:text-lg px-6 sm:px-9 py-3 rounded-lg shadow-md transition hover:bg-teal-600 mt-2">
            ابدأ الآن
          </Link>
        )}
      </section>

      {/* شريط مميزات مختصر */}
      <section className="flex justify-center gap-4 sm:gap-6 lg:gap-8 my-6 sm:my-8 flex-wrap px-4">
        {[
          {icon: '💸', text: 'سهل وسريع في تسجيل المصاريف'},
          {icon: '📊', text: 'تقارير ورسوم بيانية فورية'},
          {icon: '🔒', text: 'بياناتك بأمان وخصوصية'},
        ].map((item, i) => (
          <div key={i} className="bg-[#18181b] text-white rounded-xl px-4 sm:px-7 py-3 sm:py-4 min-w-[160px] sm:min-w-[180px] flex items-center gap-2 sm:gap-3 text-sm sm:text-lg shadow">
            <span className="text-xl sm:text-2xl">{item.icon}</span>
            <span className="text-xs sm:text-sm lg:text-base">{item.text}</span>
          </div>
        ))}
      </section>

      {/* كيف يعمل Masarify؟ */}
      <section className="container max-w-3xl mx-auto pt-6 sm:pt-8 px-4">
        <h2 className="text-teal-500 font-bold text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-7 text-center">كيف يعمل Masarify؟</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[
            {icon: '➕', title: 'أضف دخلك ومصاريفك', desc: 'سجّل كل مصادر الدخل والمصروفات بسهولة.'},
            {icon: '🗂️', title: 'صنّف مصروفاتك', desc: 'اختر تصنيفات واضحة لكل عملية لتتبع أفضل.'},
            {icon: '📈', title: 'تابع تقاريرك', desc: 'شاهد ملخصات ورسوم بيانية تساعدك على اتخاذ القرار.'},
          ].map((step, i) => (
            <div key={i} className="bg-[#18181b] rounded-2xl px-4 sm:px-5 py-5 sm:py-7 flex flex-col items-center shadow text-center">
              <span className="text-2xl sm:text-3xl mb-2">{step.icon}</span>
              <h3 className="text-white text-base sm:text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300 text-xs sm:text-sm m-0">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* تذييل تشجيعي */}
      <section className="mt-8 sm:mt-12 text-center px-4">
        <p className="text-white text-lg sm:text-xl font-semibold">
          ابدأ رحلتك المالية الجديدة مع Masarify اليوم!
        </p>
      </section>
    </>
  );
}

export default LandingPage; 
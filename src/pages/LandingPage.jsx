import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { FaWallet, FaChartBar, FaLock, FaBell, FaMoneyBillWave, FaLayerGroup, FaRegChartBar, FaFrown, FaSmile, FaRegSmile, FaRegFrown } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    title: "تحكم في مصاريفك بثقة مع Masarify",
    desc: "تابع ميزانيتك ومصاريفك اليومية بسهولة ووضوح، وحقق أهدافك المالية.",
    cta: "ابدأ الآن",
    link: "/register",
    bg: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "كل مصروف محسوب... وكل جنيه في مكانه!",
    desc: "سجّل دخلك ومصروفاتك، واحصل على تقارير وتنبيهات ذكية.",
    cta: "جرّب المميزات",
    link: "/features",
    bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "وداعًا للقلق المالي!",
    desc: "مع Masarify، سيصبح تنظيم ميزانيتك عادة سهلة وممتعة.",
    cta: "الأسئلة الشائعة",
    link: "/faq",
    bg: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "تواصل معنا واقترح أفكارك",
    desc: "نحن نستمع لك دائمًا! شاركنا اقتراحاتك أو استفساراتك وساعدنا في تطوير Masarify.",
    cta: "تواصل معنا",
    link: "/contact",
    bg: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  return (
    <>
      {/* Hero Swiper */}
      <section className="relative w-full text-center">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px]"
        >
          {heroSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center relative "
                style={{ backgroundImage: `url(${slide.bg})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="text-gray-100 text-base sm:text-lg md:text-xl mb-6 px-2">
                    {slide.desc}
                  </p>
                  <button
                    onClick={() => {
                      if (slide.link === "/register") {
                        navigate(user ? "/dashboard" : "/register");
                      } else {
                        navigate(slide.link);
                      }
                    }}
                    className="bg-teal-500 text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-md shadow-md hover:bg-teal-600 transition"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Swiper Pagination Style */}
        <style>{`
        .swiper-pagination-bullet {
          background: #777;
          opacity: 1;
          width: 10px;
          height: 10px;
          margin: 0 4px !important;
          transition: background 0.2s;
        }
        .swiper-pagination-bullet-active {
          background: #14b8a6;
        }
      `}</style>
      </section>

      {/* Quick Features */}
      <section className="max-w-5xl mx-auto my-14 px-4">
        <h2 className="text-teal-500 text-2xl sm:text-3xl font-bold text-center mb-10">لماذا تختار Masarify؟</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <FaWallet />, title: 'سهل الاستخدام', desc: 'سجّل مصاريفك في ثواني، بدون تعقيد.' },
            { icon: <FaChartBar />, title: 'تقارير لحظية', desc: 'اطّلع على تحليلات لحظية لمصاريفك.' },
            { icon: <FaLock />, title: 'خصوصية تامة', desc: 'بياناتك مؤمنة 100% ومحفوظة لك فقط.' },
            { icon: <FaBell />, title: 'تنبيهات ذكية', desc: 'تذكير بالمصاريف والدخل تلقائيًا.' }
          ].map((item, i) => (
            <div key={i} className="bg-[#18181b] text-white rounded-2xl p-5 flex flex-col items-center shadow-md border border-[#232323] hover:shadow-lg hover:scale-[1.02] transition-all">
              <div className="text-teal-400 text-3xl mb-4">{item.icon}</div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-center text-3xl font-bold text-white mb-10">كيف يعمل Masarify؟</h2>
        <div className="space-y-10">
          {[
            {
              icon: <FaMoneyBillWave />,
              title: '1. أضف مصروفاتك بسهولة',
              desc: 'ابدأ بتسجيل دخلك ومصروفاتك اليومية بواجهة بسيطة وسريعة.'
            },
            {
              icon: <FaLayerGroup />,
              title: '2. صنّف العمليات بدقة',
              desc: 'اختر من بين فئات متعددة لمساعدتك في تتبع نمط إنفاقك.'
            },
            {
              icon: <FaRegChartBar />,
              title: '3. راقب نتائجك وتقدمك',
              desc: 'اطلع على الرسوم البيانية والتقارير التي تساعدك في اتخاذ قرارات مالية أفضل.'
            }
          ].map((step, i) => (
            <div
              key={i}
              className={`flex flex-col md:flex-row items-center gap-6 `}
            >
              <div className="bg-[#18181b] border border-[#232323] rounded-xl p-6 shadow flex items-center justify-center text-teal-400 text-4xl w-20 h-20">
                {step.icon}
              </div>
              <div className="text-white flex-1">
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Before and After */}
      <section className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-10 text-center">قبل وبعد Masarify</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-[#181818] rounded-2xl p-7 px-10 text-center shadow-md border border-[#232323] min-h-[220px]">
            <FaRegFrown className="text-5xl text-red-400 mb-3 mx-auto" />
            <h4 className="text-white font-semibold mb-2 text-lg lg:text-xl">قبل Masarify</h4>
            <ul className="text-gray-400 text-base list-disc pr-4 text-right space-y-1">
              <li>مش عارف راح فين المرتب!</li>
              <li>نسيان مصاريف مهمة.</li>
              <li>مفيش تحكم في الميزانية.</li>
              <li>توتر عند نهاية الشهر.</li>
            </ul>
          </div>
          <div className="bg-[#181818] rounded-2xl p-7 px-10 text-center shadow-md border border-[#232323] min-h-[220px]">
            <FaRegSmile className="text-5xl text-teal-400 mb-3 mx-auto" />
            <h4 className="text-white font-semibold mb-2 text-lg lg:text-xl">بعد Masarify</h4>
            <ul className="text-gray-300 text-base list-disc pr-4 text-right space-y-1">
              <li>عارف كل جنيه راح فين.</li>
              <li>تحكم كامل في مصاريفك.</li>
              <li>تنبيهات ذكية عند الحاجة.</li>
              <li>راحة بال ووضوح مالي.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#101010] to-[#181818] py-10 mt-5 px-4 text-center rounded-xl shadow-inner">
        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-6">
          ابدأ رحلتك المالية الجديدة مع <span className="text-teal-400">Masarify</span>
        </h2>
        <p className="text-gray-400 text-base sm:text-lg mb-6 max-w-xl mx-auto">
          تحكم في ميزانيتك، تابع مصاريفك، وحقق أهدافك المالية بسهولة ووضوح.
        </p>
        <Link
          to={user ? "/dashboard" : "/register"}
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-lg shadow transition duration-200"
        >
          {user ? "لوحة التحكم" : "سجّل الآن "}

        </Link>
      </section>

    </>
  );
}

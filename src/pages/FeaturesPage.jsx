import React from "react";
import {
  FaPlusCircle, FaChartBar, FaBell, FaMoneyBillWave, FaRegSmile, FaRegFrown, FaRocket, FaShieldAlt
} from "react-icons/fa";

const mainFeatures = [
  {
    icon: <FaPlusCircle className="text-teal-400 text-3xl" />,
    title: "إضافة دخل بسهولة",
    desc: "سجّل كل مصادر دخلك بسرعة وبدون تعقيد، سواء راتب أو دخل إضافي.",
  },
  {
    icon: <FaMoneyBillWave className="text-teal-400 text-3xl" />,
    title: "تتبع المصاريف",
    desc: "سجّل كل مصاريفك اليومية واحصل على رؤية واضحة لمصاريفك الشهرية.",
  },
  {
    icon: <FaChartBar className="text-teal-400 text-3xl" />,
    title: "تقارير وتحليلات بصرية",
    desc: "احصل على تقارير ورسوم بيانية تساعدك على فهم عادات الإنفاق واتخاذ قرارات أفضل.",
  },
  {
    icon: <FaBell className="text-teal-400 text-3xl" />,
    title: "تنبيهات ذكية",
    desc: "استقبل تنبيهات عند تجاوز الميزانية أو عند وجود مصروفات غير معتادة.",
  },
];

const details = [
  {
    title: "إضافة دخل بسهولة",
    desc: "كل ما عليك هو إدخال مصدر الدخل والمبلغ، وسيتم إضافته تلقائيًا إلى رصيدك الشهري.",
    example: "مثال: أضفت راتبك الشهري + دخل إضافي من عمل حر في ثواني!"
  },
  {
    title: "تتبع المصاريف",
    desc: "سجّل كل مصروفاتك اليومية (أكل، مواصلات، فواتير...) وتابع أين تذهب أموالك.",
    example: "مثال: أضفت مصروفات القهوة والمواصلات يوميًا بسهولة."
  },
  {
    title: "تقارير وتحليلات بصرية",
    desc: "شاهد رسوم بيانية وتقارير توضح أين تذهب أموالك وأكثر البنود استهلاكًا.",
    example: "مثال: اكتشفت أن مصاريف التوصيل زادت هذا الشهر!"
  },
  {
    title: "تنبيهات ذكية",
    desc: "يصلك تنبيه إذا اقتربت من تجاوز الميزانية أو حدثت مصروفات غير معتادة.",
    example: "مثال: تم تنبيهك عند تجاوز حد التسوق الشهري."
  },
];

function FeaturesPage() {
  return (
    <main className="container py-10 sm:py-20 px-4 flex flex-col gap-24 lg:gap-32">
      {/* Section 1: Title */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
          مميزات <span className="text-teal-400">Masarify</span>
        </h2>
        <p className="text-gray-400 text-lg lg:text-xl leading-relaxed">
          أدوات قوية لتحكم كامل في مصاريفك وتنظيم ميزانيتك الشخصية بأسلوب ذكي وبسيط.
        </p>
      </section>

      {/* Section 2: Main Features Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 xl:gap-14">
          {mainFeatures.map((f, i) => (
            <div
              key={i}
              className="bg-[#18181b] rounded-3xl px-6 py-10 flex flex-col items-center shadow-md text-center hover:scale-[1.06] transition-transform duration-300 border border-[#232323] lg:min-h-[320px] hover:shadow-teal-700/20 transition-shadow"
            >
              {f.icon}
              <h3 className="text-teal-400 text-lg lg:text-xl font-bold my-4">{f.title}</h3>
              <p className="text-gray-300 text-base lg:text-lg mb-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Feature Details */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6">
        <h3 className="text-3xl font-bold text-white mb-12 text-center leading-relaxed">
          شرح كل ميزة بالتفصيل
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {details.map((item, i) => (
            <div
              key={i}
              className="bg-[#1c1c1c] rounded-3xl px-8 py-7 flex flex-col items-center lg:items-start text-center lg:text-right shadow-[0_0_16px_rgba(0,0,0,0.3)] border border-[#2a2a2a] hover:shadow-teal-700/20 transition-shadow"
            >
              <h4 className="text-teal-400 font-semibold text-xl lg:text-2xl mb-3">
                {item.title}
              </h4>
              <p className="text-gray-300 text-base lg:text-lg mb-2 leading-relaxed">
                {item.desc}
              </p>
              <span className="text-gray-500 text-sm italic">{item.example}</span>
            </div>
          ))}
        </div>
      </section>



      {/* Section 4: Before & After Comparison */}
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

      {/* Section 5: Why Choose Masarify */}
      <section className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-white mb-10">لماذا Masarify؟</h3>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-[#181818] border border-[#232323] rounded-2xl p-6 flex flex-col items-center shadow-md">
            <FaShieldAlt className="text-4xl text-teal-400 mb-3" />
            <h4 className="text-white font-semibold mb-2">حماية وخصوصية</h4>
            <p className="text-gray-400">بياناتك مؤمنة بالكامل ولا يتم مشاركتها مع أي جهة.</p>
          </div>
          <div className="bg-[#181818] border border-[#232323] rounded-2xl p-6 flex flex-col items-center shadow-md">
            <FaRocket className="text-4xl text-teal-400 mb-3" />
            <h4 className="text-white font-semibold mb-2">سهولة الاستخدام</h4>
            <p className="text-gray-400">واجهة استخدام بسيطة وسريعة تناسب جميع المستخدمين.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FeaturesPage;

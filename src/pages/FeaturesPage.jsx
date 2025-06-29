import React from "react";
import {
  FaPlusCircle, FaChartBar, FaBell, FaMoneyBillWave, FaRegSmile, FaRegFrown, FaRocket, FaShieldAlt, FaWallet, FaSearch
} from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";

const mainFeatures = [
  {
    icon: <FaWallet className="text-teal-400 text-3xl" />,
    title: "تحديد الميزانية الشهرية",
    desc: "حدد ميزانيتك الشهرية وتابع التزامك بها بسهولة، مع تنبيهات عند الاقتراب من الحد."
  },
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
    desc: "تراقب Masarify ميزانيتك ومصروفاتك تلقائيًا، وترسل لك إشعارات فورية عند الاقتراب من تجاوز الميزانية أو عند وجود مصروفات غير معتادة. هكذا تظل دائمًا على علم بحالتك المالية وتتجنب المفاجآت.",
  },
  {
    icon: <FaSearch className="text-teal-400 text-3xl" />,
    title: "سجل العمليات والبحث الذكي",
    desc: "تصفح جميع عملياتك المالية السابقة وابحث عنها بسهولة باستخدام الفلاتر الذكية."
  },
];

const details = [
  {
    title: "تحديد الميزانية الشهرية",
    desc: "يمكنك بسهولة تحديد ميزانية شهرية لكل المصروفات، وسيقوم Masarify بمتابعة التزامك بها تلقائيًا. ستظهر لك نسبة الإنفاق والمتبقي من الميزانية طوال الشهر، وستصلك تنبيهات ذكية إذا اقتربت من تجاوز الحد أو تم تجاوزه. هكذا تضمن التحكم الكامل في مصاريفك وتحقق أهدافك المالية بوضوح.",
    example: "مثال: حددت ميزانية 3000 جنيه للشهر، وكلما أضفت مصروفات يظهر لك المتبقي ونسبة الإنفاق، وإذا اقتربت من الحد يصلك تنبيه فوري!"
  },
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
    desc: "تراقب Masarify ميزانيتك ومصروفاتك تلقائيًا، وترسل لك إشعارات فورية عند الاقتراب من تجاوز الميزانية أو عند وجود مصروفات غير معتادة. هكذا تظل دائمًا على علم بحالتك المالية وتتجنب المفاجآت.",
    example: "مثال: استلمت إشعارًا عندما اقتربت مصروفات التسوق من الحد الشهري، ونبهني التطبيق عند تجاوز الميزانية."
  },
  {
    title: "سجل العمليات والبحث الذكي",
    desc: "يمكنك تصفح جميع عملياتك المالية (دخل ومصروف) في سجل مفصل، مع إمكانية البحث والتصفية حسب النوع، الفئة أو التاريخ. هكذا تجد أي عملية بسهولة وتراجع تاريخك المالي في أي وقت.",
    example: 'مثال: بحثت عن كل مصروفات "المطاعم" في شهر مارس وراجعت التفاصيل بضغطة واحدة!'
  },
];

const featureSlides = [
  {
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1600&q=80',
    title: 'سيطر على مصاريفك وحقق أهدافك المالية',
    desc: 'مع Masarify، كل جنيه محسوب. خطط، راقب، وحقق التوازن المالي الذي تحلم به.'
  },
  {
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
    title: 'راحة بال ووضوح مالي دائم',
    desc: 'وداعًا للقلق من المصاريف المفاجئة. كل شيء تحت سيطرتك مع تنبيهات وتقارير ذكية.'
  },
  {
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80',
    title: 'تحليلات بصرية وقرارات أذكى',
    desc: 'اكتشف عاداتك المالية، وحلل مصروفاتك، واتخذ قرارات أفضل لمستقبلك.'
  },
];

function FeaturesPage() {
  return (
    <>
      {/* سلايدر صور مميزات بعرض الصفحة بالكامل */}
      <section className="relative w-full mt-10">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active'
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="w-[80%] h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg"
        >
          {featureSlides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Slide content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
                  <h2 className="text-gray-50 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md leading-snug">
                    {slide.title}
                  </h2>
                  <p className="text-gray-50 text-base sm:text-lg md:text-xl opacity-90">
                    {slide.desc}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination styling */}
        <style>{`
    .swiper-pagination-bullet {
      background-color: #666 !important;
      opacity: 0.6;
      width: 10px;
      height: 10px;
      margin: 0 5px !important;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .swiper-pagination-bullet-active {
      background-color: #14b8a6 !important;
      width: 14px;
      height: 14px;
    }
  `}</style>
      </section>

      <main className="py-10 px-4 flex flex-col gap-12 ">
        {/* مقدمة تعريفية */}
        <section className="max-w-3xl mx-auto text-center ">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">مرحبًا بك في <span className='text-teal-500'>Masarify</span></h1>
          <p className="text-lg text-main mb-4">
            Masarify هو رفيقك الذكي لإدارة المصاريف وتحقيق أهدافك المالية بسهولة ووضوح. صُمم ليمنحك تحكمًا كاملًا في ميزانيتك، مع تقارير بصرية، تنبيهات ذكية، وواجهة عربية عصرية تناسب جميع المستخدمين.
          </p>
          <p className="text-base text-white">
            سواء كنت ترغب في تتبع مصاريفك اليومية، أو التخطيط لمستقبلك المالي، أو ببساطة تريد معرفة أين تذهب أموالك، Masarify يوفر لك كل الأدوات التي تحتاجها في مكان واحد وبأمان تام.
          </p>
        </section>

        {/* Section 1: Title */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            مميزات <span className="text-teal-400">Masarify</span>
          </h2>
          <p className="text-main text-lg lg:text-xl leading-relaxed">
            أدوات قوية لتحكم كامل في مصاريفك وتنظيم ميزانيتك الشخصية بأسلوب ذكي وبسيط.
          </p>
        </section>

        {/* Section 2: Main Features Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 ">
            {mainFeatures.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-3xl px-6 py-10 flex flex-col items-center shadow-md text-center hover:scale-[1.06] transition-transform duration-300 border border-border  hover:shadow-teal-700/20"
              >
                {f.icon}
                <h3 className="text-teal-400 text-lg lg:text-xl font-bold my-4">{f.title}</h3>
                <p className="text-main text-base lg:text-lg mb-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Feature Details */}
        <section className="max-w-6xl mx-auto px-4 lg:px-6">
          <h3 className="text-3xl font-bold text-white mb-6 text-center leading-relaxed">
            شرح كل ميزة بالتفصيل
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {details.map((item, i) => (
              <div
                key={i}
                className="bg-card rounded-3xl px-8 py-7 flex flex-col items-center lg:items-start text-center lg:text-right shadow-[0_0_16px_rgba(0,0,0,0.08)] border border-border hover:shadow-teal-700/20 transition-shadow"
              >
                <h4 className="text-teal-400 font-semibold text-xl lg:text-2xl mb-3">
                  {item.title}
                </h4>
                <p className="text-main text-base lg:text-lg mb-2 leading-relaxed">
                  {item.desc}
                </p>
                <span className="text-gray-400 text-sm italic">{item.example}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Before & After Comparison */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-10 text-center">قبل وبعد Masarify</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-7 px-15 text-center shadow-md border border-border ">
              <FaRegFrown className="text-5xl text-red-400 mb-3 mx-auto" />
              <h4 className="text-white font-semibold mb-2 text-lg lg:text-xl">قبل Masarify</h4>
              <ul className="text-gray-400 text-base list-disc pr-4 text-right space-y-1">
                <li>مش عارف راح فين المرتب!</li>
                <li>نسيان مصاريف مهمة.</li>
                <li>مفيش تحكم في الميزانية.</li>
                <li>توتر عند نهاية الشهر.</li>
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-7 px-15 text-center shadow-md border border-border ">
              <FaRegSmile className="text-5xl text-teal-400 mb-3 mx-auto" />
              <h4 className="text-white font-semibold mb-2 text-lg lg:text-xl">بعد Masarify</h4>
              <ul className="text-main text-base list-disc pr-4 text-right space-y-1">
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
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-md">
              <FaShieldAlt className="text-4xl text-teal-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">حماية وخصوصية</h4>
              <p className="text-gray-400">بياناتك مؤمنة بالكامل ولا يتم مشاركتها مع أي جهة.</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-md">
              <FaRocket className="text-4xl text-teal-400 mb-3" />
              <h4 className="font-semibold text-white mb-2">سهولة الاستخدام</h4>
              <p className="text-gray-400">واجهة استخدام بسيطة وسريعة تناسب جميع المستخدمين.</p>
            </div>
          </div>
        </section>

        {/* كيف تبدأ مع Masarify */}
        <section className="max-w-3xl mx-auto bg-card rounded-3xl shadow-md border border-border p-8 text-center">
          <h3 className="text-2xl font-bold text-teal-500 mb-6">كيف تبدأ مع Masarify؟</h3>
          <ol className="text-main text-lg space-y-4 text-right mx-auto max-w-xl list-decimal pr-6">
            <li>
              <Link to="/register" className="font-bold text-teal-500 hover:underline">سجّل حساب جديد</Link>
              <span> أو </span>
              <Link to="/login" className="font-bold text-teal-500 hover:underline">تسجيل الدخول</Link>
              <span> إذا كان لديك حساب بالفعل.</span>
            </li>
            <li>
              حدد ميزانية شهرية واضحة من لوحة التحكم في بداية كل شهر، وتابع التزامك بها أولًا بأول.
            </li>
            <li>
              أضف مصادر الدخل والمصروفات اليومية بسهولة من لوحة التحكم، وسجّل كل دخل أو مصروف بسرعة وبدون تعقيد.
            </li>
            <li>
              تابع تحليلاتك وتقاريرك المالية من صفحة التقارير، واستعرض الرسوم البيانية والتقارير الذكية لتعرف أين تذهب أموالك وتحقق أهدافك.
            </li>
            <li>
              فعّل التنبيهات لتصلك إشعارات عند تجاوز الميزانية أو وجود مصروفات غير معتادة، وابقَ دائمًا على علم بحالتك المالية مع تنبيهات ذكية وفورية.
            </li>
            <li>
              خصص مظهر الموقع حسب ذوقك من الإعدادات (الوضع الداكن/الفاتح، حجم الخط...)، واجعل تجربتك أكثر راحة وملاءمة.
            </li>
          </ol>

          <p className="mt-8 text-base text-gray-400">ابدأ اليوم رحلتك نحو إدارة مالية أذكى وأكثر وضوحًا مع Masarify!</p>
        </section>
      </main>
    </>
  );
}

export default FeaturesPage;

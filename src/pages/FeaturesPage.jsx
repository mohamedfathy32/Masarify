import React from "react";

const features = [
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#14b8a6" opacity="0.15"/><path d="M8 12l2 2 4-4" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "تتبع المصاريف بسهولة",
    desc: "سجل كل مصاريفك اليومية واحصل على رؤية واضحة لمصاريفك الشهرية."
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#14b8a6" opacity="0.15"/><path d="M8 12h8M12 8v8" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    title: "تنظيم الميزانية",
    desc: "حدد ميزانيتك الشهرية وقارن بين الدخل والمصروفات بسهولة."
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" fill="#14b8a6" opacity="0.15"/><path d="M6 12c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" stroke="#14b8a6" strokeWidth="2.2"/></svg>
    ),
    title: "تقارير وتحليلات",
    desc: "احصل على تقارير بصرية تساعدك على فهم عادات الإنفاق واتخاذ قرارات أفضل."
  },
];

function FeaturesPage() {
  return (
    <section className="container py-6 sm:py-10 px-4 text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8">مميزات Masarify</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-center">
        {features.map((f, i) => (
          <div key={i} className="bg-[#18181b] rounded-2xl px-4 sm:px-7 py-6 sm:py-8 flex flex-col items-center shadow text-center">
            {f.icon}
            <h3 className="text-teal-500 text-base sm:text-lg font-semibold my-3 sm:my-4">{f.title}</h3>
            <p className="text-gray-300 text-sm sm:text-base m-0">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesPage; 
import React from "react";
import { FaLightbulb, FaUserShield, FaRegSmile, FaBalanceScale, FaHandshake } from "react-icons/fa";

function AboutPage() {
  return (
    <main className="container max-w-3xl mx-auto py-8 sm:py-14 px-4 flex flex-col gap-12">
      {/* Hero Section */}
      <section className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">عن Masarify</h2>
        <p className="text-gray-300 text-base sm:text-lg leading-7 sm:leading-8 mb-4">
          Masarify هو تطبيق يساعدك على متابعة مصاريفك وتنظيم ميزانيتك الشهرية بسهولة ووضوح.<br/>
          هدفنا هو تمكينك من التحكم الكامل في أموالك، ومعرفة أين تذهب مصاريفك، واتخاذ قرارات مالية أفضل بثقة ووضوح.
        </p>
        <img src="/image (1).png" alt="Masarify" className="mx-auto rounded-lg shadow-lg w-32 h-32 object-cover mt-4" />
      </section>

      {/* رؤية ورسالة Masarify */}
      <section className="bg-[#181818] rounded-xl p-6 sm:p-8 text-center shadow-lg flex flex-col items-center gap-4">
        <FaLightbulb className="text-teal-400 text-4xl mb-2" />
        <h3 className="text-xl font-bold text-white mb-2">رؤيتنا ورسالتنا</h3>
        <p className="text-gray-300 text-base sm:text-lg leading-7">
          أنشأنا Masarify لأننا نؤمن أن كل شخص يستحق أن يكون لديه سيطرة كاملة وشفافة على أمواله. هدفنا هو تبسيط إدارة المصاريف، وتقديم أدوات ذكية تساعدك على اتخاذ قرارات مالية أفضل، وتمنحك راحة البال في كل خطوة.
        </p>
      </section>

      {/* لماذا أنشأنا Masarify */}
      <section className="flex flex-col md:flex-row items-center gap-6 bg-[#181818] rounded-xl p-6 sm:p-8 shadow-lg">
        <div className="flex-1 text-center md:text-right">
          <h3 className="text-xl font-bold text-white mb-2">ليه أنشأنا Masarify؟</h3>
          <p className="text-gray-300 text-base sm:text-lg leading-7">
            بدأنا Masarify من احتياج شخصي حقيقي: كنا نبحث عن طريقة سهلة وفعالة لمتابعة مصاريفنا اليومية وفهم أين تذهب أموالنا. وجدنا أن أغلب الأدوات معقدة أو غير مناسبة لاحتياجاتنا، فقررنا بناء منصة تجمع بين البساطة والدقة، وتساعدك تمسك فلوسك وتحقق أهدافك المالية بثقة.
          </p>
        </div>
        <FaRegSmile className="text-teal-400 text-5xl flex-shrink-0" />
      </section>

      {/* قصة بداية Masarify - Timeline */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 text-center">قصة Masarify</h3>
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold">1</div>
            <div>
              <h4 className="font-semibold text-white">البداية من احتياج شخصي</h4>
              <p className="text-gray-300 text-sm">واجهنا صعوبة في تتبع مصاريفنا الشهرية، وبدأت الفكرة من هنا.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold">2</div>
            <div>
              <h4 className="font-semibold text-white">تطوير أول نسخة</h4>
              <p className="text-gray-300 text-sm">صممنا أول نموذج بسيط لمتابعة المصاريف، وشاركناه مع الأصدقاء والعائلة.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold">3</div>
            <div>
              <h4 className="font-semibold text-white">التحسين المستمر</h4>
              <p className="text-gray-300 text-sm">استمعنا لملاحظات المستخدمين وطورنا المنصة لتكون أكثر بساطة وفعالية.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-lg font-bold">4</div>
            <div>
              <h4 className="font-semibold text-white">إطلاق Masarify للجميع</h4>
              <p className="text-gray-300 text-sm">أطلقنا Masarify ليكون متاحًا للجميع ويساعد كل شخص في تنظيم مصاريفه بثقة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* قيم المنصة الأساسية */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 text-center">قيمنا الأساسية</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#181818] rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <FaUserShield className="text-3xl text-teal-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">الخصوصية</h4>
            <p className="text-gray-300 text-sm">نحمي بياناتك ونحترم خصوصيتك في كل خطوة.</p>
          </div>
          <div className="bg-[#181818] rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <FaRegSmile className="text-3xl text-teal-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">البساطة</h4>
            <p className="text-gray-300 text-sm">واجهة سهلة وأدوات واضحة تناسب الجميع.</p>
          </div>
          <div className="bg-[#181818] rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <FaBalanceScale className="text-3xl text-teal-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">الدقة</h4>
            <p className="text-gray-300 text-sm">نتيح لك تتبع مصاريفك بدقة وشفافية.</p>
          </div>
          <div className="bg-[#181818] rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <FaHandshake className="text-3xl text-teal-400 mb-2" />
            <h4 className="font-semibold text-white mb-1">التفاعل</h4>
            <p className="text-gray-300 text-sm">نستمع لك ونتطور باستمرار بناءً على احتياجاتك.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage; 
import React from "react";

function AboutPage() {
  return (
    <section className="container max-w-2xl mx-auto py-6 sm:py-10 px-4 text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">عن Masarify</h2>
      <p className="text-gray-300 text-base sm:text-lg leading-6 sm:leading-8">
        Masarify هو تطبيق يساعدك على متابعة مصاريفك وتنظيم ميزانيتك الشهرية بسهولة ووضوح.<br/>
        هدفنا هو تمكينك من التحكم الكامل في أموالك، ومعرفة أين تذهب مصاريفك، واتخاذ قرارات مالية أفضل بثقة ووضوح.
      </p>
    </section>
  );
}

export default AboutPage; 
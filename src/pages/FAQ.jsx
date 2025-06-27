import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const faqData = [
  {
    question: "ما هو Masarify؟",
    answer: "Masarify هو تطبيق ويب يساعدك على تتبع مصاريفك وتنظيم ميزانيتك الشهرية بسهولة ووضوح، مع الحفاظ على خصوصيتك وبياناتك."
  },
  {
    question: "هل بياناتي آمنة على Masarify؟",
    answer: "نعم، نحن نولي أهمية قصوى لخصوصيتك. جميع بياناتك مشفرة ولا يتم مشاركتها مع أي طرف ثالث."
  },
  {
    question: "هل يمكنني استخدام Masarify مجانًا؟",
    answer: "نعم، يمكنك البدء في استخدام Masarify مجانًا والاستفادة من معظم المميزات الأساسية."
  },
  {
    question: "كيف أضيف أو أعدل مصروفاتي؟",
    answer: "ببساطة، بعد تسجيل الدخول يمكنك إضافة أو تعديل أو حذف أي مصروف أو دخل من لوحة التحكم بسهولة."
  },
  {
    question: "هل يمكنني تصدير تقاريري المالية؟",
    answer: "نعم، يمكنك تصدير تقاريرك المالية بصيغ متعددة من خلال قسم التحليلات في لوحة التحكم."
  },
  {
    question: "كيف أتواصل مع فريق الدعم؟",
    answer: "يمكنك التواصل معنا عبر صفحة 'تواصل معنا' أو من خلال أيقونات السوشيال في الفوتر."
  },
];

const FAQ = () => {
  return (
    <section className="container max-w-2xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center mb-8">
        <FaQuestionCircle className="text-4xl text-teal-500 mb-2" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">الأسئلة الشائعة</h2>
        <p className="text-gray-400 text-base sm:text-lg text-center max-w-xl">
          هنا ستجد إجابات لأكثر الأسئلة شيوعًا حول استخدام Masarify وكيفية الاستفادة القصوى من المنصة.
        </p>
      </div>
      <div className="space-y-6">
        {faqData.map((item, idx) => (
          <div key={idx} className="bg-[#181818] rounded-xl p-5 shadow-md border border-[#232323]">
            <h3 className="text-teal-400 font-semibold text-lg mb-2 flex items-center gap-2">
              <FaQuestionCircle className="inline text-base" />
              {item.question}
            </h3>
            <p className="text-gray-300 text-sm leading-7">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ; 
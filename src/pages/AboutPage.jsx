import { FaRocket, FaShieldAlt, FaSmile, FaChartLine } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";



function AboutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCta = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <main className="px-0  py-0 flex flex-col gap-20">
      {/* بانر عريض أعلى الصفحة */}
      <section className="relative w-full h-[300px] sm:h-[320px] md:h-[400px] lg:h-[480px] flex items-center justify-center overflow-hidden ">
        <img
          src="https://img.freepik.com/free-photo/tree-grows-coin-glass-jar-with-copy-space_35913-2508.jpg?ga=GA1.1.1894244180.1747400038&semt=ais_hybrid&w=740"
          alt="Masarify Hero"
          className="w-full h-full object-cover object-left absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-center px-4 py-10">
          <h1 className="text-gray-50 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            تحكم في مستقبلك المالي مع <span className="text-teal-400">Masarify</span>
          </h1>
          <p className="text-gray-50 text-lg sm:text-xl max-w-2xl mx-auto mb-6 drop-shadow">
            منصة عصرية تساعدك على تنظيم مصاريفك، تحقيق أهدافك المالية، والعيش براحة بال.
          </p>
          <button
            onClick={handleCta}
            className="bg-teal-500 text-white px-7 py-3 rounded-lg font-bold shadow hover:bg-teal-600 transition text-lg "
          >
            ابدأ الآن
          </button>
        </div>
      </section>

      {/* عن منصة Masarify */}
      <section className="flex flex-col md:flex-row items-center gap-8 mx-10 md:px-10 ">

        <img
          src="https://img.freepik.com/free-photo/man-with-banknotes-isolated-studio_1303-26940.jpg?ga=GA1.1.1894244180.1747400038&semt=ais_hybrid&w=740"
          alt="من نحن Masarify"
          className="w-full max-w-xs md:max-w-md rounded-2xl shadow-lg border border-border object-cover"
        />

        <div className="flex-1 text-white text-lg leading-relaxed">
          <h2 className="text-2xl font-bold mb-4 text-teal-400">عن منصة Masarify</h2>
          <p className="mb-3">
            أنا مؤسس Masarify، وبدأت هذه المنصة من احتياجي الشخصي لحل فعّال يساعدني على تتبع نفقاتي وتحديد أولوياتي المالية وتحقيق أهدافي بثقة.
          </p>
          <p className="mb-3">
            Masarify هي منصة مالية ذكية صُممت لمساعدتك على فهم وإدارة مصاريفك اليومية وميزانيتك الشهرية بطريقة بسيطة وواضحة.
          </p>
          <p className="mb-3">
            أؤمن أن كل شخص يستحق أن يكون لديه سيطرة كاملة على أمواله، ولهذا صممت Masarify لتكون واجهتها سهلة، وتجربتها ممتعة، وأدواتها قوية وفعالة.
          </p>
          <p>
            من خلال تقارير تحليلية ذكية، وتنبيهات فورية، وتصميم مرن يناسب احتياجاتك، أقدم لك تجربة إدارة مالية متكاملة تساعدك على اتخاذ قرارات مالية مدروسة، وتحقيق راحة البال.
          </p>
        </div>
      </section>
      <section className="flex flex-col-reverse md:flex-row items-center justify-center px-4 mx-10 ">
        <div className="flex-1 flex flex-col items-start justify-center md:pr-8">
          <h2 className="text-4xl font-extrabold mb-4 text-white leading-tight">منصة Masarify</h2>
          <p className="text-white text-lg mb-4 max-w-lg">
            تحكم في مصاريفك وحقق أهدافك المالية بسهولة ووضوح مع Masarify.<br />
            منصة عصرية تمنحك كل الأدوات التي تحتاجها لإدارة أموالك بثقة وراحة بال.
          </p>
          <button
            onClick={handleCta}
            className="bg-teal-500 text-white px-7 py-3 rounded-lg font-bold shadow hover:bg-teal-600 transition text-lg "
          >
            ابدأ الآن
          </button>
        </div>
        {/* يمين: صورة */}
        <div className="flex-1 flex justify-center items-center mb-8 md:mb-0">
          <img
            src="https://img.freepik.com/free-photo/money-saving-jar-arrangement_23-2148793801.jpg?ga=GA1.1.1894244180.1747400038&semt=ais_hybrid&w=740"
            alt="توفير المال Masarify"
            className="w-full max-w-xs md:max-w-md rounded-2xl shadow-lg border border-border object-cover"
            loading="lazy"
          />
        </div>
      </section>


    </main>
  );
}

export default AboutPage;

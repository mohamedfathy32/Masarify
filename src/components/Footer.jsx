import { Link } from "react-router-dom";
import { FaLinkedinIn, FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    {
      icon: <FaLinkedinIn className="text-white text-lg" />,
      url: "https://www.linkedin.com/in/mohamed-fathy-3a3a49239/",
      label: "LinkedIn",
    },
    {
      icon: <FaWhatsapp className="text-white text-lg" />,
      url: "https://wa.me/201094976357",
      label: "WhatsApp",
    },
    {
      icon: <FaFacebookF className="text-white text-lg" />,
      url: "https://www.facebook.com/mohamed.fathy.400599/",
      label: "Facebook",
    },
    {
      icon: <FaInstagram className="text-white text-lg" />,
      url: "https://www.instagram.com/mohamed_fathy26/",
      label: "Instagram",
    },
  ];
  const quickLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "المميزات", path: "/features" },
    { name: "عن التطبيق", path: "/about" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  const otherLinks = [
    { name: "الأسئلة الشائعة", path: "/faq" },
    { name: "تسجيل الدخول", path: "/login" },
    { name: "حساب جديد", path: "/register" },
  ];

  return (
    <footer className="bg-gradient-to-t from-[#0a0a0a] to-[#181818] text-gray-300 border-t border-[#222] pt-12 pb-6 px-4 mt-12">
      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-start">
          {/* Logo & About */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="font-bold text-3xl text-teal-500">Masarify</span>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              منصتك الذكية لإدارة المصاريف وتنظيم الميزانية بسهولة وخصوصية.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-3">الروابط السريعة</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="relative w-fit block text-sm text-gray-300 hover:text-teal-400 transition-colors after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-teal-400 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-white mb-3">روابط أخرى</h4>
            <ul className="space-y-2">
              {otherLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="relative w-fit block text-sm text-gray-300 hover:text-teal-400 transition-colors after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-teal-400 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="font-semibold text-white mb-3">تابعنا على</h4>
            <div className="flex gap-4">
              {socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="bg-[#232323] hover:bg-teal-500 p-2 rounded-full transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#222] pt-4 flex flex-col  items-center justify-between text-xs sm:text-sm text-gray-400 text-center">
          <span>© {new Date().getFullYear()} Masarify. جميع الحقوق محفوظة.</span>
          <span className="mt-2 md:mt-0">
            تم بواسطة
            <a href="https://wa.me/201094976357" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline mx-1">
              محمد فتحي
            </a>
          </span>
        </div>
      </div>
    </footer>

  );
};

export default Footer;

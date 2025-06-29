import React, { useEffect, useState } from "react";
import {
  FaEnvelope, FaUser, FaCommentDots, FaWhatsapp, FaFacebookF, FaLinkedinIn, FaInstagram, FaTag, FaPhone
} from "react-icons/fa";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import useAuth from "../hooks/useAuth";

const Contact = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: user?.email || "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setForm(f => ({ ...f, name: user?.displayName || "", email: user?.email || "" }));
  }, [user]);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    emailjs.send(
      "service_vkb5dq3",
      "template_rkjdc6u",
      form,
      "ovpQn_TavAHWRbiSP"
    )
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'تم الإرسال بنجاح',
          text: 'سوف يتم الرد عليك قريبًا.',
          confirmButtonText: 'موافق',
          timer: 6000,
          timerProgressBar: true
        });
        setForm({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'حدث خطأ',
          text: 'يرجى المحاولة لاحقًا.',
          confirmButtonText: 'موافق'
        });
        setLoading(false);
      });
  };

  return (
    <section className="container mx-auto py-14 px-4 max-w-7xl">
      {/* العنوان */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <FaEnvelope className="text-4xl text-teal-500 mb-3 mx-auto" />
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">تواصل معنا</h2>
        <p className="text-white text-base sm:text-lg">
          ارسل لنا رسالتك أو استفسارك في أي وقت، وسنكون سعداء بمساعدتك وتحسين تجربتك على Masarify.
        </p>
        <p className="text-white text-sm mt-2">
          إذا كان لديك اقتراحات أو أفكار لتطوير التطبيق، لا تتردد في مشاركتها معنا!
        </p>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* بيانات التواصل الجانبية */}
        <div className="flex flex-col gap-6 justify-center">
          <div className="bg-card rounded-xl p-5 flex items-center gap-4 border border-[#2a2a2a] shadow">
            <FaEnvelope className="text-teal-400 text-2xl" />
            <div>
              <h4 className="text-white font-bold text-sm">البريد الإلكتروني</h4>
              <p className="text-gray-400 text-sm break-all">mohamedfathy2630@gmail.com</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 flex items-center gap-4 border border-[#2a2a2a] shadow">
            <FaPhone className="text-teal-400 text-2xl" />
            <div>
              <h4 className="text-white font-bold text-sm">رقم التواصل</h4>
              <p className="text-gray-400 text-sm">+201094976357</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-5 flex flex-col gap-3 border border-[#2a2a2a] shadow">
            <h4 className="text-white font-bold text-sm">وسائل التواصل الاجتماعي</h4>
            <div className="flex gap-4 text-white">
              {[
                { icon: <FaWhatsapp className="text-gray-50" />, url: "https://wa.me/201094976357", label: "واتساب" },
                { icon: <FaFacebookF className="text-gray-50" />, url: "https://www.facebook.com/mohamed.fathy.400599/", label: "فيسبوك" },
                { icon: <FaLinkedinIn className="text-gray-50" />, url: "https://www.linkedin.com/in/mohamed-fathy-3a3a49239/", label: "لينكدإن" },
                { icon: <FaInstagram className="text-gray-50" />, url: "https://www.instagram.com/mohamed_fathy26/", label: "إنستجرام" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="bg-[#232323] hover:bg-teal-500 p-2 rounded-full transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* النموذج */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-[#232323]">
          <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
            هل عندك سؤال، استفسار، أو حتى اقتراح يساعدنا نطور Masarify؟
            <span className="text-teal-400 font-semibold"> اكتب لنا رسالتك 👇</span>،
            وهنكون سعداء نسمع منك!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: "الاسم", icon: <FaUser />, name: "name", type: "text", placeholder: "اسمك الكامل" },
              { label: "البريد الإلكتروني", icon: <FaEnvelope />, name: "email", type: "email", placeholder: "you@email.com" },
              { label: "الموضوع", icon: <FaTag />, name: "subject", type: "text", placeholder: "استفسار، اقتراح،..." }
            ].map((field, i) => (
              <div key={i} className="flex flex-col gap-2">
                <label className="text-white font-medium flex items-center gap-2">
                  {field.icon} {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  required
                  value={form[field.name]}
                  onChange={handleChange}
                  className="bg-[#232323] border border-[#333] rounded-md px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <label className="text-gray-300 font-medium flex items-center gap-2 text-white"><FaCommentDots /> الرسالة</label>
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                className="bg-[#232323] border border-[#333] rounded-md px-4 py-2 text-white focus:outline-none focus:border-teal-500 resize-none"
                placeholder="اكتب رسالتك هنا..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 rounded-md transition-colors text-lg shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {loading ? "جاري الإرسال..." : "إرسال"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

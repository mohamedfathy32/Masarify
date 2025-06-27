import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import { saveUserProfile, getUserProfile } from "../services/userService";
import Swal from "sweetalert2";


function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    city: "",
    photoURL: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef();

  useEffect(() => {
    if (!user) return;
    setForm(f => ({ ...f, name: user.displayName || "", photoURL: user.photoURL || "" }));
    getUserProfile(user.uid).then(profile => {
      setForm(f => ({
        ...f,
        ...profile,
        name: user.displayName || profile.name || "",
        photoURL: user.photoURL || profile.photoURL || ""
      }));
      setImgPreview(user.photoURL || profile.photoURL || "");
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImgChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "test cloudinary");
      formData.append("cloud_name", "dhta28b63");

      const res = await fetch("https://api.cloudinary.com/v1_1/dhta28b63/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      const imageUrl = data.secure_url;
      setForm(f => ({ ...f, photoURL: imageUrl }));
      setImgPreview(imageUrl);
    } catch {
      setError("حدث خطأ أثناء رفع الصورة");
    } finally {
      setImgUploading(false);
    }
  };

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    const dataToSave = {
      name: form.name || "",
      phone: form.phone || "",
      bio: form.bio || "",
      city: form.city || "",
      photoURL: form.photoURL || ""
    };
    console.log("بيانات الحفظ:", dataToSave, "uid المستخدم:", user?.uid);
    try {
      await updateProfile(auth.currentUser, { displayName: form.name, photoURL: form.photoURL });
      await saveUserProfile(user.uid, dataToSave);
      setSuccess(true);
      Swal.fire({
        icon: "success",
        title: "تم الحفظ!",
        text: "تم حفظ بياناتك بنجاح.",
        confirmButtonText: "حسنًا"
      });
    } catch {
      setError("حدث خطأ أثناء حفظ البيانات");
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.",
        confirmButtonText: "حسنًا"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">الإعدادات الشخصية</h2>
        <form onSubmit={handleSave} className="bg-[#18181b] rounded-2xl p-4 sm:p-6 shadow space-y-4 mb-6 sm:mb-8 text-right max-w-md mx-auto">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2">
              <img
                src={imgPreview || "/default-avatar.png"}
                alt="صورة البروفايل"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-teal-500"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 left-0 bg-teal-500 text-white rounded-full p-1 text-xs shadow hover:bg-teal-600"
                disabled={imgUploading}
              >
                {imgUploading ? "..." : "تغيير"}
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImgChange}
              />
            </div>
          </div>
          <label className="block text-gray-300 mb-1 text-sm sm:text-base">الاسم</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            maxLength={40}
          />
          <label className="block text-gray-300 mb-1 text-sm sm:text-base">البريد الإلكتروني</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#232323] text-gray-400 text-sm sm:text-base"
          />
          <label className="block text-gray-300 mb-1 text-sm sm:text-base">رقم الهاتف</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            maxLength={20}
          />
          <label className="block text-gray-300 mb-1 text-sm sm:text-base">المدينة</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            maxLength={30}
          />
          <label className="block text-gray-300 mb-1 text-sm sm:text-base">نبذة عنك</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-white text-sm sm:text-base focus:outline-none focus:border-teal-500"
            maxLength={200}
            rows={3}
          />
          {success && <div className="text-green-500 text-sm">تم حفظ البيانات بنجاح!</div>}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-teal-500 text-white font-semibold text-base sm:text-lg p-3 sm:p-4 rounded-lg border-none mt-2 cursor-pointer transition hover:bg-teal-600 disabled:opacity-60" disabled={loading}>
            {loading ? "...جاري الحفظ" : "حفظ التغييرات"}
          </button>
        </form>
        <button onClick={handleLogout} className="w-full bg-red-500 text-white font-semibold text-base sm:text-lg p-3 sm:p-4 rounded-lg border-none mt-2 cursor-pointer transition hover:bg-red-600 max-w-md mx-auto">
          تسجيل الخروج
        </button>
      </main>
    </div>
  );
}

export default Settings; 
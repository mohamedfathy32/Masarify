import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import { saveUserProfile, getUserProfile } from "../services/userService";
import {
  requestNotificationPermission,
  saveNotificationSettings,
  getNotificationSettings,
  checkNotificationStatus,
  onNotificationMessage
} from "../services/notificationService";
import Swal from "sweetalert2";
import Splash from "../components/Splash";
import { useTheme } from "../hooks/useTheme";

function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    city: "",
    photoURL: ""
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [notifications, setNotifications] = useState({
    budgetThresholds: {
      "50": true,
      "80": true,
      "100": true
    },
    transactionAlerts: true,
    weeklyReport: true,
    monthlyReminder: true
  });
  const [notificationStatus, setNotificationStatus] = useState("default");
  const fileInputRef = useRef();
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

  // صورة افتراضية للمستخدم
  const defaultAvatar = (
    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg">
      <svg className="w-16 h-16 text-gray-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  );

  useEffect(() => {
    if (!user) return;

    // تحميل بيانات المستخدم
    setForm(f => ({ ...f, name: user.displayName || "", photoURL: user.photoURL || "" }));
    getUserProfile(user.uid).then(profile => {
      setForm(f => ({
        ...f,
        ...profile,
        name: user.displayName || profile.name || "",
        photoURL: user.photoURL || profile.photoURL || ""
      }));
      setImgPreview(user.photoURL || profile.photoURL);
    });

    // تحميل إعدادات الإشعارات
    loadNotificationSettings();

    // التحقق من حالة الإشعارات
    setNotificationStatus(checkNotificationStatus());

    // مراقبة الإشعارات الواردة
    const unsubscribe = onNotificationMessage((payload) => {
      console.log("إشعار جديد:", payload);
    });

    return () => unsubscribe();
  }, [user]);

  const loadNotificationSettings = async () => {
    if (!user) return;

    try {
      const settings = await getNotificationSettings(user.uid);
      if (settings) {
        setNotifications(settings);
      }
    } catch (error) {
      console.error("خطأ في تحميل إعدادات الإشعارات:", error);
    }
  };

  const handleRequestNotificationPermission = async () => {
    if (!user) return;

    try {
      const token = await requestNotificationPermission(user.uid);
      if (token) {
        setNotificationStatus("granted");
        Swal.fire({
          icon: "success",
          title: "تم تفعيل الإشعارات!",
          text: "ستصلك إشعارات مهمة حول ميزانيتك ومعاملاتك.",
          confirmButtonText: "حسنًا"
        });
      } else {
        setNotificationStatus("denied");
        Swal.fire({
          icon: "warning",
          title: "لم يتم تفعيل الإشعارات",
          text: "يمكنك تفعيل الإشعارات من إعدادات المتصفح.",
          confirmButtonText: "حسنًا"
        });
      }
    } catch (error) {
      console.error("خطأ في طلب إذن الإشعارات:", error);
    }
  };

  const handleNotificationChange = async (key, value) => {
    const newSettings = { ...notifications };

    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      newSettings[parent] = { ...newSettings[parent], [child]: value };
    } else {
      newSettings[key] = value;
    }

    setNotifications(newSettings);

    // حفظ الإعدادات في Firestore
    if (user) {
      try {
        await saveNotificationSettings(user.uid, newSettings);
      } catch (error) {
        console.error("خطأ في حفظ إعدادات الإشعارات:", error);
      }
    }
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = e => {
    setPasswordForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  // دالة لضغط الصورة
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // حساب الأبعاد الجديدة مع الحفاظ على النسبة
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // رسم الصورة المضغوطة
        ctx.drawImage(img, 0, 0, width, height);

        // تحويل إلى Blob
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImgChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "يرجى اختيار ملف صورة صحيح.",
        confirmButtonText: "حسنًا"
      });
      return;
    }

    // التحقق من حجم الملف (15MB = 15 * 1024 * 1024 bytes)
    const maxSize = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حجم الصورة يجب أن يكون أقل من 15 ميجابايت.",
        confirmButtonText: "حسنًا"
      });
      return;
    }

    setImgUploading(true);
    setError("");

    try {
      // ضغط الصورة إذا كانت كبيرة
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) { // إذا كانت أكبر من 2MB
        processedFile = await compressImage(file);
      }

      const formData = new FormData();
      formData.append("file", processedFile);
      formData.append("upload_preset", "test cloudinary");
      formData.append("cloud_name", "dhta28b63");

      const res = await fetch("https://api.cloudinary.com/v1_1/dhta28b63/image/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error('فشل في رفع الصورة');
      }

      const data = await res.json();
      const imageUrl = data.secure_url;
      setForm(f => ({ ...f, photoURL: imageUrl }));
      setImgPreview(imageUrl);

    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      setError("حدث خطأ أثناء رفع الصورة");
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء رفع الصورة. حاول مرة أخرى.",
        confirmButtonText: "حسنًا"
      });
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
      photoURL: form.photoURL || "",
      notifications: notifications
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

  const handlePasswordUpdate = async e => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "كلمة المرور الجديدة غير متطابقة.",
        confirmButtonText: "حسنًا"
      });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.",
        confirmButtonText: "حسنًا"
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      Swal.fire({
        icon: "success",
        title: "تم التحديث!",
        text: "تم تغيير كلمة المرور بنجاح.",
        confirmButtonText: "حسنًا"
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء تغيير كلمة المرور. تأكد من كلمة المرور الحالية.",
        confirmButtonText: "حسنًا"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return <Splash />;
  }

  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">الإعدادات الشخصية</h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "profile"
                ? "bg-teal-500 text-gray-50"
                : "bg-[#18181b] text-gray-300 hover:bg-[#232323]"
                }`}
            >
              الملف الشخصي
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "security"
                ? "bg-teal-500 text-gray-50"
                : "bg-[#18181b] text-gray-300 hover:bg-[#232323]"
                }`}
            >
              الأمان
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "notifications"
                ? "bg-teal-500 text-gray-50"
                : "bg-[#18181b] text-gray-300 hover:bg-[#232323]"
                }`}
            >
              الإشعارات
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "appearance"
                ? "bg-teal-500 text-gray-50"
                : "bg-[#18181b] text-gray-300 hover:bg-[#232323]"
                }`}
            >
              المظهر
            </button>
            {/* <button
              onClick={() => setActiveTab("budget")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "budget"
                ? "bg-teal-500 text-gray-50"
                : "bg-[#18181b] text-gray-300 hover:bg-[#232323]"
                }`}
            >
              إعدادات الميزانية
            </button> */}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="w-full">
              <form onSubmit={handleSave} className="bg-[#18181b] rounded-2xl p-6 shadow space-y-4 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-50 mb-4 text-center">البيانات الشخصية</h3>

                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mb-4 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    {imgPreview ? (
                      <img
                        src={imgPreview}
                        alt="صورة البروفايل"
                        className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-lg hover:opacity-80 transition"
                      />
                    ) : (
                      defaultAvatar
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <svg className="w-8 h-8 text-gray-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImgChange}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-300 text-sm mb-2">انقر على الصورة لتغييرها</p>
                    <p className="text-gray-400 text-xs mb-2">الحجم الأقصى: 15 ميجابايت</p>
                    {imgUploading && (
                      <div className="text-cyan-400 text-sm">جاري رفع الصورة...</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">الاسم</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                      maxLength={40}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">رقم الهاتف</label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                      maxLength={20}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full p-3 rounded-lg border border-[#222] bg-[#232323] text-gray-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">المدينة</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm">نبذة عنك</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-[#222] bg-[#0f0f0f] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                    maxLength={200}
                    rows={3}
                  />
                </div>

                {success && <div className="text-green-500 text-sm text-center">تم حفظ البيانات بنجاح!</div>}
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                <button
                  type="submit"
                  className="w-full bg-teal-500 text-gray-50 font-semibold text-base p-3 rounded-lg border-none cursor-pointer transition hover:bg-teal-600 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading || imgUploading}
                >
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-[#18181b] rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">إعدادات الأمان</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">تغيير كلمة المرور</h4>
                    <p className="text-gray-400 text-sm">قم بتحديث كلمة المرور الخاصة بك</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="bg-teal-500 text-gray-50 px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition"
                  >
                    تغيير
                  </button>
                </div>

                {showPasswordForm && (
                  <form onSubmit={handlePasswordUpdate} className="bg-[#0f0f0f] rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">كلمة المرور الحالية</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 pr-10 rounded-lg border border-[#222] bg-[#18181b] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-50"
                        >
                          {showPasswords.current ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">كلمة المرور الجديدة</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 pr-10 rounded-lg border border-[#222] bg-[#18181b] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-50"
                        >
                          {showPasswords.new ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm">تأكيد كلمة المرور الجديدة</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 pr-10 rounded-lg border border-[#222] bg-[#18181b] text-gray-50 text-sm focus:outline-none focus:border-teal-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-50"
                        >
                          {showPasswords.confirm ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-teal-500 text-gray-50 px-4 py-2 rounded-lg text-sm hover:bg-teal-600 transition disabled:opacity-60"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="bg-gray-500 text-gray-50 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-[#18181b] rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">إعدادات الإشعارات</h3>

              {/* حالة الإشعارات */}
              <div className="mb-6 p-4 bg-[#0f0f0f] rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-gray-50 font-medium">حالة الإشعارات</h4>
                    <p className="text-gray-400 text-sm">
                      {notificationStatus === "granted" && "الإشعارات مفعلة"}
                      {notificationStatus === "denied" && "الإشعارات مرفوضة"}
                      {notificationStatus === "default" && "لم يتم طلب إذن الإشعارات"}
                      {notificationStatus === "not-supported" && "المتصفح لا يدعم الإشعارات"}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${notificationStatus === "granted" ? "bg-green-500/20 text-green-400" :
                    notificationStatus === "denied" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                    {notificationStatus === "granted" && "مفعلة"}
                    {notificationStatus === "denied" && "مرفوضة"}
                    {notificationStatus === "default" && "غير مفعلة"}
                    {notificationStatus === "not-supported" && "غير مدعومة"}
                  </div>
                </div>

                {notificationStatus === "default" && (
                  <button
                    onClick={handleRequestNotificationPermission}
                    className="w-full bg-teal-500 text-gray-50 font-semibold p-3 rounded-lg hover:bg-teal-600 transition"
                  >
                    تفعيل الإشعارات
                  </button>
                )}

                {notificationStatus === "denied" && (
                  <div className="text-yellow-400 text-sm">
                    <p>لتفعيل الإشعارات، اذهب إلى إعدادات المتصفح واسمح بالإشعارات لهذا الموقع.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-gray-50 font-medium mb-3">تنبيهات الميزانية</h4>

                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">تنبيه 50% من الميزانية</h4>
                    <p className="text-gray-400 text-sm">إشعار عند الوصول لـ 50% من ميزانيتك</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.budgetThresholds["50"]}
                    onChange={(e) => handleNotificationChange('budgetThresholds.50', e.target.checked)}
                    disabled={notificationStatus !== "granted"}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">تنبيه 80% من الميزانية</h4>
                    <p className="text-gray-400 text-sm">إشعار عند الوصول لـ 80% من ميزانيتك</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.budgetThresholds["80"]}
                    onChange={(e) => handleNotificationChange('budgetThresholds.80', e.target.checked)}
                    disabled={notificationStatus !== "granted"}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">تنبيه 100% من الميزانية</h4>
                    <p className="text-gray-400 text-sm">إشعار عند الوصول لـ 100% من ميزانيتك</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.budgetThresholds["100"]}
                    onChange={(e) => handleNotificationChange('budgetThresholds.100', e.target.checked)}
                    disabled={notificationStatus !== "granted"}
                  />
                </div>

                <h4 className="text-gray-50 font-medium mb-3 mt-6">إشعارات أخرى</h4>

                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">إشعارات العمليات</h4>
                    <p className="text-gray-400 text-sm">إشعارات عند إضافة عمليات جديدة</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.transactionAlerts}
                    onChange={(e) => handleNotificationChange('transactionAlerts', e.target.checked)}
                    disabled={notificationStatus !== "granted"}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">التقرير الأسبوعي</h4>
                    <p className="text-gray-400 text-sm">تقرير أسبوعي بمصروفاتك</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.weeklyReport}
                    onChange={(e) => handleNotificationChange('weeklyReport', e.target.checked)}
                    disabled={notificationStatus !== "granted"}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">تذكير بداية الشهر</h4>
                    <p className="text-gray-400 text-sm">تذكير لإعداد ميزانية الشهر الجديد</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.monthlyReminder}
                    onChange={(e) => handleNotificationChange('monthlyReminder', e.target.checked)}
                    disabled={notificationStatus !== "granted"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="bg-[#18181b] rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">إعدادات المظهر</h3>
              <div className="space-y-6">
                {/* اختيار الوضع */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0f0f0f] rounded-lg gap-4">
                  <div>
                    <h4 className="text-gray-50 font-medium mb-1">وضع الموقع</h4>
                    <p className="text-gray-400 text-sm">اختر بين الوضع المظلم أو الفاتح أو تلقائي حسب النظام</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      dir="ltr"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${theme === "dark" ? "bg-teal-500" : "bg-gray-400"
                        }`}
                    >
                      <div
                        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : "translate-x-0"
                          }`}
                      />
                    </button>
                  </div>

                </div>
                {/* اختيار حجم الخط */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#0f0f0f] rounded-lg gap-4">
                  <div>
                    <h4 className="text-gray-50 font-medium mb-1">حجم الخط</h4>
                    <p className="text-gray-400 text-sm">اختر حجم الخط المناسب لك</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="bg-[#232323] border border-[#232323] text-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="small">صغير</option>
                      <option value="normal">عادي</option>
                      <option value="large">كبير</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Budget Settings Tab */}
          {/* {activeTab === "budget" && (
            <div className="bg-[#18181b] rounded-2xl p-6 shadow">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">إعدادات إشعارات الميزانية</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">إشعار عند 50% من الميزانية</h4>
                    <p className="text-gray-400 text-sm">تنبيه عند إنفاق نصف الميزانية</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.budgetThresholds["50"]}
                    onChange={(e) => handleNotificationChange('budgetThresholds.50', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">إشعار عند 80% من الميزانية</h4>
                    <p className="text-gray-400 text-sm">تنبيه عند اقتراب تجاوز الميزانية</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.budgetThresholds["80"]}
                    onChange={(e) => handleNotificationChange('budgetThresholds.80', e.target.checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                  <div>
                    <h4 className="text-gray-50 font-medium">إشعار عند 100% من الميزانية</h4>
                    <p className="text-gray-400 text-sm">تنبيه عند تجاوز الميزانية</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-500"
                    checked={notifications.budgetThresholds["100"]}
                    onChange={(e) => handleNotificationChange('budgetThresholds.100', e.target.checked)}
                  />
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleSave}
                    className="w-full bg-teal-500 text-gray-50 font-semibold text-base p-3 rounded-lg border-none cursor-pointer transition hover:bg-teal-600 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "جاري الحفظ..." : "حفظ إعدادات الإشعارات"}
        </button>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </main>
    </div>
  );
}

export default Settings; 
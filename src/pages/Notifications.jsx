import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Swal from "sweetalert2";
import { HiOutlineBell } from "react-icons/hi";
import Splash from "../components/Splash";
import { useTheme } from "../hooks/useTheme";

function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // استخدام hook الإشعارات
  const {
    notificationStatus,
    notifications,
    unreadCount,
    loading,
    requestPermission,
    markAsRead,
    deleteNotification,
    deleteAllRead
  } = useNotifications(user?.uid);

  useEffect(() => {
    if (!user) return;

    // hook الإشعارات يقوم بتحميل البيانات تلقائياً
    console.log("صفحة الإشعارات - عدد الإشعارات:", notifications.length);
    console.log("صفحة الإشعارات - عدد الإشعارات غير المقروءة:", unreadCount);
  }, [user, notifications.length, unreadCount]);

  const handleRequestPermission = async () => {
    if (!user) return;

    try {
      const success = await requestPermission();
      if (success) {
        Swal.fire({
          icon: "success",
          title: "تم تفعيل الإشعارات!",
          text: "ستصلك إشعارات مهمة حول ميزانيتك ومعاملاتك.",
          confirmButtonText: "حسنًا"
        });
      } else {
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

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("خطأ في تحديث حالة الإشعار:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const result = await Swal.fire({
        title: "حذف الإشعار",
        text: "هل أنت متأكد من حذف هذا الإشعار؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "حذف",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#ef4444"
      });

      if (result.isConfirmed) {
        await deleteNotification(notificationId);
      }
    } catch (error) {
      console.error("خطأ في حذف الإشعار:", error);
    }
  };

  const handleDeleteAllRead = async () => {
    if (!user) return;

    try {
      const result = await Swal.fire({
        title: "حذف الإشعارات المقروءة",
        text: "هل أنت متأكد من حذف جميع الإشعارات المقروءة؟",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "حذف",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#ef4444"
      });

      if (result.isConfirmed) {
        await deleteAllRead();
        Swal.fire({
          icon: "success",
          title: "تم الحذف!",
          text: "تم حذف جميع الإشعارات المقروءة.",
          confirmButtonText: "حسنًا"
        });
      }
    } catch (error) {
      console.error("خطأ في حذف الإشعارات المقروءة:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'budget-threshold':
        return (
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'transaction-alert':
        return (
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'weekly-report':
        return (
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      case 'monthly-reminder':
        return (
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
            <HiOutlineBell size={22} />
          </div>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd MMM yyyy - HH:mm", { locale: ar });
  };

  // ألوان ديناميكية حسب الثيم
  const cardBg = theme === "light" ? "bg-white/80" : "bg-[#18181b]";
  const cardBorder = theme === "light" ? "border-gray-200" : "border-[#222]";
  const cardText = theme === "light" ? "text-gray-800" : "text-white";
  const cardSubText = theme === "light" ? "text-gray-500" : "text-gray-400";
  const cardUnread = theme === "light" ? "border-teal-400/40 bg-teal-50" : "border-teal-500/30 bg-teal-500/5";
  const cardRead = theme === "light" ? "opacity-70" : "opacity-75";
  const btnMain = theme === "light" ? "bg-teal-500 text-white hover:bg-teal-600" : "bg-teal-500 text-gray-50 hover:bg-teal-600";
  const btnDelete = theme === "light" ? "bg-red-500 text-white hover:bg-red-600" : "bg-red-500 text-gray-50 hover:bg-red-600";
  // const btnSecondary = theme === "light" ? "bg-white/80 text-teal-600 hover:bg-gray-100" : "bg-white/20 text-teal-400 hover:bg-white/30";

  if (loading) {
    return <Splash />;
  }

  return (
    <div className={`flex flex-col min-h-screen ${theme === "light" ? "bg-gray-100" : "bg-[#101014]"}`}>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${cardText}`}>الإشعارات</h1>
              <p className={`${cardText} mt-1`}>
                {unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : "جميع الإشعارات مقروءة"}
              </p>
            </div>
            <div className="flex gap-2">
              {notifications.some(n => n.isRead) && (
                <button
                  onClick={handleDeleteAllRead}
                  className={`px-4 py-2 rounded-lg text-sm transition ${btnDelete}`}
                >
                  حذف المقروءة
                </button>
              )}
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 rounded-lg text-sm transition ${btnMain}`}
              >
                العودة للوحة التحكم
              </button>
            </div>
          </div>

          {/* حالة الإشعارات */}
          {notificationStatus !== "granted" && (
            <div className={`${cardBg} rounded-2xl p-6 mb-6 border border-yellow-500/20`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`${cardText} font-semibold mb-1`}>الإشعارات غير مفعلة</h3>
                  <p className={`${cardSubText} text-sm mb-3`}>
                    {notificationStatus === "denied"
                      ? "تم رفض الإشعارات. اذهب إلى إعدادات المتصفح لتفعيلها."
                      : "قم بتفعيل الإشعارات لتصلك تنبيهات مهمة حول ميزانيتك ومعاملاتك."
                    }
                  </p>
                  {notificationStatus === "default" && (
                    <button
                      onClick={handleRequestPermission}
                      className={`px-4 py-2 rounded-lg text-sm transition ${btnMain}`}
                    >
                      تفعيل الإشعارات
                    </button>
                  )}
                  {notificationStatus === "denied" && (
                    <button
                      onClick={() => navigate('/settings')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      الذهاب للإعدادات
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* قائمة الإشعارات */}
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className={`${cardBg} rounded-2xl p-8 text-center border ${cardBorder}`}>
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineBell size={22} />
                </div>
                <h3 className={`${cardText} font-semibold mb-2`}>لا توجد إشعارات</h3>
                <p className={cardSubText}>ستظهر هنا الإشعارات الجديدة عندما تصل</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${cardBg} rounded-xl p-4 border transition-all duration-200 ${notification.isRead
                    ? `${cardBorder} ${cardRead}`
                    : `${cardUnread} border-2`
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification.type)}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${notification.isRead ? cardSubText : cardText}`}>{notification.title}</h4>
                          <p className={`${cardSubText} text-sm mb-2`}>{notification.body}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDate(notification.createdAt)}</span>
                            {!notification.isRead && (
                              <span className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs">
                                جديد
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-teal-400 hover:text-teal-300 text-sm"
                            >
                              تحديد كمقروء
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications; 
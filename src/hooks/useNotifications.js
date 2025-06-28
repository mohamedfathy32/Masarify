import { useState, useEffect } from 'react';
import { 
  requestNotificationPermission, 
  saveNotificationSettings, 
  getNotificationSettings,
  checkNotificationStatus,
  onNotificationMessage,
  sendBudgetNotification,
  sendMonthlyReminder,
  sendWeeklyReport,
  sendTransactionAlert,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadNotificationsCount
} from '../services/notificationService';

export const useNotifications = (userId) => {
  const [notificationStatus, setNotificationStatus] = useState("default");
  const [settings, setSettings] = useState({
    budgetThresholds: {
      "50": true,
      "80": true,
      "100": true
    },
    transactionAlerts: true,
    weeklyReport: true,
    monthlyReminder: true
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    console.log("تهيئة hook الإشعارات للمستخدم:", userId);

    const initializeNotifications = async () => {
      setLoading(true);
      try {
        // تحميل إعدادات الإشعارات
        await loadSettings();
        
        // تحميل الإشعارات وعدد الإشعارات غير المقروءة
        await Promise.all([
          loadNotifications(),
          loadUnreadCount()
        ]);
        
        // التحقق من حالة الإشعارات
        setNotificationStatus(checkNotificationStatus());
      } catch (error) {
        console.error("خطأ في تهيئة الإشعارات:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeNotifications();
    
    // مراقبة الإشعارات الواردة
    const unsubscribe = onNotificationMessage((payload) => {
      console.log("إشعار جديد:", payload);
      // تحديث العداد عند وصول إشعار جديد
      loadUnreadCount();
      // إعادة تحميل الإشعارات
      loadNotifications();
    });
    
    return () => unsubscribe();
  }, [userId]);

  const loadSettings = async () => {
    try {
      const userSettings = await getNotificationSettings(userId);
      if (userSettings) {
        setSettings(userSettings);
      }
    } catch (error) {
      console.error("خطأ في تحميل إعدادات الإشعارات:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      console.log("تحميل الإشعارات في hook للمستخدم:", userId);
      const userNotifications = await getUserNotifications(userId);
      console.log("تم تحميل الإشعارات في hook:", userNotifications.length);
      setNotifications(userNotifications);
    } catch (error) {
      console.error("خطأ في تحميل الإشعارات:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationsCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error("خطأ في تحميل عدد الإشعارات غير المقروءة:", error);
    }
  };

  const requestPermission = async () => {
    try {
      const token = await requestNotificationPermission(userId);
      if (token) {
        setNotificationStatus("granted");
        return true;
      } else {
        setNotificationStatus("denied");
        return false;
      }
    } catch (error) {
      console.error("خطأ في طلب إذن الإشعارات:", error);
      return false;
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await saveNotificationSettings(userId, newSettings);
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error("خطأ في حفظ إعدادات الإشعارات:", error);
      return false;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error("خطأ في تحديث حالة الإشعار:", error);
      return false;
    }
  };

  const deleteNotificationById = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      // تحديث العداد إذا كان الإشعار غير مقروء
      const deletedNotification = notifications.find(notif => notif.id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return true;
    } catch (error) {
      console.error("خطأ في حذف الإشعار:", error);
      return false;
    }
  };

  const deleteAllRead = async () => {
    try {
      await deleteReadNotifications(userId);
      setNotifications(prev => prev.filter(notif => !notif.isRead));
      return true;
    } catch (error) {
      console.error("خطأ في حذف الإشعارات المقروءة:", error);
      return false;
    }
  };

  const sendBudgetAlert = async (percentage, currentAmount, budgetAmount) => {
    return await sendBudgetNotification(userId, percentage, currentAmount, budgetAmount);
  };

  const sendMonthlyReminderAlert = async () => {
    return await sendMonthlyReminder(userId);
  };

  const sendWeeklyReportAlert = async (reportData) => {
    return await sendWeeklyReport(userId, reportData);
  };

  const sendTransactionAlertNotification = async (transaction) => {
    return await sendTransactionAlert(userId, transaction);
  };

  return {
    notificationStatus,
    settings,
    notifications,
    unreadCount,
    loading,
    requestPermission,
    updateSettings,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    deleteNotification: deleteNotificationById,
    deleteAllRead,
    sendBudgetAlert,
    sendMonthlyReminderAlert,
    sendWeeklyReportAlert,
    sendTransactionAlertNotification
  };
}; 
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../firebase";
import { doc, setDoc, getDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const messaging = getMessaging(app);

// دالة لطلب إذن الإشعارات وحفظ التوكن
export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BMzi7_6zWnts8fTg99pnK6R3DcXvJwvTjpF8EIuLNXq43ATLkpPQzOlQgevmuLhQPHrxNWIeaeF2r7S9FWZPIKQ" // ستحتاج لإضافة VAPID key من Firebase Console
      });
      
      if (token) {
        // حفظ التوكن في Firestore
        await setDoc(doc(db, "userTokens", userId), {
          token: token,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        return token;
      }
    }
    
    return null;
  } catch (error) {
    console.error("خطأ في طلب إذن الإشعارات:", error);
    return null;
  }
};

// دالة لحفظ إعدادات الإشعارات
export const saveNotificationSettings = async (userId, settings) => {
  try {
    await setDoc(doc(db, "notificationSettings", userId), {
      ...settings,
      userId: userId,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("خطأ في حفظ إعدادات الإشعارات:", error);
    return false;
  }
};

// دالة لجلب إعدادات الإشعارات
export const getNotificationSettings = async (userId) => {
  try {
    const docRef = doc(db, "notificationSettings", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // إعدادات افتراضية
      return {
        budgetThresholds: {
          "50": true,
          "80": true,
          "100": true
        },
        transactionAlerts: true,
        weeklyReport: true,
        monthlyReminder: true
      };
    }
  } catch (error) {
    console.error("خطأ في جلب إعدادات الإشعارات:", error);
    return null;
  }
};

// دالة لحفظ إشعار في Firestore
export const saveNotification = async (userId, notification) => {
  try {
    const notificationData = {
      userId: userId,
      title: notification.title,
      body: notification.body,
      type: notification.type || 'general',
      isRead: false,
      createdAt: new Date(),
      data: notification.data || {}
    };

    await addDoc(collection(db, "notifications"), notificationData);
    return true;
  } catch (error) {
    console.error("خطأ في حفظ الإشعار:", error);
    return false;
  }
};

// دالة لجلب إشعارات المستخدم
export const getUserNotifications = async (userId, limit = 50) => {
  try {
    console.log("جلب الإشعارات للمستخدم:", userId);
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    console.log("تم جلب الإشعارات:", notifications.length);
    return notifications.slice(0, limit);
  } catch (error) {
    console.error("خطأ في جلب الإشعارات:", error);
    return [];
  }
};

// دالة لتحديث حالة قراءة الإشعار
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      isRead: true,
      readAt: new Date()
    });
    return true;
  } catch (error) {
    console.error("خطأ في تحديث حالة الإشعار:", error);
    return false;
  }
};

// دالة لحذف إشعار
export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, "notifications", notificationId));
    return true;
  } catch (error) {
    console.error("خطأ في حذف الإشعار:", error);
    return false;
  }
};

// دالة لحذف جميع الإشعارات المقروءة
export const deleteReadNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("isRead", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return true;
  } catch (error) {
    console.error("خطأ في حذف الإشعارات المقروءة:", error);
    return false;
  }
};

// دالة لجلب عدد الإشعارات غير المقروءة
export const getUnreadNotificationsCount = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("isRead", "==", false)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("خطأ في جلب عدد الإشعارات غير المقروءة:", error);
    return 0;
  }
};

// دالة لإرسال إشعار محلي
export const sendLocalNotification = (title, body, icon = null) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
      tag: "masarify-notification"
    });
  }
};

// دالة لمراقبة الإشعارات الواردة
export const onNotificationMessage = (callback) => {
  return onMessage(messaging, (payload) => {
    console.log("إشعار ورد:", payload);
    
    // إظهار إشعار محلي
    if (payload.notification) {
      sendLocalNotification(
        payload.notification.title,
        payload.notification.body,
        payload.notification.icon
      );
    }
    
    // استدعاء الكولباك
    if (callback) {
      callback(payload);
    }
  });
};

// دالة للتحقق من حالة الإشعارات
export const checkNotificationStatus = () => {
  if (!("Notification" in window)) {
    return "not-supported";
  }
  
  if (Notification.permission === "granted") {
    return "granted";
  } else if (Notification.permission === "denied") {
    return "denied";
  } else {
    return "default";
  }
};

// دالة لإرسال إشعارات الميزانية
export const sendBudgetNotification = async (userId, percentage, currentAmount, budgetAmount) => {
  try {
    const settings = await getNotificationSettings(userId);
    
    if (settings?.budgetThresholds?.[percentage.toString()]) {
      const title = `تنبيه الميزانية - ${percentage}%`;
      const body = `لقد وصلت إلى ${percentage}% من ميزانيتك الشهرية. المتبقي: ${budgetAmount - currentAmount} ج.م`;
      
      // حفظ الإشعار في Firestore
      await saveNotification(userId, {
        title,
        body,
        type: 'budget-threshold',
        data: {
          percentage,
          currentAmount,
          budgetAmount,
          remaining: budgetAmount - currentAmount
        }
      });
      
      sendLocalNotification(title, body);
      
      // هنا يمكن إرسال إشعار للخادم لإرسال push notification
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: title,
          body: body,
          type: 'budget-threshold'
        })
      });
    }
  } catch (error) {
    console.error("خطأ في إرسال إشعار الميزانية:", error);
  }
};

// دالة لإرسال تذكير بداية الشهر
export const sendMonthlyReminder = async (userId) => {
  try {
    const settings = await getNotificationSettings(userId);
    
    if (settings?.monthlyReminder) {
      const title = "تذكير بداية الشهر";
      const body = "حان الوقت لإعداد ميزانيتك الشهرية الجديدة!";
      
      // حفظ الإشعار في Firestore
      await saveNotification(userId, {
        title,
        body,
        type: 'monthly-reminder'
      });
      
      sendLocalNotification(title, body);
    }
  } catch (error) {
    console.error("خطأ في إرسال تذكير الشهر:", error);
  }
};

// دالة لإرسال تقرير أسبوعي
export const sendWeeklyReport = async (userId, reportData) => {
  try {
    const settings = await getNotificationSettings(userId);
    
    if (settings?.weeklyReport) {
      const title = "التقرير الأسبوعي";
      const body = `إجمالي مصروفاتك هذا الأسبوع: ${reportData.totalExpenses} ج.م`;
      
      // حفظ الإشعار في Firestore
      await saveNotification(userId, {
        title,
        body,
        type: 'weekly-report',
        data: reportData
      });
      
      sendLocalNotification(title, body);
    }
  } catch (error) {
    console.error("خطأ في إرسال التقرير الأسبوعي:", error);
  }
};

// دالة لإرسال تنبيه المعاملات
export const sendTransactionAlert = async (userId, transaction) => {
  try {
    const settings = await getNotificationSettings(userId);
    
    if (settings?.transactionAlerts) {
      const title = "معاملة جديدة";
      const body = `تم إضافة معاملة جديدة: ${transaction.amount} ج.م - ${transaction.category}`;
      
      // حفظ الإشعار في Firestore
      await saveNotification(userId, {
        title,
        body,
        type: 'transaction-alert',
        data: transaction
      });
      
      sendLocalNotification(title, body);
    }
  } catch (error) {
    console.error("خطأ في إرسال تنبيه المعاملة:", error);
  }
}; 
// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// تكوين Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBxGQoB3JvNf1QZ8Q8Q8Q8Q8Q8Q8Q8Q8Q8",
  authDomain: "masarify.firebaseapp.com",
  projectId: "masarify",
  storageBucket: "masarify.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
});

const messaging = firebase.messaging();

// استقبال الإشعارات في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('إشعار ورد في الخلفية:', payload);

  const notificationTitle = payload.notification.title || 'Masarify';
  const notificationOptions = {
    body: payload.notification.body || 'إشعار جديد',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'masarify-notification',
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: 'فتح التطبيق'
      },
      {
        action: 'close',
        title: 'إغلاق'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// التعامل مع النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  console.log('تم النقر على الإشعار:', event);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // فتح التطبيق
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// التعامل مع إغلاق الإشعار
self.addEventListener('notificationclose', (event) => {
  console.log('تم إغلاق الإشعار:', event);
}); 
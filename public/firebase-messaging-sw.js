// Firebase Cloud Messaging Service Worker

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Note: In production, you should read these from a configuration endpoint
// For now, this service worker will be configured by the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_FIREBASE') {
    const firebaseConfig = event.data.config;
    
    try {
      firebase.initializeApp(firebaseConfig);
      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        
        const notificationTitle = payload.notification?.title || 'New Message';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new message',
          icon: payload.notification?.icon || '/vite.svg',
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
      });
    } catch (error) {
      console.error('Firebase initialization error in service worker:', error);
    }
  }
});

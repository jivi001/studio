// public/firebase-messaging-sw.js

// Scripts for Firebase products are imported in the HTML unless you are using a bundler
// (which Next.js is). In that case, you need to import them at the top of the service worker script.
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3xcXvM_M8mGIcFh6MTFiCxbZFizjyvqo",
  authDomain: "studio-2162039320-2fe37.firebaseapp.com",
  projectId: "studio-2162039320-2fe37",
  storageBucket: "studio-2162039320-2fe37.firebasestorage.app",
  messagingSenderId: "73384650168",
  appId: "1:73384650168:web:a0f4e8472d82dc9b669b4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// This listener handles messages received when the app is in the background or closed.
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optional: you can add an icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

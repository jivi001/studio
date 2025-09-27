// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

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
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // you can add a custom icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

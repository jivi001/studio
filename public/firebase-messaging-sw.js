// Import the Firebase app and messaging libraries
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';

// Get the configuration from the query string
const urlParams = new URLSearchParams(location.search);
const firebaseConfig = JSON.parse(decodeURIComponent(urlParams.get('firebaseConfig')));

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// This service worker is intentionally left blank. 
// Firebase will handle background notifications automatically
// as long as the SDK is initialized.

console.log('Firebase Messaging Service Worker initialized.');

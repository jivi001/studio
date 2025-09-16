// src/lib/fcm.ts
'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { db, messaging, getToken } from './firebase';

// =================================================================================================
// IMPORTANT! You MUST replace this placeholder with the key from your Firebase project.
// Go to Project Settings -> Cloud Messaging -> Web configuration.
// Click "Generate key pair" and copy the public key here.
const VAPID_KEY = 'BKFRTQjr4LqWEwFuT0TFJPO-NVmsiQW-7mDACzdU79bCzX2EVT1K5NE0w_8wY1VFPZ_jSYF3OBwTTAIeV5oIAdY';
// =================================================================================================


export const requestNotificationPermission = async (userId: string) => {
  if (!messaging) {
    console.log('Firebase Messaging is not available.');
    return;
  }
  
  if (VAPID_KEY === 'YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE') {
    console.error('ERROR: VAPID_KEY is not set in src/lib/fcm.ts. Notifications will not work.');
    return;
  }
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        // Save the token to the user's document in Firestore
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          fcmToken: fcmToken,
        });
        console.log('FCM token saved to Firestore.');
      } else {
        console.log('Can not get token. Ensure you have a firebase-messaging-sw.js file in your public directory.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while requesting notification permission. ', error);
  }
};

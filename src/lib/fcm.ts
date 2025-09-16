// src/lib/fcm.ts
'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { db, messaging, getToken } from './firebase';

export const requestNotificationPermission = async (userId: string) => {
  if (!messaging) {
    console.log('Firebase Messaging is not available.');
    return;
  }
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const fcmToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE' });
      
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        // Save the token to the user's document in Firestore
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          fcmToken: fcmToken,
        });
        console.log('FCM token saved to Firestore.');
      } else {
        console.log('Can not get token.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while requesting notification permission. ', error);
  }
};

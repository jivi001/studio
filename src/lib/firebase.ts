// src/lib/firebase.ts
'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3xcXvM_M8mGIcFh6MTFiCxbZFizjyvqo",
  authDomain: "studio-2162039320-2fe37.firebaseapp.com",
  projectId: "studio-2162039320-2fe37",
  storageBucket: "studio-2162039320-2fe37.firebasestorage.app",
  messagingSenderId: "73384650168",
  appId: "1:73384650168:web:a0f4e8472d82dc9b669b4d"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

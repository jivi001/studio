// src/lib/firebase.ts
'use client';

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "TODO: your api key",
  authDomain: "TODO: your auth domain",
  projectId: "TODO: your project id",
  storageBucket: "TODO: your storage bucket",
  messagingSenderId: "TODO: your messaging sender id",
  appId: "TODO: your app id"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFdIWFPRaAq73zvMH0rbQ1BD273YCOFSc",
  authDomain: "masarify-ffe12.firebaseapp.com",
  projectId: "masarify-ffe12",
  storageBucket: "masarify-ffe12.firebasestorage.app",
  messagingSenderId: "699610450319",
  appId: "1:699610450319:web:8958d8c8110e99d1e363fa",
  measurementId: "G-67PMBC3NQR"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };

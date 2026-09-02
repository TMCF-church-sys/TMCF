import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration template for TMCF Church Reconstruction Fund
// Replace with your Firebase project config keys when deploying, or use built-in REST API sync
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyTMCF-ChurchReconstruction-DemoKey",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tmcf-reconstruction.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tmcf-reconstruction",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tmcf-reconstruction.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "892019382901",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:892019382901:web:tmcfchurch12345"
};

let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization warning (using Cloud API fallback mode):", error.message);
}

export { app, db };

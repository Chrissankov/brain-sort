// Import the required Firebase modules from the SDK
import { initializeApp, getApps, getApp } from "firebase/app"; // Core app functionality
import { getAuth } from "firebase/auth"; // For authentication (login/signup)
import { getFirestore } from "firebase/firestore"; // For Firestore (real-time database)

// Firebase config values from the Firebase Console
// These should NOT be hardcoded in production — we'll use .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, // API key for Firebase project (non-null asserted)
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!, // Auth domain for Firebase Authentication
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!, // Realtime Database URL
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!, // Firebase project ID
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!, // Cloud Storage bucket name
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!, // FCM sender ID
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!, // Firebase app ID
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, // Firebase Analytics measurement ID
};

// Initialize Firebase app only once (check if already exists)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services (we’ll use these in our app)
const auth = getAuth(app); // Firebase Auth instance
const db = getFirestore(app); // Firestore DB instance

// Export so we can use them in other files
export { auth, db };

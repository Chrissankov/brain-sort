// Import the required Firebase modules

// initializeApp: Used to initialize your Firebase app using your project's config.
// getApps and getApp: Help avoid initializing Firebase multiple times.
// This is especially useful in frameworks like Next.js where components might reload.
import { initializeApp, getApps, getApp } from "firebase/app";

// getAuth: Gets the Firebase Authentication service instance.
import { getAuth } from "firebase/auth";

// getFirestore: Gets the Firebase Firestore (NoSQL database) instance.
import { getFirestore } from "firebase/firestore"; // For Firestore (real-time database)

// Firebase config values sourced from environment variables (Firebase Console)
// These should NOT be hardcoded in production — instead use environment variables (.env.local)
const firebaseConfig = {
  // The "!" is TypeScript's non-null assertion operator to assure these env variables exist.
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, // API key for Firebase project; required for client requests.
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!, // Auth domain for Firebase Authentication (e.g. your-project.firebaseapp.com).
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!, // URL of Firebase Realtime Database.
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!, // Unique Firebase project ID.
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!, // Cloud Storage bucket URL.
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!, // Used for push notifications via Firebase Cloud Messaging.
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!, // Unique app instance ID.
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, // For Firebase Analytics.
};

// Check if any Firebase apps are already initialized using getApps()
// If yes (getApps().length is true), reuse the existing app with getApp()
// Otherwise, initialize a new app using your firebaseConfig
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services using the app instance
const auth = getAuth(app); // Firebase Authentication service instance
const db = getFirestore(app); // Firestore database instance

// Export the initialized services so they can be imported elsewhere in your app
export { auth, db };

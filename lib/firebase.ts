// Import the required Firebase modules

// initializeApp: Used to initialize your Firebase app using your project's config.
// getApps and getApp: Help avoid initializing Firebase multiple times. Useful in frameworks like Next.js where components can reload.
import { initializeApp, getApps, getApp } from "firebase/app";

// getAuth: Gets the Firebase Authentication service instance.
import { getAuth } from "firebase/auth";

// getFirestore: Gets the Firebase Firestore (NoSQL database) instance.
import { getFirestore } from "firebase/firestore"; // For Firestore (real-time database)

// Firebase config values from the Firebase Console
// These should NOT be hardcoded in production — we'll use .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!, // Identifies your Firebase project. Needed for any requests from client-side code.
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!, // Domain used for Firebase Authentication. Usually project-id.firebaseapp.com.
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!, // URL to your Firebase Realtime Database.
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!, // Unique ID of your Firebase project.
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!, // URL of your Firebase Cloud Storage bucket.
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!, // Used for Firebase Cloud Messaging (notifications).
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!, // Unique ID for your Firebase app instance.
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!, // Used for Firebase Analytics.
};

// getApps() checks if any Firebase apps have already been initialized.
// If yes (getApps().length is true), reuse the existing app with getApp().
// If not, initialize a new app using your firebaseConfig.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Creates or gets the Firebase Authentication instance for your app.
const db = getFirestore(app); // Creates or gets the Firestore (real-time NoSQL database) instance.

// Export so we can import them in other files
export { auth, db };

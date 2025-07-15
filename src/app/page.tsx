// src/app/page.tsx

"use client"; // Tells Next.js this runs on the client-side (needed for hooks)

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust path if needed

export default function HomePage() {
  // Track status of Firebase connection
  const [firebaseStatus, setFirebaseStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [timeoutReached, setTimeoutReached] = useState(false); // Tracks if we hit the timeout

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true); // Show hint that it's taking longer than usual
    }, 5000); // 5-second timeout

    const testFirebase = async () => {
      try {
        // Try to get a collection from Firestore (doesn't have to exist)
        const snapshot = await getDocs(collection(db, "test"));
        setFirebaseStatus("success");
        clearTimeout(timeout); // Clear timeout on success
      } catch (error) {
        console.error("❌ Firebase test failed:", error);
        setFirebaseStatus("error");
        clearTimeout(timeout);
      }
    };

    testFirebase();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 sm:px-6 md:px-12">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          BrainSort 🧠
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mb-8">
          Turn your messy, scattered thoughts into structured goals and to-dos
          using AI.
        </p>

        {/* Firebase connection status */}
        {firebaseStatus === "loading" && (
          <div className="text-yellow-400 text-sm sm:text-base">
            🔄 Connecting to Firebase...
            {timeoutReached && (
              <div className="text-slate-400 mt-2">
                ⏳ Taking longer than usual. Check your internet or Firebase
                config.
              </div>
            )}
          </div>
        )}

        {firebaseStatus === "success" && (
          <div className="text-green-400 text-base font-medium">
            ✅ Firebase connected successfully!
          </div>
        )}

        {firebaseStatus === "error" && (
          <div className="text-red-400 text-base font-medium">
            ❌ Firebase failed to connect. Please check your config.
          </div>
        )}

        {/* CTA button */}
        <button
          disabled
          className="mt-10 w-full sm:w-auto bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-xl text-white text-lg shadow-md transition duration-200 disabled:opacity-80"
        >
          Start BrainSorting →
        </button>
      </div>
    </main>
  );
}

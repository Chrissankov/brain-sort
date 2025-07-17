// src/app/page.tsx

"use client"; // Tells Next.js that this page is a Client Component (needed for hooks).

// useEffect: Runs logic after the component mounts — perfect for async operations
// useState: Tracks local component state.
import { useEffect, useState } from "react";

// collection() & getDocs() are Firestore functions:
// collection(): to access certain collection in DB
// getDocs(): Fetches documents (if any) in that collection.
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust path if needed

// This is your main component that renders the homepage.
export default function HomePage() {
  // Track status of Firebase connection
  const [firebaseStatus, setFirebaseStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [timeoutReached, setTimeoutReached] = useState(false); // Tracks if we hit the timeout

  useEffect(() => {
    // 5-second timeout
    const timeout = setTimeout(() => {
      setTimeoutReached(true); // Show hint that it's taking longer than usual
    }, 5000);

    const testFirebase = async () => {
      try {
        // Calls getDocs() to attempt to read from a Firestore collection.
        const snapshot = await getDocs(collection(db, "test"));
        // Console logging the document(s) in the "test" collection
        console.log(snapshot.docs.map((doc) => doc.data()));
        // If successful → sets status to "success".
        setFirebaseStatus("success");
        // Clears the timeout after Firebase responds
        clearTimeout(timeout);
      } catch (error) {
        // Console logging the error
        console.error("❌ Firebase test failed:", error);
        // If it fails (e.g., bad config, offline) → sets status to "error".
        setFirebaseStatus("error");
        // Clears the timeout after Firebase responds
        clearTimeout(timeout);
      }
    };

    testFirebase();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white px-4 sm:px-6 md:px-12">
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
          <div className="text-yellow-400 text-base font-medium">
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
          className="mt-10 w-full sm:w-auto bg-sky-600 hover:bg-sky-800 px-6 py-3 rounded-xl text-white text-lg shadow-md transition duration-200 "
        >
          Start BrainSorting →
        </button>
      </div>
    </main>
  );
}

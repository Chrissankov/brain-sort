"use client"; // 🚨 This tells Next.js to render this file as a Client Component (required for using hooks like useEffect or useState)

// ✅ React hooks for managing state and lifecycle methods
import { useEffect, useState } from "react";

// ✅ Firebase Firestore functions to fetch documents from a collection
import { collection, getDocs } from "firebase/firestore";

// ✅ Import initialized Firestore database instance from your custom firebase config
import { db } from "../../lib/firebase";

// ✅ Next.js router for client-side navigation (i.e., without a full page reload)
import { useRouter } from "next/navigation";

// 🏠 Main component for the homepage
export default function HomePage() {
  // Create a router instance for programmatic navigation (e.g., redirecting)
  const router = useRouter();

  // 🔄 State to track Firebase connection status
  const [firebaseStatus, setFirebaseStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  // ⏱️ State to track if the Firebase check has taken more than 5 seconds
  const [timeoutReached, setTimeoutReached] = useState(false);

  // ⚙️ Runs on initial mount: used to test Firebase connection
  useEffect(() => {
    // ⏳ Start a timeout to show user feedback if Firebase takes too long
    const timeout = setTimeout(() => {
      setTimeoutReached(true); // Show "taking longer" hint
    }, 5000);

    // 🔥 Async function to test Firebase Firestore connectivity
    const testFirebase = async () => {
      try {
        // Try fetching all documents from the "test" collection
        const snapshot = await getDocs(collection(db, "test"));

        // Log each document’s data to the console (for debugging)
        console.log(snapshot.docs.map((doc) => doc.data()));

        // ✅ If successful, update connection status
        setFirebaseStatus("success");

        // 🧹 Clear the timeout once Firebase responds
        clearTimeout(timeout);
      } catch (error) {
        // ❌ Log the error (helps identify issues in config/network)
        console.error("❌ Firebase test failed:", error);

        // ❌ Update state to reflect failed connection
        setFirebaseStatus("error");

        // 🧹 Clear the timeout even if there was an error
        clearTimeout(timeout);
      }
    };

    // 🚀 Trigger the Firebase connection test
    testFirebase();
  }, []); // Empty dependency array = run once on component mount

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white px-4 sm:px-6 md:px-12">
      <div className="max-w-xl w-full text-center">
        {/* 🧠 App Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
          BrainSort 🧠
        </h1>

        {/* 💬 App description */}
        <p className="text-base sm:text-lg text-slate-300 mb-8">
          Turn your messy, scattered thoughts into structured goals and to-dos
          using AI.
        </p>

        {/* 🔄 Firebase connection status messages */}
        {firebaseStatus === "loading" && (
          <div className="text-yellow-400 text-base font-medium">
            🔄 Connecting to Firebase...
            {/* ⏳ Additional feedback if it's taking longer */}
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

        {/* 🚀 Call-to-action button to navigate to the "auth" page */}
        <button
          disabled={firebaseStatus !== "success"} // Disable until Firebase is ready
          onClick={() => router.push("auth")} // Navigate on click
          className={`mt-10 w-full sm:w-auto px-6 py-3 rounded-xl text-white text-lg shadow-md transition duration-200 ${
            firebaseStatus === "success"
              ? "bg-sky-600 hover:bg-sky-800" // Active state
              : "bg-sky-800" // Inactive (disabled) appearance
          }`}
        >
          Start BrainSorting →
        </button>
      </div>
    </main>
  );
}

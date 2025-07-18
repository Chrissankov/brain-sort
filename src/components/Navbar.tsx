"use client";
// Marks this as a Client Component, allowing React hooks and client-side interactivity

// Next.js router for client-side navigation without full page reload
import { useRouter } from "next/navigation";

// Firebase Auth function to sign out the user
import { signOut } from "firebase/auth";

// Your Firebase Auth instance
import { auth } from "../../lib/firebase";

// Lucide-react icon component for a modern logout icon
import { LogOut } from "lucide-react";

// Navbar component renders the top navigation bar with app branding and logout button
export default function Navbar() {
  // Initialize router for navigation
  const router = useRouter();

  // 🔓 Logout handler: signs out the user and redirects to login page
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Authentication
      router.push("/auth"); // Navigate user to the authentication page after logout
    } catch (error) {
      // Log any errors during sign out process
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="w-full bg-white shadow-md px-6 sm:px-8 md:px-20 lg:px-25 max-sm:py-4 py-6 flex items-center justify-between rounded-b-xl">
        {/* 🧠 App Logo or Name Section */}
        <div className="flex  items-center gap-2">
          {/* 🔷 Placeholder for optional brain icon or logo */}
          <span className="text-2xl font-extrabold text-gray-800 tracking-wide">
            Brain
            <span className="text-blue-600">Sort</span>{" "}
            {/* Styled part of the app name */}
          </span>
        </div>

        {/* 🚪 Logout Button Section */}
        <button
          onClick={handleLogout} // Trigger logout on click
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-sm transition duration-200 ease-in-out active:scale-95"
        >
          {/* Logout icon from Lucide */}
          <LogOut size={18} />
          {/* Logout label */}
          <span className="font-medium text-sm">Logout</span>
        </button>
      </nav>
    </>
  );
}

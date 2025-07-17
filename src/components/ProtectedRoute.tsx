"use client";
// 🟢 Marks this file as a Client Component, allowing use of React hooks and client-only APIs

// Next.js hook for client-side navigation without full page reload
import { useRouter } from "next/navigation";

// React hooks for managing component state and lifecycle
import { useEffect, useState } from "react";

// Firebase Auth listener to track authentication state changes
import { onAuthStateChanged } from "firebase/auth";

// Your Firebase Auth instance
import { auth } from "../../lib/firebase";

// Props interface defining that ProtectedRoute expects React children elements
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ProtectedRoute component restricts access to authenticated users only
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Instantiate router for client-side navigation
  const router = useRouter();

  // Local state to track if authentication check is still loading
  const [loading, setLoading] = useState(true);

  // Effect runs once when component mounts to listen for auth state changes
  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If no user is logged in, redirect to "/auth" page (login/signup)
      if (!user) {
        router.replace("/auth");
      } else {
        // If user is authenticated, stop loading and allow access
        setLoading(false);
      }
    });

    // Cleanup subscription on component unmount to avoid memory leaks
    return () => unsubscribe();
  }, [router]);

  // While checking authentication, show a loading message to the user
  if (loading)
    return <p className="text-center mt-20">Checking authentication...</p>;

  // Once authenticated, render the protected children components
  return <>{children}</>;
};

export default ProtectedRoute;

// "use client" directive tells Next.js this file runs on the client side
"use client";

// Import React hooks for state, side effects, and context
import { createContext, useContext, useEffect, useState } from "react";

// Import Firebase Auth functions and types
import {
  onAuthStateChanged, // Listener for auth state changes (login/logout)
  signInWithEmailAndPassword, // Function to log in users with email & password
  signOut, // Function to log out users
  createUserWithEmailAndPassword, // Function to create new users with email & password
  User, // Type representing a Firebase user object
} from "firebase/auth";

// Import your initialized Firebase auth instance from your config file
import { auth } from "../../lib/firebase";

// 🔒 Define the shape (interface) of the auth context data and methods
interface AuthContextType {
  currentUser: User | null; // The currently logged-in user or null if none
  login: (email: string, password: string) => Promise<void>; // Async login function
  signup: (email: string, password: string) => Promise<void>; // Async signup function
  logout: () => Promise<void>; // Async logout function
}

// 🎯 Create the React Context for authentication with initial undefined value
// This context will hold user info and auth methods
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ This component wraps parts of your app and provides auth state and functions
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Store the current user in local React state, initially null (no user)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ⏱️ On component mount, set up a listener to monitor user auth state changes
  useEffect(() => {
    // Listen to Firebase auth changes (login/logout), returns unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update local state whenever auth state changes
    });

    // Cleanup listener when this component unmounts to avoid memory leaks
    return () => unsubscribe();
  }, []); // Empty dependency array → run once on mount

  // 🔐 Async function to log in a user with email and password
  // It returns a Promise, so caller can await success or catch errors
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🧾 Async function to register a new user with email and password
  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // 🚪 Async function to log out the current user
  const logout = async () => {
    await signOut(auth);
  };

  // Render the context provider component
  // It makes currentUser and auth functions available to all children components
  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🌍 Custom React hook to easily consume the AuthContext in functional components
export const useAuth = () => {
  // Access the context value
  const context = useContext(AuthContext);

  // If context is undefined, that means useAuth was called outside an AuthProvider
  // So we throw an error to alert the developer
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Otherwise, return the context (user info and auth functions)
  return context;
};

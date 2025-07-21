"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "../../lib/firebase"; // Firebase config file

// 🔒 Define the shape of our auth context
interface AuthContextType {
  currentUser: User | null; // The current logged-in Firebase user
  login: (email: string, password: string) => Promise<void>; // Login function
  signup: (email: string, password: string) => Promise<void>; // Signup function
  logout: () => Promise<void>; // Logout function
}

// 🎯 Create the context with an initial empty value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider to wrap the app and supply auth functionality
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Store the user

  // ⏱️ Check if user is logged in on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // 🔐 Log in with Firebase
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // 🧾 Sign up with Firebase
  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // 🚪 Log out from Firebase
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🌍 Hook to access the auth context from components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

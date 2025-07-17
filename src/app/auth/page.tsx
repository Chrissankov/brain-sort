"use client";
// Marks this file as a Client Component, enabling React hooks like useState and useEffect

// React state hook for toggling between Login and Sign Up modes
import { useState } from "react";

// react-hook-form library for easy form state management and validation
import { useForm } from "react-hook-form";

// Firebase Authentication functions for login and signup
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

// Firebase Auth instance configured in your project
import { auth } from "../../../lib/firebase";

// Next.js router for client-side navigation (without full page reload)
import { useRouter } from "next/navigation";

// Define the expected structure of the form data
type FormData = {
  email: string;
  password: string;
  confirmPassword?: string; // Optional, used only during Sign Up
};

export default function AuthPage() {
  // Initialize Next.js router for navigation after login/signup
  const router = useRouter();

  // State to toggle between Login (true) and Sign Up (false)
  const [isLogin, setIsLogin] = useState(true);

  // Initialize react-hook-form with form state and validation handlers
  const {
    register, // Registers inputs to form state and validation rules
    handleSubmit, // Handles form submission
    watch, // Watches input values in real time
    formState: { errors }, // Holds form validation errors
  } = useForm<FormData>();

  // Watch password field value to validate confirmPassword matches
  const watchPassword = watch("password", "");

  // Form submission handler (login or signup)
  const onSubmit = async (data: FormData) => {
    const { email, password, confirmPassword } = data;

    try {
      if (isLogin) {
        // Login with email and password using Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);

        // Redirect to the main app page on successful login
        router.push("/brain");
      } else {
        // Additional password confirmation check before signup
        if (password !== confirmPassword) {
          return; // Abort if passwords do not match
        }

        // Create new user account with email and password
        await createUserWithEmailAndPassword(auth, email, password);

        // Redirect to main app after successful signup
        router.push("/brain");
      }
    } catch (error) {
      // Log any errors for debugging
      if (error instanceof Error) {
        console.error("Auth Error:", error.message);
      } else {
        console.error("Auth Error:", error);
      }
    }
  };

  return (
    // Full screen container with background gradient and centered content
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-4">
      {/* Form card container with white background and rounded corners */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Header with title and subtitle */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isLogin ? "Login" : "Sign Up"} to Sort Your Brain Goals 🧠
          </h2>
          <p className="text-slate-600">
            Organize your thoughts, tasks, and goals with ease.
          </p>
        </div>

        {/* Toggle buttons for switching between Login and Sign Up */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setIsLogin(true)} // Switch to Login mode
            className={`text-lg font-semibold transition ${
              isLogin
                ? "text-sky-600 border-b-2  border-sky-600" // Active styling
                : "text-gray-400" // Inactive styling
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)} // Switch to Sign Up mode
            className={`text-lg font-semibold transition ${
              !isLogin
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form for login/signup */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email input field */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              {...register("email", {
                required: "Email is required", // Required validation
                pattern: {
                  value: /^\S+@\S+$/i, // Basic email regex pattern
                  message: "Invalid email format", // Error message
                },
              })}
            />
            {/* Show email validation error */}
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input field */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg text-gray-700  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
              {...register("password", {
                required: "Password is required", // Required validation
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters", // Minimum length
                },
              })}
            />
            {/* Show password validation error */}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password input field (only shown during sign up) */}
          {!isLogin && (
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                {...register("confirmPassword", {
                  required: "Please confirm your password", // Required
                  validate: (value) =>
                    value === watchPassword || "Passwords do not match", // Must match password
                })}
              />
              {/* Show confirm password validation error */}
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

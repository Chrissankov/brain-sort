// Import global CSS styles that apply across the entire app
import { AuthProvider } from "../context/AuthContext"; // Provides authentication context to the app
import "./globals.css"; // Global CSS file imported once here, affects whole app

// Import the Metadata type from Next.js for typing the metadata object
import { Metadata } from "next";

//  Default metadata for all pages in the app
// This will be used to fill in the <head> section of every page automatically
export const metadata: Metadata = {
  // The default title shown in the browser tab for all pages
  title: "BrainSort",

  // A short description of the app — helps SEO and social media previews
  description: "Turn your chaotic thoughts into structured goals.",

  // Favicon setup — the icon shown in the browser tab
  icons: {
    icon: "./favicon.webp?v=3", // Path to your favicon image
  },
};

// The root layout component wraps every page in your app
// This is part of Next.js 13’s App Router feature, which supports layouts
export default function RootLayout({
  children, // `children` represent the nested content (pages, other layouts, components)
}: {
  children: React.ReactNode; // TypeScript type: children can be any React nodes
}) {
  return (
    // The root HTML element, setting the language to English for accessibility and SEO
    <html lang="en">
      {/* The body of the page */}
      <body>
        {/* 
          Wrap the entire app inside AuthProvider context so that any component
          can access authentication state and functions via React Context API 
        */}
        <AuthProvider>
          {children} {/* Render the page or nested layouts/components here */}
        </AuthProvider>
      </body>
    </html>
  );
}

// Import global CSS styles that apply across the entire app
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

// Import the Metadata type from Next.js for type safety
import { Metadata } from "next";

// 🧠 Default metadata for all pages
// This metadata is used by Next.js to populate the <head> section of every page
export const metadata: Metadata = {
  // The default title of the application, shown in the browser tab
  title: "BrainSort",

  // A short description of the app, useful for SEO and social sharing
  description: "Turn your chaotic thoughts into structured goals.",

  // Icon settings, used as the favicon for the site
  icons: {
    icon: "./favicon.webp?v=3",
  },
};

// The root layout component that wraps all pages in the application
// This is a special Next.js component used to define HTML structure
export default function RootLayout({
  children, // `children` is the nested content (i.e., the page or other layouts/components)
}: {
  children: React.ReactNode; // Type definition for `children` to ensure type safety
}) {
  return (
    // The root HTML tag with the language set to English
    <html lang="en">
      <body>
        {/* Render the nested components/pages inside the <body> */}
        <AuthProvider> {children}</AuthProvider>
      </body>
    </html>
  );
}

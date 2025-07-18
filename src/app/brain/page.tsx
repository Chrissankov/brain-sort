// 📦 Import the global Navbar component
import HeroSection from "@/components/Hero";
import Navbar from "@/components/Navbar";

// 🔐 Import the ProtectedRoute wrapper to restrict access to authenticated users
import ProtectedRoute from "@/components/ProtectedRoute";

// 🌟 Main component for the brain page
export default function BrainPage() {
  return (
    // ✅ Wrap the entire page with authentication protection
    <ProtectedRoute>
      <main className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <Navbar />
        <HeroSection />
      </main>
    </ProtectedRoute>
  );
}

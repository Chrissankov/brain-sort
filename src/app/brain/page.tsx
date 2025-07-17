import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function BrainPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
        <h1 className="text-4xl font-extrabold">Welcome to BrainSort!</h1>
        <p className="mt-4 text-lg max-w-xl text-center">
          Here is where you can organize your brain goals, tasks, and to-dos.
        </p>
        {/* TODO: Add BrainSorting app UI here */}
      </main>
    </ProtectedRoute>
  );
}

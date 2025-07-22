"use client"; // This component runs on the client side (needed for hooks and interactivity)

import { useState, useEffect } from "react"; // React hooks for state and lifecycle
import { Textarea } from "@/components/ui/textarea"; // Custom textarea UI component
import { Button } from "@/components/ui/button"; // Custom button UI component
import { CheckCircle2, Circle, Loader2 } from "lucide-react"; // Icons for UI feedback
import { db } from "../../lib/firebase"; // Your Firebase Firestore config
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"; // Firestore functions
import { useAuth } from "@/context/AuthContext"; // Hook to get current authenticated user

// Define the shape of each task in the checklist
interface Task {
  text: string; // The task text
  done: boolean; // Whether task is completed or not
}

export default function ClaritySection() {
  // User’s raw input from textarea (messy thoughts)
  const [rawInput, setRawInput] = useState("");

  // Loading indicator when waiting for AI or Firestore response
  const [isLoading, setIsLoading] = useState(false);

  // The array of tasks generated from AI or loaded from Firestore
  const [output, setOutput] = useState<Task[]>([]);

  // Error message string to show user feedback on failure
  const [error, setError] = useState("");

  // Get the currently logged-in Firebase user from context
  const { currentUser } = useAuth();

  // Load the saved checklist from Firestore when user logs in or component mounts
  useEffect(() => {
    async function loadChecklist() {
      if (!currentUser) return; // If no user logged in, skip loading

      try {
        // Reference to Firestore doc for this user's checklist
        const docRef = doc(db, "clarityChecklists", currentUser.uid);
        const docSnap = await getDoc(docRef);

        // If doc exists, set the checklist state to the saved tasks
        if (docSnap.exists()) {
          const savedChecklist = docSnap.data().checklist as Task[];
          setOutput(savedChecklist);
        }
      } catch (err) {
        console.error("Error loading checklist from Firestore:", err);
        setError("Failed to load saved checklist.");
      }
    }

    loadChecklist(); // Trigger loading checklist
  }, [currentUser]); // Runs when currentUser changes (login/logout)

  // Save the given checklist array to Firestore under the current user's doc
  const saveChecklist = async (checklist: Task[]) => {
    if (!currentUser) return; // Skip if no user

    try {
      const docRef = doc(db, "clarityChecklists", currentUser.uid);
      await setDoc(docRef, {
        checklist, // Save the checklist array
        timestamp: Date.now(), // Save current timestamp for reference
      });
    } catch (err) {
      console.error("Error saving checklist to Firestore:", err);
      setError("Failed to save checklist.");
    }
  };

  // Called when user clicks "Generate Clarity"
  // Sends rawInput to backend API to get AI-generated to-do list
  const handleGenerate = async () => {
    if (!rawInput.trim()) return; // Prevent empty submissions

    setIsLoading(true); // Show loading spinner
    setError(""); // Clear previous errors
    setOutput([]); // Clear previous tasks

    try {
      // Call your API endpoint with POST and JSON body containing rawInput
      const response = await fetch("/api/clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Expecting an array of strings in data.output or data.output.checklist
      const checklistArray: string[] = Array.isArray(data.output)
        ? data.output
        : data.output?.checklist;

      // If no valid checklist received, show error and stop
      if (!checklistArray || checklistArray.length === 0) {
        setError("No checklist returned from AI.");
        setIsLoading(false);
        return;
      }

      // Convert string array to Task objects with done=false initially
      const newChecklist: Task[] = checklistArray.map((task) => ({
        text: task,
        done: false,
      }));

      setOutput(newChecklist); // Display tasks in UI
      setRawInput(""); // Clear input box
      await saveChecklist(newChecklist); // Save to Firestore
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating your checklist.");
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Toggle completion status of a task when clicked and save updated list
  const toggleDone = async (index: number) => {
    // Copy output array to avoid direct mutation
    const updated = [...output];
    updated[index].done = !updated[index].done; // Flip done status
    setOutput(updated); // Update state immediately for UI responsiveness

    if (currentUser) {
      try {
        const docRef = doc(db, "clarityChecklists", currentUser.uid);
        // Save updated checklist to Firestore with timestamp
        await setDoc(docRef, {
          checklist: updated,
          timestamp: Date.now(),
        });
        console.log("Checklist saved successfully");
      } catch (error) {
        console.error("Error saving checklist:", error);
      }
    }
  };

  // Reset the checklist: clear UI and delete from Firestore
  const handleReset = async () => {
    setOutput([]); // Clear tasks in UI
    setError(""); // Clear errors

    if (currentUser) {
      console.log("Saving for user:", currentUser.uid);

      const docRef = doc(db, "clarityChecklists", currentUser.uid);

      // Overwrite with empty checklist first (optional but good practice)
      await setDoc(docRef, {
        checklist: [],
        timestamp: Date.now(),
      });

      try {
        // Delete the document completely from Firestore
        await deleteDoc(docRef);
      } catch (err) {
        console.error("Error deleting checklist:", err);
        setError("Failed to reset checklist.");
      }
    } else {
      console.log("No user logged in. Skipping save.");
      return;
    }
  };

  // UI JSX render starts here
  return (
    <section
      id="clarity"
      className="w-full px-6 md:px-20 py-20 text-white bg-gradient-to-b from-slate-900 to-slate-1500"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
        {/* Main title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          Turn Thoughts into Clarity 🧠
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-center text-gray-300 max-w-xl">
          Enter your messy thoughts below and we&apos;ll turn them into a
          powerful, actionable to-do list.
        </p>

        {/* Textarea input bound to rawInput state */}
        <Textarea
          placeholder="I want to start a business but I feel overwhelmed..."
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="mb-4 min-h-[120px] text-base"
          rows={6}
        />

        {/* Buttons container */}
        <div className="flex gap-3 mb-6">
          {/* Generate button: disabled if loading or no input */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !rawInput.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Generate Clarity"
            )}
          </Button>

          {/* Reset button only shown if there is an output */}
          {output.length > 0 && (
            <Button variant="secondary" onClick={handleReset}>
              Reset List
            </Button>
          )}
        </div>
      </div>

      {/* Show checklist tasks if any exist */}
      {output.length > 0 && (
        <div className="mt-10 w-full max-w-3xl mx-auto bg-slate-800/80 p-6 rounded-xl border border-gray-700 shadow-xl">
          <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-300">
            Your To-Do List ✅
          </h3>

          {/* List tasks */}
          <ul className="space-y-3">
            {output.map((task, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-3 rounded-md border cursor-pointer select-none ${
                  task.done
                    ? "bg-green-200 line-through text-green-700"
                    : "bg-gray-50 text-gray-900"
                }`}
                onClick={() => toggleDone(index)} // Clicking toggles done state
              >
                <span>{task.text}</span>
                {/* Show check icon if done, else empty circle */}
                {task.done ? (
                  <CheckCircle2 className="text-green-700 w-6 h-6" />
                ) : (
                  <Circle className="text-gray-400 w-6 h-6" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show error message if exists */}
      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
    </section>
  );
}

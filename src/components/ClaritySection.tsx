"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { db } from "../../lib/firebase"; // Your Firebase config
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"; // Firestore methods
import { useAuth } from "@/context/AuthContext"; // Your auth context to get currentUser

// Define Task type with text and done boolean
interface Task {
  text: string;
  done: boolean;
}

export default function ClaritySection() {
  // Raw user input string
  const [rawInput, setRawInput] = useState("");
  // Loading state while fetching AI output or saving/loading checklist
  const [isLoading, setIsLoading] = useState(false);
  // Array of tasks with done state
  const [output, setOutput] = useState<Task[]>([]);
  // Error message string for UI feedback
  const [error, setError] = useState("");
  // Current logged-in user info from context
  const { currentUser } = useAuth();

  // Load saved checklist from Firestore when user logs in / component mounts
  useEffect(() => {
    async function loadChecklist() {
      if (!currentUser) return; // no user, no loading

      try {
        const docRef = doc(db, "clarityChecklists", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const savedChecklist = docSnap.data().checklist as Task[];
          setOutput(savedChecklist);
        }
      } catch (err) {
        console.error("Error loading checklist from Firestore:", err);
        setError("Failed to load saved checklist.");
      }
    }

    loadChecklist();
  }, [currentUser]);

  // Save checklist to Firestore for current user
  const saveChecklist = async (checklist: Task[]) => {
    if (!currentUser) return;

    try {
      const docRef = doc(db, "clarityChecklists", currentUser.uid);
      await setDoc(docRef, {
        checklist,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Error saving checklist to Firestore:", err);
      setError("Failed to save checklist.");
    }
  };

  // Send raw input to backend → get AI-generated checklist tasks
  const handleGenerate = async () => {
    if (!rawInput.trim()) return; // Prevent empty input submission

    setIsLoading(true);
    setError("");
    setOutput([]); // Clear current output while generating

    try {
      const response = await fetch("/api/clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // data.output is expected to be an array of strings (tasks)
      const checklistArray: string[] = Array.isArray(data.output)
        ? data.output
        : data.output?.checklist;

      if (!checklistArray || checklistArray.length === 0) {
        setError("No checklist returned from AI.");
        setIsLoading(false);
        return;
      }

      // Convert array of strings to array of Tasks with done=false
      const newChecklist: Task[] = checklistArray.map((task) => ({
        text: task,
        done: false,
      }));

      setOutput(newChecklist); // Show new checklist
      setRawInput(""); // Clear input box
      await saveChecklist(newChecklist); // Save to Firestore
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating your checklist.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle task done/undone and save immediately
  const toggleDone = async (index: number) => {
    const updated = [...output];
    updated[index].done = !updated[index].done;
    setOutput(updated);

    if (currentUser) {
      try {
        const docRef = doc(db, "clarityChecklists", currentUser.uid);
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

  // Reset checklist in UI and Firestore
  const handleReset = async () => {
    setOutput([]); // Clear UI list
    setError("");
    if (currentUser) {
      console.log("Saving for user:", currentUser.uid);
      const docRef = doc(db, "clarityChecklists", currentUser.uid);
      await setDoc(docRef, {
        checklist: [],
        timestamp: Date.now(),
      });
    } else {
      console.log("No user logged in. Skipping save.");
      return;
    }

    try {
      const docRef = doc(db, "clarityChecklists", currentUser.uid);
      await deleteDoc(docRef); // Remove from Firestore
    } catch (err) {
      console.error("Error deleting checklist:", err);
      setError("Failed to reset checklist.");
    }
  };

  return (
    <section
      id="clarity"
      className="w-full px-6 md:px-20 py-20 text-white bg-gradient-to-b from-slate-900 to-slate-1500"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          Turn Thoughts into Clarity 🧠
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-center text-gray-300 max-w-xl">
          Enter your messy thoughts below and we&apos;ll turn them into a
          powerful, actionable to-do list.
        </p>

        {/* Input textarea */}
        <Textarea
          placeholder="I want to start a business but I feel overwhelmed..."
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="mb-4 min-h-[120px] text-base"
          rows={6}
        />

        {/* Buttons container */}
        <div className="flex gap-3 mb-6">
          {/* Generate Button */}
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

          {/* Reset Button - only show if output exists */}
          {output.length > 0 && (
            <Button variant="secondary" onClick={handleReset}>
              Reset List
            </Button>
          )}
        </div>
      </div>

      {/* Display checklist if exists */}
      {output.length > 0 && (
        <div className="mt-10 w-full max-w-3xl mx-auto bg-slate-800/80 p-6 rounded-xl border border-gray-700 shadow-xl">
          <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-300">
            Your To-Do List ✅
          </h3>
          <ul className="space-y-3">
            {output.map((task, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-3 rounded-md border cursor-pointer select-none ${
                  task.done
                    ? "bg-green-200 line-through text-green-700"
                    : "bg-gray-50 text-gray-900"
                }`}
                onClick={() => toggleDone(index)} // Toggle on entire list item click
              >
                <span>{task.text}</span>
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

      {/* Display error message */}
      {error && <p className="text-red-400 text-center mt-4">{error}</p>}
    </section>
  );
}

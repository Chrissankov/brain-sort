// components/ClaritySection.tsx

"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import openai from "../../lib/gemini";
import { db } from "../../lib/firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext"; // Make sure you have a context providing user auth
import { v4 as uuidv4 } from "uuid";

export default function ClaritySection() {
  interface ClarityOutput {
    goals: string[];
    tasks: string[];
    steps: {
      goal: string;
      steps: string[];
    }[];
  }

  const { currentUser } = useAuth(); // Get the current user (from Firebase Auth)
  const [rawInput, setRawInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<ClarityOutput | null>(null);
  const [error, setError] = useState("");

  // 🧠 Handle the logic to call OpenAI API and transform the input
  async function handleGenerate() {
    if (!rawInput.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      if (data.output) {
        setOutput(data.output);
      } else {
        setError("No structured data returned.");
      }

      setRawInput("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating clarity.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      id="clarity"
      className="w-full px-6 md:px-20 py-20 text-white bg-slate-900"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Turn Thoughts into Clarity 🧠
        </h2>
        <p className="text-lg text-center text-gray-300 max-w-xl">
          Enter your messy thoughts below, and we’ll turn them into a roadmap of
          goals, tasks, and steps.
        </p>

        {/* 📝 Input Textarea */}
        <Textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="I want to build a personal website but don’t know where to start..."
          rows={6}
          className="w-full max-w-2xl bg-slate-800 border border-gray-600 text-white"
        />

        {/* 🚀 Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !rawInput.trim()}
        >
          {isLoading ? "Generating..." : "Generate Clarity"}
        </Button>

        {/* ⚠️ Error Message */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* ✅ Output Display */}
        {output && (
          <div className="mt-10 w-full max-w-3xl bg-slate-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4">Your Roadmap</h3>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2 text-green-400">
                Goals:
              </h4>
              <ul className="list-disc ml-6 text-gray-200">
                {output.goals?.map((goal: string, idx: number) => (
                  <li key={idx}>{goal}</li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2 text-yellow-400">
                Tasks:
              </h4>
              <ul className="list-disc ml-6 text-gray-200">
                {output.tasks?.map((task: string, idx: number) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-2 text-blue-400">
                Steps:
              </h4>
              {output.steps?.map((section, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-semibold text-gray-300">{section.goal}</p>
                  <ul className="list-disc ml-6 text-gray-200">
                    {section.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ClaritySection() {
  interface ClarityOutput {
    checklist: string[];
  }

  const [rawInput, setRawInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<ClarityOutput | null>(null);
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  // ✅ Handle checkbox toggling
  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(idx) ? newSet.delete(idx) : newSet.add(idx);
      return newSet;
    });
  };

  // 🧠 Handle generating clarity
  async function handleGenerate() {
    if (!rawInput.trim()) return;

    setIsLoading(true);
    setError("");
    setOutput(null);
    setCheckedItems(new Set());

    try {
      const response = await fetch("/api/clarity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawInput }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const checklistArray = Array.isArray(data.output)
        ? data.output
        : data.output.checklist;

      if (checklistArray?.length) {
        setOutput({ checklist: checklistArray });
        setRawInput("");
      } else {
        setError("No checklist returned.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while generating your checklist.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section
      id="clarity"
      className="w-full px-6 md:px-20 py-20 text-white bg-gradient-to-b from-slate-900 to-slate-1500"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6 items-center">
        <h2 className="text-4xl md:text-5xl font-bold text-center">
          Turn Thoughts into Clarity 🧠
        </h2>

        <p className="text-lg text-center text-gray-300 max-w-xl">
          Enter your messy thoughts below and we&apos;ll turn them into a
          powerful, actionable to-do list.
        </p>

        {/* Input Textarea */}
        <Textarea
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="Ex: I want to launch my side project but don't know how to start..."
          rows={6}
          className="w-full max-w-2xl bg-slate-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
        />

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !rawInput.trim()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Clarity"
          )}
        </Button>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

        {/* Output Checklist */}
        {output?.checklist && (
          <div className="mt-10 w-full max-w-3xl bg-slate-800/80 p-6 rounded-xl border border-gray-700 shadow-xl">
            <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-300">
              Your To-Do List ✅
            </h3>
            <ul className="space-y-3">
              {output.checklist.map((item, idx) => (
                <li
                  key={idx}
                  className={`flex items-center gap-3 bg-slate-900/60 px-4 py-3 rounded-lg hover:bg-slate-800 transition-all ${
                    checkedItems.has(idx)
                      ? "line-through text-green-400"
                      : "text-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems.has(idx)}
                    onChange={() => toggleCheck(idx)}
                    className="accent-green-500 w-5 h-5"
                  />
                  <span className="flex-1">{item}</span>
                  {checkedItems.has(idx) && (
                    <CheckCircle2 className="text-green-400 w-5 h-5" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// app/api/clarity/route.ts

import { NextRequest, NextResponse } from "next/server"; // Server functions
import genAI from "../../../../lib/gemini"; // Gemini client (set up separately in /lib)

export async function POST(req: NextRequest) {
  try {
    const { rawInput } = await req.json(); // Get user input from body

    // Set up Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // Lightweight, fast model
    });

    // 🧠 Prompt engineering: instruct Gemini how to respond
    const prompt = `
You are an AI assistant that helps people turn messy thoughts into short, clear, and actionable to-do items.

Input:
${rawInput}

Output Format:
- Respond with 5–7 short bullet points only.
- Each item should start with a verb and be easy to act on.
- Respond only with a JSON array of strings like:
[
  "Define your fitness goal",
  "Create a weekly workout plan",
  "Buy healthy groceries",
  "Start tracking your progress"
]
`;

    // Send the structured prompt to Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const rawText = response.text(); // Extract raw string response

    // ✂️ Clean and parse the AI response
    const cleaned = (await rawText)
      .replace(/```json|```/g, "") // Remove markdown JSON code blocks
      .replace(/\/\/.*$/gm, "") // Remove comments
      .replace(/,\s*([}\]])/g, "$1"); // Remove trailing commas

    const parsed = JSON.parse(cleaned); // Convert string to JSON array

    return NextResponse.json({ output: parsed }); // ✅ Return as JSON
  } catch (error: unknown) {
    console.error("Error in Gemini route:", error);

    const message =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "Unknown error";

    return NextResponse.json(
      { error: "Gemini AI failed", details: message },
      { status: 500 }
    );
  }
}

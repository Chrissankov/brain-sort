// app/api/clarity/route.ts
import { NextRequest, NextResponse } from "next/server";
import genAI from "../../../../lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { rawInput } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert productivity mentor and goal-setting coach.
Take raw, chaotic, unstructured thoughts and return this JSON only (no code blocks, no comments, no markdown):

{
  "goals": [ "clear goal 1", "clear goal 2", ... ],
  "tasks": [ "task 1 related to goals", "task 2...", ... ],
  "steps": [
    {
      "goal": "related goal",
      "steps": [ "step 1", "step 2", ... ]
    }
  ]
}

Tone: Friendly, clear, supportive, and action-oriented.
Input: "${rawInput}"
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const rawText = response.text();

    const cleaned = (await rawText)
      .replace(/```json|```/g, "") // remove code block tags
      .replace(/\/\/.*$/gm, "") // remove comments if any
      .replace(/,\s*([}\]])/g, "$1"); // remove trailing commas

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ output: parsed });
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

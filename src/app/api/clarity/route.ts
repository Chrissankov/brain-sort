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

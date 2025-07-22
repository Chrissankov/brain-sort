// Importing types and utilities from Next.js for handling API routes
import { NextRequest, NextResponse } from "next/server";

// Importing the Gemini AI client (configured in your /lib/gemini.ts file)
import genAI from "../../../../lib/gemini";

// Define an asynchronous function to handle POST requests to this API route
export async function POST(req: NextRequest) {
  try {
    // Extract the rawInput field from the JSON body of the incoming request
    // This is the user's messy text/thoughts sent from the frontend
    const { rawInput } = await req.json();

    // 🧠 Set up the Gemini model (using a lightweight and fast version)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // You can switch to another model if needed (like gemini-pro)
    });

    // 🧩 Construct a prompt that tells the AI *exactly* what we want
    // This is a technique called prompt engineering: giving AI a clear task and format
    const prompt = `
You are an AI assistant that transforms messy, vague, or unstructured thoughts into clear and highly specific to-do items.

Your goal is to:
- Extract 5–7 concrete action steps the user can take immediately.
- Make each task specific, short, and easy to understand without further explanation.

Rules for the output:
- Each item must start with a strong action verb (e.g. "Email", "Buy", "Schedule", "Write", "Call", "Clean").
- Avoid vague terms like "start", "try", "improve", or "think about".
- Focus on actions that can actually be done.
- Do not include explanations, notes, or headings.
- Respond only with a valid JSON array of strings.

Example Input:
I need to get in shape, and my apartment is a mess. I’ve been meaning to reconnect with John too, and I have that big team presentation coming up Monday. Also, I keep forgetting to order more dog food.

Example Output:
[
  "Look up local gyms and pick one to visit this week",
  "Buy a 15lb kettlebell and resistance bands on Amazon",
  "Spend 30 minutes cleaning the kitchen and living room tonight",
  "Text John to suggest catching up over coffee this weekend",
  "Write a rough outline for Monday's team presentation",
  "Order a 30lb bag of dog food from your usual pet store"
]

Now process the following input:

Input:
${rawInput}
`;

    // Send the prompt to the Gemini model
    const result = await model.generateContent({
      // We simulate a conversation where the user is giving a prompt
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Extract the raw text response from Gemini
    const response = result.response;
    const rawText = response.text(); // This returns a Promise<string>

    // Clean up the response text so it's safe to parse into JSON
    const cleaned = rawText
      // Remove any ```json or ``` from markdown-style code blocks
      .replace(/```json|```/g, "")
      // Remove inline comments that might exist in the JSON
      .replace(/\/\/.*$/gm, "")
      // Remove any trailing commas in arrays/objects (which would cause JSON.parse to fail)
      .replace(/,\s*([}\]])/g, "$1");

    // Convert the cleaned string into a real JavaScript array
    const parsed = JSON.parse(cleaned);

    // Return the structured to-do items as JSON back to the frontend
    return NextResponse.json({ output: parsed });
  } catch (error: unknown) {
    // Catch any error that happens during the process and log it for debugging
    console.error("Error in Gemini route:", error);

    // Extract a useful error message from the unknown error object
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "Unknown error"; // fallback if we can't find the message

    // Return an error response to the frontend with status 500 (internal server error)
    return NextResponse.json(
      { error: "Gemini AI failed", details: message },
      { status: 500 }
    );
  }
}

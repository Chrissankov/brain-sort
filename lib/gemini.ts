// Import the Gemini SDK from the Google Generative AI package
// This gives us access to the Gemini models like gemini-1.5, gemini-pro, etc.
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a new instance of the Gemini client using your API key
// The `!` tells TypeScript: "trust me, this variable is definitely defined"
// `NEXT_PUBLIC_GEMINI_API_KEY` should be stored in your `.env.local` file
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

// Export the Gemini client so it can be used in other parts of the app
// For example, we use it in /api/clarity/route.ts
export default genAI;

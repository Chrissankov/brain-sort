// components/HeroSection.tsx

// 🧠 Import Spline 3D scene viewer for cool visual interactions
import Spline from "@splinetool/react-spline/next";

import { FaFlagCheckered } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="w-full  flex flex-col items-center md:flex-row px-10 md:px-20 lg:px-25 py-20   gap-12">
      {/* 🔵 Left: Text content */}
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Welcome to BrainSort!
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-md">
          Organize your chaotic thoughts into structured goals, tasks, and
          to-dos — powered by AI.
        </p>

        {/* 🚩 Flag CTA button to scroll to Main Purpose section */}
        <a
          href="#clarity"
          className="inline-flex items-center justify-center gap-2 mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg rounded-xl transition duration-300"
        >
          <FaFlagCheckered className="text-xl" />
          Begin Your Journey
        </a>
      </div>

      {/* 🧠 Right: Spline animation */}
      <div className="md:w-1/2 w-full h-[400px] sm:h-[500px] md:h-[600px]">
        <Spline scene="https://prod.spline.design/iJqL7wai15T-TW8j/scene.splinecode" />
      </div>
    </section>
  );
}

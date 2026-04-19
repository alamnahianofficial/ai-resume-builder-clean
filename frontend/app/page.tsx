"use client";

import { useState } from "react";

export default function Builder() {
  const [step, setStep] = useState(0);

  const steps = ["Personal", "Education", "Experience", "Preview"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-8 text-center tracking-tight">
          AI Resume Builder
        </h1>

        {/* Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((label, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                i === step
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white/10 text-zinc-300"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-zinc-400"
            placeholder="Full Name"
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-zinc-400"
            placeholder="Email"
          />
        </div>

        {/* Button */}
        <button
          onClick={() => setStep(step + 1)}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition-transform font-medium shadow-lg"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

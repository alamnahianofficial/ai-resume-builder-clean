"use client";

import { useState } from "react";

export default function Builder() {
  const [step, setStep] = useState<number>(0);

  const steps = ["Personal", "Education", "Experience", "Preview"];

  const nextStep = () => {
    setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          AI Resume Builder
        </h1>

        {/* Step Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {steps.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              type="button"
              className={`px-3 py-2 text-sm rounded-full transition ${
                i === step
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-zinc-300 hover:bg-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* STEP CONTENT */}
        <div className="space-y-4">
          {step === 0 && (
            <>
              <input
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full Name"
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Email"
              />
            </>
          )}

          {step === 1 && (
            <>
              <input
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                placeholder="University"
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                placeholder="Degree"
              />
            </>
          )}

          {step === 2 && (
            <>
              <input
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                placeholder="Company"
              />
              <input
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                placeholder="Role"
              />
            </>
          )}

          {step === 3 && (
            <div className="text-center text-zinc-400 py-8">
              Resume Preview Coming Soon 🚀
            </div>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0}
            className="w-full py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40"
          >
            Back
          </button>

          <button
            type="button"
            onClick={nextStep}
            disabled={step === steps.length - 1}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02] transition-transform disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

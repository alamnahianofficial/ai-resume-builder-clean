"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function StepIndicator() {
  const { step } = useResumeStore();

  const steps = ["Personal", "Education", "Experience", "Preview"];

  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`px-4 py-2 rounded-full text-sm ${
            step === i + 1 ? "bg-black text-white" : "bg-gray-200"
          }`}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

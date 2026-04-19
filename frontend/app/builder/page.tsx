"use client";

import { useState } from "react";

export default function Builder() {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    degree: "",
    company: "",
    role: "",
  });

  const steps = ["Personal", "Education", "Experience", "Preview"];

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
          AI Resume Builder
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {steps.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              type="button"
              className={`px-3 py-2 text-sm rounded-full transition ${
                i === step
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT - FORM */}
          <div className="space-y-4">
            {step === 0 && (
              <>
                <input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                  placeholder="Full Name"
                />
                <input
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                  placeholder="Email"
                />
              </>
            )}

            {step === 1 && (
              <>
                <input
                  value={formData.university}
                  onChange={(e) => handleChange("university", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                  placeholder="University"
                />
                <input
                  value={formData.degree}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                  placeholder="Degree"
                />
              </>
            )}

            {step === 2 && (
              <>
                <input
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                  placeholder="Company"
                />
                <input
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                  placeholder="Role"
                />
              </>
            )}

            {step === 3 && (
              <div className="text-zinc-400 text-center py-10">
                Review your resume →
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={prevStep}
                className="w-full py-3 rounded-xl bg-zinc-700"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                Next →
              </button>
            </div>
          </div>

          {/* RIGHT - LIVE PREVIEW */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl min-h-[400px]">
            <h2 className="text-2xl font-bold mb-2">
              {formData.name || "Your Name"}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {formData.email || "email@example.com"}
            </p>

            <div className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">Education</h3>
              <p className="text-sm">
                {formData.degree || "Degree"} <br />
                {formData.university || "University"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold border-b pb-1 mb-2">Experience</h3>
              <p className="text-sm">
                {formData.role || "Role"} <br />
                {formData.company || "Company"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

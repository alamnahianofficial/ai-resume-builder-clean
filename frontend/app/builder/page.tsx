"use client";
import React, { useState } from "react";
import StandardCV from "@/components/StandardCV";
import { motion, AnimatePresence } from "framer-motion";

export default function BuilderPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: [{ company: "", role: "", duration: "", bullets: [""] }],
    education: [{ school: "", degree: "", year: "" }],
    skills: [""],
  });

  const steps = ["Contact", "Education", "Experience", "Skills", "Preview"];

  const handleAIImprove = async () => {
    setLoading(true);
    try {
      // Connects to your Render Backend
      const res = await fetch(
        "https://your-backend.onrender.com/api/ai/improve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resume),
        },
      );
      const data = await res.json();
      if (data.improved_data) setResume(data.improved_data);
    } catch (e) {
      console.error("AI Error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: Input Form */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
          <div className="flex justify-between mb-8 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <span
                key={i}
                className={`text-xs uppercase tracking-widest font-bold ${i === step ? "text-blue-500" : "text-zinc-600"}`}
              >
                {s}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Personal Info</h2>
                  <input
                    className="w-full bg-black/20 border border-white/10 p-3 rounded-lg"
                    placeholder="Full Name"
                    onChange={(e) =>
                      setResume({ ...resume, full_name: e.target.value })
                    }
                  />
                  <input
                    className="w-full bg-black/20 border border-white/10 p-3 rounded-lg"
                    placeholder="Email"
                    onChange={(e) =>
                      setResume({ ...resume, email: e.target.value })
                    }
                  />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Experience</h2>
                  <button
                    onClick={handleAIImprove}
                    disabled={loading}
                    className="w-full bg-indigo-600 p-3 rounded-xl font-bold mb-4"
                  >
                    {loading
                      ? "AI is rewriting..."
                      : "✨ Enhance Experience with AI"}
                  </button>
                  <p className="text-zinc-500 text-sm">
                    Add your roles below to let AI optimize them.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 mt-10">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-white/10 p-3 rounded-xl"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              className="flex-2 bg-blue-600 p-3 rounded-xl font-bold"
            >
              {step === steps.length - 1 ? "Finish" : "Next →"}
            </button>
          </div>
        </div>

        {/* RIGHT: Live Preview (Times New Roman) */}
        <div className="hidden lg:block sticky top-10">
          <StandardCV data={resume} />
        </div>
      </div>
    </div>
  );
}

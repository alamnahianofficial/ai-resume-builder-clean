"use client";

import { useState } from "react";
import StandardCV from "@/components/StandardCV";
import { motion, AnimatePresence } from "framer-motion";

export default function Builder() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: [{ company: "", role: "", duration: "", bullets: "" }],
    education: [{ school: "", degree: "", year: "" }],
    skills: "",
  });

  const steps = ["Personal", "Education", "Experience", "Skills", "Preview"];

  const handleNext = () =>
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleAIImprove = async () => {
    setLoading(true);
    try {
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
      console.error("AI Error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FORM SIDE */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-fit">
          <div className="flex justify-between mb-8 overflow-x-auto gap-4">
            {steps.map((label, i) => (
              <div
                key={i}
                className={`text-xs font-bold uppercase tracking-widest ${i === step ? "text-blue-500" : "text-zinc-600"}`}
              >
                {label}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Personal Details</h2>
                  <input
                    className="input"
                    placeholder="Full Name"
                    onChange={(e) =>
                      setResume({ ...resume, full_name: e.target.value })
                    }
                  />
                  <input
                    className="input"
                    placeholder="Email"
                    onChange={(e) =>
                      setResume({ ...resume, email: e.target.value })
                    }
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Work Experience</h2>
                  <textarea
                    className="input h-32"
                    placeholder="Describe your role..."
                    onChange={(e) => {
                      let newExp = [...resume.experience];
                      newExp[0].bullets = e.target.value;
                      setResume({ ...resume, experience: newExp });
                    }}
                  />
                  <button
                    onClick={handleAIImprove}
                    disabled={loading}
                    className="btn"
                  >
                    {loading ? "AI is rewriting..." : "✨ Enhance with AI"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 mt-8">
            {step > 0 && (
              <button onClick={handleBack} className="btn-secondary">
                Back
              </button>
            )}
            <button onClick={handleNext} className="btn">
              {step === steps.length - 1 ? "Download PDF" : "Next →"}
            </button>
          </div>
        </div>

        {/* PREVIEW SIDE */}
        <div className="sticky top-10">
          <StandardCV data={resume} />
        </div>
      </div>
    </div>
  );
}

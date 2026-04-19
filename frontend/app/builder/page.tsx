"use client";
import React, { useState } from "react";
import StandardCV from "@/components/StandardCV";
import { motion } from "framer-motion";

// Interface to fix TypeScript "any" errors
export interface ResumeData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    location: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  skills: string[];
}

export default function BuilderPage() {
  const [resume, setResume] = useState<ResumeData>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: [],
    education: [],
    skills: [],
  });

  const [loading, setLoading] = useState(false);

  const handleAIImprove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      const data = await res.json();
      if (data.improved_data) {
        setResume(data.improved_data);
      }
    } catch (e) {
      console.error("AI Error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Left: Input Panel */}
        <div className="w-full lg:w-1/2 overflow-y-auto p-6 lg:p-12 border-r border-slate-800">
          <header className="mb-12">
            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-slate-500 bg-clip-text text-transparent">
              Resume Intelligence
            </h1>
            <p className="text-slate-500 mt-2">
              Craft a high-performance career document.
            </p>
          </header>

          <div className="space-y-8">
            <section className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-4 tracking-widest">
                General Info
              </label>
              <input
                className="w-full bg-transparent border-b border-slate-700 py-2 focus:border-indigo-500 outline-none transition-all"
                placeholder="Full Name"
                value={resume.full_name}
                onChange={(e) =>
                  setResume({ ...resume, full_name: e.target.value })
                }
              />
            </section>

            <button
              onClick={handleAIImprove}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
            >
              {loading ? "Optimizing..." : "✨ Enhance with AI"}
            </button>
          </div>
        </div>

        {/* Right: Preview Panel */}
        <div className="hidden lg:flex w-1/2 bg-slate-950 items-start justify-center p-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full shadow-2xl"
          >
            <StandardCV data={resume} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

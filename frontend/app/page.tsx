"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        <div className="text-xl font-black tracking-tighter flex items-center gap-2 italic text-blue-500">
          CV DADA
        </div>
        <Link
          href="/builder"
          className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition"
        >
          Build Now
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 inline-block">
            Intelligence in every bullet point
          </span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 max-w-5xl leading-[1.05]">
            Land your dream job with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              CV DADA.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop fighting with formatting. Build a professional, ATS-friendly CV
            in minutes — download as PDF or DOCX instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/builder"
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
            >
              Build Your CV — Free
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Visual Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mt-24 w-full max-w-6xl aspect-[16/9] bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-3xl"
        >
          <div className="w-full h-full bg-[#0B0F1A]/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center gap-4">
            <p className="text-blue-500 font-black italic text-4xl tracking-tighter">
              CV DADA
            </p>
            <p className="text-zinc-600 font-mono text-sm">
              Your professional CV, ready in minutes.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

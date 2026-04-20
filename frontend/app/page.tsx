"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sparkles size={20} />,
    title: "AI-Powered Writing",
    desc: "One click rewrites your experience into sharp, recruiter-approved bullet points.",
  },
  {
    icon: <FileText size={20} />,
    title: "PDF & DOCX Export",
    desc: "Download clean, printable A4 files that pass ATS scanners instantly.",
  },
  {
    icon: <Zap size={20} />,
    title: "Live Preview",
    desc: "See every change reflected in real-time on a pixel-perfect A4 canvas.",
  },
  {
    icon: <CheckCircle size={20} />,
    title: "ATS Friendly",
    desc: "Times New Roman, clean hierarchy, no tables — built for modern ATS systems.",
  },
];

const STEPS = [
  {
    n: "01",
    label: "Fill your details",
    desc: "Enter your education, experience, skills, and projects in the structured editor.",
  },
  {
    n: "02",
    label: "AI improvement",
    desc: "Hit the AI button on any section and watch it rewrite with professional language.",
  },
  {
    n: "03",
    label: "Download & apply",
    desc: "Export to PDF or DOCX and submit with confidence.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] bg-blue-700/8 blur-[140px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] bg-indigo-700/8 blur-[140px] rounded-full" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-cyan-700/5 blur-[100px] rounded-full" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <span className="text-2xl font-black text-blue-500 italic tracking-tighter">
          CV DADA
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-slate-500 font-semibold uppercase tracking-widest">
            Free · No signup
          </span>
          <Link
            href="/builder"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Start Building →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
            ✦ AI-Powered · ATS-Ready · Free
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.02] mb-6 max-w-5xl">
            Build a CV that
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              actually gets read.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional, ATS-friendly CVs in minutes. AI rewrites your
            experience. Export to PDF or DOCX. No account required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/builder"
              className="group px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-600/25 flex items-center gap-2"
            >
              Build My CV — Free
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <CheckCircle size={14} className="text-emerald-500" />
              No sign-up · No watermark · No limits
            </div>
          </div>
        </motion.div>

        {/* ── MOCK PREVIEW CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-20 w-full max-w-4xl"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/60">
            {/* Browser chrome */}
            <div className="bg-[#0d1117] px-4 py-3 flex items-center gap-2 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="ml-4 flex-1 bg-white/5 rounded-md h-5 max-w-xs text-[10px] text-slate-600 flex items-center px-3">
                cvdada.app/builder
              </div>
            </div>
            {/* App preview */}
            <div className="bg-[#080d14] flex" style={{ height: 320 }}>
              {/* Editor side */}
              <div className="w-1/2 border-r border-white/5 p-5 space-y-3">
                {["Full Name", "Email Address", "Phone Number"].map((ph) => (
                  <div
                    key={ph}
                    className="h-8 bg-slate-800/60 rounded-lg flex items-center px-3"
                  >
                    <span className="text-slate-600 text-xs">{ph}</span>
                  </div>
                ))}
                <div className="h-20 bg-slate-800/60 rounded-lg mt-2" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 bg-slate-800/60 rounded-lg" />
                  <div className="h-8 flex-1 bg-slate-800/60 rounded-lg" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-7 w-16 bg-blue-600/30 rounded-lg flex items-center justify-center gap-1">
                    <Sparkles size={9} className="text-blue-400" />
                    <span className="text-[9px] text-blue-400 font-bold">
                      AI
                    </span>
                  </div>
                  <div className="h-7 flex-1 bg-slate-800/40 rounded-lg" />
                </div>
              </div>
              {/* Preview side */}
              <div className="w-1/2 flex items-center justify-center p-4">
                <div
                  className="w-full bg-white rounded shadow-xl p-4"
                  style={{
                    fontSize: 5,
                    lineHeight: 1.6,
                    color: "#000",
                    fontFamily: "serif",
                  }}
                >
                  <div className="text-center mb-2 pb-1 border-b-2 border-black">
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: "bold",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      NAHIAN ALAM
                    </div>
                    <div style={{ fontSize: 5.5, color: "#444" }}>
                      email@example.com | +880… | Dhaka
                    </div>
                  </div>
                  {["EDUCATION", "WORK EXPERIENCE", "PROJECTS", "SKILLS"].map(
                    (s) => (
                      <div key={s} className="mb-1.5">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span
                            style={{
                              fontSize: 5.5,
                              fontWeight: "bold",
                              letterSpacing: 0.5,
                            }}
                          >
                            {s}
                          </span>
                          <div className="flex-1 h-px bg-black" />
                        </div>
                        <div className="space-y-0.5">
                          {[0, 1].map((i) => (
                            <div key={i} className="flex justify-between">
                              <div className="w-2/3 h-1.5 bg-gray-200 rounded-sm" />
                              <div className="w-1/5 h-1.5 bg-gray-100 rounded-sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-3xl md:text-4xl font-black mb-3">
          Everything you need,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            nothing you don't.
          </span>
        </h2>
        <p className="text-center text-slate-500 mb-14 max-w-xl mx-auto">
          A focused toolset built for job-seekers who want results, not
          complexity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-white/3 border border-white/6 hover:border-blue-500/30 hover:bg-white/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-center text-3xl md:text-4xl font-black mb-14">
          Three steps to your next job.
        </h2>
        <div className="space-y-6">
          {STEPS.map(({ n, label, desc }) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 items-start p-6 rounded-2xl bg-white/3 border border-white/6"
            >
              <span className="text-4xl font-black text-blue-500/20 leading-none flex-shrink-0">
                {n}
              </span>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">{label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto p-12 rounded-3xl bg-gradient-to-br from-blue-600/15 to-indigo-600/10 border border-blue-500/20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to get hired?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Build your professional CV right now — it's completely free.
            </p>
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-blue-600/30 group"
            >
              <Download size={18} />
              Build & Download CV
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 text-center py-8 border-t border-white/5 text-slate-600 text-xs">
        <span className="font-black text-blue-500 italic">CV DADA</span> — Free,
        professional CV builder.
      </footer>
    </div>
  );
}

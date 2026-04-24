"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  ImageIcon,
  Loader2,
  Trash2,
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import StandardCV, {
  ResumeData,
  EduEntry,
  ExpEntry,
  ProjectEntry,
  SkillEntry,
  CertEntry,
  RefEntry,
  ExtraEntry,
} from "@/components/StandardCV";

const uid = () => Date.now() + Math.random();

// ─── INITIALIZERS ────────────────────────────────────────────────────────────
const blankEdu = (): EduEntry => ({ id: uid(), institution: "", degree: "", cgpa: "", duration: "" });
const blankExp = (): ExpEntry => ({ id: uid(), role: "", org: "", duration: "", bullets: "" });
const blankProj = (): ProjectEntry => ({ id: uid(), name: "", link: "", duration: "", bullets: "" });
const blankSkill = (): SkillEntry => ({ id: uid(), category: "", skills: "" });
const blankCert = (): CertEntry => ({ id: uid(), name: "", issuer: "", date: "" });
const blankRef = (): RefEntry => ({ id: uid(), name: "", title: "", org: "", phone: "", email: "" });
const blankExtra = (): ExtraEntry => ({ id: uid(), label: "", value: "" });

const initResume = (): ResumeData => ({
  full_name: "", email: "", phone: "", location: "", linkedin: "", github: "", portfolio: "", summary: "",
  education: [blankEdu()], experience: [blankExp()], projects: [blankProj()],
  skills: [blankSkill()], certifications: [blankCert()], references: [blankRef()], extras: [blankExtra()],
});

const FONT = "'Times New Roman', Times, serif";

// ─── buildPDFHtml (Full Implementation) ──────────────────────────────────────
function buildPDFHtml(data: ResumeData, photo: string | null): string {
  const F = FONT;
  const contacts = [data.email, data.phone, data.location].filter(Boolean).join("  |  ");
  
  const ST = (t: string) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;page-break-after:avoid;">
      <h2 style="font-family:${F};font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;margin:0;">${t}</h2>
      <div style="flex:1;height:1.5px;background:#000;"></div>
    </div>`;

  const BL = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return "";
    return `<ul style="margin:2px 0 8px 18px;padding:0;list-style-type:disc;">
      ${lines.map(l => `<li style="font-family:${F};font-size:10pt;line-height:1.5;margin-bottom:2px;">${l}</li>`).join("")}
    </ul>`;
  };

  const eduHTML = data.education.filter(e => e.institution).map(e => `
    <div style="margin-bottom:10px;page-break-inside:avoid;">
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:10.5pt;"><span>${e.institution}</span><span>${e.duration}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10pt;font-style:italic;"><span>${e.degree}</span><span>${e.cgpa ? 'CGPA: '+e.cgpa : ''}</span></div>
    </div>`).join("");

  const expHTML = data.experience.filter(e => e.role).map(e => `
    <div style="margin-bottom:12px;page-break-inside:avoid;">
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:10.5pt;"><span>${e.role}</span><span>${e.duration}</span></div>
      <div style="font-size:10pt;color:#333;margin-bottom:2px;">${e.org}</div>
      ${BL(e.bullets)}
    </div>`).join("");

  return `<!DOCTYPE html><html><head><style>* { box-sizing: border-box; } body { background:white; margin:0; padding:0; }</style></head><body>
    <div id="cv-root" style="width:794px;padding:70px 80px;background:white;color:black;font-family:${F};">
      <div style="text-align:center;border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:20px;">
        <h1 style="font-size:26pt;font-weight:bold;text-transform:uppercase;margin:0 0 5px 0;">${data.full_name || "YOUR NAME"}</h1>
        <div style="font-size:10pt;line-height:1.6;">${contacts}</div>
      </div>
      ${data.summary ? `<div style="margin-bottom:18px;">${ST("Professional Profile")}<p style="font-size:10.5pt;line-height:1.6;text-align:justify;margin:0;">${data.summary}</p></div>` : ""}
      ${eduHTML ? `<div style="margin-bottom:18px;">${ST("Education")}${eduHTML}</div>` : ""}
      ${expHTML ? `<div style="margin-bottom:18px;">${ST("Work Experience")}${expHTML}</div>` : ""}
      <div style="height:60px;"></div>
    </div></body></html>`;
}

// ─── MAIN BUILDER COMPONENT ──────────────────────────────────────────────────
export default function Builder() {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeData>(initResume);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [photo, setPhoto] = useState<string | null>(null);

  const toggleSection = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));
  const setField = (f: keyof ResumeData, v: string) => setResume(p => ({ ...p, [f]: v }));

  // Dynamic Item Helpers
  function makeU<T extends { id: number }>(key: keyof ResumeData, blank: () => T) {
    return {
      add: () => setResume(p => ({ ...p, [key]: [...(p[key] as T[]), blank()] })),
      remove: (id: number) => setResume(p => ({ ...p, [key]: (p[key] as T[]).filter(x => x.id !== id) })),
      upd: (id: number, f: keyof T, v: string) => setResume(p => ({
        ...p, [key]: (p[key] as T[]).map(x => x.id === id ? { ...x, [f]: v } : x)
      })),
    };
  }

  const edu = makeU<EduEntry>("education", blankEdu);
  const exp = makeU<ExpEntry>("experience", blankExp);
  const proj = makeU<ProjectEntry>("projects", blankProj);
  const skill = makeU<SkillEntry>("skills", blankSkill);

  // ─── PDF EXPORT LOGIC ──────────────────────────────────────────────────────
  const exportPDF = async () => {
    setExportingPDF(true);
    let container: HTMLDivElement | null = null;
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then((m) => m.default),
      ]);

      container = document.createElement("div");
      container.style.cssText = "position:fixed; top:0; left:-9999px; width:794px; z-index:-1;";
      container.innerHTML = buildPDFHtml(resume, photo);
      document.body.appendChild(container);

      await new Promise(r => setTimeout(r, 800));
      const root = container.querySelector("#cv-root") as HTMLElement;
      const canvas = await html2canvas(root, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const PAGE_W = 210;
      const PAGE_H = 297;
      const MARGIN = 12; 
      const USEABLE_H = PAGE_H - (MARGIN * 2);

      const imgW = PAGE_W;
      const imgH = (canvas.height / canvas.width) * imgW;
      const totalPages = Math.ceil(imgH / USEABLE_H);

      for (let p = 0; p < totalPages; p++) {
        if (p > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, -(p * USEABLE_H) + MARGIN, imgW, imgH);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, PAGE_W, MARGIN, 'F'); 
        pdf.rect(0, PAGE_H - MARGIN, PAGE_W, MARGIN, 'F');
      }

      pdf.save(`${resume.full_name || "Resume"}_CV.pdf`);
    } catch (e) { console.error(e); }
    finally {
      if (container?.parentNode) container.parentNode.removeChild(container);
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#030712] text-slate-200">
      <AnimatePresence>
        {exportingPDF && (
          <motion.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDITOR */}
      <div className="w-full lg:w-1/2 p-6 overflow-y-auto max-h-screen scrollbar-hide border-r border-white/5">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-blue-500 italic">CV DADA</h1>
          <button onClick={exportPDF} className="abtn bg-blue-600 hover:bg-blue-500 rounded-xl px-6 py-2 flex items-center gap-2">
            <Download size={16}/> Export PDF
          </button>
        </header>

        <div className="space-y-4">
          {/* PERSONAL INFO */}
          <section className="sec-box">
            <button onClick={() => toggleSection('personal')} className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-500 tracking-widest">
              1. Personal Details {collapsed['personal'] ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
            </button>
            {!collapsed['personal'] && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <input className="di text-xs col-span-2" placeholder="Full Name" value={resume.full_name} onChange={e => setField('full_name', e.target.value)} />
                <input className="di text-xs" placeholder="Email" value={resume.email} onChange={e => setField('email', e.target.value)} />
                <input className="di text-xs" placeholder="Phone" value={resume.phone} onChange={e => setField('phone', e.target.value)} />
              </div>
            )}
          </section>

          {/* EXPERIENCE LOOP */}
          <section className="sec-box">
            <button onClick={() => toggleSection('exp')} className="w-full flex justify-between items-center text-xs font-bold uppercase text-slate-500 tracking-widest">
              4. Experience {collapsed['exp'] ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
            </button>
            {!collapsed['exp'] && (
              <div className="mt-4 space-y-6">
                {resume.experience.map((e, i) => (
                  <div key={e.id} className="space-y-3 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-blue-400 font-bold">Job #${i+1}</span>
                      {i > 0 && <button onClick={() => exp.remove(e.id)} className="text-red-500"><Trash2 size={14}/></button>}
                    </div>
                    <input className="di text-xs" placeholder="Job Title" value={e.role} onChange={ev => exp.upd(e.id, 'role', ev.target.value)} />
                    <input className="di text-xs" placeholder="Company" value={e.org} onChange={ev => exp.upd(e.id, 'org', ev.target.value)} />
                    <textarea className="di text-xs h-24" placeholder="Bullet points (one per line)" value={e.bullets} onChange={ev => exp.upd(e.id, 'bullets', ev.target.value)} />
                  </div>
                ))}
                <button onClick={exp.add} className="add-btn w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-blue-400 transition-colors">
                  + Add Experience
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="hidden lg:flex w-1/2 bg-[#010413] justify-center p-12 overflow-y-auto">
        <div className="scale-[0.8] origin-top">
          <StandardCV data={resume} photo={photo} />
        </div>
      </div>
    </div>
  );
}

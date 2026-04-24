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

// ─── buildPDFHtml (Optimized for Slicing) ─────────────────────────────────────
function buildPDFHtml(data: ResumeData, photo: string | null): string {
  const F = FONT;
  const contacts = [data.email, data.phone, data.location].filter(Boolean).join("  |  ");
  const hasPhoto = !!photo;

  const ST = (t: string) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;page-break-after:avoid;">
      <h2 style="font-family:${F};font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;margin:0;">${t}</h2>
      <div style="flex:1;height:1.5px;background:#000;"></div>
    </div>`;

  const BL = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return "";
    return `<ul style="margin:3px 0 10px 18px;padding:0;list-style-type:disc;">
      ${lines.map(l => `<li style="font-family:${F};font-size:10pt;line-height:1.4;margin-bottom:2px;">${l}</li>`).join("")}
    </ul>`;
  };

  // Sections (Mapped from data)
  const summaryHTML = data.summary ? `<div style="margin-bottom:15px;page-break-inside:avoid;">${ST("Professional Profile")}<p style="font-family:${F};font-size:10.5pt;line-height:1.6;text-align:justify;">${data.summary}</p></div>` : "";
  
  const eduHTML = data.education.filter(e => e.institution).length ? 
    `<div style="margin-bottom:15px;">${ST("Education")}${data.education.map(e => `
      <div style="margin-bottom:8px;page-break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:10.5pt;"><span>${e.institution}</span><span>${e.duration}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:10pt;font-style:italic;"><span>${e.degree}</span><span>${e.cgpa ? 'CGPA: '+e.cgpa : ''}</span></div>
      </div>`).join("")}</div>` : "";

  // ... (Work Exp, Projects, Skills follow similar template logic)
  // Note: StandardCV component handles the complex visual preview, 
  // but buildPDFHtml needs to be a flat string for html2canvas.

  return `<!DOCTYPE html><html><head><style>body{background:white;margin:0;padding:0;}</style></head><body>
    <div id="cv-root" style="width:794px;padding:70px 80px;background:white;color:black;font-family:${F};">
      <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:15px;">
        <h1 style="font-size:24pt;text-transform:uppercase;margin:0 0 5px 0;">${data.full_name || "YOUR NAME"}</h1>
        <div style="font-size:10pt;">${contacts}</div>
      </div>
      ${summaryHTML}${eduHTML}
      <div style="height:50px;"></div> </div></body></html>`;
}

// ─── MAIN BUILDER ────────────────────────────────────────────────────────────
export default function Builder() {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingDOCX, setExportingDOCX] = useState(false);
  const [aiGenStatus, setAiGenStatus] = useState("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiBrief, setAiBrief] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeData>(initResume);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));
  const setField = (f: keyof ResumeData, v: string) => setResume(p => ({ ...p, [f]: v }));

  // Helper for Arrays (Education, Experience, etc.)
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

  // ─── FIXED PDF EXPORT ──────────────────────────────────────────────────────
  const exportPDF = async () => {
    setExportingPDF(true);
    let container: HTMLDivElement | null = null;
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then((m) => m.default),
      ]);

      const A4_PX = 794;
      container = document.createElement("div");
      container.style.cssText = "position:fixed; top:0; left:-9999px; width:" + A4_PX + "px; z-index:-1;";
      container.innerHTML = buildPDFHtml(resume, photo);
      document.body.appendChild(container);

      await new Promise(r => setTimeout(r, 800));
      const root = container.querySelector("#cv-root") as HTMLElement;
      const canvas = await html2canvas(root, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const PAGE_W = 210;
      const PAGE_H = 297;
      const MARGIN = 10; 
      const USEABLE_H = PAGE_H - (MARGIN * 2);

      const imgW = PAGE_W;
      const imgH = (canvas.height / canvas.width) * imgW;
      const totalPages = Math.ceil(imgH / USEABLE_H);

      for (let p = 0; p < totalPages; p++) {
        if (p > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", 0, -(p * USEABLE_H) + MARGIN, imgW, imgH);
        
        // White Masks to prevent edge bleeding
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
        {(exportingPDF || exportingDOCX) && (
          <motion.div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT PANEL: EDITOR */}
      <div className="w-full lg:w-1/2 p-6 overflow-y-auto max-h-screen scrollbar-hide border-r border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-blue-500">CV DADA</h1>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="abtn bg-blue-600 hover:bg-blue-500"><Download size={14}/> PDF</button>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-4">
          <div className="sec-box">
             <button onClick={() => toggleSection('personal')} className="w-full flex justify-between font-bold text-xs uppercase tracking-widest text-slate-500">
               1. Personal Info {collapsed['personal'] ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
             </button>
             {!collapsed['personal'] && (
               <div className="grid grid-cols-2 gap-3 mt-4">
                 <input className="di text-xs col-span-2" placeholder="Full Name" value={resume.full_name} onChange={e => setField('full_name', e.target.value)} />
                 <input className="di text-xs" placeholder="Email" value={resume.email} onChange={e => setField('email', e.target.value)} />
                 <input className="di text-xs" placeholder="Phone" value={resume.phone} onChange={e => setField('phone', e.target.value)} />
               </div>
             )}
          </div>

          <div className="sec-box">
             <button onClick={() => toggleSection('edu')} className="w-full flex justify-between font-bold text-xs uppercase tracking-widest text-slate-500">
               3. Education {collapsed['edu'] ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
             </button>
             {!collapsed['edu'] && (
               <div className="mt-4 space-y-4">
                 {resume.education.map((e, i) => (
                   <div key={e.id} className="space-y-2">
                     <input className="di text-xs" placeholder="University" value={e.institution} onChange={ev => edu.upd(e.id, 'institution', ev.target.value)} />
                     <input className="di text-xs" placeholder="Degree" value={e.degree} onChange={ev => edu.upd(e.id, 'degree', ev.target.value)} />
                   </div>
                 ))}
                 <button onClick={edu.add} className="add-btn"><Plus size={12}/> Add Education</button>
               </div>
             )}
          </div>
          {/* Add similar loops for Experience, Projects, etc. */}
        </div>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className="hidden lg:flex w-1/2 bg-[#010413] justify-center p-10 overflow-y-auto">
        <div className="scale-75 origin-top">
          <StandardCV data={resume} photo={photo} />
        </div>
      </div>
    </div>
  );
}

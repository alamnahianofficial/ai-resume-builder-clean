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

// ─── buildPDFHtml (Fixed for Durations & Page Breaks) ────────────────────────
function buildPDFHtml(data: ResumeData, photo: string | null): string {
  const F = FONT;
  const rowStyle = "display:flex; justify-content:space-between; align-items:baseline; width:100%;";
  
  const ST = (t: string) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;page-break-after:avoid;">
      <h2 style="font-family:${F};font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:.07em;margin:0;">${t}</h2>
      <div style="flex:1;height:1.5px;background:#000;"></div>
    </div>`;

  const BL = (text: string) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return "";
    return `<ul style="margin:2px 0 8px 18px;padding:0;list-style-type:disc;">
      ${lines.map(l => `<li style="font-family:${F};font-size:10pt;line-height:1.5;margin-bottom:2px;word-break:break-word;">${l}</li>`).join("")}
    </ul>`;
  };

  const eduHTML = data.education.filter(e => e.institution).map(e => `
    <div style="margin-bottom:10px;page-break-inside:avoid;">
      <div style="${rowStyle}">
        <span style="font-weight:bold;font-size:10.5pt;flex:1;">${e.institution}</span>
        <span style="font-weight:bold;font-size:10pt;white-space:nowrap;margin-left:15px;">${e.duration}</span>
      </div>
      <div style="${rowStyle}">
        <span style="font-style:italic;font-size:10pt;">${e.degree}</span>
        ${e.cgpa ? `<span style="font-size:10pt;">CGPA: <b>${e.cgpa}</b></span>` : ""}
      </div>
    </div>`).join("");

  const expHTML = data.experience.filter(e => e.role).map(e => `
    <div style="margin-bottom:12px;page-break-inside:avoid;">
      <div style="${rowStyle}">
        <span style="font-weight:bold;font-size:10.5pt;flex:1;">${e.role}</span>
        <span style="font-weight:bold;font-size:10pt;white-space:nowrap;margin-left:15px;">${e.duration}</span>
      </div>
      <div style="font-size:10pt;color:#333;margin-bottom:2px;">${e.org}</div>
      ${BL(e.bullets)}
    </div>`).join("");

  const extraHTML = data.extras.filter(ex => ex.label).map(ex => `
    <div style="${rowStyle} margin-bottom:4px; font-size:10pt;">
      <span style="font-weight:bold; flex-shrink:0; width:140px;">${ex.label}:</span>
      <span style="flex:1; text-align:left;">${ex.value}</span>
    </div>`).join("");

  return `<!DOCTYPE html><html><head><style>* { box-sizing: border-box; } body { background:white; margin:0; padding:0; }</style></head><body>
    <div id="cv-root" style="width:794px;padding:70px 80px;background:white;color:black;font-family:${F};">
      <div style="text-align:center;border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:20px;">
        <h1 style="font-size:26pt;font-weight:bold;text-transform:uppercase;margin:0 0 5px 0;">${data.full_name || "YOUR NAME"}</h1>
        <div style="font-size:10pt;">${[data.email, data.phone, data.location].filter(Boolean).join("  |  ")}</div>
      </div>
      ${data.summary ? `<div style="margin-bottom:18px;">${ST("Professional Profile")}<p style="font-size:10.5pt;line-height:1.6;text-align:justify;margin:0;">${data.summary}</p></div>` : ""}
      ${eduHTML ? `<div style="margin-bottom:18px;">${ST("Education")}${eduHTML}</div>` : ""}
      ${expHTML ? `<div style="margin-bottom:18px;">${ST("Work Experience")}${expHTML}</div>` : ""}
      ${extraHTML ? `<div style="margin-bottom:18px;">${ST("Additional Information")}${extraHTML}</div>` : ""}
      <div style="height:60px;"></div>
    </div></body></html>`;
}

// ─── MAIN BUILDER ────────────────────────────────────────────────────────────
export default function Builder() {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [resume, setResume] = useState<ResumeData>(initResume);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [photo, setPhoto] = useState<string | null>(null);

  const toggleSection = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));
  const setField = (f: keyof ResumeData, v: string) => setResume(p => ({ ...p, [f]: v }));

  const makeU = <T extends { id: number }>(key: keyof ResumeData, blank: () => T) => ({
    add: () => setResume(p => ({ ...p, [key]: [...(p[key] as T[]), blank()] })),
    remove: (id: number) => setResume(p => ({ ...p, [key]: (p[key] as T[]).filter(x => x.id !== id) })),
    upd: (id: number, f: keyof T, v: string) => setResume(p => ({
      ...p, [key]: (p[key] as T[]).map(x => x.id === id ? { ...x, [f]: v } : x)
    })),
  });

  const edu = makeU<EduEntry>("education", blankEdu);
  const exp = makeU<ExpEntry>("experience", blankExp);
  const extra = makeU<ExtraEntry>("extras", blankExtra);

  // ─── EXPORT PDF (With Multi-Page Masking) ──────────────────────────────────
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
      const MARGIN_V = 15; // Vertical Margin
      const MARGIN_H = 10; // Horizontal Margin
      const USEABLE_H = PAGE_H - (MARGIN_V * 2);

      const imgW = PAGE_W - (MARGIN_H * 2);
      const imgH = (canvas.height / canvas.width) * imgW;
      const totalPages = Math.ceil(imgH / USEABLE_H);

      for (let p = 0; p < totalPages; p++) {
        if (p > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 1.0), "JPEG", MARGIN_H, -(p * USEABLE_H) + MARGIN_V, imgW, imgH);
        
        // Masks for clean page breaks
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, PAGE_W, MARGIN_V, 'F'); 
        pdf.rect(0, PAGE_H - MARGIN_V, PAGE_W, PAGE_H, 'F');
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
            <p className="ml-4 font-bold text-xs tracking-widest uppercase animate-pulse">Generating PDF...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full lg:w-1/2 p-6 overflow-y-auto max-h-screen scrollbar-hide border-r border-white/5">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-blue-500 italic">CV DADA</h1>
          <button onClick={exportPDF} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all">
            <Download size={18}/> PDF
          </button>
        </header>

        <div className="space-y-4">
          <section className="sec-box">
            <button onClick={() => toggleSection('personal')} className="w-full flex justify-between font-bold text-xs text-slate-500 uppercase tracking-widest">
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

          <section className="sec-box">
            <button onClick={() => toggleSection('exp')} className="w-full flex justify-between font-bold text-xs text-slate-500 uppercase tracking-widest">
              4. Experience {collapsed['exp'] ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
            </button>
            {!collapsed['exp'] && (
              <div className="mt-4 space-y-4">
                {resume.experience.map((e, i) => (
                  <div key={e.id} className="space-y-2 border-b border-white/5 pb-4">
                    <div className="flex justify-between">
                      <input className="di text-xs font-bold text-blue-400" placeholder="Job Title" value={e.role} onChange={ev => exp.upd(e.id, 'role', ev.target.value)} />
                      <input className="di text-xs w-32 text-right" placeholder="Duration" value={e.duration} onChange={ev => exp.upd(e.id, 'duration', ev.target.value)} />
                    </div>
                    <input className="di text-xs" placeholder="Company" value={e.org} onChange={ev => exp.upd(e.id, 'org', ev.target.value)} />
                    <textarea className="di text-xs h-20" placeholder="Bullet points..." value={e.bullets} onChange={ev => exp.upd(e.id, 'bullets', ev.target.value)} />
                    <button onClick={() => exp.remove(e.id)} className="text-red-500 text-[10px] font-bold">REMOVE</button>
                  </div>
                ))}
                <button onClick={exp.add} className="add-btn">+ Add Job</button>
              </div>
            )}
          </section>

          <section className="sec-box">
            <button onClick={() => toggleSection('extra')} className="w-full flex justify-between font-bold text-xs text-slate-500 uppercase tracking-widest">
              9. Additional Info {collapsed['extra'] ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}
            </button>
            {!collapsed['extra'] && (
              <div className="mt-4 space-y-2">
                {resume.extras.map((ex) => (
                  <div key={ex.id} className="flex gap-2">
                    <input className="di text-xs w-1/3" placeholder="Label (e.g. Languages)" value={ex.label} onChange={ev => extra.upd(ex.id, 'label', ev.target.value)} />
                    <input className="di text-xs flex-1" placeholder="Value" value={ex.value} onChange={ev => extra.upd(ex.id, 'value', ev.target.value)} />
                    <button onClick={() => extra.remove(ex.id)}><Trash2 size={14} className="text-slate-600"/></button>
                  </div>
                ))}
                <button onClick={extra.add} className="add-btn">+ Add Row</button>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#010413] justify-center p-12 overflow-y-auto">
        <div className="scale-[0.8] origin-top">
          <StandardCV data={resume} photo={photo} />
        </div>
      </div>
    </div>
  );
}

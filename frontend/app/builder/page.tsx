"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Loader2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import StandardCV, {
  ResumeData,
  EduEntry,
  ExpEntry,
  ExtraEntry,
} from "@/components/StandardCV";

const uid = () => Date.now() + Math.random();

// ─── INITIALIZERS ─────────────────────────────────────────
const blankEdu = (): EduEntry => ({
  id: uid(),
  institution: "",
  degree: "",
  cgpa: "",
  duration: "",
});

const blankExp = (): ExpEntry => ({
  id: uid(),
  role: "",
  org: "",
  duration: "",
  bullets: "",
});

const blankExtra = (): ExtraEntry => ({
  id: uid(),
  label: "",
  value: "",
});

const initResume = (): ResumeData => ({
  full_name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  education: [blankEdu()],
  experience: [blankExp()],
  projects: [],
  skills: [],
  certifications: [],
  references: [],
  extras: [blankExtra()],
});

const FONT = "'Times New Roman', Times, serif";

// ─── HTML BUILDER (UNCHANGED CORE) ────────────────────────
function buildPDFHtml(data: ResumeData): string {
  const F = FONT;

  const row = "display:flex;justify-content:space-between;width:100%;";

  const BL = (text: string) => {
    const lines = text.split("\n").filter(Boolean);
    return `<ul style="margin-left:18px;">
      ${lines.map(l => `<li>${l}</li>`).join("")}
    </ul>`;
  };

  const expHTML = data.experience
    .filter(e => e.role)
    .map(e => `
      <div style="margin-bottom:10px;page-break-inside:avoid;">
        <div style="${row}">
          <b>${e.role}</b>
          <span>${e.duration}</span>
        </div>
        <div>${e.org}</div>
        ${BL(e.bullets)}
      </div>
    `).join("");

  return `
  <html>
    <body style="margin:0;">
      <div id="cv-root" style="width:794px;padding:60px 70px;font-family:${F};">
        <h1 style="text-align:center;">${data.full_name || "NAME"}</h1>
        ${expHTML}
      </div>
    </body>
  </html>`;
}

// ─── MAIN ─────────────────────────────────────────────────
export default function Builder() {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [resume, setResume] = useState<ResumeData>(initResume);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (k: string) =>
    setCollapsed(p => ({ ...p, [k]: !p[k] }));

  const makeU = <T extends { id: number }>(key: keyof ResumeData, blank: () => T) => ({
    add: () => setResume(p => ({ ...p, [key]: [...(p[key] as T[]), blank()] })),
    remove: (id: number) => setResume(p => ({
      ...p,
      [key]: (p[key] as T[]).filter(x => x.id !== id),
    })),
    upd: (id: number, f: keyof T, v: string) =>
      setResume(p => ({
        ...p,
        [key]: (p[key] as T[]).map(x =>
          x.id === id ? { ...x, [f]: v } : x
        ),
      })),
  });

  const exp = makeU<ExpEntry>("experience", blankExp);
  const extra = makeU<ExtraEntry>("extras", blankExtra);

  // ─── 🔥 FIXED PDF EXPORT ────────────────────────────────
  const exportPDF = async () => {
    setExportingPDF(true);
    let container: HTMLDivElement | null = null;

    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then(m => m.default),
      ]);

      container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 794px;
        background: white;
      `;

      container.innerHTML = buildPDFHtml(resume);
      document.body.appendChild(container);

      await new Promise(r => setTimeout(r, 400));

      const root = container.querySelector("#cv-root") as HTMLElement;

      const canvas = await html2canvas(root, {
        scale: 2,
        backgroundColor: "#ffffff",
        width: 794,
        windowWidth: 794,
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const PAGE_W = 210;
      const PAGE_H = 297;
      const MARGIN = 10;

      const imgWidth = PAGE_W - MARGIN * 2;

      const pxPageHeight = Math.floor(
        (canvas.width * (PAGE_H - MARGIN * 2)) / imgWidth
      );

      let y = 0;
      let page = 0;

      while (y < canvas.height) {
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = pxPageHeight;

        const ctx = pageCanvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        ctx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          pxPageHeight,
          0,
          0,
          canvas.width,
          pxPageHeight
        );

        const img = pageCanvas.toDataURL("image/jpeg", 1);

        if (page > 0) pdf.addPage();

        pdf.addImage(
          img,
          "JPEG",
          MARGIN,
          MARGIN,
          imgWidth,
          (pageCanvas.height * imgWidth) / pageCanvas.width
        );

        y += pxPageHeight;
        page++;
      }

      pdf.save(`${resume.full_name || "Resume"}.pdf`);
    } catch (err) {
      console.error("PDF ERROR:", err);
    } finally {
      if (container?.parentNode) container.parentNode.removeChild(container);
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AnimatePresence>
        {exportingPDF && (
          <motion.div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-1/2 p-6">
        <button
          onClick={exportPDF}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          <Download size={16} /> Export PDF
        </button>

        {/* EXPERIENCE */}
        <div className="mt-6">
          <button onClick={() => toggle("exp")}>
            Experience {collapsed["exp"] ? <ChevronDown /> : <ChevronUp />}
          </button>

          {!collapsed["exp"] &&
            resume.experience.map(e => (
              <div key={e.id}>
                <input
                  placeholder="Role"
                  value={e.role}
                  onChange={ev => exp.upd(e.id, "role", ev.target.value)}
                />
                <input
                  placeholder="Duration"
                  value={e.duration}
                  onChange={ev => exp.upd(e.id, "duration", ev.target.value)}
                />
                <textarea
                  value={e.bullets}
                  onChange={ev => exp.upd(e.id, "bullets", ev.target.value)}
                />
                <button onClick={() => exp.remove(e.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          <button onClick={exp.add}>+ Add</button>
        </div>
      </div>

      <div className="w-1/2 p-10">
        <StandardCV data={resume} />
      </div>
    </div>
  );
}

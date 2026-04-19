"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, ImageIcon, Loader2, Trash2 } from "lucide-react";
import StandardCV from "@/components/StandardCV";

interface Item {
  id: number;
  org: string;
  date: string;
  desc: string;
  link?: string;
}

interface Section {
  id: number;
  title: string;
  items: Item[];
  isProject?: boolean;
}

interface ResumeData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  sections: Section[];
}

const SECTION_PRESETS = [
  { label: "+ Summary", title: "Professional Summary", isProject: false },
  { label: "+ Skills", title: "Technical Skills", isProject: false },
  { label: "+ Experience", title: "Work Experience", isProject: false },
  { label: "+ Projects", title: "Projects", isProject: true },
  { label: "+ Education", title: "Education", isProject: false },
  { label: "+ Certifications", title: "Certifications", isProject: false },
  { label: "+ References", title: "References", isProject: false },
];

const FONT = "'Times New Roman', Times, serif";

export default function Builder() {
  const [mounted, setMounted] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingDOCX, setExportingDOCX] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [resume, setResume] = useState<ResumeData>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    sections: [],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── BUILD HTML FOR PDF ──────────────────────────────────────────────────────
  const buildHTML = () => {
    const photoSrc = photo || "";
    const hasPhoto = !!photoSrc;
    const contactLine = [resume.email, resume.phone, resume.location]
      .filter(Boolean)
      .join("  |  ");

    const socialLinks = [
      resume.linkedin && `<span><b>LinkedIn:</b> ${resume.linkedin}</span>`,
      resume.github && `<span><b>GitHub:</b> ${resume.github}</span>`,
      resume.portfolio && `<span><b>Portfolio:</b> ${resume.portfolio}</span>`,
    ]
      .filter(Boolean)
      .join(`<span style="margin:0 10px;color:#666">|</span>`);

    const summaryHTML = resume.summary
      ? `
      <div style="margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <h2 style="font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:.06em;margin:0;padding:0;white-space:nowrap;flex-shrink:0;font-family:${FONT}">Professional Profile</h2>
          <div style="flex:1;height:1px;background:#000;min-width:0"></div>
        </div>
        <p style="font-size:10.5pt;line-height:1.65;text-align:justify;color:#000;margin:0;font-family:${FONT}">${resume.summary}</p>
      </div>`
      : "";

    const sectionsHTML = resume.sections
      .map(
        (sec) => `
      <div style="margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <h2 style="font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:.06em;margin:0;padding:0;white-space:nowrap;flex-shrink:0;font-family:${FONT}">${sec.title}</h2>
          <div style="flex:1;height:1px;background:#000;min-width:0"></div>
        </div>
        ${sec.items
          .map(
            (item) => `
          <div style="margin-top:${sec.items.indexOf(item) === 0 ? "0" : "10px"}">
            ${
              item.org || item.date
                ? `
              <div style="display:flex;justify-content:space-between;font-size:10.5pt;font-weight:bold;color:#000;font-family:${FONT};margin-bottom:2px">
                <span>${item.org || ""}</span>
                <span style="font-weight:normal;color:#333">${item.date || ""}</span>
              </div>`
                : ""
            }
            ${item.link ? `<div style="font-size:9.5pt;color:#1a56db;font-family:${FONT};margin-bottom:3px">🔗 ${item.link}</div>` : ""}
            ${
              item.desc
                ? `
              <ul style="margin:3px 0 0 20px;padding:0;list-style-type:disc">
                ${item.desc
                  .split("\n")
                  .filter((b) => b.trim())
                  .map(
                    (b) =>
                      `<li style="font-size:10pt;line-height:1.55;color:#000;font-family:${FONT};margin-bottom:2px">${b.trim()}</li>`,
                  )
                  .join("")}
              </ul>`
                : ""
            }
          </div>`,
          )
          .join("")}
      </div>`,
      )
      .join("");

    return `<!DOCTYPE html><html><head><meta charset="utf-8">
      <style>* { box-sizing:border-box; margin:0; padding:0; } body { background:white; }</style>
    </head><body>
      <div id="cv-root" style="width:794px;padding:57px 68px;background:white;font-family:${FONT};color:#000">
        <div style="display:flex;justify-content:${hasPhoto ? "space-between" : "center"};align-items:flex-start;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:14px;gap:14px">
          <div style="flex:${hasPhoto ? "1" : "unset"};text-align:${hasPhoto ? "left" : "center"}">
            <h1 style="font-size:26pt;font-weight:bold;text-transform:uppercase;letter-spacing:1px;line-height:1.1;margin:0 0 5px 0;color:#000;font-family:${FONT}">${resume.full_name || "YOUR NAME"}</h1>
            ${contactLine ? `<div style="font-size:10pt;color:#222;line-height:1.7;font-family:${FONT}">${contactLine}</div>` : ""}
            ${socialLinks ? `<div style="font-size:9.5pt;color:#1a56db;font-family:${FONT};margin-top:4px;display:flex;flex-wrap:wrap;gap:14px;justify-content:${hasPhoto ? "flex-start" : "center"}">${socialLinks}</div>` : ""}
          </div>
          ${hasPhoto ? `<div style="width:100px;height:126px;flex-shrink:0;border:1.5px solid #000;overflow:hidden;background:#f0f0f0"><img src="${photoSrc}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block"/></div>` : ""}
        </div>
        ${summaryHTML}
        ${sectionsHTML}
      </div>
    </body></html>`;
  };

  // ─── PDF EXPORT ──────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    setExportingPDF(true);
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then((m) => m.default),
      ]);

      // Write into isolated iframe — no transforms, no Tailwind, no oklch
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;top:0;left:-9999px;width:794px;height:1080px;border:none;opacity:0;pointer-events:none;z-index:-1";
      document.body.appendChild(iframe);

      const iDoc = iframe.contentDocument!;
      iDoc.open();
      iDoc.write(buildHTML());
      iDoc.close();

      // Wait for images
      await Promise.all(
        Array.from(iDoc.images).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((r) => {
                img.onload = r;
                img.onerror = r;
              }),
        ),
      );
      await new Promise((r) => setTimeout(r, 350));

      const root = iDoc.getElementById("cv-root") as HTMLElement;
      const totalHeight = root.scrollHeight;
      iframe.style.height = totalHeight + "px";
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: totalHeight,
        windowWidth: 794,
        windowHeight: totalHeight,
      });

      document.body.removeChild(iframe);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const PAGE_W_MM = 210;
      const PAGE_H_MM = 297;
      const pxPerMm = canvas.width / PAGE_W_MM; // canvas px per mm
      const pageHpx = Math.round(PAGE_H_MM * pxPerMm); // canvas px per A4 page
      const totalPages = Math.ceil(canvas.height / pageHpx);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = pageHpx;
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, -(page * pageHpx));

        pdf.addImage(
          slice.toDataURL("image/jpeg", 0.97),
          "JPEG",
          0,
          0,
          PAGE_W_MM,
          PAGE_H_MM,
        );
      }

      pdf.save(`${resume.full_name || "Resume"}_CV.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
      alert("PDF export failed — check console.");
    }
    setExportingPDF(false);
  };

  // ─── DOCX EXPORT ─────────────────────────────────────────────────────────────
  const exportDOCX = async () => {
    setExportingDOCX(true);
    try {
      const {
        Document,
        Packer,
        Paragraph,
        TextRun,
        AlignmentType,
        BorderStyle,
        ExternalHyperlink,
      } = await import("docx");
      const { saveAs } = await import("file-saver");
      const children: any[] = [];

      // Name
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: (resume.full_name || "YOUR NAME").toUpperCase(),
              bold: true,
              size: 48,
              font: "Times New Roman",
            }),
          ],
        }),
      );

      // Contact
      const contactLine = [resume.email, resume.phone, resume.location]
        .filter(Boolean)
        .join("  |  ");
      if (contactLine)
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: contactLine,
                size: 20,
                color: "444444",
                font: "Times New Roman",
              }),
            ],
          }),
        );

      // Social links
      const socials = [
        resume.linkedin && `LinkedIn: ${resume.linkedin}`,
        resume.github && `GitHub: ${resume.github}`,
        resume.portfolio && `Portfolio: ${resume.portfolio}`,
      ].filter(Boolean) as string[];
      if (socials.length)
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: socials.join("   |   "),
                size: 18,
                color: "1a56db",
                font: "Times New Roman",
              }),
            ],
          }),
        );

      // Summary
      if (resume.summary) {
        children.push(
          new Paragraph({
            spacing: { before: 200, after: 60 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            },
            children: [
              new TextRun({
                text: "PROFESSIONAL PROFILE",
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: resume.summary,
                size: 20,
                font: "Times New Roman",
              }),
            ],
          }),
        );
      }

      // Dynamic sections
      for (const sec of resume.sections) {
        children.push(
          new Paragraph({
            spacing: { before: 240, after: 60 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            },
            children: [
              new TextRun({
                text: sec.title.toUpperCase(),
                bold: true,
                size: 22,
                font: "Times New Roman",
              }),
            ],
          }),
        );

        for (const item of sec.items) {
          if (item.org || item.date) {
            children.push(
              new Paragraph({
                spacing: { before: 100, after: 20 },
                children: [
                  new TextRun({
                    text: item.org || "",
                    bold: true,
                    size: 20,
                    font: "Times New Roman",
                  }),
                  ...(item.date
                    ? [
                        new TextRun({
                          text: "  " + item.date,
                          size: 20,
                          color: "555555",
                          font: "Times New Roman",
                        }),
                      ]
                    : []),
                ],
              }),
            );
          }
          if (item.link) {
            children.push(
              new Paragraph({
                spacing: { after: 30 },
                children: [
                  new TextRun({
                    text: "Link: ",
                    size: 19,
                    font: "Times New Roman",
                    color: "444444",
                  }),
                  new ExternalHyperlink({
                    link: item.link,
                    children: [
                      new TextRun({
                        text: item.link,
                        size: 19,
                        font: "Times New Roman",
                        color: "1a56db",
                        underline: {},
                      }),
                    ],
                  }),
                ],
              }),
            );
          }
          if (item.desc) {
            for (const bullet of item.desc
              .split("\n")
              .filter((b) => b.trim())) {
              children.push(
                new Paragraph({
                  bullet: { level: 0 },
                  spacing: { after: 40 },
                  children: [
                    new TextRun({
                      text: bullet.trim(),
                      size: 20,
                      font: "Times New Roman",
                    }),
                  ],
                }),
              );
            }
          }
        }
      }

      const doc = new Document({ sections: [{ children }] });
      saveAs(
        await Packer.toBlob(doc),
        `${resume.full_name || "Resume"}_CV.docx`,
      );
    } catch (e) {
      console.error("DOCX error:", e);
      alert("DOCX export failed — check console.");
    }
    setExportingDOCX(false);
  };

  // ─── STATE HELPERS ────────────────────────────────────────────────────────────
  const addSection = (title: string, isProject: boolean) =>
    setResume((p) => ({
      ...p,
      sections: [
        ...p.sections,
        {
          id: Date.now(),
          title: title.toUpperCase(),
          isProject,
          items: [
            { id: Date.now() + 1, org: "", date: "", desc: "", link: "" },
          ],
        },
      ],
    }));

  const removeSection = (id: number) =>
    setResume((p) => ({
      ...p,
      sections: p.sections.filter((s) => s.id !== id),
    }));

  const updateField = (field: keyof ResumeData, val: string) =>
    setResume((p) => ({ ...p, [field]: val }));

  const updateItem = (
    secId: number,
    itemId: number,
    field: keyof Item,
    val: string,
  ) =>
    setResume((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id !== secId
          ? s
          : {
              ...s,
              items: s.items.map((it) =>
                it.id === itemId ? { ...it, [field]: val } : it,
              ),
            },
      ),
    }));

  const addItem = (secId: number) =>
    setResume((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id !== secId
          ? s
          : {
              ...s,
              items: [
                ...s.items,
                { id: Date.now(), org: "", date: "", desc: "", link: "" },
              ],
            },
      ),
    }));

  const removeItem = (secId: number, itemId: number) =>
    setResume((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id !== secId
          ? s
          : { ...s, items: s.items.filter((it) => it.id !== itemId) },
      ),
    }));

  if (!mounted) return null;
  const isExporting = exportingPDF || exportingDOCX;

  return (
    <>
      <style>{`
        .dada-input {
          width:100%; background:rgba(15,23,42,.6);
          border:1px solid rgba(100,116,139,.25); border-radius:12px;
          padding:10px 14px; color:#e2e8f0; font-size:13px;
          outline:none; transition:border-color .2s,box-shadow .2s;
          resize:none; font-family:inherit;
        }
        .dada-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.15); }
        .dada-input::placeholder { color:#475569; }

        .action-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:8px 16px; border-radius:10px; font-size:12px;
          font-weight:700; letter-spacing:.05em; border:none;
          cursor:pointer; color:#fff;
          transition:transform .15s,box-shadow .15s,filter .15s;
        }
        .action-btn:hover { transform:translateY(-1px) scale(1.03); filter:brightness(1.1); box-shadow:0 6px 20px rgba(0,0,0,.35); }
        .action-btn:active { transform:translateY(1px) scale(0.97); }
        .action-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }

        .tab-btn {
          white-space:nowrap; padding:7px 14px; border-radius:999px;
          background:rgba(30,41,59,.7); border:1px solid rgba(100,116,139,.2);
          color:#94a3b8; font-size:11px; font-weight:700; cursor:pointer; transition:all .2s;
        }
        .tab-btn:hover { background:#1e40af; color:#fff; border-color:#3b82f6; transform:translateY(-1px); }

        .icon-btn {
          display:inline-flex; align-items:center; justify-content:center;
          width:28px; height:28px; border-radius:8px; border:none;
          cursor:pointer; transition:all .15s; background:transparent;
        }
        .icon-btn:hover { background:rgba(239,68,68,.15); }
        .icon-btn:active { transform:scale(.9); }

        .add-item-btn {
          display:flex; align-items:center; gap:6px; margin-top:12px;
          padding:6px 12px; border-radius:8px;
          background:rgba(59,130,246,.08); border:1px dashed rgba(59,130,246,.3);
          color:#60a5fa; font-size:11px; font-weight:600; cursor:pointer; transition:all .2s; width:fit-content;
        }
        .add-item-btn:hover { background:rgba(59,130,246,.15); border-color:#3b82f6; }

        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

        .link-row {
          display:flex; align-items:center; gap:8px;
          background:rgba(15,23,42,.6); border:1px solid rgba(59,130,246,.25);
          border-radius:12px; padding:9px 14px; margin-top:8px;
        }
        .link-row input {
          flex:1; background:transparent; border:none; outline:none;
          color:#93c5fd; font-size:12px; font-family:inherit;
        }
        .link-row input::placeholder { color:#334155; }
        .link-row svg { flex-shrink:0; }
      `}</style>

      <div className="flex flex-col lg:flex-row min-h-screen bg-[#030712] text-slate-200">
        {/* EXPORT OVERLAY */}
        <AnimatePresence>
          {isExporting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <Loader2 className="w-14 h-14 text-blue-500 animate-spin" />
                <p className="font-bold tracking-[.25em] text-xs uppercase text-slate-300 animate-pulse">
                  {exportingPDF ? "Generating PDF…" : "Building DOCX…"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── LEFT EDITOR ── */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto max-h-screen border-r border-white/5 scrollbar-hide">
          {/* Top bar */}
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-black text-blue-500 italic tracking-tighter">
              CV DADA
            </h1>
            <div className="flex gap-3">
              <button
                onClick={exportPDF}
                disabled={isExporting}
                className="action-btn"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                }}
              >
                {exportingPDF ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Download size={13} />
                )}{" "}
                PDF
              </button>
              <button
                onClick={exportDOCX}
                disabled={isExporting}
                className="action-btn"
                style={{
                  background: "linear-gradient(135deg,#334155,#1e293b)",
                }}
              >
                {exportingDOCX ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <FileText size={13} />
                )}{" "}
                DOCX
              </button>
            </div>
          </header>

          {/* Photo upload */}
          <div className="mb-8 p-5 bg-slate-900/40 border border-blue-500/20 rounded-3xl flex items-center gap-6">
            <label className="cursor-pointer block">
              <div
                style={{
                  width: 88,
                  height: 110,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: photo ? "2px solid #3b82f6" : "2px dashed #334155",
                  background: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                ) : (
                  <ImageIcon size={24} color="#475569" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => setPhoto(r.result as string);
                  r.readAsDataURL(f);
                }}
              />
            </label>
            <div>
              <p className="text-sm font-bold text-white mb-1">
                Passport Photo
              </p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">
                Click to upload
              </p>
              {photo && (
                <button
                  onClick={() => setPhoto(null)}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-semibold"
                >
                  ✕ Remove
                </button>
              )}
            </div>
          </div>

          {/* Core fields */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {(
              [
                ["full_name", "Full Name"],
                ["email", "Email Address"],
                ["phone", "Phone Number"],
                ["location", "Location"],
              ] as const
            ).map(([field, ph]) => (
              <input
                key={field}
                className="dada-input"
                placeholder={ph}
                value={resume[field]}
                onChange={(e) => updateField(field, e.target.value)}
              />
            ))}
          </div>

          {/* Social / Portfolio links */}
          <div className="mb-6 p-4 bg-slate-900/30 border border-slate-800 rounded-2xl space-y-3">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">
              Profile Links
            </p>
            {(
              [
                ["linkedin", "LinkedIn URL  e.g. linkedin.com/in/yourname"],
                ["github", "GitHub URL  e.g. github.com/yourname"],
                ["portfolio", "Portfolio / Website URL"],
              ] as const
            ).map(([field, ph]) => (
              <input
                key={field}
                className="dada-input text-xs"
                placeholder={ph}
                value={resume[field]}
                onChange={(e) => updateField(field, e.target.value)}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mb-6">
            <textarea
              className="dada-input min-h-[80px]"
              placeholder="Professional Summary / Bio…"
              value={resume.summary}
              onChange={(e) => updateField("summary", e.target.value)}
            />
          </div>

          {/* Section preset buttons */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-6">
            {SECTION_PRESETS.map((p) => (
              <button
                key={p.title}
                className="tab-btn"
                onClick={() => addSection(p.title, p.isProject)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Dynamic sections */}
          <div className="space-y-5 pb-24">
            <AnimatePresence mode="popLayout">
              {resume.sections.map((sec) => (
                <motion.div
                  key={sec.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 bg-slate-900/30 border border-slate-800 rounded-3xl"
                >
                  {/* Section header row */}
                  <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                    <span className="text-blue-400 font-black text-[10px] tracking-[.2em]">
                      {sec.title}
                    </span>
                    <button
                      className="icon-btn"
                      onClick={() => removeSection(sec.id)}
                    >
                      <Trash2 size={14} color="#f87171" />
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-6">
                    {sec.items.map((item, idx) => (
                      <div key={item.id} className="space-y-3">
                        {idx > 0 && (
                          <div className="flex justify-end">
                            <button
                              className="icon-btn"
                              onClick={() => removeItem(sec.id, item.id)}
                            >
                              <Trash2 size={12} color="#f87171" />
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            className="dada-input text-xs"
                            placeholder={
                              sec.isProject
                                ? "Project Name"
                                : "Organization / Role"
                            }
                            value={item.org}
                            onChange={(e) =>
                              updateItem(sec.id, item.id, "org", e.target.value)
                            }
                          />
                          <input
                            className="dada-input text-xs"
                            placeholder="Date range"
                            value={item.date}
                            onChange={(e) =>
                              updateItem(
                                sec.id,
                                item.id,
                                "date",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        {/* Project link field — shown for ALL sections but labelled for projects */}
                        {sec.isProject && (
                          <div className="link-row">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#60a5fa"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <input
                              placeholder="Project link (GitHub / Live demo / etc.)"
                              value={item.link || ""}
                              onChange={(e) =>
                                updateItem(
                                  sec.id,
                                  item.id,
                                  "link",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        )}

                        <textarea
                          className="dada-input min-h-[90px] text-xs font-mono"
                          placeholder="Details — one bullet per line…"
                          value={item.desc}
                          onChange={(e) =>
                            updateItem(sec.id, item.id, "desc", e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    className="add-item-btn"
                    onClick={() => addItem(sec.id)}
                  >
                    <span style={{ fontSize: 14 }}>+</span> Add Entry
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT PREVIEW ── */}
        <div
          className="hidden lg:block w-full lg:w-1/2 bg-[#010413] overflow-y-auto scrollbar-hide"
          style={{ minHeight: "100vh" }}
        >
          {/* The scaler wrapper grows with the CV — no fixed height clipping */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 20px",
              minHeight: "100%",
            }}
          >
            <div
              style={{
                transformOrigin: "top center",
                transform: "scale(0.65)",
                // Let height grow naturally so 2-page CVs are visible
                alignSelf: "flex-start",
              }}
            >
              <StandardCV data={resume} photo={photo} previewRef={previewRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

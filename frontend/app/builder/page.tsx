"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  FileText,
  ImageIcon,
  Loader2,
  Trash2,
  Sparkles,
} from "lucide-react";
import StandardCV, {
  ResumeData,
  EduEntry,
  ExpEntry,
  ProjectEntry,
  SkillEntry,
  CertEntry,
  ExtraEntry,
} from "@/components/StandardCV";

// ─── BLANKS ──────────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();
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
  desc: "",
});
const blankProj = (): ProjectEntry => ({
  id: uid(),
  name: "",
  link: "",
  duration: "",
  desc: "",
});
const blankSkill = (): SkillEntry => ({ id: uid(), category: "", skills: "" });
const blankCert = (): CertEntry => ({
  id: uid(),
  name: "",
  issuer: "",
  date: "",
});
const blankExtra = (): ExtraEntry => ({ id: uid(), label: "", value: "" });

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
  projects: [blankProj()],
  skills: [blankSkill()],
  certifications: [blankCert()],
  extras: [blankExtra()],
});

// ─── PDF HTML ────────────────────────────────────────────────────────────────
const F = "'Times New Roman', Times, serif";

function buildPDFHtml(data: ResumeData, photo: string | null): string {
  const contacts = [data.email, data.phone, data.location]
    .filter(Boolean)
    .join("  |  ");
  const socials = [
    data.linkedin &&
      `<span><b>LinkedIn:</b> <span style="color:#1a56db">${data.linkedin}</span></span>`,
    data.github &&
      `<span><b>GitHub:</b> <span style="color:#1a56db">${data.github}</span></span>`,
    data.portfolio &&
      `<span><b>Portfolio:</b> <span style="color:#1a56db">${data.portfolio}</span></span>`,
  ]
    .filter(Boolean)
    .join(`<span style="margin:0 8px;color:#666">|</span>`);

  const ST = (t: string) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
      <h2 style="font-family:${F};font-size:11pt;font-weight:bold;text-transform:uppercase;
                 letter-spacing:.07em;margin:0;padding:0;white-space:nowrap;flex-shrink:0">${t}</h2>
      <div style="flex:1;height:1.5px;background:#000;min-width:0"></div>
    </div>`;

  const BD = (t: string) =>
    t
      ? `<span style="font-family:${F};font-size:10pt;font-weight:bold;white-space:nowrap">${t}</span>`
      : "";

  const BL = (desc: string) => {
    const lines = desc
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.length
      ? `<ul style="margin:3px 0 0 18px;padding:0;list-style-type:disc">${lines
          .map(
            (l) =>
              `<li style="font-family:${F};font-size:10pt;line-height:1.55;margin-bottom:2px">${l}</li>`,
          )
          .join("")}</ul>`
      : "";
  };

  const hasPhoto = !!photo;

  // ── Section HTMLs in professional order ──
  const summaryHTML = data.summary
    ? `
    <div style="margin-bottom:14px">
      ${ST("Professional Profile")}
      <p style="font-family:${F};font-size:10.5pt;line-height:1.65;text-align:justify;margin:0">${data.summary}</p>
    </div>`
    : "";

  const eduRows = data.education.filter((e) => e.institution || e.degree);
  const eduHTML = eduRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("Education")}
      ${eduRows
        .map(
          (e, i) => `
        <div style="margin-top:${i === 0 ? "0" : "10px"}">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span style="font-family:${F};font-size:10.5pt;font-weight:bold">${e.institution}</span>
            ${BD(e.duration)}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span style="font-family:${F};font-size:10pt;font-style:italic;color:#222">${e.degree}</span>
            ${e.cgpa ? `<span style="font-family:${F};font-size:10pt">CGPA: <b>${e.cgpa}</b></span>` : ""}
          </div>
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  const expRows = data.experience.filter((e) => e.role || e.org);
  const expHTML = expRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("Work Experience")}
      ${expRows
        .map(
          (e, i) => `
        <div style="margin-top:${i === 0 ? "0" : "10px"}">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span style="font-family:${F};font-size:10.5pt;font-weight:bold">${e.role}</span>
            ${BD(e.duration)}
          </div>
          ${e.org ? `<div style="font-family:${F};font-size:10pt;color:#333;margin-bottom:2px">${e.org}</div>` : ""}
          ${BL(e.desc)}
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  const projRows = data.projects.filter((p) => p.name);
  const projHTML = projRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("Projects / Thesis")}
      ${projRows
        .map(
          (p, i) => `
        <div style="margin-top:${i === 0 ? "0" : "10px"}">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <span style="font-family:${F};font-size:10.5pt;font-weight:bold">${p.name}</span>
            ${BD(p.duration)}
          </div>
          ${p.link ? `<div style="font-family:${F};font-size:9.5pt;color:#1a56db;margin-bottom:2px">🔗 ${p.link}</div>` : ""}
          ${BL(p.desc)}
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  const skillRows = data.skills.filter((s) => s.skills);
  const skillHTML = skillRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("Skills")}
      ${skillRows
        .map(
          (s) => `
        <div style="display:flex;gap:6px;margin-bottom:3px;font-family:${F};font-size:10pt">
          ${s.category ? `<span style="font-weight:bold;flex-shrink:0;min-width:120px">${s.category}:</span>` : ""}
          <span>${s.skills}</span>
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  const certRows = data.certifications.filter((c) => c.name);
  const certHTML = certRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("Certifications")}
      ${certRows
        .map(
          (c, i) => `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:${i === 0 ? "0" : "5px"}">
          <span style="font-family:${F};font-size:10pt">${c.name}${c.issuer ? ` <i style="color:#444">— ${c.issuer}</i>` : ""}</span>
          ${BD(c.date)}
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  const extraRows = data.extras.filter((e) => e.label && e.value);
  const extraHTML = extraRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("Additional Information")}
      ${extraRows
        .map(
          (e) => `
        <div style="display:flex;gap:6px;margin-bottom:3px;font-family:${F};font-size:10pt">
          <span style="font-weight:bold;flex-shrink:0;min-width:140px">${e.label}:</span>
          <span>${e.value}</span>
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
    <style>* { box-sizing:border-box; margin:0; padding:0; } body { background:white; }</style>
  </head><body>
    <div id="cv-root" style="width:794px;padding:53px 68px 60px 68px;background:white;font-family:${F};color:#000">
      <!-- HEADER -->
      <div style="display:flex;justify-content:${hasPhoto ? "space-between" : "center"};align-items:flex-start;
                  border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:14px;gap:14px">
        <div style="flex:${hasPhoto ? "1" : "unset"};text-align:${hasPhoto ? "left" : "center"}">
          <h1 style="font-family:${F};font-size:26pt;font-weight:bold;text-transform:uppercase;
                     letter-spacing:1px;line-height:1.05;margin:0 0 5px 0">${data.full_name || "YOUR NAME"}</h1>
          ${contacts ? `<div style="font-family:${F};font-size:10pt;color:#222;line-height:1.7">${contacts}</div>` : ""}
          ${
            socials
              ? `<div style="font-family:${F};font-size:9.5pt;margin-top:4px;
                              display:flex;flex-wrap:wrap;gap:12px;
                              justify-content:${hasPhoto ? "flex-start" : "center"}">${socials}</div>`
              : ""
          }
        </div>
        ${
          hasPhoto
            ? `<div style="width:100px;height:126px;flex-shrink:0;border:1.5px solid #000;overflow:hidden;background:#f0f0f0">
          <img src="${photo}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block"/>
        </div>`
            : ""
        }
      </div>
      ${summaryHTML}${eduHTML}${expHTML}${projHTML}${skillHTML}${certHTML}${extraHTML}
    </div>
  </body></html>`;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Builder() {
  const [mounted, setMounted] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingDOCX, setExportingDOCX] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeData>(initResume);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── FIELD UPDATER ───────────────────────────────────────────────────────
  const setField = (field: keyof ResumeData, val: string) =>
    setResume((p) => ({ ...p, [field]: val }));

  function makeUpdaters<T extends { id: number }>(
    key: keyof ResumeData,
    blankFn: () => T,
  ) {
    const add = () =>
      setResume((p) => ({ ...p, [key]: [...(p[key] as T[]), blankFn()] }));
    const remove = (id: number) =>
      setResume((p) => ({
        ...p,
        [key]: (p[key] as T[]).filter((x) => x.id !== id),
      }));
    const update = (id: number, f: keyof T, v: string) =>
      setResume((p) => ({
        ...p,
        [key]: (p[key] as T[]).map((x) => (x.id === id ? { ...x, [f]: v } : x)),
      }));
    return { add, remove, update };
  }

  const edu = makeUpdaters<EduEntry>("education", blankEdu);
  const exp = makeUpdaters<ExpEntry>("experience", blankExp);
  const proj = makeUpdaters<ProjectEntry>("projects", blankProj);
  const skill = makeUpdaters<SkillEntry>("skills", blankSkill);
  const cert = makeUpdaters<CertEntry>("certifications", blankCert);
  const extra = makeUpdaters<ExtraEntry>("extras", blankExtra);

  // ─── AI IMPROVE ──────────────────────────────────────────────────────────
  const aiImprove = async (
    text: string,
    ctx: string,
    onResult: (v: string) => void,
    key: string,
  ) => {
    if (!text.trim()) return;
    setAiLoading(key);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [
            {
              role: "user",
              content: `You are an expert CV writer. Improve the following ${ctx} to be more professional, concise, and ATS-friendly. Keep bullet points (one per line). Return ONLY the improved text, no commentary.\n\nOriginal:\n${text}`,
            },
          ],
        }),
      });
      const d = await res.json();
      const improved = d.content
        ?.find((c: any) => c.type === "text")
        ?.text?.trim();
      if (improved) onResult(improved);
    } catch (e) {
      console.error("AI error:", e);
    }
    setAiLoading(null);
  };

  // ─── PDF EXPORT ──────────────────────────────────────────────────────────
  const exportPDF = async () => {
    setExportingPDF(true);
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then((m) => m.default),
      ]);

      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;top:0;left:-9999px;width:794px;height:1080px;border:none;opacity:0;pointer-events:none;z-index:-1";
      document.body.appendChild(iframe);
      const iDoc = iframe.contentDocument!;
      iDoc.open();
      iDoc.write(buildPDFHtml(resume, photo));
      iDoc.close();

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
      await new Promise((r) => setTimeout(r, 400));

      const root = iDoc.getElementById("cv-root") as HTMLElement;
      const totalH = root.scrollHeight;
      iframe.style.height = totalH + "px";
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        height: totalH,
        windowWidth: 794,
        windowHeight: totalH,
      });
      document.body.removeChild(iframe);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const PW = 210,
        PH = 297;
      const pxPerMm = canvas.width / PW;
      const pageHpx = Math.round(PH * pxPerMm);
      const pages = Math.ceil(canvas.height / pageHpx);

      for (let p = 0; p < pages; p++) {
        if (p > 0) pdf.addPage();
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = pageHpx;
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, -(p * pageHpx));
        pdf.addImage(slice.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, PW, PH);
      }
      pdf.save(`${resume.full_name || "Resume"}_CV.pdf`);
    } catch (e) {
      console.error("PDF error:", e);
      alert("PDF export failed — check console.");
    }
    setExportingPDF(false);
  };

  // ─── DOCX EXPORT ─────────────────────────────────────────────────────────
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
      const TN = "Times New Roman";
      const ch: any[] = [];

      const SH = (t: string) =>
        new Paragraph({
          spacing: { before: 240, after: 60 },
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
          },
          children: [
            new TextRun({
              text: t.toUpperCase(),
              bold: true,
              size: 22,
              font: TN,
            }),
          ],
        });

      // Name
      ch.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: (resume.full_name || "YOUR NAME").toUpperCase(),
              bold: true,
              size: 48,
              font: TN,
            }),
          ],
        }),
      );

      const contactLine = [resume.email, resume.phone, resume.location]
        .filter(Boolean)
        .join("  |  ");
      if (contactLine)
        ch.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: contactLine,
                size: 20,
                color: "444444",
                font: TN,
              }),
            ],
          }),
        );

      const socs = [
        resume.linkedin && `LinkedIn: ${resume.linkedin}`,
        resume.github && `GitHub: ${resume.github}`,
        resume.portfolio && `Portfolio: ${resume.portfolio}`,
      ].filter(Boolean) as string[];
      if (socs.length)
        ch.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: socs.join("   |   "),
                size: 18,
                color: "1a56db",
                font: TN,
              }),
            ],
          }),
        );

      // Summary
      if (resume.summary) {
        ch.push(SH("Professional Profile"));
        ch.push(
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: resume.summary, size: 20, font: TN }),
            ],
          }),
        );
      }

      // Education
      const eduRows = resume.education.filter((e) => e.institution || e.degree);
      if (eduRows.length) {
        ch.push(SH("Education"));
        for (const e of eduRows) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [
                new TextRun({
                  text: e.institution,
                  bold: true,
                  size: 21,
                  font: TN,
                }),
                e.duration
                  ? new TextRun({
                      text: `\t${e.duration}`,
                      bold: true,
                      size: 20,
                      font: TN,
                    })
                  : new TextRun(""),
              ],
            }),
          );
          if (e.degree || e.cgpa)
            ch.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({
                    text: e.degree,
                    size: 20,
                    font: TN,
                    italics: true,
                  }),
                  e.cgpa
                    ? new TextRun({
                        text: `\tCGPA: ${e.cgpa}`,
                        size: 20,
                        font: TN,
                        bold: true,
                      })
                    : new TextRun(""),
                ],
              }),
            );
        }
      }

      // Experience
      const expRows = resume.experience.filter((e) => e.role || e.org);
      if (expRows.length) {
        ch.push(SH("Work Experience"));
        for (const e of expRows) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [
                new TextRun({ text: e.role, bold: true, size: 21, font: TN }),
                e.duration
                  ? new TextRun({
                      text: `\t${e.duration}`,
                      bold: true,
                      size: 20,
                      font: TN,
                    })
                  : new TextRun(""),
              ],
            }),
          );
          if (e.org)
            ch.push(
              new Paragraph({
                spacing: { after: 20 },
                children: [new TextRun({ text: e.org, size: 20, font: TN })],
              }),
            );
          for (const b of e.desc.split("\n").filter((b) => b.trim()))
            ch.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [new TextRun({ text: b.trim(), size: 20, font: TN })],
              }),
            );
        }
      }

      // Projects
      const projRows = resume.projects.filter((p) => p.name);
      if (projRows.length) {
        ch.push(SH("Projects / Thesis"));
        for (const p of projRows) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [
                new TextRun({ text: p.name, bold: true, size: 21, font: TN }),
                p.duration
                  ? new TextRun({
                      text: `\t${p.duration}`,
                      bold: true,
                      size: 20,
                      font: TN,
                    })
                  : new TextRun(""),
              ],
            }),
          );
          if (p.link)
            ch.push(
              new Paragraph({
                spacing: { after: 20 },
                children: [
                  new TextRun({ text: "Link: ", size: 19, font: TN }),
                  new ExternalHyperlink({
                    link: p.link,
                    children: [
                      new TextRun({
                        text: p.link,
                        size: 19,
                        font: TN,
                        color: "1a56db",
                        underline: {},
                      }),
                    ],
                  }),
                ],
              }),
            );
          for (const b of p.desc.split("\n").filter((b) => b.trim()))
            ch.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [new TextRun({ text: b.trim(), size: 20, font: TN })],
              }),
            );
        }
      }

      // Skills
      const skillRows = resume.skills.filter((s) => s.skills);
      if (skillRows.length) {
        ch.push(SH("Skills"));
        for (const s of skillRows)
          ch.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                s.category
                  ? new TextRun({
                      text: `${s.category}: `,
                      bold: true,
                      size: 20,
                      font: TN,
                    })
                  : new TextRun(""),
                new TextRun({ text: s.skills, size: 20, font: TN }),
              ],
            }),
          );
      }

      // Certifications
      const certRows = resume.certifications.filter((c) => c.name);
      if (certRows.length) {
        ch.push(SH("Certifications"));
        for (const c of certRows)
          ch.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                new TextRun({ text: c.name, size: 20, font: TN }),
                c.issuer
                  ? new TextRun({
                      text: ` — ${c.issuer}`,
                      size: 20,
                      font: TN,
                      italics: true,
                    })
                  : new TextRun(""),
                c.date
                  ? new TextRun({
                      text: `\t${c.date}`,
                      bold: true,
                      size: 20,
                      font: TN,
                    })
                  : new TextRun(""),
              ],
            }),
          );
      }

      // Extras
      const extraRows = resume.extras.filter((e) => e.label && e.value);
      if (extraRows.length) {
        ch.push(SH("Additional Information"));
        for (const e of extraRows)
          ch.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: `${e.label}: `,
                  bold: true,
                  size: 20,
                  font: TN,
                }),
                new TextRun({ text: e.value, size: 20, font: TN }),
              ],
            }),
          );
      }

      const doc = new Document({ sections: [{ children: ch }] });
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

  if (!mounted) return null;
  const isExporting = exportingPDF || exportingDOCX;

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .di { width:100%; background:rgba(15,23,42,.6); border:1px solid rgba(100,116,139,.25);
              border-radius:10px; padding:9px 13px; color:#e2e8f0; font-size:13px;
              outline:none; transition:border-color .2s,box-shadow .2s; resize:none; font-family:inherit; }
        .di:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.15); }
        .di::placeholder { color:#475569; }

        .abtn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px;
                border-radius:10px; font-size:12px; font-weight:700; border:none;
                cursor:pointer; color:#fff; transition:transform .15s,box-shadow .15s,filter .15s; }
        .abtn:hover { transform:translateY(-1px) scale(1.03); filter:brightness(1.1); box-shadow:0 6px 20px rgba(0,0,0,.4); }
        .abtn:active { transform:translateY(1px) scale(.97); }
        .abtn:disabled { opacity:.55; cursor:not-allowed; transform:none; }

        .aibtn { display:inline-flex; align-items:center; gap:5px; padding:5px 10px;
                 border-radius:8px; font-size:11px; font-weight:600; border:none;
                 cursor:pointer; background:rgba(99,102,241,.12); color:#a5b4fc;
                 border:1px solid rgba(99,102,241,.25); transition:all .2s; }
        .aibtn:hover { background:rgba(99,102,241,.22); color:#c7d2fe; }
        .aibtn:disabled { opacity:.5; cursor:not-allowed; }

        .add-btn { display:flex; align-items:center; gap:5px; margin-top:10px;
                   padding:5px 12px; border-radius:8px; background:rgba(59,130,246,.07);
                   border:1px dashed rgba(59,130,246,.3); color:#60a5fa; font-size:11px;
                   font-weight:600; cursor:pointer; transition:all .2s; width:fit-content; }
        .add-btn:hover { background:rgba(59,130,246,.14); border-color:#3b82f6; }

        .icon-btn { display:inline-flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:7px; border:none;
                    cursor:pointer; transition:all .15s; background:transparent; }
        .icon-btn:hover { background:rgba(239,68,68,.15); }

        .sec-box { padding:20px 22px; background:rgba(15,23,42,.5);
                   border:1px solid rgba(51,65,85,.7); border-radius:20px; margin-bottom:12px; }
        .sec-label { font-size:9px; font-weight:900; letter-spacing:.18em; text-transform:uppercase;
                     color:#475569; margin-bottom:10px; }
        .entry-divider { border:none; border-top:1px solid rgba(51,65,85,.5); margin:14px 0; }

        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

        .link-row { display:flex; align-items:center; gap:8px; background:rgba(15,23,42,.6);
                    border:1px solid rgba(59,130,246,.25); border-radius:10px; padding:8px 13px; }
        .link-row input { flex:1; background:transparent; border:none; outline:none;
                          color:#93c5fd; font-size:12px; font-family:inherit; }
        .link-row input::placeholder { color:#334155; }
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

        {/* ══ LEFT EDITOR ═══════════════════════════════════════════════════ */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto max-h-screen scrollbar-hide border-r border-white/5">
          {/* Top bar */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black text-blue-500 italic tracking-tighter">
              CV DADA
            </h1>
            <div className="flex gap-3">
              <button
                onClick={exportPDF}
                disabled={isExporting}
                className="abtn"
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
                className="abtn"
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

          {/* ── 0. PHOTO ── */}
          <div className="sec-box flex items-center gap-5 mb-2">
            <label className="cursor-pointer">
              <div
                style={{
                  width: 88,
                  height: 110,
                  borderRadius: 10,
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
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                ) : (
                  <ImageIcon size={22} color="#475569" />
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

          {/* ── 1. PERSONAL INFO ── */}
          <div className="sec-box">
            <div className="sec-label">1 · Personal Information</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                className="di text-xs col-span-2"
                placeholder="Full Name"
                value={resume.full_name}
                onChange={(e) => setField("full_name", e.target.value)}
              />
              <input
                className="di text-xs"
                placeholder="Email Address"
                value={resume.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              <input
                className="di text-xs"
                placeholder="Phone Number"
                value={resume.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <input
                className="di text-xs col-span-2"
                placeholder="Location  e.g. Dhaka, Bangladesh"
                value={resume.location}
                onChange={(e) => setField("location", e.target.value)}
              />
            </div>
            <div className="sec-label mt-3">Profile Links (optional)</div>
            <div className="space-y-2">
              <input
                className="di text-xs"
                placeholder="LinkedIn  e.g. linkedin.com/in/yourname"
                value={resume.linkedin}
                onChange={(e) => setField("linkedin", e.target.value)}
              />
              <input
                className="di text-xs"
                placeholder="GitHub  e.g. github.com/yourname"
                value={resume.github}
                onChange={(e) => setField("github", e.target.value)}
              />
              <input
                className="di text-xs"
                placeholder="Portfolio / Website"
                value={resume.portfolio}
                onChange={(e) => setField("portfolio", e.target.value)}
              />
            </div>
          </div>

          {/* ── 2. SUMMARY ── */}
          <div className="sec-box">
            <div className="flex justify-between items-center mb-2">
              <div className="sec-label mb-0">
                2 · Professional Summary (optional)
              </div>
              <button
                className="aibtn"
                disabled={!!aiLoading}
                onClick={() =>
                  aiImprove(
                    resume.summary,
                    "professional summary",
                    (v) => setField("summary", v),
                    "summary",
                  )
                }
              >
                {aiLoading === "summary" ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Sparkles size={10} />
                )}{" "}
                AI
              </button>
            </div>
            <textarea
              className="di min-h-[80px] text-xs"
              placeholder="Write a 2–3 sentence professional profile…"
              value={resume.summary}
              onChange={(e) => setField("summary", e.target.value)}
            />
          </div>

          {/* ── 3. EDUCATION ── */}
          <div className="sec-box">
            <div className="sec-label">3 · Education</div>
            {resume.education.map((e, idx) => (
              <div key={e.id}>
                {idx > 0 && <hr className="entry-divider" />}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-600 font-bold">
                    Degree {idx + 1}
                  </span>
                  {idx > 0 && (
                    <button
                      className="icon-btn"
                      onClick={() => edu.remove(e.id)}
                    >
                      <Trash2 size={12} color="#f87171" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    className="di text-xs col-span-2"
                    placeholder="University / Institution"
                    value={e.institution}
                    onChange={(ev) =>
                      edu.update(e.id, "institution", ev.target.value)
                    }
                  />
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Degree / Program  e.g. BSc Computer Science"
                    value={e.degree}
                    onChange={(ev) =>
                      edu.update(e.id, "degree", ev.target.value)
                    }
                  />
                  <input
                    className="di text-xs"
                    placeholder="Duration  e.g. 2020 – 2024"
                    value={e.duration}
                    onChange={(ev) =>
                      edu.update(e.id, "duration", ev.target.value)
                    }
                  />
                  <input
                    className="di text-xs"
                    placeholder="CGPA  e.g. 3.75 / 4.00"
                    value={e.cgpa}
                    onChange={(ev) => edu.update(e.id, "cgpa", ev.target.value)}
                  />
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={edu.add}>
              + Add Degree
            </button>
          </div>

          {/* ── 4. EXPERIENCE ── */}
          <div className="sec-box">
            <div className="sec-label">4 · Work Experience</div>
            {resume.experience.map((e, idx) => (
              <div key={e.id}>
                {idx > 0 && <hr className="entry-divider" />}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-600 font-bold">
                    Job {idx + 1}
                  </span>
                  {idx > 0 && (
                    <button
                      className="icon-btn"
                      onClick={() => exp.remove(e.id)}
                    >
                      <Trash2 size={12} color="#f87171" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Role / Position"
                    value={e.role}
                    onChange={(ev) => exp.update(e.id, "role", ev.target.value)}
                  />
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Company / Organization"
                    value={e.org}
                    onChange={(ev) => exp.update(e.id, "org", ev.target.value)}
                  />
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Duration  e.g. Jan 2022 – Present"
                    value={e.duration}
                    onChange={(ev) =>
                      exp.update(e.id, "duration", ev.target.value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    Responsibilities
                  </span>
                  <button
                    className="aibtn"
                    disabled={!!aiLoading}
                    onClick={() =>
                      aiImprove(
                        e.desc,
                        "work experience description",
                        (v) => exp.update(e.id, "desc", v),
                        `exp-${e.id}`,
                      )
                    }
                  >
                    {aiLoading === `exp-${e.id}` ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Sparkles size={10} />
                    )}{" "}
                    AI
                  </button>
                </div>
                <textarea
                  className="di min-h-[80px] text-xs font-mono"
                  placeholder="Bullet points — one per line…"
                  value={e.desc}
                  onChange={(ev) => exp.update(e.id, "desc", ev.target.value)}
                />
              </div>
            ))}
            <button className="add-btn" onClick={exp.add}>
              + Add Job
            </button>
          </div>

          {/* ── 5. PROJECTS ── */}
          <div className="sec-box">
            <div className="sec-label">5 · Projects / Thesis / Research</div>
            {resume.projects.map((p, idx) => (
              <div key={p.id}>
                {idx > 0 && <hr className="entry-divider" />}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-600 font-bold">
                    Project {idx + 1}
                  </span>
                  {idx > 0 && (
                    <button
                      className="icon-btn"
                      onClick={() => proj.remove(p.id)}
                    >
                      <Trash2 size={12} color="#f87171" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Project / Thesis Title"
                    value={p.name}
                    onChange={(ev) =>
                      proj.update(p.id, "name", ev.target.value)
                    }
                  />
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Duration  e.g. 2023 – 2024"
                    value={p.duration}
                    onChange={(ev) =>
                      proj.update(p.id, "duration", ev.target.value)
                    }
                  />
                </div>
                <div className="link-row mb-2">
                  <svg
                    width="12"
                    height="12"
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
                    placeholder="GitHub / Live demo / Paper link"
                    value={p.link}
                    onChange={(ev) =>
                      proj.update(p.id, "link", ev.target.value)
                    }
                  />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    Description
                  </span>
                  <button
                    className="aibtn"
                    disabled={!!aiLoading}
                    onClick={() =>
                      aiImprove(
                        p.desc,
                        "project description",
                        (v) => proj.update(p.id, "desc", v),
                        `proj-${p.id}`,
                      )
                    }
                  >
                    {aiLoading === `proj-${p.id}` ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Sparkles size={10} />
                    )}{" "}
                    AI
                  </button>
                </div>
                <textarea
                  className="di min-h-[70px] text-xs font-mono"
                  placeholder="Bullet points — one per line…"
                  value={p.desc}
                  onChange={(ev) => proj.update(p.id, "desc", ev.target.value)}
                />
              </div>
            ))}
            <button className="add-btn" onClick={proj.add}>
              + Add Project
            </button>
          </div>

          {/* ── 6. SKILLS ── */}
          <div className="sec-box">
            <div className="sec-label">6 · Skills</div>
            {resume.skills.map((s, idx) => (
              <div key={s.id} className="flex gap-2 mb-2 items-center">
                <input
                  className="di text-xs"
                  style={{ maxWidth: 130 }}
                  placeholder="Category"
                  value={s.category}
                  onChange={(e) =>
                    skill.update(s.id, "category", e.target.value)
                  }
                />
                <input
                  className="di text-xs flex-1"
                  placeholder="Python, React, Docker…"
                  value={s.skills}
                  onChange={(e) => skill.update(s.id, "skills", e.target.value)}
                />
                {idx > 0 && (
                  <button
                    className="icon-btn"
                    onClick={() => skill.remove(s.id)}
                  >
                    <Trash2 size={12} color="#f87171" />
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={skill.add}>
              + Add Category
            </button>
          </div>

          {/* ── 7. CERTIFICATIONS ── */}
          <div className="sec-box">
            <div className="sec-label">7 · Certifications (optional)</div>
            {resume.certifications.map((c, idx) => (
              <div
                key={c.id}
                className="grid grid-cols-2 gap-2 mb-2 items-center"
              >
                <input
                  className="di text-xs col-span-2"
                  placeholder="Certificate Name"
                  value={c.name}
                  onChange={(e) => cert.update(c.id, "name", e.target.value)}
                />
                <input
                  className="di text-xs"
                  placeholder="Issuer  e.g. Coursera"
                  value={c.issuer}
                  onChange={(e) => cert.update(c.id, "issuer", e.target.value)}
                />
                <div className="flex gap-2 items-center">
                  <input
                    className="di text-xs flex-1"
                    placeholder="Date  e.g. 2023"
                    value={c.date}
                    onChange={(e) => cert.update(c.id, "date", e.target.value)}
                  />
                  {idx > 0 && (
                    <button
                      className="icon-btn"
                      onClick={() => cert.remove(c.id)}
                    >
                      <Trash2 size={12} color="#f87171" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button className="add-btn" onClick={cert.add}>
              + Add Certificate
            </button>
          </div>

          {/* ── 8. ADDITIONAL INFO ── */}
          <div className="sec-box pb-6">
            <div className="sec-label">
              8 · Additional Information (optional)
            </div>
            {resume.extras.map((e, idx) => (
              <div key={e.id} className="flex gap-2 mb-2 items-center">
                <input
                  className="di text-xs"
                  style={{ maxWidth: 150 }}
                  placeholder="Label  e.g. Languages"
                  value={e.label}
                  onChange={(ev) =>
                    extra.update(e.id, "label", ev.target.value)
                  }
                />
                <input
                  className="di text-xs flex-1"
                  placeholder="Value"
                  value={e.value}
                  onChange={(ev) =>
                    extra.update(e.id, "value", ev.target.value)
                  }
                />
                {idx > 0 && (
                  <button
                    className="icon-btn"
                    onClick={() => extra.remove(e.id)}
                  >
                    <Trash2 size={12} color="#f87171" />
                  </button>
                )}
              </div>
            ))}
            <button className="add-btn" onClick={extra.add}>
              + Add Row
            </button>
          </div>
        </div>
        {/* end LEFT */}

        {/* ══ RIGHT PREVIEW ═════════════════════════════════════════════════ */}
        <div
          className="hidden lg:block w-full lg:w-1/2 bg-[#010413] overflow-y-auto scrollbar-hide"
          style={{ minHeight: "100vh" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0",
              minHeight: "100%",
            }}
          >
            <div
              style={{
                transformOrigin: "top center",
                transform: "scale(0.65)",
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

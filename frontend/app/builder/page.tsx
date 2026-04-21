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
  Wand2,
  ChevronDown,
  ChevronUp,
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
  bullets: "",
});
const blankProj = (): ProjectEntry => ({
  id: uid(),
  name: "",
  link: "",
  duration: "",
  bullets: "",
});
const blankSkill = (): SkillEntry => ({ id: uid(), category: "", skills: "" });
const blankCert = (): CertEntry => ({
  id: uid(),
  name: "",
  issuer: "",
  date: "",
});
const blankRef = (): RefEntry => ({
  id: uid(),
  name: "",
  title: "",
  org: "",
  phone: "",
  email: "",
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
  references: [blankRef()],
  extras: [blankExtra()],
});

// ─── PDF HTML BUILDER ────────────────────────────────────────────────────────
const F = "'Times New Roman', Times, serif";

function buildPDFHtml(data: ResumeData, photo: string | null): string {
  const contacts = [data.email, data.phone, data.location]
    .filter(Boolean)
    .join("  |  ");
  const hasPhoto = !!photo;

  const ST = (t: string) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <h2 style="font-family:${F};font-size:11pt;font-weight:bold;text-transform:uppercase;
                 letter-spacing:.07em;margin:0;padding:0;white-space:nowrap;flex-shrink:0">${t}</h2>
      <div style="flex:1;height:1.5px;background:#000;min-width:0"></div>
    </div>`;

  const BD = (t: string) =>
    t
      ? `<span style="font-family:${F};font-size:10pt;font-weight:bold;white-space:nowrap;flex-shrink:0">${t}</span>`
      : "";

  const BL = (text: string) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.length
      ? `<ul style="margin:3px 0 0 18px;padding:0;list-style-type:disc">${lines
          .map(
            (l) =>
              `<li style="font-family:${F};font-size:10pt;line-height:1.6;margin-bottom:2px">${l}</li>`,
          )
          .join("")}</ul>`
      : "";
  };

  // Social links each on own line
  const socialLines = [
    data.linkedin &&
      `<div style="font-family:${F};font-size:9.5pt;margin-top:2px"><b>LinkedIn:</b> <span style="color:#1a56db">${data.linkedin}</span></div>`,
    data.github &&
      `<div style="font-family:${F};font-size:9.5pt;margin-top:2px"><b>GitHub:</b> <span style="color:#1a56db">${data.github}</span></div>`,
    data.portfolio &&
      `<div style="font-family:${F};font-size:9.5pt;margin-top:2px"><b>Portfolio:</b> <span style="color:#1a56db">${data.portfolio}</span></div>`,
  ]
    .filter(Boolean)
    .join("");

  const summaryHTML = data.summary
    ? `
    <div style="margin-bottom:14px">
      ${ST("Professional Profile")}
      <p style="font-family:${F};font-size:10.5pt;line-height:1.7;text-align:justify;margin:0">${data.summary}</p>
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
        <div style="margin-top:${i === 0 ? "0" : "9px"}">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px">
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
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px">
            <span style="font-family:${F};font-size:10.5pt;font-weight:bold">${e.role}</span>
            ${BD(e.duration)}
          </div>
          ${e.org ? `<div style="font-family:${F};font-size:10pt;color:#333;margin-bottom:2px">${e.org}</div>` : ""}
          ${BL(e.bullets)}
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
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px">
            <span style="font-family:${F};font-size:10.5pt;font-weight:bold">${p.name}</span>
            ${BD(p.duration)}
          </div>
          ${p.link ? `<div style="font-family:${F};font-size:9.5pt;color:#1a56db;margin-bottom:2px">🔗 ${p.link}</div>` : ""}
          ${BL(p.bullets)}
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
        <div style="display:flex;gap:6px;margin-bottom:4px;font-family:${F};font-size:10pt;line-height:1.5">
          ${s.category ? `<span style="font-weight:bold;flex-shrink:0;min-width:130px">${s.category}:</span>` : ""}
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
          <span style="font-family:${F};font-size:10pt">
            <b>${c.name}</b>${c.issuer ? ` <i style="color:#444">— ${c.issuer}</i>` : ""}
          </span>
          ${BD(c.date)}
        </div>`,
        )
        .join("")}
    </div>`
    : "";

  const refRows = data.references.filter((r) => r.name);
  const refHTML = refRows.length
    ? `
    <div style="margin-bottom:14px">
      ${ST("References")}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 24px">
        ${refRows
          .map(
            (r) => `
          <div>
            <div style="font-family:${F};font-size:10.5pt;font-weight:bold;margin-bottom:1px">${r.name}</div>
            ${r.title ? `<div style="font-family:${F};font-size:10pt;font-style:italic;color:#333">${r.title}</div>` : ""}
            ${r.org ? `<div style="font-family:${F};font-size:10pt;color:#444">${r.org}</div>` : ""}
            ${r.phone ? `<div style="font-family:${F};font-size:9.5pt;color:#444">Phone: ${r.phone}</div>` : ""}
            ${r.email ? `<div style="font-family:${F};font-size:9.5pt;color:#1a56db">Email: ${r.email}</div>` : ""}
          </div>`,
          )
          .join("")}
      </div>
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
        <div style="display:flex;gap:6px;margin-bottom:4px;font-family:${F};font-size:10pt">
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
      <div style="display:flex;justify-content:${hasPhoto ? "space-between" : "center"};align-items:flex-start;
                  border-bottom:2.5px solid #000;padding-bottom:12px;margin-bottom:14px;gap:14px">
        <div style="flex:${hasPhoto ? "1" : "unset"};text-align:${hasPhoto ? "left" : "center"}">
          <h1 style="font-family:${F};font-size:26pt;font-weight:bold;text-transform:uppercase;
                     letter-spacing:1px;line-height:1.05;margin:0 0 5px 0">${data.full_name || "YOUR NAME"}</h1>
          ${contacts ? `<div style="font-family:${F};font-size:10pt;color:#222;line-height:1.7">${contacts}</div>` : ""}
          ${socialLines}
        </div>
        ${
          hasPhoto
            ? `<div style="width:100px;height:126px;flex-shrink:0;border:1.5px solid #000;overflow:hidden;background:#f0f0f0">
          <img src="${photo}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block"/></div>`
            : ""
        }
      </div>
      ${summaryHTML}${eduHTML}${expHTML}${projHTML}${skillHTML}${certHTML}${refHTML}${extraHTML}
    </div>
  </body></html>`;
}

// ─── AI CV BUILDER ───────────────────────────────────────────────────────────
// Uses the Anthropic API (already available via claude.ai artifacts)
async function generateCVWithAI(
  brief: string,
  setResume: (r: ResumeData) => void,
  setStatus: (s: string) => void,
) {
  setStatus("Calling AI…");
  try {
    const prompt = `You are an expert CV writer. Based on the following brief information about a person, generate a complete, professional, ATS-friendly CV data object.

BRIEF:
${brief}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string or empty",
  "github": "string or empty",
  "portfolio": "string or empty",
  "summary": "3-4 sentence professional profile",
  "education": [
    { "institution": "string", "degree": "string", "cgpa": "string or empty", "duration": "string e.g. 2020 – 2024" }
  ],
  "experience": [
    { "role": "string", "org": "string", "duration": "string", "bullets": "bullet1\nbullet2\nbullet3" }
  ],
  "projects": [
    { "name": "string", "link": "string or empty", "duration": "string or empty", "bullets": "bullet1\nbullet2" }
  ],
  "skills": [
    { "category": "category name", "skills": "skill1, skill2, skill3" }
  ],
  "certifications": [],
  "references": [],
  "extras": []
}

Rules:
- Write 3-5 strong, quantified bullet points per experience entry
- Bullets must start with action verbs
- Keep summary professional and concise
- If info is missing, make reasonable professional assumptions
- Return ONLY the JSON, nothing else`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    setStatus("Parsing response…");
    const d = await res.json();
    const raw =
      d.content?.find((c: any) => c.type === "text")?.text?.trim() ?? "";

    // strip possible markdown fences
    const jsonStr = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    const parsed = JSON.parse(jsonStr);

    // Inject IDs
    const withIds = {
      ...parsed,
      education: (parsed.education || []).map((e: any) => ({
        ...e,
        id: uid(),
      })),
      experience: (parsed.experience || []).map((e: any) => ({
        ...e,
        id: uid(),
      })),
      projects: (parsed.projects || []).map((e: any) => ({ ...e, id: uid() })),
      skills: (parsed.skills || []).map((e: any) => ({ ...e, id: uid() })),
      certifications: (parsed.certifications || []).map((e: any) => ({
        ...e,
        id: uid(),
      })),
      references: (parsed.references || []).map((e: any) => ({
        ...e,
        id: uid(),
      })),
      extras: (parsed.extras || []).map((e: any) => ({ ...e, id: uid() })),
    };

    setResume(withIds as ResumeData);
    setStatus("done");
  } catch (e) {
    console.error("AI generate error:", e);
    setStatus("error");
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function Builder() {
  const [mounted, setMounted] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingDOCX, setExportingDOCX] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiGenStatus, setAiGenStatus] = useState<string>("");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiBrief, setAiBrief] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeData>(initResume);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSection = (key: string) =>
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  // ─── UPDATERS ──────────────────────────────────────────────────────────
  const setField = (f: keyof ResumeData, v: string) =>
    setResume((p) => ({ ...p, [f]: v }));

  function makeU<T extends { id: number }>(
    key: keyof ResumeData,
    blank: () => T,
  ) {
    const add = () =>
      setResume((p) => ({ ...p, [key]: [...(p[key] as T[]), blank()] }));
    const remove = (id: number) =>
      setResume((p) => ({
        ...p,
        [key]: (p[key] as T[]).filter((x) => x.id !== id),
      }));
    const upd = (id: number, f: keyof T, v: string) =>
      setResume((p) => ({
        ...p,
        [key]: (p[key] as T[]).map((x) => (x.id === id ? { ...x, [f]: v } : x)),
      }));
    return { add, remove, upd };
  }

  const edu = makeU<EduEntry>("education", blankEdu);
  const exp = makeU<ExpEntry>("experience", blankExp);
  const proj = makeU<ProjectEntry>("projects", blankProj);
  const skill = makeU<SkillEntry>("skills", blankSkill);
  const cert = makeU<CertEntry>("certifications", blankCert);
  const ref_ = makeU<RefEntry>("references", blankRef);
  const extra = makeU<ExtraEntry>("extras", blankExtra);

  // ─── AI IMPROVE (single field) ─────────────────────────────────────────
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
              content: `You are an expert CV writer. Improve the following ${ctx} to be professional, concise, and ATS-friendly. Use action verbs. Keep bullet points (one per line). Return ONLY the improved text, no commentary.\n\nOriginal:\n${text}`,
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

  // ─── PDF EXPORT ────────────────────────────────────────────────────────
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
      alert("PDF failed — check console.");
    }
    setExportingPDF(false);
  };

  // ─── DOCX EXPORT ───────────────────────────────────────────────────────
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
        TabStopType,
        TabStopLeader,
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
      const bd = (t: string) =>
        new TextRun({ text: t, bold: true, size: 20, font: TN });
      const tx = (t: string, opts: any = {}) =>
        new TextRun({ text: t, size: 20, font: TN, ...opts });

      // Header
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

      const cl = [resume.email, resume.phone, resume.location]
        .filter(Boolean)
        .join("  |  ");
      if (cl)
        ch.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [tx(cl, { color: "444444" })],
          }),
        );
      if (resume.linkedin)
        ch.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              bd("LinkedIn: "),
              tx(resume.linkedin, { color: "1a56db" }),
            ],
          }),
        );
      if (resume.github)
        ch.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [bd("GitHub: "), tx(resume.github, { color: "1a56db" })],
          }),
        );
      if (resume.portfolio)
        ch.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              bd("Portfolio: "),
              tx(resume.portfolio, { color: "1a56db" }),
            ],
          }),
        );

      // Summary
      if (resume.summary) {
        ch.push(SH("Professional Profile"));
        ch.push(
          new Paragraph({
            spacing: { after: 200 },
            children: [tx(resume.summary)],
          }),
        );
      }

      // Education
      const eduR = resume.education.filter((e) => e.institution || e.degree);
      if (eduR.length) {
        ch.push(SH("Education"));
        for (const e of eduR) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [
                bd(e.institution),
                ...(e.duration ? [tx("\t" + e.duration, { bold: true })] : []),
              ],
            }),
          );
          if (e.degree || e.cgpa)
            ch.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  tx(e.degree, { italics: true }),
                  ...(e.cgpa ? [tx("\tCGPA: ", {}), bd(e.cgpa)] : []),
                ],
              }),
            );
        }
      }

      // Experience
      const expR = resume.experience.filter((e) => e.role || e.org);
      if (expR.length) {
        ch.push(SH("Work Experience"));
        for (const e of expR) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [
                bd(e.role),
                ...(e.duration ? [tx("\t" + e.duration, { bold: true })] : []),
              ],
            }),
          );
          if (e.org)
            ch.push(
              new Paragraph({ spacing: { after: 20 }, children: [tx(e.org)] }),
            );
          for (const b of e.bullets.split("\n").filter((b) => b.trim()))
            ch.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [tx(b.trim())],
              }),
            );
        }
      }

      // Projects
      const prR = resume.projects.filter((p) => p.name);
      if (prR.length) {
        ch.push(SH("Projects / Thesis"));
        for (const p of prR) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [
                bd(p.name),
                ...(p.duration ? [tx("\t" + p.duration, { bold: true })] : []),
              ],
            }),
          );
          if (p.link)
            ch.push(
              new Paragraph({
                spacing: { after: 20 },
                children: [
                  tx("Link: "),
                  new ExternalHyperlink({
                    link: p.link,
                    children: [tx(p.link, { color: "1a56db", underline: {} })],
                  }),
                ],
              }),
            );
          for (const b of p.bullets.split("\n").filter((b) => b.trim()))
            ch.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: [tx(b.trim())],
              }),
            );
        }
      }

      // Skills
      const skR = resume.skills.filter((s) => s.skills);
      if (skR.length) {
        ch.push(SH("Skills"));
        for (const s of skR)
          ch.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                ...(s.category ? [bd(s.category + ": ")] : []),
                tx(s.skills),
              ],
            }),
          );
      }

      // Certifications
      const ceR = resume.certifications.filter((c) => c.name);
      if (ceR.length) {
        ch.push(SH("Certifications"));
        for (const c of ceR)
          ch.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                bd(c.name),
                ...(c.issuer ? [tx(` — ${c.issuer}`, { italics: true })] : []),
                ...(c.date ? [tx("\t" + c.date, { bold: true })] : []),
              ],
            }),
          );
      }

      // References
      const rfR = resume.references.filter((r) => r.name);
      if (rfR.length) {
        ch.push(SH("References"));
        for (const r of rfR) {
          ch.push(
            new Paragraph({
              spacing: { before: 80, after: 0 },
              children: [bd(r.name)],
            }),
          );
          if (r.title)
            ch.push(
              new Paragraph({
                spacing: { after: 0 },
                children: [tx(r.title, { italics: true })],
              }),
            );
          if (r.org)
            ch.push(
              new Paragraph({ spacing: { after: 0 }, children: [tx(r.org)] }),
            );
          if (r.phone)
            ch.push(
              new Paragraph({
                spacing: { after: 0 },
                children: [tx("Phone: " + r.phone)],
              }),
            );
          if (r.email)
            ch.push(
              new Paragraph({
                spacing: { after: 60 },
                children: [tx("Email: " + r.email, { color: "1a56db" })],
              }),
            );
        }
      }

      // Extras
      const exR = resume.extras.filter((e) => e.label && e.value);
      if (exR.length) {
        ch.push(SH("Additional Information"));
        for (const e of exR)
          ch.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [bd(e.label + ": "), tx(e.value)],
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
      alert("DOCX failed — check console.");
    }
    setExportingDOCX(false);
  };

  if (!mounted) return null;
  const isExporting = exportingPDF || exportingDOCX;
  const isAiGen =
    aiGenStatus === "Calling AI…" || aiGenStatus === "Parsing response…";

  // ─── SECTION COLLAPSE HEADER ───────────────────────────────────────────
  const SecHeader = ({
    id,
    label,
    num,
  }: {
    id: string;
    label: string;
    num: string;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex justify-between items-center mb-3"
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <div className="sec-label mb-0">
        {num} · {label}
      </div>
      {collapsed[id] ? (
        <ChevronDown size={14} color="#475569" />
      ) : (
        <ChevronUp size={14} color="#475569" />
      )}
    </button>
  );

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
        .add-btn { display:flex; align-items:center; gap:5px; margin-top:10px; padding:5px 12px;
                   border-radius:8px; background:rgba(59,130,246,.07); border:1px dashed rgba(59,130,246,.3);
                   color:#60a5fa; font-size:11px; font-weight:600; cursor:pointer; transition:all .2s; width:fit-content; }
        .add-btn:hover { background:rgba(59,130,246,.14); border-color:#3b82f6; }
        .icon-btn { display:inline-flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:7px; border:none;
                    cursor:pointer; transition:all .15s; background:transparent; }
        .icon-btn:hover { background:rgba(239,68,68,.15); }
        .sec-box { padding:18px 20px; background:rgba(15,23,42,.5); border:1px solid rgba(51,65,85,.7);
                   border-radius:18px; margin-bottom:10px; }
        .sec-label { font-size:9px; font-weight:900; letter-spacing:.18em; text-transform:uppercase; color:#475569; }
        .entry-divider { border:none; border-top:1px solid rgba(51,65,85,.5); margin:12px 0; }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
        .link-row { display:flex; align-items:center; gap:8px; background:rgba(15,23,42,.6);
                    border:1px solid rgba(59,130,246,.25); border-radius:10px; padding:8px 13px; }
        .link-row input { flex:1; background:transparent; border:none; outline:none;
                          color:#93c5fd; font-size:12px; font-family:inherit; }
        .link-row input::placeholder { color:#334155; }
        .ai-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.75); z-index:60;
                             display:flex; align-items:center; justify-content:center; padding:16px; }
        .ai-modal { background:#0f172a; border:1px solid rgba(59,130,246,.3); border-radius:24px;
                    padding:32px; width:100%; max-width:560px; }
      `}</style>

      <div className="flex flex-col lg:flex-row min-h-screen bg-[#030712] text-slate-200">
        {/* ── EXPORT OVERLAY ── */}
        <AnimatePresence>
          {(isExporting || isAiGen) && (
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
                  {isAiGen
                    ? aiGenStatus
                    : exportingPDF
                      ? "Generating PDF…"
                      : "Building DOCX…"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── AI GENERATE MODAL ── */}
        <AnimatePresence>
          {showAIModal && (
            <motion.div
              className="ai-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (
                  (e.target as HTMLElement).classList.contains(
                    "ai-modal-backdrop",
                  )
                )
                  setShowAIModal(false);
              }}
            >
              <motion.div
                className="ai-modal"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                    <Wand2 size={20} color="#a5b4fc" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">
                      AI CV Builder
                    </h2>
                    <p className="text-slate-500 text-xs">
                      Describe yourself — AI writes your full CV
                    </p>
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                  Tell the AI about yourself: your name, education, work
                  history, skills, and anything else. It will generate a
                  complete, professional CV instantly.
                </p>

                <textarea
                  className="di min-h-[180px] text-sm mb-4"
                  placeholder={`Example:\nMy name is Shafinur Rahman. I have a BBA in Marketing from BRAC University (2025). I worked at Kreative Strategies as a Senior Account Executive (2026), Shohoz as a Marketing Intern (2025), and Interspeed Advertising (2024). My skills include Canva, content creation, social media marketing, and strategic planning. I speak Bangla and English.`}
                  value={aiBrief}
                  onChange={(e) => setAiBrief(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:border-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!aiBrief.trim()) return;
                      setShowAIModal(false);
                      await generateCVWithAI(
                        aiBrief,
                        setResume,
                        setAiGenStatus,
                      );
                      setAiGenStatus("");
                    }}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={15} /> Generate My CV
                  </button>
                </div>

                {aiGenStatus === "error" && (
                  <p className="text-red-400 text-xs mt-3 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ LEFT EDITOR ══════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-1/2 p-5 lg:p-9 overflow-y-auto max-h-screen scrollbar-hide border-r border-white/5">
          {/* Top bar */}
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-black text-blue-500 italic tracking-tighter">
              CV DADA
            </h1>
            <div className="flex gap-2 flex-wrap justify-end">
              {/* AI Generate button */}
              <button
                onClick={() => {
                  setAiGenStatus("");
                  setShowAIModal(true);
                }}
                className="abtn"
                style={{
                  background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                }}
              >
                <Wand2 size={13} /> AI Build
              </button>
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

          {/* AI tip banner */}
          <div className="mb-5 p-3 rounded-2xl bg-indigo-500/8 border border-indigo-500/20 flex items-center gap-3">
            <Sparkles size={16} color="#a5b4fc" className="flex-shrink-0" />
            <p className="text-slate-400 text-xs leading-relaxed">
              <span className="text-indigo-400 font-bold">New:</span> Click{" "}
              <span className="text-white font-bold">AI Build</span> to describe
              yourself and let AI write your entire CV automatically — free,
              instant, no account needed.
            </p>
          </div>

          {/* Photo */}
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

          {/* 1. PERSONAL INFO */}
          <div className="sec-box">
            <SecHeader id="personal" label="Personal Information" num="1" />
            {!collapsed["personal"] && (
              <>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    className="di text-xs col-span-2"
                    placeholder="Full Name"
                    value={resume.full_name}
                    onChange={(e) => setField("full_name", e.target.value)}
                  />
                  <input
                    className="di text-xs"
                    placeholder="Email"
                    value={resume.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  <input
                    className="di text-xs"
                    placeholder="Phone"
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
                <div className="sec-label mt-3 mb-2">Profile Links</div>
                <div className="space-y-2">
                  <input
                    className="di text-xs"
                    placeholder="LinkedIn URL"
                    value={resume.linkedin}
                    onChange={(e) => setField("linkedin", e.target.value)}
                  />
                  <input
                    className="di text-xs"
                    placeholder="GitHub URL"
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
              </>
            )}
          </div>

          {/* 2. SUMMARY */}
          <div className="sec-box">
            <div className="flex justify-between items-center mb-3">
              <SecHeader id="summary" label="Professional Summary" num="2" />
              <button
                className="aibtn ml-2 flex-shrink-0"
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
            {!collapsed["summary"] && (
              <textarea
                className="di min-h-[80px] text-xs"
                placeholder="Write a 2–4 sentence professional profile…"
                value={resume.summary}
                onChange={(e) => setField("summary", e.target.value)}
              />
            )}
          </div>

          {/* 3. EDUCATION */}
          <div className="sec-box">
            <SecHeader id="edu" label="Education" num="3" />
            {!collapsed["edu"] && (
              <>
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
                    <div className="grid grid-cols-2 gap-2 mb-0">
                      <input
                        className="di text-xs col-span-2"
                        placeholder="University / Institution"
                        value={e.institution}
                        onChange={(ev) =>
                          edu.upd(e.id, "institution", ev.target.value)
                        }
                      />
                      <input
                        className="di text-xs col-span-2"
                        placeholder="Degree  e.g. BSc Computer Science"
                        value={e.degree}
                        onChange={(ev) =>
                          edu.upd(e.id, "degree", ev.target.value)
                        }
                      />
                      <input
                        className="di text-xs"
                        placeholder="Duration  e.g. 2020 – 2024"
                        value={e.duration}
                        onChange={(ev) =>
                          edu.upd(e.id, "duration", ev.target.value)
                        }
                      />
                      <input
                        className="di text-xs"
                        placeholder="CGPA  e.g. 3.75"
                        value={e.cgpa}
                        onChange={(ev) =>
                          edu.upd(e.id, "cgpa", ev.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <button className="add-btn" onClick={edu.add}>
                  + Add Degree
                </button>
              </>
            )}
          </div>

          {/* 4. EXPERIENCE */}
          <div className="sec-box">
            <SecHeader id="exp" label="Work Experience" num="4" />
            {!collapsed["exp"] && (
              <>
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
                        onChange={(ev) =>
                          exp.upd(e.id, "role", ev.target.value)
                        }
                      />
                      <input
                        className="di text-xs col-span-2"
                        placeholder="Company / Organization"
                        value={e.org}
                        onChange={(ev) => exp.upd(e.id, "org", ev.target.value)}
                      />
                      <input
                        className="di text-xs col-span-2"
                        placeholder="Duration  e.g. Jan 2022 – Present"
                        value={e.duration}
                        onChange={(ev) =>
                          exp.upd(e.id, "duration", ev.target.value)
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                        Responsibilities (one per line)
                      </span>
                      <button
                        className="aibtn"
                        disabled={!!aiLoading}
                        onClick={() =>
                          aiImprove(
                            e.bullets,
                            "work experience",
                            (v) => exp.upd(e.id, "bullets", v),
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
                      placeholder="Led team of 5 engineers to deliver…&#10;Reduced load time by 40% through…&#10;Managed client accounts worth…"
                      value={e.bullets}
                      onChange={(ev) =>
                        exp.upd(e.id, "bullets", ev.target.value)
                      }
                    />
                  </div>
                ))}
                <button className="add-btn" onClick={exp.add}>
                  + Add Job
                </button>
              </>
            )}
          </div>

          {/* 5. PROJECTS */}
          <div className="sec-box">
            <SecHeader id="proj" label="Projects / Thesis" num="5" />
            {!collapsed["proj"] && (
              <>
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
                          proj.upd(p.id, "name", ev.target.value)
                        }
                      />
                      <input
                        className="di text-xs col-span-2"
                        placeholder="Duration  e.g. 2023 – 2024"
                        value={p.duration}
                        onChange={(ev) =>
                          proj.upd(p.id, "duration", ev.target.value)
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
                        placeholder="GitHub / Live demo link"
                        value={p.link}
                        onChange={(ev) =>
                          proj.upd(p.id, "link", ev.target.value)
                        }
                      />
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                        Description (one bullet per line)
                      </span>
                      <button
                        className="aibtn"
                        disabled={!!aiLoading}
                        onClick={() =>
                          aiImprove(
                            p.bullets,
                            "project description",
                            (v) => proj.upd(p.id, "bullets", v),
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
                      placeholder="Built REST API with…&#10;Achieved 95% test coverage…"
                      value={p.bullets}
                      onChange={(ev) =>
                        proj.upd(p.id, "bullets", ev.target.value)
                      }
                    />
                  </div>
                ))}
                <button className="add-btn" onClick={proj.add}>
                  + Add Project
                </button>
              </>
            )}
          </div>

          {/* 6. SKILLS */}
          <div className="sec-box">
            <SecHeader id="skills" label="Skills" num="6" />
            {!collapsed["skills"] && (
              <>
                <p className="text-[10px] text-slate-600 mb-2">
                  Category: list of skills on each row
                </p>
                {resume.skills.map((s, idx) => (
                  <div key={s.id} className="flex gap-2 mb-2 items-center">
                    <input
                      className="di text-xs"
                      style={{ maxWidth: 130 }}
                      placeholder="e.g. Languages"
                      value={s.category}
                      onChange={(e) =>
                        skill.upd(s.id, "category", e.target.value)
                      }
                    />
                    <input
                      className="di text-xs flex-1"
                      placeholder="Python, React, Docker…"
                      value={s.skills}
                      onChange={(e) =>
                        skill.upd(s.id, "skills", e.target.value)
                      }
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
              </>
            )}
          </div>

          {/* 7. CERTIFICATIONS */}
          <div className="sec-box">
            <SecHeader id="cert" label="Certifications" num="7" />
            {!collapsed["cert"] && (
              <>
                {resume.certifications.map((c, idx) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-2 gap-2 mb-2 items-center"
                  >
                    <input
                      className="di text-xs col-span-2"
                      placeholder="Certificate Name"
                      value={c.name}
                      onChange={(e) => cert.upd(c.id, "name", e.target.value)}
                    />
                    <input
                      className="di text-xs"
                      placeholder="Issuer  e.g. Coursera"
                      value={c.issuer}
                      onChange={(e) => cert.upd(c.id, "issuer", e.target.value)}
                    />
                    <div className="flex gap-2">
                      <input
                        className="di text-xs flex-1"
                        placeholder="Date"
                        value={c.date}
                        onChange={(e) => cert.upd(c.id, "date", e.target.value)}
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
              </>
            )}
          </div>

          {/* 8. REFERENCES */}
          <div className="sec-box">
            <SecHeader id="refs" label="References" num="8" />
            {!collapsed["refs"] && (
              <>
                {resume.references.map((r, idx) => (
                  <div key={r.id}>
                    {idx > 0 && <hr className="entry-divider" />}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-slate-600 font-bold">
                        Reference {idx + 1}
                      </span>
                      {idx > 0 && (
                        <button
                          className="icon-btn"
                          onClick={() => ref_.remove(r.id)}
                        >
                          <Trash2 size={12} color="#f87171" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-0">
                      <input
                        className="di text-xs col-span-2"
                        placeholder="Full Name"
                        value={r.name}
                        onChange={(e) => ref_.upd(r.id, "name", e.target.value)}
                      />
                      <input
                        className="di text-xs"
                        placeholder="Job Title"
                        value={r.title}
                        onChange={(e) =>
                          ref_.upd(r.id, "title", e.target.value)
                        }
                      />
                      <input
                        className="di text-xs"
                        placeholder="Organization"
                        value={r.org}
                        onChange={(e) => ref_.upd(r.id, "org", e.target.value)}
                      />
                      <input
                        className="di text-xs"
                        placeholder="Phone"
                        value={r.phone}
                        onChange={(e) =>
                          ref_.upd(r.id, "phone", e.target.value)
                        }
                      />
                      <input
                        className="di text-xs"
                        placeholder="Email"
                        value={r.email}
                        onChange={(e) =>
                          ref_.upd(r.id, "email", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <button className="add-btn" onClick={ref_.add}>
                  + Add Reference
                </button>
              </>
            )}
          </div>

          {/* 9. ADDITIONAL */}
          <div className="sec-box pb-6">
            <SecHeader id="extra" label="Additional Info" num="9" />
            {!collapsed["extra"] && (
              <>
                {resume.extras.map((e, idx) => (
                  <div key={e.id} className="flex gap-2 mb-2 items-center">
                    <input
                      className="di text-xs"
                      style={{ maxWidth: 150 }}
                      placeholder="Label"
                      value={e.label}
                      onChange={(ev) =>
                        extra.upd(e.id, "label", ev.target.value)
                      }
                    />
                    <input
                      className="di text-xs flex-1"
                      placeholder="Value"
                      value={e.value}
                      onChange={(ev) =>
                        extra.upd(e.id, "value", ev.target.value)
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
              </>
            )}
          </div>
        </div>
        {/* end left */}

        {/* ══ RIGHT PREVIEW ═══════════════════════════════════════════════════ */}
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

"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function ResumePreview() {
  const { personal, education, experience } = useResumeStore();

  const handleDownload = async () => {
    const element = document.getElementById("resume");
    if (!element) return;

    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 24px;
                color: #000;
              }
              h1 { font-size: 22px; margin-bottom: 4px; }
              h2 {
                font-size: 16px;
                margin-top: 20px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 4px;
              }
              p {
                font-size: 12px;
                margin: 2px 0;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              .section { margin-bottom: 16px; }
              .row {
                display: flex;
                justify-content: space-between;
                gap: 10px;
              }
              .left {
                flex: 1;
                min-width: 0;
              }
              .right {
                white-space: nowrap;
                font-size: 11px;
                color: #555;
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `;

      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (!res.ok) throw new Error("PDF failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
    } catch (err) {
      console.error(err);
      alert("PDF export failed");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleDownload}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

      <div
        id="resume"
        className="bg-white text-black p-8 shadow max-w-3xl mx-auto text-sm"
      >
        {/* HEADER */}
        <div className="mb-6 break-words">
          <h1 className="text-xl font-bold break-words">
            {personal.name || "Your Name"}
          </h1>
          <p className="text-gray-600 break-words">
            {personal.email || "email@example.com"}
          </p>
        </div>

        {/* EDUCATION */}
        <div className="mb-6">
          <h2 className="font-bold border-b pb-1 mb-2">Education</h2>

          {education.map((edu, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between gap-2">
                <div className="font-semibold break-words">
                  {edu.degree || "Degree"}
                </div>
                <div className="text-gray-500 text-xs whitespace-nowrap">
                  {edu.year || ""}
                </div>
              </div>

              <p className="text-gray-600 break-words">
                {edu.school || ""}
              </p>
            </div>
          ))}
        </div>

        {/* EXPERIENCE */}
        <div>
          <h2 className="font-bold border-b pb-1 mb-2">Experience</h2>

          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between gap-2">
                <div className="font-semibold break-words">
                  {exp.role || "Role"}
                </div>
                <div className="text-gray-500 text-xs whitespace-nowrap">
                  {exp.duration || ""}
                </div>
              </div>

              <p className="text-gray-600 break-words">
                {exp.company || ""}
              </p>

              <p className="mt-1 break-words">
                {exp.description || ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

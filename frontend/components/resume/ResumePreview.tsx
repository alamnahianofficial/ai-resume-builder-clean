"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function ResumePreview() {
  const { personal, education, experience } = useResumeStore();

  const handleDownload = async () => {
    const element = document.getElementById("resume");
    if (!element) return;

    try {
      const html = element.outerHTML;

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
        className="bg-white text-black p-8 shadow max-w-3xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {personal.name || "Your Name"}
          </h1>
          <p className="text-sm text-gray-600">
            {personal.email || "email@example.com"}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-bold border-b pb-1 mb-2">Education</h2>

          {education.map((edu, index) => (
            <div key={index} className="mb-2">
              <p className="font-semibold">{edu.degree || "Degree"}</p>
              <p className="text-sm text-gray-600">
                {edu.school} — {edu.year}
              </p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-bold border-b pb-1 mb-2">Experience</h2>

          {experience.map((exp, index) => (
            <div key={index} className="mb-3">
              <p className="font-semibold">{exp.role || "Role"}</p>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <p className="text-sm mt-1">
                {exp.description || "Description"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

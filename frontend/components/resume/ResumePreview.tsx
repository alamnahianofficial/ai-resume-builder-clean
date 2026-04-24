"use client";

import { useResumeStore } from "@/store/useResumeStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";

export default function ResumePreview() {
  const { personal, education, experience } = useResumeStore();
  const [exporting, setExporting] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("resume");
    if (!element) return;

    setExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Handle multi-page if content is taller than one A4 page
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("resume.pdf");
    } catch (err) {
      console.error(err);
      alert("PDF export failed — check console");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleDownload}
        disabled={exporting}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {exporting ? "Generating PDF..." : "Download PDF"}
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

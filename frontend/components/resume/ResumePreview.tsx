"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function ResumePreview() {
  const { personal, education, experience } = useResumeStore();

  const handleDocxDownload = () => {
    alert("DOCX export coming soon (you can implement using docx library)");
  };

  return (
    <div className="space-y-6">
      {/* WARNING MESSAGE */}
      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded text-sm">
        ⚠️ PDF export is temporarily unavailable. Please use DOCX export instead.
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        {/* DISABLED PDF BUTTON */}
        <button
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
        >
          PDF (Coming Soon)
        </button>

        {/* DOCX BUTTON */}
        <button
          onClick={handleDocxDownload}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Download DOCX
        </button>
      </div>

      {/* RESUME PREVIEW */}
      <div className="flex justify-center">
        <div
          id="resume"
          className="bg-white text-black p-8 shadow text-sm"
          style={{
            width: "794px",
            minHeight: "1123px",
          }}
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
    </div>
  );
}

import React from "react";

export default function StandardCV({ data }: { data: any }) {
  return (
    <div
      id="resume-preview"
      className="ats-resume bg-white p-12 shadow-2xl mx-auto w-full max-w-[800px] min-h-[1050px] text-black leading-tight border border-gray-200"
    >
      {/* HEADER: ATS strictly likes center or left-aligned text */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase mb-1">
          {data.full_name || "YOUR NAME"}
        </h1>
        <p className="text-sm">
          {data.email} | {data.phone} | {data.location}
        </p>
      </div>

      {/* SUMMARY */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-1">
            Professional Summary
          </h2>
          <p className="text-[10.5pt] text-justify">{data.summary}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      <div className="mb-4">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
          Work Experience
        </h2>
        {data.experience?.map((exp: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between font-bold text-[10.5pt]">
              <span>{exp.company}</span>
              <span>{exp.duration}</span>
            </div>
            <div className="flex justify-between italic text-[10.5pt]">
              <span>{exp.role}</span>
              <span>{exp.location}</span>
            </div>
            <ul className="list-disc ml-5 mt-1 text-[10pt]">
              {exp.bullets?.map((b: string, j: number) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* EDUCATION */}
      <div className="mb-4">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">
          Education
        </h2>
        {data.education?.map((edu: any, i: number) => (
          <div key={i} className="flex justify-between text-[10.5pt]">
            <div>
              <span className="font-bold">{data.school}</span> —{" "}
              <span>{edu.degree}</span>
            </div>
            <span>{edu.year}</span>
          </div>
        ))}
      </div>

      {/* SKILLS */}
      <div>
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-1">
          Skills
        </h2>
        <p className="text-[10pt]">{data.skills?.join(", ")}</p>
      </div>
    </div>
  );
}

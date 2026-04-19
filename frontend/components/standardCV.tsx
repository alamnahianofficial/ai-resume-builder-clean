import React from "react";

export default function StandardCV({ data }: { data: any }) {
  return (
    <div
      id="resume-preview"
      className="bg-white p-12 shadow-2xl mx-auto w-full max-w-[800px] min-h-[1050px] text-slate-900 font-serif leading-snug"
    >
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">
          {data.full_name || "Your Name"}
        </h1>
        <div className="text-sm text-slate-600 flex justify-center gap-4">
          <span>{data.email}</span>
          <span>{data.phone}</span>
          <span>{data.location}</span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-slate-200 mb-3 text-slate-500">
            Professional Summary
          </h2>
          <p className="text-[13px] italic leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-slate-200 mb-4 text-slate-500">
          Experience
        </h2>
        {data.experience?.map((exp: any, idx: number) => (
          <div key={idx} className="mb-6">
            <div className="flex justify-between items-baseline">
              <h3 className="text-md font-bold text-slate-800">
                {exp.company}
              </h3>
              <span className="text-xs font-medium text-slate-500">
                {exp.duration}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm italic text-slate-700">{exp.role}</span>
              <span className="text-xs text-slate-400">{exp.location}</span>
            </div>
            <ul className="list-disc list-outside ml-5 space-y-1">
              {exp.bullets?.map((bullet: string, bIdx: number) => (
                <li key={bIdx} className="text-[12.5px] pl-1">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-slate-200 mb-3 text-slate-500">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills?.map((skill: string, sIdx: number) => (
            <span
              key={sIdx}
              className="text-[12px] bg-slate-50 px-2 py-0.5 border border-slate-100 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

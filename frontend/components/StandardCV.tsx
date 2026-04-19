import React from "react";

export default function StandardCV({ data }: { data: any }) {
  return (
    <div className="ats-resume p-10 mx-auto w-full max-w-[800px] min-h-[1000px] shadow-2xl">
      <div className="text-center border-b border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase">
          {data.full_name || "Name"}
        </h1>
        <p className="text-sm">
          {data.email} | {data.phone} | {data.location}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-1">
          Work Experience
        </h2>
        {data.experience?.map((exp: any, i: number) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between font-bold">
              <span>{exp.company || "Company"}</span>
              <span>{exp.duration}</span>
            </div>
            <p className="italic">{exp.role}</p>
            <p className="text-justify text-[10.5pt] mt-1">{exp.bullets}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

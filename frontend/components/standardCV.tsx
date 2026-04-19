import React from "react";

// Define the structure to replace 'any'
interface ResumeData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: {
    company: string;
    role: string;
    location: string;
    duration: string;
    bullets: string[];
  }[];
  skills: string[];
}

export default function StandardCV({ data }: { data: ResumeData }) {
  return (
    // Updated Tailwind classes to canonical versions suggested by your IDE
    <div
      id="resume-preview"
      className="bg-white p-12 shadow-2xl mx-auto w-full max-w-200 min-h-262.5 text-slate-900 font-serif leading-snug"
    >
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
      {/* ... rest of the component remains the same ... */}
    </div>
  );
}

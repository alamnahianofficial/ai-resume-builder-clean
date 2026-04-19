"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function ATSChecker() {
  const { jobDescription, setJobDescription, calculateATS, atsScore } =
    useResumeStore();

  return (
    <div className="space-y-4 mb-6">
      <textarea
        placeholder="Paste Job Description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="border border-gray-300 p-3 w-full rounded"
      />

      <button
        onClick={calculateATS}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Check ATS Score
      </button>

      {atsScore > 0 && (
        <div className="p-4 bg-gray-100 rounded">
          <p className="font-bold">ATS Score: {atsScore}%</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useResumeStore } from "@/store/useResumeStore";

export default function EducationForm() {
  const { education, updateEducation, addEducation, setStep } =
    useResumeStore();

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <div key={index} className="space-y-2 border p-4 rounded">
          <input
            placeholder="School"
            value={edu.school}
            className="border p-2 w-full"
            onChange={(e) => updateEducation(index, "school", e.target.value)}
          />

          <input
            placeholder="Degree"
            value={edu.degree}
            className="border p-2 w-full"
            onChange={(e) => updateEducation(index, "degree", e.target.value)}
          />

          <input
            placeholder="Year"
            value={edu.year}
            className="border p-2 w-full"
            onChange={(e) => updateEducation(index, "year", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addEducation} className="bg-gray-200 px-4 py-2">
        + Add Education
      </button>

      <div className="flex gap-4">
        <button onClick={() => setStep(1)} className="bg-gray-400 px-4 py-2">
          Back
        </button>

        <button
          onClick={() => setStep(3)}
          className="bg-black text-white px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

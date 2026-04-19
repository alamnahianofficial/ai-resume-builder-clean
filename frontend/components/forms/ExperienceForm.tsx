"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { api } from "@/lib/api";
import { useState } from "react";

export default function ExperienceForm() {
  const { experience, updateExperience, addExperience, setStep } =
    useResumeStore();

  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const improveWithAI = async (index: number) => {
    if (!experience[index].role) {
      alert("Please enter a role first");
      return;
    }

    try {
      setLoadingIndex(index);

      const res = await api.post("/ai/generate-summary", {
        role: experience[index].role,
      });

      updateExperience(index, "description", res.data.summary);
    } catch (err) {
      console.error(err);
      alert("AI failed");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      {experience.map((exp, index) => (
        <div
          key={index}
          className="space-y-3 border p-4 rounded bg-white shadow-sm"
        >
          <input
            placeholder="Company"
            value={exp.company}
            className="border border-gray-300 p-2 w-full rounded"
            onChange={(e) => updateExperience(index, "company", e.target.value)}
          />

          <input
            placeholder="Role"
            value={exp.role}
            className="border border-gray-300 p-2 w-full rounded"
            onChange={(e) => updateExperience(index, "role", e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={exp.description}
            className="border border-gray-300 p-2 w-full rounded"
            onChange={(e) =>
              updateExperience(index, "description", e.target.value)
            }
          />

          <button
            onClick={() => improveWithAI(index)}
            disabled={loadingIndex === index}
            className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {loadingIndex === index ? "Improving..." : "Improve with AI"}
          </button>
        </div>
      ))}

      <button onClick={addExperience} className="bg-gray-200 px-4 py-2 rounded">
        + Add Experience
      </button>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="bg-gray-400 px-4 py-2 rounded"
        >
          Back
        </button>

        <button
          onClick={() => setStep(4)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

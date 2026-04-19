"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { api } from "@/lib/api";
import { useState } from "react";

export default function AISuggestions() {
  const { jobDescription } = useResumeStore();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    if (!jobDescription) {
      alert("Paste job description first");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/ai/suggest", {
        job_description: jobDescription,
      });

      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
      alert("Failed to get suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <button
        onClick={getSuggestions}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Get AI Suggestions"}
      </button>

      {suggestions.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Suggestions:</h3>

          <ul className="list-disc pl-5 space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

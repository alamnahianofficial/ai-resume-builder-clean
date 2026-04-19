"use client";

import { useState } from "react";

export default function Builder() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    degree: "",
    company: "",
    role: "",
  });

  const steps = ["Personal", "Education", "Experience", "Preview"];

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // 🔥 Fake AI suggestion (replace later with API)
  const improveWithAI = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        role: prev.role || "AI Engineer Intern",
        degree: prev.degree || "BSc in Computer Science",
      }));
      setLoading(false);
    }, 1500);
  };

  // 🔥 ATS Score logic
  const calculateATS = () => {
    let score = 0;

    if (formData.name) score += 20;
    if (formData.email) score += 20;
    if (formData.degree) score += 20;
    if (formData.university) score += 20;
    if (formData.role || formData.company) score += 20;

    setAtsScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="animate-pulse text-lg">
            🤖 AI is optimizing your resume...
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">
          AI Resume Builder
        </h1>

        {/* STEPS */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {steps.map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`px-4 py-2 rounded-full text-sm ${
                i === step ? "bg-blue-600" : "bg-white/10 text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FORM */}
          <div className="space-y-4">
            {step === 0 && (
              <>
                <input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="input"
                  placeholder="Full Name"
                />
                <input
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="input"
                  placeholder="Email"
                />
              </>
            )}

            {step === 1 && (
              <>
                <input
                  value={formData.university}
                  onChange={(e) => handleChange("university", e.target.value)}
                  className="input"
                  placeholder="University"
                />
                <input
                  value={formData.degree}
                  onChange={(e) => handleChange("degree", e.target.value)}
                  className="input"
                  placeholder="Degree"
                />
              </>
            )}

            {step === 2 && (
              <>
                <input
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="input"
                  placeholder="Company (optional)"
                />
                <input
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="input"
                  placeholder="Role (optional)"
                />

                <button
                  onClick={improveWithAI}
                  className="w-full py-2 rounded-xl bg-purple-600"
                >
                  🤖 Improve with AI
                </button>
              </>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <button
                  onClick={calculateATS}
                  className="w-full py-3 rounded-xl bg-green-600"
                >
                  📊 Check ATS Score
                </button>

                {atsScore !== null && (
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      ATS Score: {atsScore}%
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${atsScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NAV */}
            <div className="flex gap-3 pt-4">
              <button onClick={prevStep} className="btn-secondary">
                Back
              </button>
              <button onClick={nextStep} className="btn">
                Next →
              </button>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl">
            {formData.name && (
              <h2 className="text-2xl font-bold">{formData.name}</h2>
            )}

            {formData.email && (
              <p className="text-sm text-gray-600 mb-4">{formData.email}</p>
            )}

            {(formData.degree || formData.university) && (
              <div className="mb-4">
                <h3 className="font-semibold border-b pb-1 mb-2">Education</h3>
                <p className="text-sm">
                  {formData.degree && (
                    <>
                      {formData.degree}
                      <br />
                    </>
                  )}
                  {formData.university}
                </p>
              </div>
            )}

            {(formData.role || formData.company) && (
              <div>
                <h3 className="font-semibold border-b pb-1 mb-2">Experience</h3>
                <p className="text-sm">
                  {formData.role && (
                    <>
                      {formData.role}
                      <br />
                    </>
                  )}
                  {formData.company}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

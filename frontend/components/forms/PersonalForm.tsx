"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";

export default function PersonalForm() {
  const { personal, setPersonal, setStep } = useResumeStore();

  const [form, setForm] = useState(personal);

  const handleNext = () => {
    setPersonal(form);
    setStep(2);
  };

  return (
    <div className="space-y-4">
      <input
        value={form.name}
        placeholder="Full Name"
        className="border p-2 w-full"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        value={form.email}
        placeholder="Email"
        className="border p-2 w-full"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <button onClick={handleNext} className="bg-black text-white px-4 py-2">
        Next
      </button>
    </div>
  );
}

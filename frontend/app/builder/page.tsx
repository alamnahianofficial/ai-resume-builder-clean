"use client";

import StepIndicator from "@/components/ui/StepIndicator";
import PersonalForm from "@/components/forms/PersonalForm";
import EducationForm from "@/components/forms/EducationForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import ResumePreview from "@/components/resume/ResumePreview";
import { useResumeStore } from "@/store/useResumeStore";

export default function BuilderPage() {
  const { step } = useResumeStore();

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>

      <StepIndicator />

      {step === 1 && <PersonalForm />}
      {step === 2 && <EducationForm />}
      {step === 3 && <ExperienceForm />}
      {step === 4 && <ResumePreview />}
    </div>
  );
}

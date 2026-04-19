import { create } from "zustand";

type Education = {
  school: string;
  degree: string;
  year: string;
};

type Experience = {
  company: string;
  role: string;
  description: string;
};

type ResumeState = {
  step: number;

  personal: {
    name: string;
    email: string;
  };

  education: Education[];
  experience: Experience[];

  jobDescription: string;
  atsScore: number;

  setStep: (step: number) => void;
  setPersonal: (data: any) => void;

  addEducation: () => void;
  updateEducation: (
    index: number,
    field: keyof Education,
    value: string,
  ) => void;

  addExperience: () => void;
  updateExperience: (
    index: number,
    field: keyof Experience,
    value: string,
  ) => void;

  setJobDescription: (text: string) => void;
  calculateATS: () => void;
};

export const useResumeStore = create<ResumeState>((set, get) => ({
  step: 1,

  personal: { name: "", email: "" },

  education: [{ school: "", degree: "", year: "" }],

  experience: [{ company: "", role: "", description: "" }],

  jobDescription: "",
  atsScore: 0,

  setStep: (step) => set({ step }),

  setPersonal: (data) =>
    set((state) => ({
      personal: { ...state.personal, ...data },
    })),

  addEducation: () =>
    set((state) => ({
      education: [...state.education, { school: "", degree: "", year: "" }],
    })),

  updateEducation: (index, field, value) =>
    set((state) => {
      const updated = [...state.education];
      updated[index][field] = value;
      return { education: updated };
    }),

  addExperience: () =>
    set((state) => ({
      experience: [
        ...state.experience,
        { company: "", role: "", description: "" },
      ],
    })),

  updateExperience: (index, field, value) =>
    set((state) => {
      const updated = [...state.experience];
      updated[index][field] = value;
      return { experience: updated };
    }),

  setJobDescription: (text) => set({ jobDescription: text }),

  calculateATS: () => {
    const { jobDescription, experience } = get();

    const jdWords = jobDescription.toLowerCase().split(" ");
    let matchCount = 0;

    experience.forEach((exp) => {
      const desc = exp.description.toLowerCase();

      jdWords.forEach((word) => {
        if (desc.includes(word)) {
          matchCount++;
        }
      });
    });

    const score = Math.min(
      100,
      Math.floor((matchCount / jdWords.length) * 100),
    );

    set({ atsScore: score });
  },
}));

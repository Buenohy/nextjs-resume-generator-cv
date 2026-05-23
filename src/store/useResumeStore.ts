import { create } from "zustand";

interface ResumeStore {
  jobText: string;
  setJobText: (text: string) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  jobText: "",
  setJobText: (text) => set({ jobText: text }),
}));

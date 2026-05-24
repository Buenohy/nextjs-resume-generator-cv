import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ExperienceItem {
  role: string;
  company: string;
  url: string;
  date: string;
  details: string[];
  stacks: string[];
}

export interface FullContentState {
  info: {
    name: string;
    role: string;
    city: string;
    age: string;
  };
  meta_ats: Record<string, string>;
  links: Record<string, string>;
  summary: string;
  skills: string[];
  experiences: ExperienceItem[];
  education: string[];
  certifications: string[];
  languages: string[];
}

interface FullContentActions {
  updateFullContent: (updater: (draft: FullContentState) => void) => void;
}

type FullContentStore = FullContentState & FullContentActions;

const initialState: FullContentState = {
  info: { name: "", role: "", city: "", age: "" },
  meta_ats: {},
  links: {},
  summary: "",
  skills: [""],
  experiences: [
    {
      role: "",
      company: "",
      url: "",
      date: "",
      details: [""],
      stacks: [""],
    },
  ],
  education: [""],
  certifications: [""],
  languages: [""],
};

export const useFullContentStore = create<FullContentStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateFullContent: (updater) =>
        set((state) => {
          const draft = { ...state };
          updater(draft);
          return draft;
        }),
    }),
    {
      name: "full-content-storage", // chave no localStorage
    }
  )
);

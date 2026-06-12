import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface ExperienceState {
  role: string;
  company: string;
  url: string;
  date: string;
  details: string[];
  stacks: string[];
}

export interface CvDataState {
  info: {
    name: string;
    role: string;
    city: string;
    age: string;
  };
  meta_ats: {
    role_target: string;
    subject: string;
    keywords: string[];
    category: string;
    contributor: string;
    coverage: string;
    identifier: string;
    publisher: string;
    relation: string;
    rights: string;
    source: string;
    type: string;
    notes: string;
  };
  links: {
    linkedin: string;
    phone: string;
    phone_url: string;
    website: string;
    website_url: string;
    email: string;
    github: string;
  };
  company: string;
  summary: string;
  ai: string;
  skills: string[];
  experiences: ExperienceState[];
  education: string[];
  certifications: string[];
  languages: string[];
  language?: string;
  jobText?: string;
  platformText?: string;
}

interface AnalysisResults {
  warnings: {
    keywords: string[];
    roleTarget: string | null;
    subjectWords: string[];
    infoRoleMismatch: boolean;
  };
  keywordsTable: Array<{
    id: string;
    keyword: string;
    inVacancy: number;
    goal2x: number;
    onResume: number;
    status: "Pending" | "Approved";
  }>;
  verbIssues: Array<{
    original: string;
    suggestions: string[];
    context: string;
  }>;
  suspectWords: string[];
}

interface ResumeStore {
  jobText: string;
  setJobText: (text: string) => void;
  platformText: string;
  setPlatformText: (text: string) => void;
  cvData: CvDataState;
  updateCvData: (updater: (draft: CvDataState) => void) => void;
  analysisResults: AnalysisResults | null;
  isLoadingAnalysis: boolean;
  triggerAnalysis: () => Promise<void>;
  saveResumeToHistory: (locale: string) => Promise<boolean>;
}

const initialCvData: CvDataState = {
  info: { name: "", role: "", city: "", age: "" },
  meta_ats: {
    role_target: "",
    subject: "",
    keywords: [""],
    category: "Resume",
    contributor: "",
    coverage: "",
    identifier: "",
    publisher: "",
    relation: "",
    rights: "",
    source: "",
    type: "Text/PDF",
    notes: "",
  },
  links: {
    linkedin: "",
    phone: "",
    phone_url: "",
    website: "",
    website_url: "",
    email: "",
    github: "",
  },
  company: "",
  summary: "",
  ai: "",
  skills: [""],
  experiences: [
    { role: "", company: "", url: "", date: "", details: [""], stacks: [""] },
  ],
  education: [""],
  certifications: [""],
  languages: [""],
};

const HISTORY_API_URL = "http://localhost:3001/history";

export const useResumeStore = create<ResumeStore>()(
  persist(
    immer((set, get) => ({
      jobText: "",
      setJobText: (text) => set({ jobText: text }),

      platformText: "",
      setPlatformText: (text) => set({ platformText: text }),

      cvData: initialCvData,
      // Immer-powered imutability updater
      updateCvData: (updater) => {
        set((state) => {
          updater(state.cvData);
        });
      },

      analysisResults: null,
      isLoadingAnalysis: false,

      triggerAnalysis: async () => {
        const { jobText, cvData } = get();
        if (!jobText.trim()) return;

        set({ isLoadingAnalysis: true });

        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobText, cvData }),
          });

          if (response.ok) {
            const data = await response.json();
            set({ analysisResults: data });
          }
        } catch (error) {
          console.error("Error analyzing resume:", error);
        } finally {
          set({ isLoadingAnalysis: false });
        }
      },

      saveResumeToHistory: async (locale: string) => {
        const { cvData } = get();

        const targetRole =
          cvData.info.role ||
          cvData.meta_ats.role_target ||
          "Role not specified";
        const targetCompany = cvData.company || "Company not specified";

        const payloadWithLocale = {
          ...cvData,
          language: locale,
          jobText: get().jobText,
          platformText: get().platformText,
        };

        try {
          const response = await fetch(HISTORY_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              targetRole,
              targetCompany,
              cvPayload: payloadWithLocale,
            }),
          });

          return response.ok;
        } catch (error) {
          console.error("Error saving resume history to database:", error);
          return false;
        }
      },
    })),
    {
      name: "ats-resume-builder-cache",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

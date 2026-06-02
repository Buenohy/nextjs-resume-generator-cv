import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
    status: "Pendente" | "Aprovado";
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
    (set, get) => ({
      jobText: "",
      setJobText: (text) => set({ jobText: text }),

      cvData: initialCvData,
      updateCvData: (updater) => {
        const current = get().cvData;
        const clone = JSON.parse(JSON.stringify(current)) as CvDataState;
        updater(clone);
        set({ cvData: clone });
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
          console.error("Erro ao analisar currículo", error);
        } finally {
          set({ isLoadingAnalysis: false });
        }
      },

      // --- SALVAR HISTÓRICO NO BACKEND (Injetando o carimbo de idioma correto) ---
      saveResumeToHistory: async (locale: string) => {
        const { cvData } = get();

        const targetRole =
          cvData.info.role ||
          cvData.meta_ats.role_target ||
          "Cargo não especificado";
        const targetCompany = cvData.company || "Empresa não especificada";

        // Injeta o idioma ativo da tela diretamente na árvore de dados salva no Postgres (JSONB)
        const payloadWithLocale = {
          ...cvData,
          language: locale,
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
          console.error(
            "Erro ao salvar histórico do currículo no banco:",
            error
          );
          return false;
        }
      },
    }),
    {
      name: "ats-resume-builder-cache",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

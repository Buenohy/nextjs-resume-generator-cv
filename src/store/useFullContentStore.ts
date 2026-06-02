import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useLocale } from "next-intl";
import type { UseBoundStore, StoreApi } from "zustand";

export interface ExperienceItem {
  id?: string;
  language?: string;
  role: string;
  company: string;
  url: string;
  date: string;
  details: string[];
  stacks: string[];
}

export interface FullContentState {
  info: { name: string; role: string; city: string; age: string };
  meta_ats: Record<string, string>;
  links: Record<string, string>;
  summary: string;
  skills: string[];
  savedExperiences: ExperienceItem[];
  education: string[];
  certifications: string[];
  languages: string[];
  isLoading: boolean;
}

interface FullContentActions {
  updateFullContent: (updater: (draft: FullContentState) => void) => void;
  fetchExperiences: () => Promise<void>;
  addSavedExperience: (experience: ExperienceItem) => Promise<void>;
  updateSavedExperience: (
    id: string,
    experience: ExperienceItem
  ) => Promise<void>;
  removeSavedExperience: (id: string) => Promise<void>;
}

export type FullContentStore = FullContentState & FullContentActions;

const initialState: FullContentState = {
  info: { name: "", role: "", city: "", age: "" },
  meta_ats: {},
  links: {},
  summary: "",
  skills: [""],
  savedExperiences: [],
  education: [""],
  certifications: [""],
  languages: [""],
  isLoading: false,
};

// --- URL BASE DA API NO NESTJS ---
const API_URL = "http://localhost:3001/experiences";

const storesCache = new Map<
  string,
  UseBoundStore<StoreApi<FullContentStore>>
>();

function createFullContentStore(
  locale: string
): UseBoundStore<StoreApi<FullContentStore>> {
  return create<FullContentStore>()(
    immer((set) => ({
      ...initialState,

      updateFullContent: (updater) =>
        set((state) => {
          updater(state);
        }),

      // --- 1. LER DO BANCO DE DADOS (FILTRANDO POR IDIOMA) ---
      fetchExperiences: async () => {
        set({ isLoading: true });
        try {
          // Ex: GET http://localhost:3001/experiences?language=pt
          const res = await fetch(`${API_URL}?language=${locale}`);
          if (res.ok) {
            const data = await res.json();
            set({ savedExperiences: data });
          }
        } catch (error) {
          console.error("Erro ao buscar experiências da API:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // --- 2. SALVAR NO BANCO DE DADOS ---
      addSavedExperience: async (experience) => {
        try {
          // Injeta o idioma atual no objeto antes de enviar pro backend
          const payload = { ...experience, language: locale };

          const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const newExp = await res.json();
            set((state) => {
              state.savedExperiences.unshift(newExp); // Adiciona no topo da lista na tela
            });
          }
        } catch (error) {
          console.error("Erro ao salvar experiência na API:", error);
        }
      },

      // --- 3. ATUALIZAR (EDITAR) NO BANCO DE DADOS ---
      updateSavedExperience: async (id, experience) => {
        try {
          const payload = { ...experience, language: locale };

          const res = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            const updatedExp = await res.json();
            set((state) => {
              const index = state.savedExperiences.findIndex(
                (e) => e.id === id
              );
              if (index !== -1) {
                state.savedExperiences[index] = updatedExp;
              }
            });
          }
        } catch (error) {
          console.error("Erro ao atualizar experiência na API:", error);
        }
      },

      // --- 4. EXCLUIR DO BANCO DE DADOS ---
      removeSavedExperience: async (id: string) => {
        try {
          const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            set((state) => {
              state.savedExperiences = state.savedExperiences.filter(
                (e) => e.id !== id
              );
            });
          }
        } catch (error) {
          console.error("Erro ao deletar experiência da API:", error);
        }
      },
    }))
  );
}

export function useFullContentStore(): UseBoundStore<
  StoreApi<FullContentStore>
> {
  const locale = useLocale();
  if (!storesCache.has(locale)) {
    storesCache.set(locale, createFullContentStore(locale));
  }
  return storesCache.get(locale)!;
}

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${BASE_URL}/experiences`;

const storesCache = new Map<
  string,
  UseBoundStore<StoreApi<FullContentStore>>
>();

function createFullContentStore(
  locale: string
): UseBoundStore<StoreApi<FullContentStore>> {
  return create<FullContentStore>()(
    persist(
      immer((set) => ({
        ...initialState,

        updateFullContent: (updater) =>
          set((state) => {
            updater(state);
          }),

        // Fetch experiences from the API filtered by active locale.
        // Fallback gracefully to LocalStorage state if API fails or server is offline.
        fetchExperiences: async () => {
          set({ isLoading: true });
          try {
            const res = await fetch(`${API_URL}?language=${locale}`);
            if (res.ok) {
              const data = await res.json();
              set({ savedExperiences: data });
            }
          } catch (error) {
            console.warn(
              "API/Backend unavailable. Falling back to local data from LocalStorage:",
              error
            );
          } finally {
            set({ isLoading: false });
          }
        },

        // Save a new experience entry (Offline-First approach).
        // Updates local store & LocalStorage immediately, then attempts to sync with API.
        addSavedExperience: async (experience) => {
          const tempId = `local-${Date.now()}`;
          const newExp = { ...experience, id: tempId, language: locale };

          // 1. Optimistic update in LocalStorage & local state
          set((state) => {
            state.savedExperiences.unshift(newExp);
          });

          // 2. Try persisting to backend database
          try {
            const payload = { ...experience, language: locale };
            const res = await fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              const savedBackendExp = await res.json();
              // Replace temporary local ID with real database ID
              set((state) => {
                const index = state.savedExperiences.findIndex(
                  (e) => e.id === tempId
                );
                if (index !== -1) {
                  state.savedExperiences[index] = savedBackendExp;
                }
              });
            }
          } catch (error) {
            console.warn(
              "Failed to save experience to API. Retaining local copy in LocalStorage.",
              error
            );
          }
        },

        // Update an existing experience entry locally first, then sync with API
        updateSavedExperience: async (id, experience) => {
          // 1. Update state & LocalStorage immediately
          set((state) => {
            const index = state.savedExperiences.findIndex((e) => e.id === id);
            if (index !== -1) {
              state.savedExperiences[index] = {
                ...experience,
                id,
                language: locale,
              };
            }
          });

          // 2. Try updating backend
          try {
            const payload = { ...experience, language: locale };
            await fetch(`${API_URL}/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } catch (error) {
            console.warn(
              "Failed to update experience on API. Changes saved locally.",
              error
            );
          }
        },

        // Delete an experience entry locally first, then sync with API
        removeSavedExperience: async (id: string) => {
          // 1. Remove from state & LocalStorage immediately
          set((state) => {
            state.savedExperiences = state.savedExperiences.filter(
              (e) => e.id !== id
            );
          });

          // 2. Try removing from backend
          try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          } catch (error) {
            console.warn(
              "Failed to delete experience from API. Removed locally.",
              error
            );
          }
        },
      })),
      {
        // Unique key per locale in LocalStorage (e.g. "full-content-store-pt", "full-content-store-en")
        name: `full-content-store-${locale}`,
        storage: createJSONStorage(() => localStorage),
        // Exclude transient/loading state from persistent storage
        partialize: (state) => ({
          info: state.info,
          meta_ats: state.meta_ats,
          links: state.links,
          summary: state.summary,
          skills: state.skills,
          savedExperiences: state.savedExperiences,
          education: state.education,
          certifications: state.certifications,
          languages: state.languages,
        }),
      }
    )
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

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useLocale } from "next-intl";
import type { UseBoundStore, StoreApi } from "zustand";

export interface ExperienceItem {
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
}

interface FullContentActions {
  updateFullContent: (updater: (draft: FullContentState) => void) => void;
  addSavedExperience: (experience: ExperienceItem) => void;
  removeSavedExperience: (index: number) => void;
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
};

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
        addSavedExperience: (experience) =>
          set((state) => {
            state.savedExperiences.push(experience);
          }),
        removeSavedExperience: (index) =>
          set((state) => {
            state.savedExperiences = state.savedExperiences.filter(
              (_, i) => i !== index
            );
          }),
      })),
      {
        name: `full-content-storage-${locale}`,
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

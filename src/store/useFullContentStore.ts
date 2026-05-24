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
  experiences: ExperienceItem[];
  education: string[];
  certifications: string[];
  languages: string[];
}

interface FullContentActions {
  updateFullContent: (updater: (draft: FullContentState) => void) => void;
}

export type FullContentStore = FullContentState & FullContentActions;

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
            // immer permite mutar 'state' diretamente
            updater(state);
            // não precisa retornar nada, o immer cuida da imutabilidade
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

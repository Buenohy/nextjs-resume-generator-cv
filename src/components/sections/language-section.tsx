"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { Skeleton } from "@/components/ui/skeleton";
import { useSyncCollapse } from "@/app/hooks/useSyncCollapse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// --- CONVERSÃO AUXILIAR (ESCOPO GLOBAL DO ARQUIVO) ---
const parseLangString = (str?: string, LANGUAGE_LEVELS: string[] = []) => {
  if (!str) return { text: "", level: "" };
  const parts = str.split(" - ");
  let text = str;
  let level = "";
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    const hasLevel = LANGUAGE_LEVELS.some((l) => lastPart.includes(l));
    if (hasLevel) {
      level = parts.pop() || "";
      text = parts.join(" - ");
    }
  }
  return { text: text.trim(), level: level.trim() };
};

// --- SUB-COMPONENTE AUXILIAR (LANGUAGE ITEM) ---
interface LanguageItemProps {
  lang: string;
  index: number;
  LANGUAGE_LEVELS: string[];
  cvDataLength: number;
  t: any;
  handleAutoResize: any;
  removeItem: (index: number) => void;
  handleLangChange: (index: number, text: string, level: string) => void;
}

function LanguageItem({
  lang,
  index,
  LANGUAGE_LEVELS,
  cvDataLength,
  t,
  handleAutoResize,
  removeItem,
  handleLangChange,
}: LanguageItemProps) {
  // HOOK DO SUB-ITEM CONECTADO AO ÍNDICE
  const [isLangOpen, setIsLangOpen] = useSyncCollapse(
    `languages-item-${index}`,
    true
  );
  const parsed = parseLangString(lang, LANGUAGE_LEVELS);

  return (
    <Collapsible
      open={isLangOpen}
      onOpenChange={setIsLangOpen}
      id={`languages-item-${index}`}
      className="border-muted/50 mb-4 scroll-mt-24 border-b pb-6 last:border-0 last:pb-0"
    >
      {/* NÍVEL 2: HEADER DO IDIOMA */}
      <div className="mb-4 flex w-full flex-row items-center justify-between gap-4">
        <CollapsibleTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="group flex flex-1 cursor-pointer items-center justify-between text-left transition-opacity hover:opacity-80 focus:outline-none"
          >
            <FieldLabel className="cursor-pointer text-left font-medium capitalize">
              {t("sections.languages.itemLabel", { num: index + 1 })}
            </FieldLabel>
            <ChevronDown
              className={`text-muted-foreground mr-4 h-4 w-4 transition-transform duration-200 ${
                isLangOpen ? "rotate-180" : ""
              } `}
            />
          </div>
        </CollapsibleTrigger>

        {cvDataLength > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="h-8 w-8 shrink-0"
          >
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        )}
      </div>

      <CollapsibleContent className="space-y-6">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Textarea
            className="min-h-9.5 w-full min-w-0 flex-1 resize-none overflow-hidden py-2"
            rows={1}
            placeholder={t("sections.languages.placeholder")}
            value={parsed.text}
            onBlur={(e) => {
              if (!e.target.value.trim() && cvDataLength > 1) {
                removeItem(index);
              }
            }}
            onChange={(e) => {
              handleAutoResize(e);
              handleLangChange(index, e.target.value, parsed.level);
            }}
          />

          <div className="w-full min-w-0 flex-1">
            <Select
              value={parsed.level}
              onValueChange={(val) => handleLangChange(index, parsed.text, val)}
              modal={false}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("sections.languages.levelPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function LanguagesSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("languages", true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const LANGUAGE_LEVELS = t.raw("language_levels") as string[];

  const addItem = () => {
    updateCvData((draft) => {
      draft.languages.push("");
    });
  };

  const removeItem = (index: number) => {
    updateCvData((draft) => {
      if (draft.languages.length > 1) {
        draft.languages = draft.languages.filter((_, i) => i !== index);
      }
    });
  };

  const updateItem = (index: number, value: string) => {
    updateCvData((draft) => {
      draft.languages[index] = value;
    });
  };

  const handleLangChange = (index: number, text: string, level: string) => {
    const finalVal = level ? `${text} - ${level}` : text;
    updateItem(index, finalVal);
  };

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 sm:w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent id="languages" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4 py-4"
      >
        {/* NÍVEL 1: HEADER DA SEÇÃO */}
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.languages.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.languages.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.languages.count", {
                count: cvData.languages.length,
              })}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 focus-visible:ring-0"
              >
                <ChevronDown
                  className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  } `}
                />
              </Button>
            </CollapsibleTrigger>

            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> {t("sections.languages.addBtn")}
            </Button>
          </div>
        </div>

        {/* NÍVEL 1 CONTEÚDO (LISTA) */}
        <CollapsibleContent className="space-y-4">
          {cvData.languages.map((lang, index) => (
            <LanguageItem
              key={index}
              lang={lang}
              index={index}
              LANGUAGE_LEVELS={LANGUAGE_LEVELS}
              cvDataLength={cvData.languages.length}
              t={t}
              handleAutoResize={handleAutoResize}
              removeItem={removeItem}
              handleLangChange={handleLangChange}
            />
          ))}

          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={addItem}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> {t("sections.languages.addBtn")}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

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

// --- PARSE "__LEVEL_X__" TOKENS ---
const parseLangString = (str?: string) => {
  if (!str) return { text: "", level: "" };
  const parts = str.split(" - ");
  let text = str;
  let level = "";
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.startsWith("__LEVEL_")) {
      level = lastPart;
      parts.pop();
      text = parts.join(" - ");
    }
  }
  return { text: text.trim(), level: level.trim() };
};

interface LanguageItemProps {
  lang: string;
  index: number;
  LANGUAGE_LEVELS: string[];
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  const [isLangOpen, setIsLangOpen] = useSyncCollapse(
    `languages-item-${index}`,
    false
  );
  const parsed = parseLangString(lang);

  return (
    <Collapsible
      open={isLangOpen}
      onOpenChange={setIsLangOpen}
      id={`languages-item-${index}`}
      className="border-muted/50 mb-4 scroll-mt-24 border-b pb-6 last:border-0 last:pb-0"
    >
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
              className={`text-muted-foreground mr-4 h-4 w-4 transition-transform duration-200 ${isLangOpen ? `rotate-180` : ""} `}
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
            className="min-h-[38px] w-full min-w-0 flex-1 resize-none overflow-hidden py-2"
            rows={1}
            placeholder={t("sections.languages.placeholder")}
            value={parsed.text}
            onBlur={(e) => {
              if (!e.target.value.trim() && cvDataLength > 1) removeItem(index);
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
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("sections.languages.levelPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent>
                {/* Store translation tokens instead of localized strings to preserve consistency */}
                {LANGUAGE_LEVELS.map((level, i) => (
                  <SelectItem key={i} value={`__LEVEL_${i}__`}>
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

export function LanguagesSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("languages", false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const LANGUAGE_LEVELS = t.raw("language_levels") as string[];

  const addItem = () =>
    updateCvData((draft) => {
      draft.languages.push("");
    });
  const removeItem = (index: number) =>
    updateCvData((draft) => {
      if (draft.languages.length > 1)
        draft.languages = draft.languages.filter((_, i) => i !== index);
    });
  const updateItem = (index: number, value: string) =>
    updateCvData((draft) => {
      draft.languages[index] = value;
    });

  const handleLangChange = (index: number, text: string, level: string) => {
    const finalVal = level ? `${text} - ${level}` : text;
    updateItem(index, finalVal);
  };

  if (!isMounted) return <Skeleton className="h-20 w-full" />;

  return (
    <CardContent id="languages" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4 py-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.languages.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.languages.subTitle")}
            </h3>
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
                  className={`text-muted-foreground h-5 w-5 transition-transform ${isOpen ? `rotate-180` : ""} `}
                />
              </Button>
            </CollapsibleTrigger>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> {t("sections.languages.addBtn")}
            </Button>
          </div>
        </div>

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
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

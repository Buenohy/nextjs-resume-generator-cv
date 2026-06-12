"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthYearPicker } from "../sections/ui/mouth-year-picker";
import { useSyncCollapse } from "@/app/hooks/useSyncCollapse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// --- AUXILIARY CONVERSION FOR TOKENIZED STRINGS ---
const parseEduString = (str?: string) => {
  if (!str)
    return {
      text: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
    };
  const parts = str.split(" | ");
  let text = str;
  let dateStr = "";

  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    const hasYear = /\b\d{4}\b/.test(lastPart);
    const hasMonthToken =
      lastPart.includes("__MONTH_") || lastPart.includes("__PRESENT__");

    if (hasYear || hasMonthToken) {
      dateStr = parts.pop() || "";
      text = parts.join(" | ");
    }
  }

  const [startStr, endStr] = dateStr.split(" - ");
  const s = (startStr || "").trim().split(" ");
  const e = (endStr || "").trim().split(" ");
  return {
    text: text.trim(),
    startMonth: s[0] || "",
    startYear: s[1] || "",
    endMonth: e[0] || "",
    endYear: e[1] || "",
  };
};

interface EducationItemProps {
  edu: string;
  index: number;
  YEARS: string[];
  MONTHS: string[];
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeItem: (index: number) => void;
  handleEduChange: (
    index: number,
    text: string,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => void;
}

function EducationItem({
  edu,
  index,
  YEARS,
  MONTHS,
  cvDataLength,
  t,
  handleAutoResize,
  removeItem,
  handleEduChange,
}: EducationItemProps) {
  const [isEduOpen, setIsEduOpen] = useSyncCollapse(
    `education-item-${index}`,
    false
  );
  const parsed = parseEduString(edu);

  return (
    <Collapsible
      open={isEduOpen}
      onOpenChange={setIsEduOpen}
      id={`education-item-${index}`}
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
              {t("sections.education.itemLabel", { num: index + 1 })}
            </FieldLabel>
            <ChevronDown
              className={`text-muted-foreground mr-4 h-4 w-4 transition-transform duration-200 ${
                isEduOpen ? "rotate-180" : ""
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
        <div className="flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-2">
            <Textarea
              className="min-h-[38px] w-full min-w-0 flex-1 resize-none overflow-hidden py-2"
              rows={1}
              placeholder={t("sections.education.placeholder")}
              value={parsed.text}
              onBlur={(e) => {
                if (!e.target.value.trim() && cvDataLength > 1) {
                  removeItem(index);
                }
              }}
              onChange={(e) => {
                handleAutoResize(e);
                handleEduChange(
                  index,
                  e.target.value,
                  parsed.startMonth,
                  parsed.startYear,
                  parsed.endMonth,
                  parsed.endYear
                );
              }}
            />
          </div>

          <div
            id={`education-${index}-period`}
            className="flex w-full scroll-mt-24 flex-col gap-2"
          >
            <FieldLabel className="text-left font-medium capitalize">
              {t("sections.education.period")}
            </FieldLabel>

            <MonthYearPicker
              startMonth={parsed.startMonth}
              startYear={parsed.startYear}
              endMonth={parsed.endMonth}
              endYear={parsed.endYear}
              months={MONTHS}
              years={YEARS}
              onStartMonthChange={(val) =>
                handleEduChange(
                  index,
                  parsed.text,
                  val,
                  parsed.startYear,
                  parsed.endMonth,
                  parsed.endYear
                )
              }
              onStartYearChange={(val) =>
                handleEduChange(
                  index,
                  parsed.text,
                  parsed.startMonth,
                  val,
                  parsed.endMonth,
                  parsed.endYear
                )
              }
              onEndMonthChange={(val) =>
                handleEduChange(
                  index,
                  parsed.text,
                  parsed.startMonth,
                  parsed.startYear,
                  val,
                  parsed.endYear
                )
              }
              onEndYearChange={(val) =>
                handleEduChange(
                  index,
                  parsed.text,
                  parsed.startMonth,
                  parsed.startYear,
                  parsed.endMonth,
                  val
                )
              }
              t={t}
              showPresent
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function EducationSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("education", false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const MONTHS = t.raw("months") as string[];
  const YEARS = Array.from({ length: 41 }, (_, i) =>
    String(new Date().getFullYear() + 10 - i)
  );

  const addItem = () => {
    updateCvData((draft) => {
      draft.education.push("");
    });
  };

  const removeItem = (index: number) => {
    updateCvData((draft) => {
      if (draft.education.length > 1) {
        draft.education = draft.education.filter((_, i) => i !== index);
      }
    });
  };

  const updateItem = (index: number, value: string) => {
    updateCvData((draft) => {
      draft.education[index] = value;
    });
  };

  const handleEduChange = (
    index: number,
    text: string,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    // SAVES THE __PRESENT__ TOKEN IF IT IS CURRENTLY SELECTED
    const end =
      em === "__PRESENT__" ? "__PRESENT__" : [em, ey].filter(Boolean).join(" ");
    const datePart = [start, end].filter(Boolean).join(" - ");
    const finalVal = datePart ? `${text} | ${datePart}` : text;
    updateItem(index, finalVal);
  };

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-4 border-b py-4">
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
    <CardContent id="education" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4 border-b py-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.education.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.education.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.education.count", {
                count: cvData.education.length,
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
              <Plus className="mr-2 h-4 w-4" /> {t("sections.education.addBtn")}
            </Button>
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          {cvData.education.map((edu, index) => (
            <EducationItem
              key={index}
              edu={edu}
              index={index}
              YEARS={YEARS}
              MONTHS={MONTHS}
              cvDataLength={cvData.education.length}
              t={t}
              handleAutoResize={handleAutoResize}
              removeItem={removeItem}
              handleEduChange={handleEduChange}
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
              <Plus className="mr-1 size-3.5" />{" "}
              {t("sections.education.addBtn")}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

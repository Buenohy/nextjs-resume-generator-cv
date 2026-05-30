"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { Skeleton } from "@/components/ui/skeleton";
import { MonthYearPicker } from "../sections/ui/mouth-year-picker";

export function EducationSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();
  const [isMounted, setIsMounted] = useState(false);

  {
    /* 
    DEFERRED MOUNT EFFECT
    - Defers rendering the fully interactive state to prevent hydration issues.
  */
  }
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
      const hasYear = YEARS.some((y) => lastPart.includes(y));
      const hasMonth =
        MONTHS.some((m) => lastPart.includes(m)) ||
        lastPart.includes("Present");
      if (hasYear || hasMonth) {
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

  const handleEduChange = (
    index: number,
    text: string,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    const end =
      em === "Present" ? "Present" : [em, ey].filter(Boolean).join(" ");
    const datePart = [start, end].filter(Boolean).join(" - ");
    const finalVal = datePart ? `${text} | ${datePart}` : text;
    updateItem(index, finalVal);
  };

  {
    /* 
    HIGH-FIDELITY SKELETON LOADER
    - Matches the layout, dynamic loops, and structural sizes of the entire Education component.
  */
  }
  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-4 border-b py-4">
          {/* Section Header Skeleton */}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 sm:w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Dynamic Education Skeletons mapping exactly the same amount of items */}
          {cvData.education.map((_, index) => (
            <Field
              key={index}
              className="border-muted/50 mb-4 border-b pb-6 last:border-0 last:pb-0"
            >
              <div className="flex w-full flex-col gap-6">
                {/* Part 1: Education Name Skeleton */}
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <Skeleton className="h-[38px] w-full rounded-md" />
                </div>

                {/* Part 2: Period / Date Selects Skeletons */}
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-4 w-20" />

                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    {/* Start Date Skeletons */}
                    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                      <Skeleton className="h-3 w-12" />
                      <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Skeleton className="h-10 w-full rounded-md sm:w-28" />
                        <Skeleton className="h-10 w-full rounded-md sm:w-24" />
                      </div>
                    </div>

                    <span className="text-muted-foreground hidden pb-2.5 sm:block">
                      -
                    </span>

                    {/* End Date Skeletons */}
                    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                      <Skeleton className="h-3 w-12" />
                      <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Skeleton className="h-10 w-full rounded-md sm:w-28" />
                        <Skeleton className="h-10 w-full rounded-md sm:w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Field>
          ))}

          {/* Bottom Add Button Skeleton */}
          <div className="mt-2 flex justify-end">
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent id="education" className="scroll-mt-20">
      <div className="flex flex-col gap-4 border-b py-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.education.title")}
            </h2>
            <h3 className="border-b pb-2 text-lg">
              {t("sections.education.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.education.count", {
                count: cvData.education.length,
              })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> {t("sections.education.addBtn")}
          </Button>
        </div>

        {/* EDUCATION LIST */}
        {cvData.education.map((edu, index) => {
          const parsed = parseEduString(edu);

          return (
            <Field
              key={index}
              className="border-muted/50 mb-4 border-b pb-6 last:border-0 last:pb-0"
            >
              {/* MAIN CONTAINER: Separates the Name area from the Date area */}
              <div className="flex w-full flex-col gap-6">
                {/* === PART 1: EDUCATION NAME === */}
                <div className="flex w-full flex-col gap-2">
                  {/* ROW 1: LABEL & TRASH BUTTON */}
                  <div className="flex w-full items-center justify-between">
                    <FieldLabel className="text-left font-medium capitalize">
                      {t("sections.education.itemLabel", { num: index + 1 })}
                    </FieldLabel>

                    {/* Trash Button - aligned right next to the label */}
                    {cvData.education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* ROW 2: TEXTAREA (Course/School Name) */}
                  <Textarea
                    className="min-h-[38px] w-full min-w-0 flex-1 resize-none overflow-hidden py-2"
                    rows={1}
                    placeholder={t("sections.education.placeholder")}
                    value={parsed.text}
                    onBlur={(e) => {
                      if (
                        !e.target.value.trim() &&
                        cvData.education.length > 1
                      ) {
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

                {/* === PART 2: PERIOD / DATE SECTION === */}
                <div className="flex w-full flex-col gap-2">
                  {/* LABEL ON TOP */}
                  <FieldLabel className="text-left font-medium capitalize">
                    {t("sections.education.period")}
                  </FieldLabel>

                  {/* Substituído o agrupamento manual de Selects pelo componente global */}
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
                    onlyEnd={true}
                  />
                </div>
              </div>
            </Field>
          );
        })}

        {/* ADD ITEM BUTTON */}
        <div className="mt-2 flex justify-end">
          <Button
            variant="outline"
            size="xs"
            onClick={addItem}
            className="gap-1 text-xs"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />{" "}
            {t("sections.education.addBtn")}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

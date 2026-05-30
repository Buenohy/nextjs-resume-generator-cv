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

export function CertificationsSection() {
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
      draft.certifications.push("");
    });
  };

  const removeItem = (index: number) => {
    updateCvData((draft) => {
      if (draft.certifications.length > 1) {
        draft.certifications = draft.certifications.filter(
          (_, i) => i !== index
        );
      }
    });
  };

  const updateItem = (index: number, value: string) => {
    updateCvData((draft) => {
      draft.certifications[index] = value;
    });
  };

  const parseCertString = (str?: string) => {
    if (!str) return { text: "", month: "", year: "" };
    const parts = str.split(" | ");
    let text = str;
    let dateStr = "";
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      const hasYear = YEARS.some((y) => lastPart.includes(y));
      const hasMonth = MONTHS.some((m) => lastPart.includes(m));
      if (hasYear || hasMonth) {
        dateStr = parts.pop() || "";
        text = parts.join(" | ");
      }
    }
    const dateParts = (dateStr || "").trim().split(" ");
    return {
      text: text.trim(),
      month: dateParts[0] || "",
      year: dateParts[1] || "",
    };
  };

  const handleCertChange = (
    index: number,
    text: string,
    m: string,
    y: string
  ) => {
    const datePart = [m, y].filter(Boolean).join(" ");
    const finalVal = datePart ? `${text} | ${datePart}` : text;
    updateItem(index, finalVal);
  };

  {
    /* 
    HIGH-FIDELITY SKELETON LOADER
    - Matches the layout, dynamic loops, and structural sizes of the entire Certifications component.
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
              <Skeleton className="h-4 w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Dynamic Certifications Skeletons mapping exactly the same amount of items */}
          {cvData.certifications.map((_, index) => (
            <Field
              key={index}
              className="border-muted/50 border-b last:border-0 last:pb-0"
            >
              <div className="flex w-full flex-col gap-4">
                {/* Part 1: Certification Name Skeleton */}
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <Skeleton className="h-[38px] w-full rounded-md" />
                </div>

                {/* Part 2: Date Selector Skeletons */}
                <div className="flex w-full flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-20 pl-1" />
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                      <Skeleton className="h-10 w-full rounded-md sm:w-28" />
                      <Skeleton className="h-10 w-full rounded-md sm:w-24" />
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
    <CardContent>
      <div className="flex flex-col gap-4 border-b py-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.certifications.title")}
            </h2>
            <h3 className="border-b pb-2 text-lg">
              {t("sections.certifications.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.certifications.count", {
                count: cvData.certifications.length,
              })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />{" "}
            {t("sections.certifications.addBtn")}
          </Button>
        </div>

        {/* CERTIFICATIONS LIST */}
        {cvData.certifications.map((cert, index) => {
          const parsed = parseCertString(cert);

          return (
            <Field
              key={index}
              className="border-muted/50 border-b last:border-0 last:pb-0"
            >
              <div className="flex w-full flex-col gap-4">
                {/* === PART 1: CERTIFICATION NAME === */}
                <div className="flex w-full flex-col gap-2">
                  {/* ROW 1: LABEL & TRASH BUTTON */}
                  <div className="flex w-full items-center justify-between">
                    <FieldLabel className="text-left font-medium capitalize">
                      {t("sections.certifications.itemLabel", {
                        num: index + 1,
                      })}
                    </FieldLabel>

                    {/* Trash Button - aligned right next to the label */}
                    {cvData.certifications.length > 1 && (
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

                  {/* ROW 2: TEXTAREA */}
                  <Textarea
                    className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                    rows={1}
                    placeholder={t("sections.certifications.placeholder")}
                    value={parsed.text}
                    onBlur={(e) => {
                      if (
                        !e.target.value.trim() &&
                        cvData.certifications.length > 1
                      ) {
                        removeItem(index);
                      }
                    }}
                    onChange={(e) => {
                      handleAutoResize(e);
                      handleCertChange(
                        index,
                        e.target.value,
                        parsed.month,
                        parsed.year
                      );
                    }}
                  />
                </div>

                {/* === PART 2: DATE SECTION === */}
                <div className="flex w-full flex-col gap-2">
                  {/* LABEL ON TOP */}
                  <FieldLabel className="text-left font-medium capitalize">
                    {t("sections.certifications.date")}
                  </FieldLabel>

                  {/* DATE SELECTS CONTAINER */}
                  <MonthYearPicker
                    startMonth=""
                    startYear=""
                    endMonth={parsed.month}
                    endYear={parsed.year}
                    months={MONTHS}
                    years={YEARS}
                    onStartMonthChange={() => {}}
                    onStartYearChange={() => {}}
                    onEndMonthChange={(val) =>
                      handleCertChange(index, parsed.text, val, parsed.year)
                    }
                    onEndYearChange={(val) =>
                      handleCertChange(index, parsed.text, parsed.month, val)
                    }
                    t={t}
                    showPresent={false}
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
            {t("sections.certifications.addBtn")}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

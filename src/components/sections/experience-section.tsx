"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { useResumeStore, ExperienceState } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { MonthYearPicker } from "@/components/sections/ui/mouth-year-picker";
import { Skeleton } from "@/components/ui/skeleton";

export function ExperienceSection() {
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

  // Base fields WITHOUT "date" (since we use MonthYearPicker)
  const experienceFields = Object.entries(t.raw("sections.experience.fields"))
    .filter(([key]) => key !== "date")
    .map(([key, value]: [string, any]) => ({
      id: key,
      label: value.label,
      placeholder: value.placeholder,
    }));

  const parseDateString = (dateStr?: string) => {
    if (!dateStr)
      return { startMonth: "", startYear: "", endMonth: "", endYear: "" };
    const [start, end] = dateStr.split(" - ");
    const s = (start || "").trim().split(" ");
    const e = (end || "").trim().split(" ");
    return {
      startMonth: s[0] || "",
      startYear: s[1] || "",
      endMonth: e[0] || "",
      endYear: e[1] || "",
    };
  };

  const handleDateChange = (
    expIndex: number,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    const end =
      em === "Present" ? "Present" : [em, ey].filter(Boolean).join(" ");
    const date =
      start || end ? `${start}${start && end ? " - " : ""}${end}` : "";
    updateCvData((draft) => {
      draft.experiences[expIndex].date = date;
    });
  };

  // Handlers for adding/removing experiences, details, and stacks
  const addExperience = () => {
    updateCvData((draft) => {
      if (draft.experiences.length < 4) {
        draft.experiences.push({
          role: "",
          company: "",
          url: "",
          date: "",
          details: [""],
          stacks: [""],
        });
      }
    });
  };

  const removeExperience = (index: number) => {
    updateCvData((draft) => {
      if (draft.experiences.length > 1) {
        draft.experiences = draft.experiences.filter((_, i) => i !== index);
      }
    });
  };

  const updateField = (
    expIndex: number,
    fieldId: keyof Omit<ExperienceState, "details" | "stacks">,
    value: string
  ) => {
    updateCvData((draft) => {
      draft.experiences[expIndex][fieldId] = value;
    });
  };

  const addDetail = (expIndex: number) => {
    updateCvData((draft) => {
      if (draft.experiences[expIndex].details.length < 3) {
        draft.experiences[expIndex].details.push("");
      }
    });
  };

  const removeDetail = (expIndex: number, dIdx: number) => {
    updateCvData((draft) => {
      if (draft.experiences[expIndex].details.length > 1) {
        draft.experiences[expIndex].details = draft.experiences[
          expIndex
        ].details.filter((_, i) => i !== dIdx);
      }
    });
  };

  const updateDetail = (expIndex: number, dIdx: number, value: string) => {
    updateCvData((draft) => {
      draft.experiences[expIndex].details[dIdx] = value;
    });
  };

  const addStack = (expIndex: number) => {
    updateCvData((draft) => {
      draft.experiences[expIndex].stacks.push("");
    });
  };

  const removeStack = (expIndex: number, sIdx: number) => {
    updateCvData((draft) => {
      if (draft.experiences[expIndex].stacks.length > 1) {
        draft.experiences[expIndex].stacks = draft.experiences[
          expIndex
        ].stacks.filter((_, i) => i !== sIdx);
      }
    });
  };

  const updateStack = (expIndex: number, sIdx: number, value: string) => {
    updateCvData((draft) => {
      draft.experiences[expIndex].stacks[sIdx] = value;
    });
  };

  {
    /* 
    HIGH-FIDELITY SKELETON LOADER
    - Matches the layout, nested layers, gaps, and heights of all experience sub-components exactly.
  */
  }
  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-6 border-b py-4">
          {/* Main Section Header Skeleton */}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Dynamic Experiences Skeletons mapping exactly the same amount of items */}
          {cvData.experiences.map((exp, expIndex) => (
            <div
              key={expIndex}
              className="flex flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
            >
              {/* Individual Experience Header Skeletons */}
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <Skeleton className="h-5.5 w-32" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>

              {/* Standard inputs + date picker field Skeletons (4 fields in total) */}
              {[1, 2, 3, 4].map((fieldIndex) => (
                <Field key={fieldIndex} className="mb-2">
                  <div className="flex w-full flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </Field>
              ))}

              {/* Dynamic Details List Skeletons mapping exactly the same amount of items */}
              <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4.5 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-7 w-24 rounded-md" />
                </div>
                {exp.details.map((_, dIdx) => (
                  <Field key={dIdx} className="mb-2">
                    <div className="flex w-full flex-col gap-2">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </Field>
                ))}
              </div>

              {/* Dynamic Tech Stacks List Skeletons mapping exactly the same amount of items */}
              <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4.5 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-7 w-24 rounded-md" />
                </div>
                {exp.stacks.map((_, sIdx) => (
                  <Field key={sIdx} className="mb-2">
                    <div className="flex w-full flex-col gap-2">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </Field>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.experience.title")}
            </h2>
            <h3 className="text-lg">{t("sections.experience.subTitle")}</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.experience.count", {
                count: cvData.experiences.length,
              })}
            </p>
          </div>
          {cvData.experiences.length < 4 && (
            <Button variant="outline" size="sm" onClick={addExperience}>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {t("sections.experience.addBtn")}
            </Button>
          )}
        </div>

        {/* EXPERIENCES LIST */}
        {cvData.experiences.map((exp, expIndex) => {
          const dateParsed = parseDateString(exp.date);

          return (
            <div
              key={expIndex}
              className="flex flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
            >
              {/* EXPERIENCE ITEM HEADER & REMOVE BUTTON */}
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h4 className="text-lg font-semibold">
                  {t("sections.experience.itemLabel", { num: expIndex + 1 })}
                </h4>
                {cvData.experiences.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(expIndex)}
                  >
                    <Trash2 className="text-destructive mr-1 h-4 w-4" />{" "}
                    {t("sections.experience.removeBtn")}
                  </Button>
                )}
              </div>

              {/* STANDARD FIELDS (Role, Company, URL) */}
              {experienceFields.map(({ id, label, placeholder }) => (
                <Field key={id} className="mb-2">
                  <div className="flex w-full flex-col gap-2">
                    <FieldLabel className="text-left font-medium capitalize">
                      {label}
                    </FieldLabel>
                    <Input
                      className="w-full"
                      placeholder={placeholder}
                      value={exp[id as keyof typeof exp] || ""}
                      onChange={(e) =>
                        updateField(
                          expIndex,
                          id as keyof Omit<
                            ExperienceState,
                            "details" | "stacks"
                          >,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </Field>
              ))}

              {/* DATE PICKER FIELD */}
              <Field className="mb-2">
                <div className="flex w-full flex-col gap-2">
                  <FieldLabel className="text-left font-medium capitalize">
                    {t("sections.experience.dateTitle")}
                  </FieldLabel>
                  <MonthYearPicker
                    startMonth={dateParsed.startMonth}
                    startYear={dateParsed.startYear}
                    endMonth={dateParsed.endMonth}
                    endYear={dateParsed.endYear}
                    months={MONTHS}
                    years={YEARS}
                    side="bottom"
                    onStartMonthChange={(val) =>
                      handleDateChange(
                        expIndex,
                        val,
                        dateParsed.startYear,
                        dateParsed.endMonth,
                        dateParsed.endYear
                      )
                    }
                    onStartYearChange={(val) =>
                      handleDateChange(
                        expIndex,
                        dateParsed.startMonth,
                        val,
                        dateParsed.endMonth,
                        dateParsed.endYear
                      )
                    }
                    onEndMonthChange={(val) =>
                      handleDateChange(
                        expIndex,
                        dateParsed.startMonth,
                        dateParsed.startYear,
                        val,
                        dateParsed.endYear
                      )
                    }
                    onEndYearChange={(val) =>
                      handleDateChange(
                        expIndex,
                        dateParsed.startMonth,
                        dateParsed.startYear,
                        dateParsed.endMonth,
                        val
                      )
                    }
                    t={t}
                    onlyEnd={false}
                  />
                </div>
              </Field>

              {/* === DETAILS SECTION === */}
              <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                {/* DETAILS HEADER */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h5 className="text-sm font-semibold">
                      {t("sections.experience.detailsTitle")}
                    </h5>
                    <p className="text-muted-foreground text-xs">
                      {t("sections.experience.detailsCount", {
                        count: exp.details.length,
                      })}
                    </p>
                  </div>
                  {exp.details.length < 3 && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => addDetail(expIndex)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                      {t("sections.experience.addDetailBtn")}
                    </Button>
                  )}
                </div>

                {/* DETAILS LIST */}
                {exp.details.map((detail, dIdx) => (
                  <Field key={dIdx} className="mb-2">
                    <div className="flex w-full flex-col gap-2">
                      {/* ROW 1: LABEL & TRASH BUTTON */}
                      <div className="flex w-full items-center justify-between">
                        <FieldLabel className="text-left text-xs font-medium capitalize">
                          {t("sections.experience.detailLabel", {
                            num: dIdx + 1,
                          })}
                        </FieldLabel>

                        {/* Trash Button - aligned right next to the label */}
                        {exp.details.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDetail(expIndex, dIdx)}
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
                        placeholder={t(
                          "sections.experience.detailPlaceholder",
                          { num: dIdx + 1 }
                        )}
                        value={detail}
                        onBlur={(e) => {
                          if (
                            !e.target.value.trim() &&
                            exp.details.length > 1
                          ) {
                            removeDetail(expIndex, dIdx);
                          }
                        }}
                        onChange={(e) => {
                          handleAutoResize(e);
                          updateDetail(expIndex, dIdx, e.target.value);
                        }}
                      />
                    </div>
                  </Field>
                ))}

                {/* ADD DETAIL BUTTON (Bottom) */}
                {exp.details.length < 3 && (
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => addDetail(expIndex)}
                      className="gap-1 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />{" "}
                      {t("sections.experience.addDetailBtn")}
                    </Button>
                  </div>
                )}
              </div>

              {/* === STACKS SECTION === */}
              <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                {/* STACKS HEADER */}
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h5 className="text-sm font-semibold">
                      {t("sections.experience.stacksTitle")}
                    </h5>
                    <p className="text-muted-foreground text-xs">
                      {t("sections.experience.stacksCount", {
                        count: exp.stacks.length,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => addStack(expIndex)}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                    {t("sections.experience.addStackBtn")}
                  </Button>
                </div>

                {/* STACKS LIST */}
                {exp.stacks.map((stack, sIdx) => (
                  <Field key={sIdx} className="mb-2">
                    <div className="flex w-full flex-col gap-2">
                      {/* ROW 1: LABEL & TRASH BUTTON */}
                      <div className="flex w-full items-center justify-between">
                        <FieldLabel className="text-left text-xs font-medium capitalize">
                          {t("sections.experience.stackLabel", {
                            num: sIdx + 1,
                          })}
                        </FieldLabel>

                        {/* Trash Button - aligned right next to the label */}
                        {exp.stacks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStack(expIndex, sIdx)}
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
                        placeholder={t("sections.experience.stackPlaceholder")}
                        value={stack}
                        onBlur={(e) => {
                          if (!e.target.value.trim() && exp.stacks.length > 1) {
                            removeStack(expIndex, sIdx);
                          }
                        }}
                        onChange={(e) => {
                          handleAutoResize(e);
                          updateStack(expIndex, sIdx, e.target.value);
                        }}
                      />
                    </div>
                  </Field>
                ))}

                {/* ADD STACK BUTTON (Bottom) */}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => addStack(expIndex)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />{" "}
                    {t("sections.experience.addStackBtn")}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  );
}

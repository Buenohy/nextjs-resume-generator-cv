"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useResumeStore, ExperienceState } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { MonthYearPicker } from "@/components/sections/ui/mouth-year-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { useSyncCollapse } from "@/app/hooks/useSyncCollapse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// --- CONVERSÃO AUXILIAR DE DATA ---
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

interface ExperienceItemProps {
  exp: ExperienceState;
  expIndex: number;
  experienceFields: any[];
  MONTHS: string[];
  YEARS: string[];
  cvDataLength: number;
  t: any;
  handleAutoResize: any;
  handleDateChange: (
    expIndex: number,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => void;
  removeExperience: (index: number) => void;
  updateField: (expIndex: number, fieldId: any, value: string) => void;
  addDetail: (expIndex: number) => void;
  removeDetail: (expIndex: number, dIdx: number) => void;
  updateDetail: (expIndex: number, dIdx: number, value: string) => void;
  addStack: (expIndex: number) => void;
  removeStack: (expIndex: number, sIdx: number) => void;
  updateStack: (expIndex: number, sIdx: number, value: string) => void;
}

function ExperienceItem({
  exp,
  expIndex,
  experienceFields,
  MONTHS,
  YEARS,
  cvDataLength,
  t,
  handleAutoResize,
  handleDateChange,
  removeExperience,
  updateField,
  addDetail,
  removeDetail,
  updateDetail,
  addStack,
  removeStack,
  updateStack,
}: ExperienceItemProps) {
  const [isExpOpen, setIsExpOpen] = useSyncCollapse(
    `experience-item-${expIndex}`,
    false
  );
  const [isDetailsOpen, setIsDetailsOpen] = useSyncCollapse(
    `experience-details-${expIndex}`,
    false
  );
  const [isStacksOpen, setIsStacksOpen] = useSyncCollapse(
    `experience-stacks-${expIndex}`,
    false
  );

  const dateParsed = parseDateString(exp.date);

  return (
    <Collapsible
      open={isExpOpen}
      onOpenChange={setIsExpOpen}
      id={`experience-item-${expIndex}`}
      className="flex scroll-mt-24 flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
    >
      <div className="flex w-full flex-row items-center justify-between gap-4">
        <h4 className="text-left text-lg font-semibold">
          {t("sections.experience.itemLabel", { num: expIndex + 1 })}
        </h4>

        <div className="flex shrink-0 flex-row items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 focus-visible:ring-0"
            >
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                  isExpOpen ? "rotate-180" : ""
                } `}
              />
            </Button>
          </CollapsibleTrigger>

          {cvDataLength > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(expIndex)}
              className="gap-1"
            >
              <Trash2 className="text-destructive h-4 w-4" />{" "}
              {t("sections.experience.removeBtn")}
            </Button>
          )}
        </div>
      </div>

      <CollapsibleContent className="space-y-6">
        {experienceFields.map(({ id, label, placeholder }) => (
          <Field
            key={id}
            id={`experience-${expIndex}-${id}`}
            className="mb-2 scroll-mt-24"
          >
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
                    id as keyof Omit<ExperienceState, "details" | "stacks">,
                    e.target.value
                  )
                }
              />
            </div>
          </Field>
        ))}

        <Field id={`experience-${expIndex}-date`} className="mb-2 scroll-mt-24">
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
              showPresent={true}
            />
          </div>
        </Field>

        <Collapsible
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          id={`experience-details-${expIndex}`}
          className="border-muted/60 my-4 ml-4 flex scroll-mt-24 flex-col gap-4 border-l-2 pl-6 md:ml-8"
        >
          <div className="flex w-full flex-row items-start justify-between gap-4">
            <div className="flex flex-col text-left">
              <h5 className="text-sm font-semibold">
                {t("sections.experience.detailsTitle")}
              </h5>
              <p className="text-muted-foreground text-xs">
                {t("sections.experience.detailsCount", {
                  count: exp.details.length,
                })}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 focus-visible:ring-0"
                >
                  <ChevronDown
                    className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                      isDetailsOpen ? "rotate-180" : ""
                    } `}
                  />
                </Button>
              </CollapsibleTrigger>

              {exp.details.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => addDetail(expIndex)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                  {t("sections.experience.addDetailBtn")}
                </Button>
              )}
            </div>
          </div>

          <CollapsibleContent className="w-full space-y-4">
            {exp.details.map((detail, dIdx) => (
              <Field
                key={dIdx}
                id={`experience-${expIndex}-detail-${dIdx}`}
                className="mb-2 scroll-mt-24"
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <FieldLabel className="text-left text-xs font-medium capitalize">
                      {t("sections.experience.detailLabel", {
                        num: dIdx + 1,
                      })}
                    </FieldLabel>

                    {exp.details.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDetail(expIndex, dIdx)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <Textarea
                    className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                    rows={1}
                    placeholder={t("sections.experience.detailPlaceholder", {
                      num: dIdx + 1,
                    })}
                    value={detail}
                    onBlur={(e) => {
                      if (!e.target.value.trim() && exp.details.length > 1) {
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

            {exp.details.length < 3 && (
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
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
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={isStacksOpen}
          onOpenChange={setIsStacksOpen}
          id={`experience-stacks-${expIndex}`}
          className="border-muted/60 my-4 ml-4 flex scroll-mt-24 flex-col gap-4 border-l-2 pl-6 md:ml-8"
        >
          <div className="flex w-full flex-row items-start justify-between gap-4">
            <div className="flex flex-col text-left">
              <h5 className="text-sm font-semibold">
                {t("sections.experience.stacksTitle")}
              </h5>
              <p className="text-muted-foreground text-xs">
                {t("sections.experience.stacksCount", {
                  count: exp.stacks.length,
                })}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 focus-visible:ring-0"
                >
                  <ChevronDown
                    className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                      isStacksOpen ? "rotate-180" : ""
                    } `}
                  />
                </Button>
              </CollapsibleTrigger>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => addStack(expIndex)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                {t("sections.experience.addStackBtn")}
              </Button>
            </div>
          </div>

          <CollapsibleContent className="w-full space-y-4">
            {exp.stacks.map((stack, sIdx) => (
              <Field
                key={sIdx}
                id={`experience-${expIndex}-stack-${sIdx}`}
                className="mb-2 scroll-mt-24"
              >
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <FieldLabel className="text-left text-xs font-medium capitalize">
                      {t("sections.experience.stackLabel", {
                        num: sIdx + 1,
                      })}
                    </FieldLabel>

                    {exp.stacks.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStack(expIndex, sIdx)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    )}
                  </div>

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

            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => addStack(expIndex)}
                className="gap-1 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />{" "}
                {t("sections.experience.addStackBtn")}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  );
}

// --- COMPONENTE PRINCIPAL ---
export function ExperienceSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("experience", false);

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

  const experienceFields = Object.entries(t.raw("sections.experience.fields"))
    .filter(([key]) => key !== "date")
    .map(([key, value]: [string, any]) => ({
      id: key,
      label: value.label,
      placeholder: value.placeholder,
    }));

  // --- GRAVAÇÃO DA DATA COM SUPORTE A TOKEN DINÂMICO ---
  const handleDateChange = (
    expIndex: number,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    const end =
      em === "__PRESENT__" ? "__PRESENT__" : [em, ey].filter(Boolean).join(" ");

    const datePart =
      start || end ? `${start}${start && end ? " - " : ""}${end}` : "";
    updateCvData((draft) => {
      draft.experiences[expIndex].date = datePart;
    });
  };

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

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-6 border-b py-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent id="experience" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-6 border-b py-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.experience.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.experience.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.experience.count", {
                count: cvData.experiences.length,
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

            {cvData.experiences.length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExperience}
              >
                <Plus className="mr-2 h-4 w-4" />{" "}
                {t("sections.experience.addBtn")}
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          {cvData.experiences.map((exp, expIndex) => (
            <ExperienceItem
              key={expIndex}
              exp={exp}
              expIndex={expIndex}
              experienceFields={experienceFields}
              MONTHS={MONTHS}
              YEARS={YEARS}
              cvDataLength={cvData.experiences.length}
              t={t}
              handleAutoResize={handleAutoResize}
              handleDateChange={handleDateChange}
              removeExperience={removeExperience}
              updateField={updateField}
              addDetail={addDetail}
              removeDetail={removeDetail}
              updateDetail={updateDetail}
              addStack={addStack}
              removeStack={removeStack}
              updateStack={updateStack}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

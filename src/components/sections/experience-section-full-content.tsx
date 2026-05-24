"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import {
  useFullContentStore,
  FullContentState,
} from "@/store/useFullContentStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { MonthYearPicker } from "./ui/mouth-year-picker";

type ExperienceItem = FullContentState["experiences"][number];

export function ExperienceSectionFullContent() {
  const t = useTranslations("ResumeBuilderPage");
  const useStore = useFullContentStore();
  const experiences = useStore((s) => s.experiences);
  const updateFullContent = useStore((s) => s.updateFullContent);
  const handleAutoResize = useAutoResize();

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
    updateFullContent((draft) => {
      draft.experiences[expIndex].date = date;
    });
  };

  const addExperience = () => {
    updateFullContent((draft) => {
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
    updateFullContent((draft) => {
      if (draft.experiences.length > 1) {
        draft.experiences = draft.experiences.filter((_, i) => i !== index);
      }
    });
  };

  const updateField = (
    expIndex: number,
    fieldId: keyof Omit<ExperienceItem, "details" | "stacks">,
    value: string
  ) => {
    updateFullContent((draft) => {
      draft.experiences[expIndex][fieldId] = value;
    });
  };

  const addDetail = (expIndex: number) => {
    updateFullContent((draft) => {
      if (draft.experiences[expIndex].details.length < 3) {
        draft.experiences[expIndex].details.push("");
      }
    });
  };

  const removeDetail = (expIndex: number, dIdx: number) => {
    updateFullContent((draft) => {
      if (draft.experiences[expIndex].details.length > 1) {
        draft.experiences[expIndex].details = draft.experiences[
          expIndex
        ].details.filter((_, i) => i !== dIdx);
      }
    });
  };

  const updateDetail = (expIndex: number, dIdx: number, value: string) => {
    updateFullContent((draft) => {
      draft.experiences[expIndex].details[dIdx] = value;
    });
  };

  const addStack = (expIndex: number) => {
    updateFullContent((draft) => {
      draft.experiences[expIndex].stacks.push("");
    });
  };

  const removeStack = (expIndex: number, sIdx: number) => {
    updateFullContent((draft) => {
      if (draft.experiences[expIndex].stacks.length > 1) {
        draft.experiences[expIndex].stacks = draft.experiences[
          expIndex
        ].stacks.filter((_, i) => i !== sIdx);
      }
    });
  };

  const updateStack = (expIndex: number, sIdx: number, value: string) => {
    updateFullContent((draft) => {
      draft.experiences[expIndex].stacks[sIdx] = value;
    });
  };

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.experience.title")}
            </h2>
            <h3 className="text-lg">{t("sections.experience.subTitle")}</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.experience.count", {
                count: experiences.length,
              })}
            </p>
          </div>
          {experiences.length < 4 && (
            <Button variant="outline" size="lg" onClick={addExperience}>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {t("sections.experience.addBtn")}
            </Button>
          )}
        </div>

        {experiences.map((exp, expIndex) => {
          const dateParsed = parseDateString(exp.date);

          return (
            <div
              key={expIndex}
              className="flex flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <h4 className="text-lg font-semibold">
                  {t("sections.experience.itemLabel", {
                    num: expIndex + 1,
                  })}
                </h4>
                {experiences.length > 1 && (
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

              {experienceFields.map(({ id, label, placeholder }) => (
                <Field key={id} className="mb-4">
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                    <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                      {label}
                    </FieldLabel>
                    <Input
                      className="w-full flex-1"
                      placeholder={placeholder}
                      value={exp[id as keyof typeof exp] || ""}
                      onChange={(e) =>
                        updateField(
                          expIndex,
                          id as keyof Omit<
                            ExperienceItem,
                            "details" | "stacks"
                          >,
                          e.target.value
                        )
                      }
                    />
                  </div>
                </Field>
              ))}

              <Field className="mb-4">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    Date
                  </FieldLabel>
                  <MonthYearPicker
                    startMonth={dateParsed.startMonth}
                    startYear={dateParsed.startYear}
                    endMonth={dateParsed.endMonth}
                    endYear={dateParsed.endYear}
                    months={MONTHS}
                    years={YEARS}
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
                    showPresent
                  />
                </div>
              </Field>

              <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
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
                      size="sm"
                      onClick={() => addDetail(expIndex)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                      {t("sections.experience.addDetailBtn")}
                    </Button>
                  )}
                </div>
                {exp.details.map((detail, dIdx) => (
                  <Field key={dIdx} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          {t("sections.experience.detailLabel", {
                            num: dIdx + 1,
                          })}
                        </FieldLabel>
                        {exp.details.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDetail(expIndex, dIdx)}
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
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
                      {exp.details.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDetail(expIndex, dIdx)}
                          className="hidden sm:inline-flex"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                ))}
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

              <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
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
                    size="sm"
                    onClick={() => addStack(expIndex)}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                    {t("sections.experience.addStackBtn")}
                  </Button>
                </div>
                {exp.stacks.map((stack, sIdx) => (
                  <Field key={sIdx} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          {t("sections.experience.stackLabel", {
                            num: sIdx + 1,
                          })}
                        </FieldLabel>
                        {exp.stacks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStack(expIndex, sIdx)}
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
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
                      {exp.stacks.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStack(expIndex, sIdx)}
                          className="hidden sm:inline-flex"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                ))}
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

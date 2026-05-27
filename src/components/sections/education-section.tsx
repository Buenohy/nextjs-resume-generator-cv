"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
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

export function EducationSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

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

  return (
    <CardContent>
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

                  {/* 
                    DATE SELECTS CONTAINER 
                    - Mobile: Stacks Start and End dates vertically (flex-col).
                    - Desktop: Puts them inline (sm:flex-row) aligned to bottom (sm:items-end).
                  */}
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                    {/* --- START DATE BLOCK --- */}
                    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                      <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
                        {t("sections.education.start")}
                      </span>

                      <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Select
                          value={parsed.startMonth}
                          onValueChange={(val) =>
                            handleEduChange(
                              index,
                              parsed.text,
                              val,
                              parsed.startYear,
                              parsed.endMonth,
                              parsed.endYear
                            )
                          }
                          modal={false}
                        >
                          <SelectTrigger className="w-full sm:w-[110px]">
                            <SelectValue
                              placeholder={t("sections.education.month")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {MONTHS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={parsed.startYear}
                          onValueChange={(val) =>
                            handleEduChange(
                              index,
                              parsed.text,
                              parsed.startMonth,
                              val,
                              parsed.endMonth,
                              parsed.endYear
                            )
                          }
                          modal={false}
                        >
                          <SelectTrigger className="w-full sm:w-[90px]">
                            <SelectValue
                              placeholder={t("sections.education.year")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {YEARS.map((y) => (
                              <SelectItem key={y} value={y}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* SEPARATOR (Hidden on mobile, visible on desktop) */}
                    <span className="text-muted-foreground hidden pb-2.5 sm:block">
                      -
                    </span>

                    {/* --- END DATE BLOCK --- */}
                    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                      <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
                        {t("sections.education.end")}
                      </span>

                      <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Select
                          value={parsed.endMonth}
                          onValueChange={(val) =>
                            handleEduChange(
                              index,
                              parsed.text,
                              parsed.startMonth,
                              parsed.startYear,
                              val,
                              parsed.endYear
                            )
                          }
                          modal={false}
                        >
                          <SelectTrigger className="w-full sm:w-[110px]">
                            <SelectValue
                              placeholder={t("sections.education.month")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Present">Present</SelectItem>
                            {MONTHS.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Render End Year only if End Month is not 'Present' */}
                        {parsed.endMonth !== "Present" && (
                          <Select
                            value={parsed.endYear}
                            onValueChange={(val) =>
                              handleEduChange(
                                index,
                                parsed.text,
                                parsed.startMonth,
                                parsed.startYear,
                                parsed.endMonth,
                                val
                              )
                            }
                            modal={false}
                          >
                            <SelectTrigger className="w-full sm:w-[90px]">
                              <SelectValue
                                placeholder={t("sections.education.year")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {YEARS.map((y) => (
                                <SelectItem key={y} value={y}>
                                  {y}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </div>
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

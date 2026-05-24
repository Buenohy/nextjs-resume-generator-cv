"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import {
  useFullContentStore,
  ExperienceItem,
} from "@/store/useFullContentStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { MonthYearPicker } from "./ui/mouth-year-picker";
import { ExperienceTable } from "./ui/experience-table";

const emptyExperience: ExperienceItem = {
  role: "",
  company: "",
  url: "",
  date: "",
  details: [""],
  stacks: [""],
};

export function ExperienceSectionFullContent() {
  const t = useTranslations("ResumeBuilderPage");
  const tFull = useTranslations("FullContentPage");
  const useStore = useFullContentStore();
  const savedExperiences = useStore((s) => s.savedExperiences);
  const addSavedExperience = useStore((s) => s.addSavedExperience);
  const removeSavedExperience = useStore((s) => s.removeSavedExperience);
  const handleAutoResize = useAutoResize();

  const [form, setForm] = useState<ExperienceItem>({ ...emptyExperience });
  const [expToDelete, setExpToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  const dateParsed = parseDateString(form.date);

  const handleDateChange = (sm: string, sy: string, em: string, ey: string) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    const end =
      em === "Present" ? "Present" : [em, ey].filter(Boolean).join(" ");
    const date =
      start || end ? `${start}${start && end ? " - " : ""}${end}` : "";
    setForm({ ...form, date });
    setErrorMessage("");
  };

  const updateField = (
    fieldId: keyof Omit<ExperienceItem, "details" | "stacks">,
    value: string
  ) => {
    setForm({ ...form, [fieldId]: value });
    setErrorMessage("");
  };

  const addDetail = () => {
    if (form.details.length < 3) {
      setForm({ ...form, details: [...form.details, ""] });
    }
  };

  const removeDetail = (dIdx: number) => {
    if (form.details.length > 1) {
      setForm({
        ...form,
        details: form.details.filter((_, i) => i !== dIdx),
      });
    }
  };

  const updateDetail = (dIdx: number, value: string) => {
    const newDetails = [...form.details];
    newDetails[dIdx] = value;
    setForm({ ...form, details: newDetails });
  };

  const addStack = () => {
    setForm({ ...form, stacks: [...form.stacks, ""] });
  };

  const removeStack = (sIdx: number) => {
    if (form.stacks.length > 1) {
      setForm({
        ...form,
        stacks: form.stacks.filter((_, i) => i !== sIdx),
      });
    }
  };

  const updateStack = (sIdx: number, value: string) => {
    const newStacks = [...form.stacks];
    newStacks[sIdx] = value;
    setForm({ ...form, stacks: newStacks });
  };

  const handleSave = () => {
    if (!form.role.trim() || !form.company.trim() || !form.date.trim()) {
      setErrorMessage(tFull("validationError"));
      return;
    }
    const hasDetail = form.details.some((d) => d.trim() !== "");
    if (!hasDetail) {
      setErrorMessage(tFull("validationError"));
      return;
    }

    const cleaned: ExperienceItem = {
      ...form,
      details: form.details.filter((d) => d.trim() !== ""),
      stacks: form.stacks.filter((s) => s.trim() !== ""),
    };
    addSavedExperience(cleaned);
    setForm({ ...emptyExperience });
    setErrorMessage("");
  };

  const handleDeleteConfirm = () => {
    if (expToDelete !== null) {
      removeSavedExperience(expToDelete);
      setExpToDelete(null);
    }
  };

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        <div>
          <h2 className="text-xl font-semibold">
            {t("sections.experience.title")}
          </h2>
          <h3 className="text-lg">{t("sections.experience.subTitle")}</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {tFull("formSubtitle")}
          </p>
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
                value={form[id as keyof typeof form] || ""}
                onChange={(e) =>
                  updateField(
                    id as keyof Omit<ExperienceItem, "details" | "stacks">,
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
                  val,
                  dateParsed.startYear,
                  dateParsed.endMonth,
                  dateParsed.endYear
                )
              }
              onStartYearChange={(val) =>
                handleDateChange(
                  dateParsed.startMonth,
                  val,
                  dateParsed.endMonth,
                  dateParsed.endYear
                )
              }
              onEndMonthChange={(val) =>
                handleDateChange(
                  dateParsed.startMonth,
                  dateParsed.startYear,
                  val,
                  dateParsed.endYear
                )
              }
              onEndYearChange={(val) =>
                handleDateChange(
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
                  count: form.details.length,
                })}
              </p>
            </div>
            {form.details.length < 3 && (
              <Button variant="outline" size="xs" onClick={addDetail}>
                <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                {t("sections.experience.addDetailBtn")}
              </Button>
            )}
          </div>
          {form.details.map((detail, dIdx) => (
            <Field key={dIdx} className="mb-2">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex w-full items-center justify-between sm:w-auto">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    {t("sections.experience.detailLabel", { num: dIdx + 1 })}
                  </FieldLabel>
                  {form.details.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDetail(dIdx)}
                      className="h-8 w-8 sm:hidden"
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                  rows={1}
                  placeholder={t("sections.experience.detailPlaceholder", {
                    num: dIdx + 1,
                  })}
                  value={detail}
                  onChange={(e) => {
                    handleAutoResize(e);
                    updateDetail(dIdx, e.target.value);
                  }}
                />
                {form.details.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDetail(dIdx)}
                    className="hidden sm:inline-flex"
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                )}
              </div>
            </Field>
          ))}
          {form.details.length < 3 && (
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="xs"
                onClick={addDetail}
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
                  count: form.stacks.length,
                })}
              </p>
            </div>
            <Button variant="outline" size="xs" onClick={addStack}>
              <Plus className="mr-1 h-3.5 w-3.5" />{" "}
              {t("sections.experience.addStackBtn")}
            </Button>
          </div>
          {form.stacks.map((stack, sIdx) => (
            <Field key={sIdx} className="mb-2">
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex w-full items-center justify-between sm:w-auto">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    {t("sections.experience.stackLabel", { num: sIdx + 1 })}
                  </FieldLabel>
                  {form.stacks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStack(sIdx)}
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
                  onChange={(e) => {
                    handleAutoResize(e);
                    updateStack(sIdx, e.target.value);
                  }}
                />
                {form.stacks.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStack(sIdx)}
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
              onClick={addStack}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />{" "}
              {t("sections.experience.addStackBtn")}
            </Button>
          </div>
        </div>

        <Button onClick={handleSave} className="mx-auto w-fit">
          {tFull("saveButton")}
        </Button>
        {errorMessage && (
          <p className="text-destructive mt-1 text-sm">{errorMessage}</p>
        )}
      </div>

      <div className="pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{tFull("savedTitle")}</h2>
        </div>
        <div className="border-muted overflow-x-auto rounded-md border shadow-sm">
          <ExperienceTable
            experiences={savedExperiences}
            onDelete={(index) => setExpToDelete(index)}
            tFull={tFull}
          />
        </div>
      </div>

      <AlertDialog
        open={expToDelete !== null}
        onOpenChange={(open) => !open && setExpToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tFull("deleteDialogTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tFull("deleteDialogDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tFull("deleteDialogCancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {tFull("deleteDialogConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardContent>
  );
}

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

export function CertificationsSection() {
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
                  <div className="flex flex-col gap-1.5">
                    {/* SUB-LABEL: "CONCLUSÃO" */}
                    <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                      {t("sections.certifications.completion")}
                    </span>

                    {/* SELECTS ROW */}
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                      {/* MONTH SELECT */}
                      <Select
                        value={parsed.month}
                        onValueChange={(val) =>
                          handleCertChange(index, parsed.text, val, parsed.year)
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

                      {/* YEAR SELECT */}
                      <Select
                        value={parsed.year}
                        onValueChange={(val) =>
                          handleCertChange(
                            index,
                            parsed.text,
                            parsed.month,
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
            {t("sections.certifications.addBtn")}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

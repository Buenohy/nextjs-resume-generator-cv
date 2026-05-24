"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";

export function SkillsSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const addItem = () => {
    updateCvData((draft) => {
      draft.skills.push("");
    });
  };

  const removeItem = (index: number) => {
    updateCvData((draft) => {
      if (draft.skills.length > 1) {
        draft.skills = draft.skills.filter((_, i) => i !== index);
      }
    });
  };

  const updateItem = (index: number, value: string) => {
    updateCvData((draft) => {
      draft.skills[index] = value;
    });
  };

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.skills.title")}
            </h2>
            <h3 className="text-lg">{t("sections.skills.subTitle")}</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.skills.count", { count: cvData.skills.length })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> {t("sections.skills.addBtn")}
          </Button>
        </div>

        {cvData.skills.map((skill, index) => (
          <Field key={index} className="mb-2">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex w-full items-center justify-between sm:w-auto">
                <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                  {t("sections.skills.itemLabel", { num: index + 1 })}
                </FieldLabel>
                {cvData.skills.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 sm:hidden"
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                rows={1}
                placeholder={t("sections.skills.placeholder")}
                value={skill}
                onBlur={(e) => {
                  if (!e.target.value.trim() && cvData.skills.length > 1) {
                    removeItem(index);
                  }
                }}
                onChange={(e) => {
                  handleAutoResize(e);
                  updateItem(index, e.target.value);
                }}
              />
              {cvData.skills.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
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
            onClick={addItem}
            className="gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> {t("sections.skills.addBtn")}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

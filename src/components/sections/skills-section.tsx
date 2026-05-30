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

export function SkillsSection() {
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

  {
    /* 
    HIGH-FIDELITY SKELETON LOADER
    - Matches the layout, gaps, and heights of both flat and dynamic components exactly.
  */
  }
  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-4 border-b py-4">
          {/* Header Skeletons */}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 sm:w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Dynamic Skills Skeletons mapping exactly the same amount of items */}
          {(cvData.skills.length > 0 ? cvData.skills : [""]).map((_, index) => (
            <Field key={index}>
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between">
                  <Skeleton className="h-3.5 w-20" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
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
    <CardContent id="skills" className="scroll-mt-20">
      {/* Outer container spacing set to gap-4 for consistency */}
      <div className="flex flex-col gap-4 border-b py-4">
        {/* SECTION HEADER */}
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

        {/* SKILLS LIST */}
        {cvData.skills.map((skill, index) => (
          <Field key={index}>
            {/* 
              MAIN ITEM CONTAINER
              - flex-col: Stacks the Label+Trash row on top of the Textarea input.
              - gap-2: Small space between the Label row and the Input row.
            */}
            <div className="flex w-full flex-col gap-2">
              {/* 
                ROW 1: LABEL & TRASH BUTTON
                - flex w-full: Takes full width.
                - items-center: Vertically aligns elements to the center.
                - justify-between: Pushes label to the left and trash to the far right.
              */}
              <div className="flex w-full items-center justify-between">
                <FieldLabel className="text-left font-medium capitalize">
                  {t("sections.skills.itemLabel", { num: index + 1 })}
                </FieldLabel>

                {/* Trash Button - aligned right next to the label */}
                {cvData.skills.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 shrink-0" /* Prevents button from shrinking */
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* 
                ROW 2: INPUT FIELD (Textarea)
                - w-full: Takes 100% of the available layout width.
              */}
              <Textarea
                className="min-h-[38px] w-full resize-none overflow-hidden py-2"
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
            </div>
          </Field>
        ))}

        {/* ADD ITEM BUTTON (Bottom) */}
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

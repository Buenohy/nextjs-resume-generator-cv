"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { Skeleton } from "@/components/ui/skeleton";
import { useSyncCollapse } from "@/app/hooks/useSyncCollapse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// --- AUXILIARY SUB-COMPONENT (SKILL ITEM) ---
interface SkillItemProps {
  skill: string;
  index: number;
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, value: string) => void;
}

function SkillItem({
  skill,
  index,
  cvDataLength,
  t,
  handleAutoResize,
  removeItem,
  updateItem,
}: SkillItemProps) {
  // CONNECT SUB-ITEM COLLAPSE STATE TO INDEX TO PREVENT HYDRATION DRIFT
  const [isSkillOpen, setIsSkillOpen] = useSyncCollapse(
    `skills-item-${index}`,
    false
  );

  return (
    <Collapsible
      open={isSkillOpen}
      onOpenChange={setIsSkillOpen}
      id={`skills-item-${index}`}
      className="border-muted/50 mb-4 scroll-mt-24 border-b pb-6 last:border-0 last:pb-0"
    >
      <div className="flex w-full flex-col gap-2">
        {/* ROW 1: LABEL & TRASH BUTTON */}
        <div className="flex w-full items-center justify-between">
          <CollapsibleTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="group flex flex-1 cursor-pointer items-center justify-between text-left transition-opacity hover:opacity-80 focus:outline-none"
            >
              <FieldLabel className="cursor-pointer text-left font-medium capitalize">
                {t("sections.skills.itemLabel", { num: index + 1 })}
              </FieldLabel>
              <ChevronDown
                className={`text-muted-foreground mr-4 h-4 w-4 transition-transform duration-200 ${
                  isSkillOpen ? "rotate-180" : ""
                } `}
              />
            </div>
          </CollapsibleTrigger>

          {/* Trash Button */}
          {cvDataLength > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              className="h-8 w-8 shrink-0"
            >
              <Trash2 className="text-destructive h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ROW 2: INPUT FIELD (Textarea) */}
        <CollapsibleContent className="w-full space-y-4">
          <Textarea
            className="min-h-[38px] w-full resize-none overflow-hidden py-2"
            rows={1}
            placeholder={t("sections.skills.placeholder")}
            value={skill}
            onBlur={(e) => {
              if (!e.target.value.trim() && cvDataLength > 1) {
                removeItem(index);
              }
            }}
            onChange={(e) => {
              handleAutoResize(e);
              updateItem(index, e.target.value);
            }}
          />
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// --- MAIN COMPONENT ---
export function SkillsSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("skills", false);

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

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-4 border-b py-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56 sm:w-72" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent id="skills" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4 border-b py-4"
      >
        {/* SECTION HEADER CONTAINER */}
        <div className="flex w-full flex-row items-start justify-between gap-4">
          {/* LEFT SIDE: DESCRIPTIVE TEXTS */}
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.skills.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.skills.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.skills.count", { count: cvData.skills.length })}
            </p>
          </div>

          {/* RIGHT SIDE: UTILITIES GROUPING */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            {/* COLLAPSIBLE TRIGGER (CHEVRON BUTTON) */}
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

            {/* ADD BUTTON */}
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> {t("sections.skills.addBtn")}
            </Button>
          </div>
        </div>

        {/* COLLAPSIBLE CONTENT */}
        <CollapsibleContent className="space-y-4">
          {/* SKILLS LIST */}
          {cvData.skills.map((skill, index) => (
            <SkillItem
              key={index}
              skill={skill}
              index={index}
              cvDataLength={cvData.skills.length}
              t={t}
              handleAutoResize={handleAutoResize}
              removeItem={removeItem}
              updateItem={updateItem}
            />
          ))}

          {/* ADD ITEM BUTTON (Bottom) */}
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={addItem}
              className="gap-1 text-xs"
            >
              <Plus className="size-3.5" /> {t("sections.skills.addBtn")}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

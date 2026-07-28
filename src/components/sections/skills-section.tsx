"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown, GripVertical } from "lucide-react";
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
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { closestCenter } from "@dnd-kit/collision";

// --- AUXILIARY SUB-COMPONENT (SKILL ITEM) ---
interface SkillItemProps {
  skill: string;
  index: number;
  sortableId: string;
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, value: string) => void;
}

function SkillItem({
  skill,
  index,
  sortableId,
  cvDataLength,
  t,
  handleAutoResize,
  removeItem,
  updateItem,
}: SkillItemProps) {
  // CONNECT SUB-ITEM COLLAPSE STATE TO STABLE SORTABLE ID (not raw index,
  // which changes when items are reordered) TO PREVENT HYDRATION DRIFT
  const [isSkillOpen, setIsSkillOpen] = useSyncCollapse(
    `skills-item-${sortableId}`,
    false
  );

  const { ref, handleRef } = useSortable({
    id: sortableId,
    index,
    collisionDetector: closestCenter,
  });

  return (
    <div
      ref={ref}
      // touch-none prevents the browser from treating a fast touch/pointer
      // drag as a page scroll gesture (see language-section.tsx for details)
      className="touch-none"
    >
      <Collapsible
        open={isSkillOpen}
        onOpenChange={setIsSkillOpen}
        id={`skills-item-${sortableId}`}
        className="border-muted/50 mb-4 scroll-mt-24 border-b pb-6 last:border-0 last:pb-0"
      >
        <div className="flex w-full flex-col gap-2">
          {/* ROW 1: HANDLE, LABEL & TRASH BUTTON */}
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-3">
              {/* Drag handle */}
              <button
                type="button"
                ref={handleRef}
                className="text-muted-foreground hover:text-foreground shrink-0 cursor-grab touch-none p-1 select-none focus-visible:outline-none active:cursor-grabbing"
              >
                <GripVertical className="size-4" />
              </button>

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
                    className={`text-muted-foreground mr-4 size-4 transition-transform duration-200 ${
                      isSkillOpen ? "rotate-180" : ""
                    } `}
                  />
                </div>
              </CollapsibleTrigger>
            </div>

            {/* Trash Button */}
            {cvDataLength > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                className="h-8 w-8 shrink-0"
              >
                <Trash2 className="text-destructive size-4" />
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
    </div>
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

  // Virtual IDs used only by dnd-kit for stable sortable identity.
  // cvData.skills stays a plain string[] — this ref never touches the store directly.
  const idsRef = useRef<string[]>([]);

  const currentLength = cvData.skills.length;
  if (idsRef.current.length < currentLength) {
    for (let i = idsRef.current.length; i < currentLength; i++) {
      idsRef.current.push(Math.random().toString(36).substring(2, 9));
    }
  } else if (idsRef.current.length > currentLength) {
    idsRef.current = idsRef.current.slice(0, currentLength);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const addItem = () => {
    idsRef.current.push(Math.random().toString(36).substring(2, 9));
    updateCvData((draft) => {
      draft.skills.push("");
    });
  };

  const removeItem = (index: number) => {
    if (cvData.skills.length <= 1) return;
    idsRef.current.splice(index, 1);
    updateCvData((draft) => {
      draft.skills = draft.skills.filter((_, i) => i !== index);
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
                  className={`text-muted-foreground size-5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  } `}
                />
              </Button>
            </CollapsibleTrigger>

            {/* ADD BUTTON */}
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 size-4" /> {t("sections.skills.addBtn")}
            </Button>
          </div>
        </div>

        {/* COLLAPSIBLE CONTENT */}
        <CollapsibleContent className="space-y-4">
          <DragDropProvider
            onDragEnd={(event: any) => {
              if (event?.canceled) return;

              // See language-section.tsx for full explanation: @dnd-kit/react
              // v0.5.0 already reorders the item internally before onDragEnd
              // fires, so operation.source.index is the FINAL position.
              // The correct diff pair is initialIndex (before) vs index (after),
              // both read from operation.source.
              const source = event?.operation?.source;
              if (!source) return;

              const oldIndex = source.initialIndex;
              const newIndex = source.index;

              if (
                oldIndex == null ||
                newIndex == null ||
                oldIndex === newIndex
              ) {
                return;
              }

              // Keep the virtual ID list in sync so React keys stay stable
              const [movedId] = idsRef.current.splice(oldIndex, 1);
              idsRef.current.splice(newIndex, 0, movedId);

              // Persist the real reorder in the Zustand store (source of truth)
              updateCvData((draft) => {
                const [movedSkill] = draft.skills.splice(oldIndex, 1);
                draft.skills.splice(newIndex, 0, movedSkill);
              });
            }}
          >
            {/* SKILLS LIST */}
            {cvData.skills.map((skill, index) => (
              <SkillItem
                key={idsRef.current[index]}
                sortableId={idsRef.current[index]}
                skill={skill}
                index={index}
                cvDataLength={cvData.skills.length}
                t={t}
                handleAutoResize={handleAutoResize}
                removeItem={removeItem}
                updateItem={updateItem}
              />
            ))}
          </DragDropProvider>

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

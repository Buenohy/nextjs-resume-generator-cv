"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown, GripVertical } from "lucide-react";
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
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { closestCenter } from "@dnd-kit/collision";

// --- HELPER DATE PARSING ---
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

// Generates a random virtual id used only for dnd-kit sortable identity.
const genId = () => Math.random().toString(36).substring(2, 9);

// --- DRAGGABLE ROW: PROJECT DETAIL ---
interface DetailRowProps {
  sortableId: string;
  index: number;
  value: string;
  label: string;
  placeholder: string;
  canRemove: boolean;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange: (value: string) => void;
  onRemove: () => void;
}

function DetailRow({
  sortableId,
  index,
  value,
  label,
  placeholder,
  canRemove,
  handleAutoResize,
  onChange,
  onRemove,
}: DetailRowProps) {
  const { ref, handleRef } = useSortable({
    id: sortableId,
    index,
    collisionDetector: closestCenter,
  });

  return (
    <div ref={ref} className="touch-none">
      <Field className="mb-2 scroll-mt-24">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <button
                type="button"
                ref={handleRef}
                className="text-muted-foreground hover:text-foreground shrink-0 cursor-grab touch-none p-1 select-none focus-visible:outline-none active:cursor-grabbing"
              >
                <GripVertical className="size-3.5" />
              </button>
              <FieldLabel className="text-left text-xs font-medium capitalize">
                {label}
              </FieldLabel>
            </div>

            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 shrink-0"
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            )}
          </div>

          <Textarea
            className="min-h-[38px] w-full resize-none overflow-hidden py-2"
            rows={1}
            placeholder={placeholder}
            value={value}
            onBlur={(e) => {
              if (!e.target.value.trim() && canRemove) onRemove();
            }}
            onChange={(e) => {
              handleAutoResize(e);
              onChange(e.target.value);
            }}
          />
        </div>
      </Field>
    </div>
  );
}

// --- DRAGGABLE ROW: TECH STACK ---
interface StackRowProps {
  sortableId: string;
  index: number;
  value: string;
  label: string;
  placeholder: string;
  canRemove: boolean;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange: (value: string) => void;
  onRemove: () => void;
}

function StackRow({
  sortableId,
  index,
  value,
  label,
  placeholder,
  canRemove,
  handleAutoResize,
  onChange,
  onRemove,
}: StackRowProps) {
  const { ref, handleRef } = useSortable({
    id: sortableId,
    index,
    collisionDetector: closestCenter,
  });

  return (
    <div ref={ref} className="touch-none">
      <Field className="mb-2 scroll-mt-24">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-2">
              <button
                type="button"
                ref={handleRef}
                className="text-muted-foreground hover:text-foreground shrink-0 cursor-grab touch-none p-1 select-none focus-visible:outline-none active:cursor-grabbing"
              >
                <GripVertical className="size-3.5" />
              </button>
              <FieldLabel className="text-left text-xs font-medium capitalize">
                {label}
              </FieldLabel>
            </div>

            {canRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 shrink-0"
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            )}
          </div>

          <Textarea
            className="min-h-[38px] w-full resize-none overflow-hidden py-2"
            rows={1}
            placeholder={placeholder}
            value={value}
            onBlur={(e) => {
              if (!e.target.value.trim() && canRemove) onRemove();
            }}
            onChange={(e) => {
              handleAutoResize(e);
              onChange(e.target.value);
            }}
          />
        </div>
      </Field>
    </div>
  );
}

interface ExperienceItemProps {
  exp: ExperienceState;
  expIndex: number;
  sortableId: string;
  experienceFields: { id: string; label: string; placeholder: string }[];
  MONTHS: string[];
  YEARS: string[];
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDateChange: (
    expIndex: number,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => void;
  removeExperience: (index: number) => void;
  updateField: (
    expIndex: number,
    fieldId: keyof Omit<ExperienceState, "details" | "stacks">,
    value: string
  ) => void;
  addDetail: (expIndex: number) => void;
  removeDetail: (expIndex: number, dIdx: number) => void;
  updateDetail: (expIndex: number, dIdx: number, value: string) => void;
  addStack: (expIndex: number) => void;
  removeStack: (expIndex: number, sIdx: number) => void;
  updateStack: (expIndex: number, sIdx: number, value: string) => void;
  onDetailsDragEnd: (expIndex: number, oldIdx: number, newIdx: number) => void;
  onStacksDragEnd: (expIndex: number, oldIdx: number, newIdx: number) => void;
}

function ExperienceItem({
  exp,
  expIndex,
  sortableId,
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
  onDetailsDragEnd,
  onStacksDragEnd,
}: ExperienceItemProps) {
  const [isExpOpen, setIsExpOpen] = useSyncCollapse(
    `experience-item-${sortableId}`,
    false
  );
  const [isDetailsOpen, setIsDetailsOpen] = useSyncCollapse(
    `experience-details-${sortableId}`,
    false
  );
  const [isStacksOpen, setIsStacksOpen] = useSyncCollapse(
    `experience-stacks-${sortableId}`,
    false
  );

  // Estado local de IDs virtuais para detalhes e stacks do item
  const [detailIds, setDetailIds] = useState<string[]>(() =>
    exp.details.map(() => genId())
  );
  const [stackIds, setStackIds] = useState<string[]>(() =>
    exp.stacks.map(() => genId())
  );

  // Sincroniza tamanhos de IDs com a store caso mude externamente
  if (detailIds.length !== exp.details.length) {
    const next = [...detailIds];
    while (next.length < exp.details.length) next.push(genId());
    while (next.length > exp.details.length) next.pop();
    setDetailIds(next);
  }

  if (stackIds.length !== exp.stacks.length) {
    const next = [...stackIds];
    while (next.length < exp.stacks.length) next.push(genId());
    while (next.length > exp.stacks.length) next.pop();
    setStackIds(next);
  }

  const dateParsed = parseDateString(exp.date);

  const { ref, handleRef } = useSortable({
    id: sortableId,
    index: expIndex,
    collisionDetector: closestCenter,
  });

  const handleDetailsDrag = (event: any) => {
    if (event?.canceled) return;
    const source = event?.operation?.source;
    if (!source) return;

    const oldIndex = source.initialIndex;
    const newIndex = source.index;

    if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

    setDetailIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });

    onDetailsDragEnd(expIndex, oldIndex, newIndex);
  };

  const handleStacksDrag = (event: any) => {
    if (event?.canceled) return;
    const source = event?.operation?.source;
    if (!source) return;

    const oldIndex = source.initialIndex;
    const newIndex = source.index;

    if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

    setStackIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });

    onStacksDragEnd(expIndex, oldIndex, newIndex);
  };

  return (
    <div ref={ref} className="touch-none">
      <Collapsible
        open={isExpOpen}
        onOpenChange={setIsExpOpen}
        id={`experience-item-${sortableId}`}
        className="flex scroll-mt-24 flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
      >
        <div className="flex w-full flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              ref={handleRef}
              className="text-muted-foreground hover:text-foreground shrink-0 cursor-grab touch-none p-1 select-none focus-visible:outline-none active:cursor-grabbing"
            >
              <GripVertical className="size-4" />
            </button>
            <h4 className="text-left text-lg font-semibold">
              {t("sections.experience.itemLabel", { num: expIndex + 1 })}
            </h4>
          </div>

          <div className="flex shrink-0 flex-row items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 focus-visible:ring-0"
              >
                <ChevronDown
                  className={`text-muted-foreground size-4 transition-transform duration-200 ${
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
                <Trash2 className="text-destructive size-4" />{" "}
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

          <Field
            id={`experience-${expIndex}-date`}
            className="mb-2 scroll-mt-24"
          >
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

          {/* --- PROJECT DETAILS (draggable) --- */}
          <Collapsible
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            id={`experience-details-${sortableId}`}
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
                      className={`text-muted-foreground size-4 transition-transform duration-200 ${
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
                    <Plus className="mr-1 size-3.5" />{" "}
                    {t("sections.experience.addDetailBtn")}
                  </Button>
                )}
              </div>
            </div>

            <CollapsibleContent className="w-full space-y-4">
              <DragDropProvider onDragEnd={handleDetailsDrag}>
                {exp.details.map((detail, dIdx) => (
                  <DetailRow
                    key={detailIds[dIdx] || `detail-${dIdx}`}
                    sortableId={detailIds[dIdx] || `detail-${dIdx}`}
                    index={dIdx}
                    value={detail}
                    label={t("sections.experience.detailLabel", {
                      num: dIdx + 1,
                    })}
                    placeholder={t("sections.experience.detailPlaceholder", {
                      num: dIdx + 1,
                    })}
                    canRemove={exp.details.length > 1}
                    handleAutoResize={handleAutoResize}
                    onChange={(value) => updateDetail(expIndex, dIdx, value)}
                    onRemove={() => removeDetail(expIndex, dIdx)}
                  />
                ))}
              </DragDropProvider>

              {exp.details.length < 3 && (
                <div className="mt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => addDetail(expIndex)}
                    className="gap-1 text-xs"
                  >
                    <Plus className="size-3.5" />{" "}
                    {t("sections.experience.addDetailBtn")}
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* --- TECH STACKS (draggable) --- */}
          <Collapsible
            open={isStacksOpen}
            onOpenChange={setIsStacksOpen}
            id={`experience-stacks-${sortableId}`}
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
                      className={`text-muted-foreground size-4 transition-transform duration-200 ${
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
                  <Plus className="mr-1 size-3.5" />{" "}
                  {t("sections.experience.addStackBtn")}
                </Button>
              </div>
            </div>

            <CollapsibleContent className="w-full space-y-4">
              <DragDropProvider onDragEnd={handleStacksDrag}>
                {exp.stacks.map((stack, sIdx) => (
                  <StackRow
                    key={stackIds[sIdx] || `stack-${sIdx}`}
                    sortableId={stackIds[sIdx] || `stack-${sIdx}`}
                    index={sIdx}
                    value={stack}
                    label={t("sections.experience.stackLabel", {
                      num: sIdx + 1,
                    })}
                    placeholder={t("sections.experience.stackPlaceholder")}
                    canRemove={exp.stacks.length > 1}
                    handleAutoResize={handleAutoResize}
                    onChange={(value) => updateStack(expIndex, sIdx, value)}
                    onRemove={() => removeStack(expIndex, sIdx)}
                  />
                ))}
              </DragDropProvider>

              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => addStack(expIndex)}
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />{" "}
                  {t("sections.experience.addStackBtn")}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function ExperienceSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("experience", false);

  // Estado React para os IDs virtuais das experiências principais
  const [expIds, setExpIds] = useState<string[]>(() =>
    cvData.experiences.map(() => genId())
  );

  // Sincroniza a quantidade de IDs se o tamanho do array mudar na store
  if (expIds.length !== cvData.experiences.length) {
    const next = [...expIds];
    while (next.length < cvData.experiences.length) next.push(genId());
    while (next.length > cvData.experiences.length) next.pop();
    setExpIds(next);
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

  const experienceFields = Object.entries(
    t.raw("sections.experience.fields") as Record<
      string,
      { label: string; placeholder: string }
    >
  )
    .filter(([key]) => key !== "date")
    .map(([key, value]) => ({
      id: key,
      label: value.label,
      placeholder: value.placeholder,
    }));

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
    if (cvData.experiences.length >= 4) return;
    setExpIds((prev) => [...prev, genId()]);
    updateCvData((draft) => {
      draft.experiences.push({
        role: "",
        company: "",
        url: "",
        date: "",
        details: [""],
        stacks: [""],
      });
    });
  };

  const removeExperience = (index: number) => {
    if (cvData.experiences.length <= 1) return;
    setExpIds((prev) => prev.filter((_, i) => i !== index));
    updateCvData((draft) => {
      draft.experiences = draft.experiences.filter((_, i) => i !== index);
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
    if (cvData.experiences[expIndex].details.length >= 3) return;
    updateCvData((draft) => {
      if (draft.experiences[expIndex].details.length < 3) {
        draft.experiences[expIndex].details.push("");
      }
    });
  };

  const removeDetail = (expIndex: number, dIdx: number) => {
    if (cvData.experiences[expIndex].details.length <= 1) return;
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
    if (cvData.experiences[expIndex].stacks.length <= 1) return;
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

  // --- DRAG END: TOP-LEVEL EXPERIENCES ---
  const handleExperienceDragEnd = (event: any) => {
    if (event?.canceled) return;

    const source = event?.operation?.source;
    if (!source) return;

    const oldIndex = source.initialIndex;
    const newIndex = source.index;

    if (oldIndex == null || newIndex == null || oldIndex === newIndex) return;

    setExpIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next;
    });

    updateCvData((draft) => {
      const [movedExp] = draft.experiences.splice(oldIndex, 1);
      draft.experiences.splice(newIndex, 0, movedExp);
    });
  };

  // --- DRAG END: PROJECT DETAILS ---
  const handleDetailsDragEnd = (
    expIndex: number,
    oldIndex: number,
    newIndex: number
  ) => {
    updateCvData((draft) => {
      const [movedDetail] = draft.experiences[expIndex].details.splice(
        oldIndex,
        1
      );
      draft.experiences[expIndex].details.splice(newIndex, 0, movedDetail);
    });
  };

  // --- DRAG END: TECH STACKS ---
  const handleStacksDragEnd = (
    expIndex: number,
    oldIndex: number,
    newIndex: number
  ) => {
    updateCvData((draft) => {
      const [movedStack] = draft.experiences[expIndex].stacks.splice(
        oldIndex,
        1
      );
      draft.experiences[expIndex].stacks.splice(newIndex, 0, movedStack);
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
                  className={`text-muted-foreground size-5 transition-transform duration-200 ${
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
                <Plus className="mr-2 size-4" />{" "}
                {t("sections.experience.addBtn")}
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          <DragDropProvider onDragEnd={handleExperienceDragEnd}>
            {cvData.experiences.map((exp, expIndex) => {
              const sortableId = expIds[expIndex] || `exp-${expIndex}`;

              return (
                <ExperienceItem
                  key={sortableId}
                  exp={exp}
                  expIndex={expIndex}
                  sortableId={sortableId}
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
                  onDetailsDragEnd={handleDetailsDragEnd}
                  onStacksDragEnd={handleStacksDragEnd}
                />
              );
            })}
          </DragDropProvider>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

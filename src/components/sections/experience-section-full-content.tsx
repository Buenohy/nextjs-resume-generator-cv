"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, X, GripVertical } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { closestCenter } from "@dnd-kit/collision";
import { PdfMetrics } from "../pdf-metrics";

const emptyExperience: ExperienceItem = {
  role: "",
  company: "",
  url: "",
  date: "",
  details: [""],
  stacks: [""],
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
      <Field className="mb-2">
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
          <PdfMetrics text={value} showPdfLines={true} charsPerLine={110} />
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
      <Field className="mb-2">
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
          <PdfMetrics text={value} showPdfLines={false} />
        </div>
      </Field>
    </div>
  );
}

export function ExperienceSectionFullContent() {
  const t = useTranslations("ResumeBuilderPage");
  const tFull = useTranslations("FullContentPage");
  const useStore = useFullContentStore();

  const savedExperiences = useStore((s) => s.savedExperiences);
  const isLoading = useStore((s) => s.isLoading);
  const fetchExperiences = useStore((s) => s.fetchExperiences);
  const addSavedExperience = useStore((s) => s.addSavedExperience);
  const updateSavedExperience = useStore((s) => s.updateSavedExperience);
  const removeSavedExperience = useStore((s) => s.removeSavedExperience);
  const handleAutoResize = useAutoResize();

  const [form, setForm] = useState<ExperienceItem>({ ...emptyExperience });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expToDelete, setExpToDelete] = useState<string | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Local state for virtual IDs to handle stable sortable rendering
  const [detailIds, setDetailIds] = useState<string[]>(() =>
    form.details.map(() => genId())
  );
  const [stackIds, setStackIds] = useState<string[]>(() =>
    form.stacks.map(() => genId())
  );

  // Sync virtual IDs size with form arrays size
  if (detailIds.length !== form.details.length) {
    const next = [...detailIds];
    while (next.length < form.details.length) next.push(genId());
    while (next.length > form.details.length) next.pop();
    setDetailIds(next);
  }

  if (stackIds.length !== form.stacks.length) {
    const next = [...stackIds];
    while (next.length < form.stacks.length) next.push(genId());
    while (next.length > form.stacks.length) next.pop();
    setStackIds(next);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      fetchExperiences();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // --- RECORD DATE WITH DYNAMIC TOKEN SUPPORT ---
  const handleDateChange = (sm: string, sy: string, em: string, ey: string) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    const end =
      em === "__PRESENT__" ? "__PRESENT__" : [em, ey].filter(Boolean).join(" ");

    const date =
      start || end ? `${start}${start && end ? " - " : ""}${end}` : "";
    setForm({ ...form, date });
  };

  const updateField = (
    fieldId: keyof Omit<ExperienceItem, "details" | "stacks">,
    value: string
  ) => {
    setForm({ ...form, [fieldId]: value });
  };

  const addDetail = () => {
    if (form.details.length >= 3) return;
    setForm({ ...form, details: [...form.details, ""] });
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

  // --- DRAG END: PROJECT DETAILS ---
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

    const newDetails = [...form.details];
    const [movedDetail] = newDetails.splice(oldIndex, 1);
    newDetails.splice(newIndex, 0, movedDetail);
    setForm({ ...form, details: newDetails });
  };

  // --- DRAG END: TECH STACKS ---
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

    const newStacks = [...form.stacks];
    const [movedStack] = newStacks.splice(oldIndex, 1);
    newStacks.splice(newIndex, 0, movedStack);
    setForm({ ...form, stacks: newStacks });
  };

  const handleSave = async () => {
    if (!form.role.trim() || !form.company.trim() || !form.date.trim()) {
      setShowValidationError(true);
      return;
    }
    const hasDetail = form.details.some((d) => d.trim() !== "");
    if (!hasDetail) {
      setShowValidationError(true);
      return;
    }

    const cleaned: ExperienceItem = {
      ...form,
      details: form.details.filter((d) => d.trim() !== ""),
      stacks: form.stacks.filter((s) => s.trim() !== ""),
    };

    if (editingId) {
      await updateSavedExperience(editingId, cleaned);
    } else {
      await addSavedExperience(cleaned);
    }

    cancelEdit();
  };

  const handleEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id!);
    setForm({
      ...exp,
      details: exp.details?.length ? exp.details : [""],
      stacks: exp.stacks?.length ? exp.stacks : [""],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ ...emptyExperience });
  };

  const handleDeleteConfirm = () => {
    if (expToDelete !== null) {
      removeSavedExperience(expToDelete);
      setExpToDelete(null);
    }
  };

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-6 border-b py-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="mt-1 h-3.5 w-64" />
          </div>
          <Skeleton className="mx-auto h-10 w-36 rounded-md" />
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div
        className={cn(
          "flex flex-col gap-6 border-b py-4 transition-colors",
          editingId && "bg-primary/5 -mx-4 rounded-t-lg px-4"
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {editingId ? tFull("editTitle") : t("sections.experience.title")}
            </h2>
            <h3 className="text-lg">
              {editingId
                ? tFull("editSubtitle")
                : t("sections.experience.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {editingId ? tFull("editModeActive") : tFull("formSubtitle")}
            </p>
          </div>
          {editingId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelEdit}
              title={tFull("cancelEditTooltip")}
            >
              <X className="size-5" />
            </Button>
          )}
        </div>

        {experienceFields.map(({ id, label, placeholder }) => (
          <Field key={id} className="mb-4">
            <div className="flex w-full flex-col gap-2">
              <FieldLabel className="text-left font-medium capitalize">
                {label}
              </FieldLabel>
              <Input
                className="w-full"
                placeholder={placeholder}
                value={form[id as keyof typeof form] || ""}
                onChange={(e) =>
                  updateField(
                    id as keyof Omit<ExperienceItem, "details" | "stacks">,
                    e.target.value
                  )
                }
              />
              <PdfMetrics
                text={form[id as keyof typeof form] || ""}
                showPdfLines={false}
              />
            </div>
          </Field>
        ))}

        <Field className="mb-4">
          <div className="flex w-full flex-col gap-2">
            <FieldLabel className="text-left font-medium capitalize">
              {t("sections.certifications.date")}
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
              showPresent={true}
            />
          </div>
        </Field>

        {/* --- PROJECT DETAILS (draggable) --- */}
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
              <Button variant="outline" size="sm" onClick={addDetail}>
                <Plus className="mr-1 h-3.5 w-3.5" />{" "}
                {t("sections.experience.addDetailBtn")}
              </Button>
            )}
          </div>

          <div className="w-full space-y-4">
            <DragDropProvider onDragEnd={handleDetailsDrag}>
              {form.details.map((detail, dIdx) => (
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
                  canRemove={form.details.length > 1}
                  handleAutoResize={handleAutoResize}
                  onChange={(value) => updateDetail(dIdx, value)}
                  onRemove={() => removeDetail(dIdx)}
                />
              ))}
            </DragDropProvider>
          </div>

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

        {/* --- TECH STACKS (draggable) --- */}
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
            <Button variant="outline" size="sm" onClick={addStack}>
              <Plus className="mr-1 h-3.5 w-3.5" />{" "}
              {t("sections.experience.addStackBtn")}
            </Button>
          </div>

          <div className="w-full space-y-4">
            <DragDropProvider onDragEnd={handleStacksDrag}>
              {form.stacks.map((stack, sIdx) => (
                <StackRow
                  key={stackIds[sIdx] || `stack-${sIdx}`}
                  sortableId={stackIds[sIdx] || `stack-${sIdx}`}
                  index={sIdx}
                  value={stack}
                  label={t("sections.experience.stackLabel", { num: sIdx + 1 })}
                  placeholder={t("sections.experience.stackPlaceholder")}
                  canRemove={form.stacks.length > 1}
                  handleAutoResize={handleAutoResize}
                  onChange={(value) => updateStack(sIdx, value)}
                  onRemove={() => removeStack(sIdx)}
                />
              ))}
            </DragDropProvider>
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="xs"
              onClick={() => addStack()}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />{" "}
              {t("sections.experience.addStackBtn")}
            </Button>
          </div>
        </div>

        <div className="mx-auto flex gap-2">
          {editingId && (
            <Button variant="outline" onClick={cancelEdit}>
              {tFull("cancelButton")}
            </Button>
          )}
          <Button onClick={handleSave}>
            {editingId ? tFull("updateButton") : tFull("saveButton")}
          </Button>
        </div>
      </div>

      <div className="pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{tFull("savedTitle")}</h2>
        </div>

        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-md" />
        ) : (
          <div className="border-muted overflow-x-auto rounded-md border shadow-sm">
            <ExperienceTable
              experiences={savedExperiences}
              onEdit={handleEdit}
              onDelete={(id) => setExpToDelete(id)}
              tFull={tFull}
            />
          </div>
        )}
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

      <AlertDialog
        open={showValidationError}
        onOpenChange={setShowValidationError}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {tFull("validationDialogTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {tFull("validationDialogDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationError(false)}>
              {tFull("validationDialogConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardContent>
  );
}

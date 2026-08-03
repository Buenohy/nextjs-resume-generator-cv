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
import { MonthYearPicker } from "../sections/ui/mouth-year-picker";
import { useSyncCollapse } from "@/app/hooks/useSyncCollapse";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { closestCenter } from "@dnd-kit/collision";
import { PdfMetrics } from "../pdf-metrics";

// --- AUXILIARY CONVERSION FOR TOKENIZED STRINGS ---
const parseCertString = (str?: string) => {
  if (!str) return { text: "", month: "", year: "" };
  const parts = str.split(" | ");
  let text = str;
  let dateStr = "";

  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    const hasMonthToken = lastPart.includes("__MONTH_");
    const hasYear = /\b\d{4}\b/.test(lastPart);

    if (hasMonthToken || hasYear) {
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

// --- AUXILIARY SUB-COMPONENT (CERTIFICATION ITEM) ---
interface CertificationItemProps {
  cert: string;
  index: number;
  sortableId: string;
  YEARS: string[];
  MONTHS: string[];
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeItem: (index: number) => void;
  handleCertChange: (index: number, text: string, m: string, y: string) => void;
}

function CertificationItem({
  cert,
  index,
  sortableId,
  YEARS,
  MONTHS,
  cvDataLength,
  t,
  handleAutoResize,
  removeItem,
  handleCertChange,
}: CertificationItemProps) {
  // Keyed by the stable sortableId (not the raw index, which shifts on reorder)
  // to prevent collapse-state drift after drag-and-drop.
  const [isCertOpen, setIsCertOpen] = useSyncCollapse(
    `certification-item-${sortableId}`,
    false
  );
  const parsed = parseCertString(cert);

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
        open={isCertOpen}
        onOpenChange={setIsCertOpen}
        id={`certification-item-${sortableId}`}
        className="border-muted/50 mb-4 scroll-mt-24 border-b pb-6 last:border-0 last:pb-0"
      >
        <div className="mb-4 flex w-full flex-row items-center justify-between gap-4">
          <div className="flex flex-1 flex-row items-center gap-3">
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
                  {t("sections.certifications.itemLabel", { num: index + 1 })}
                </FieldLabel>
                <ChevronDown
                  className={`text-muted-foreground mr-4 size-4 transition-transform duration-200 ${
                    isCertOpen ? "rotate-180" : ""
                  } `}
                />
              </div>
            </CollapsibleTrigger>
          </div>

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

        <CollapsibleContent className="space-y-6">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-2">
              <Textarea
                className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                rows={1}
                placeholder={t("sections.certifications.placeholder")}
                value={parsed.text}
                onBlur={(e) => {
                  if (!e.target.value.trim() && cvDataLength > 1) {
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
              <PdfMetrics text={parsed.text} charsPerLine={110} />
            </div>

            <div
              id={`certification-${index}-date`}
              className="flex w-full scroll-mt-24 flex-col gap-2"
            >
              <FieldLabel className="text-left font-medium capitalize">
                {t("sections.certifications.date")}
              </FieldLabel>

              <MonthYearPicker
                startMonth=""
                startYear=""
                endMonth={parsed.month}
                endYear={parsed.year}
                months={MONTHS}
                years={YEARS}
                onStartMonthChange={() => {}}
                onStartYearChange={() => {}}
                onEndMonthChange={(val) =>
                  handleCertChange(index, parsed.text, val, parsed.year)
                }
                onEndYearChange={(val) =>
                  handleCertChange(index, parsed.text, parsed.month, val)
                }
                t={t}
                showPresent={false}
                onlyEnd={true}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function CertificationsSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("certifications", false);

  // Virtual IDs used only by dnd-kit for stable sortable identity.
  // cvData.certifications stays a plain string[] — this ref never touches the store directly.
  const idsRef = useRef<string[]>([]);

  const currentLength = cvData.certifications.length;
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

  const MONTHS = t.raw("months") as string[];
  const YEARS = Array.from({ length: 41 }, (_, i) =>
    String(new Date().getFullYear() + 10 - i)
  );

  const addItem = () => {
    idsRef.current.push(Math.random().toString(36).substring(2, 9));
    updateCvData((draft) => {
      draft.certifications.push("");
    });
  };

  const removeItem = (index: number) => {
    if (cvData.certifications.length <= 1) return;
    idsRef.current.splice(index, 1);
    updateCvData((draft) => {
      draft.certifications = draft.certifications.filter((_, i) => i !== index);
    });
  };

  const updateItem = (index: number, value: string) => {
    updateCvData((draft) => {
      draft.certifications[index] = value;
    });
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

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-4 border-b py-4">
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
    <CardContent id="certifications" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4 border-b py-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.certifications.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.certifications.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.certifications.count", {
                count: cvData.certifications.length,
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

            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 size-4" />{" "}
              {t("sections.certifications.addBtn")}
            </Button>
          </div>
        </div>

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
                const [movedCert] = draft.certifications.splice(oldIndex, 1);
                draft.certifications.splice(newIndex, 0, movedCert);
              });
            }}
          >
            {cvData.certifications.map((cert, index) => (
              <CertificationItem
                key={idsRef.current[index]}
                sortableId={idsRef.current[index]}
                cert={cert}
                index={index}
                YEARS={YEARS}
                MONTHS={MONTHS}
                cvDataLength={cvData.certifications.length}
                t={t}
                handleAutoResize={handleAutoResize}
                removeItem={removeItem}
                handleCertChange={handleCertChange}
              />
            ))}
          </DragDropProvider>

          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={addItem}
              className="gap-1 text-xs"
            >
              <Plus className="mr-1 size-3.5" />{" "}
              {t("sections.certifications.addBtn")}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

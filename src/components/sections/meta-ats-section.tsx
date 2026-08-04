"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Trash2, ChevronDown, GripVertical } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PdfMetrics } from "@/components/pdf-metrics";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// --- AUXILIARY SUB-COMPONENT (KEYWORD ITEM) ---
interface KeywordItemProps {
  keyword: string;
  index: number;
  sortableId: string;
  keywordsListLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeKeyword: (index: number) => void;
  updateKeyword: (index: number, value: string) => void;
}

function KeywordItem({
  keyword,
  index,
  sortableId,
  keywordsListLength,
  t,
  handleAutoResize,
  removeKeyword,
  updateKeyword,
}: KeywordItemProps) {
  const { ref, handleRef } = useSortable({
    id: sortableId,
    index,
    collisionDetector: closestCenter,
  });

  return (
    <div
      ref={ref}
      // touch-none prevents the browser from treating a fast touch/pointer
      // drag as a page scroll gesture
      className="touch-none"
    >
      <Field
        id={`meta-keyword-${sortableId}`}
        className="mb-4 scroll-mt-24 last:mb-0"
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

              <FieldLabel className="text-left text-xs font-medium capitalize">
                {t("sections.meta_ats.keywordLabel", {
                  num: index + 1,
                })}
              </FieldLabel>
            </div>

            {/* Trash Button */}
            {keywordsListLength > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeKeyword(index)}
                className="size-8 shrink-0"
              >
                <Trash2 className="text-destructive h-4 w-4" />
              </Button>
            )}
          </div>

          {/* ROW 2: INPUT FIELD (Textarea) */}
          <div>
            <Textarea
              className="min-h-[38px] w-full resize-none overflow-hidden py-2"
              rows={1}
              placeholder={t("sections.meta_ats.keywordPlaceholder")}
              value={keyword}
              onBlur={(e) => {
                if (!e.target.value.trim() && keywordsListLength > 1) {
                  removeKeyword(index);
                }
              }}
              onChange={(e) => {
                handleAutoResize(e);
                updateKeyword(index, e.target.value);
              }}
            />
            <PdfMetrics text={keyword} showPdfLines={false} />
          </div>
        </div>
      </Field>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function MetaAtsSection() {
  const t = useTranslations("ResumeBuilderPage");
  const locale = useLocale();
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const [isMounted, setIsMounted] = useState(false);

  // COLLAPSE STATES SYNCHRONIZED VIA CUSTOM HOOK
  const [isOpen, setIsOpen] = useSyncCollapse("meta-ats", false);
  const [isKeywordsOpen, setIsKeywordsOpen] = useSyncCollapse(
    "meta-keywords",
    false
  );

  const keywordsList = Array.isArray(cvData.meta_ats.keywords)
    ? cvData.meta_ats.keywords
    : [];

  // Virtual IDs used only by dnd-kit for stable sortable identity.
  const idsRef = useRef<string[]>([]);

  const currentLength = keywordsList.length;
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

  const sectionDef = {
    id: "meta_ats",
    title: t("sections.meta_ats.title"),
    subTitle: t("sections.meta_ats.subTitle"),
    fields: Object.entries(
      t.raw("sections.meta_ats.fields") as Record<
        string,
        { label: string; placeholder: string }
      >
    )
      .filter(([key]) => key !== "keywords")
      .map(([key, value]) => ({
        id: key,
        label: value.label,
        placeholder: value.placeholder,
      })),
  };

  const getFieldValue = (fieldId: string) =>
    cvData.meta_ats[fieldId as keyof typeof cvData.meta_ats] || "";

  const handleChange = (fieldId: string, value: string) => {
    updateCvData((draft) => {
      if (fieldId !== "keywords") {
        const stringKey = fieldId as keyof Omit<
          typeof draft.meta_ats,
          "keywords"
        >;
        draft.meta_ats[stringKey] = value;
      }

      if (fieldId === "contributor") {
        draft.meta_ats.identifier = value ? `CV-${value}` : "";
        draft.meta_ats.rights = value
          ? `Copyright © 2026 ${value}. All rights reserved.`
          : "";
      }
    });
  };

  const textareaFields = ["subject", "rights"];

  useEffect(() => {
    if (
      !Array.isArray(cvData.meta_ats.keywords) ||
      cvData.meta_ats.keywords.length === 0
    ) {
      updateCvData((draft) => {
        draft.meta_ats.keywords = [""];
      });
    }
  }, [cvData.meta_ats.keywords, updateCvData]);

  const addKeyword = () => {
    idsRef.current.push(Math.random().toString(36).substring(2, 9));
    updateCvData((draft) => {
      if (!Array.isArray(draft.meta_ats.keywords)) {
        draft.meta_ats.keywords = [];
      }
      draft.meta_ats.keywords.push("");
    });
  };

  const removeKeyword = (index: number) => {
    if (keywordsList.length <= 1) return;
    idsRef.current.splice(index, 1);
    updateCvData((draft) => {
      if (
        Array.isArray(draft.meta_ats.keywords) &&
        draft.meta_ats.keywords.length > 1
      ) {
        draft.meta_ats.keywords = draft.meta_ats.keywords.filter(
          (_, i) => i !== index
        );
      }
    });
  };

  const updateKeyword = (index: number, value: string) => {
    updateCvData((draft) => {
      if (Array.isArray(draft.meta_ats.keywords)) {
        draft.meta_ats.keywords[index] = value;
      }
    });
  };

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-6 border-b py-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4.5 w-56 sm:w-72" />
            </div>
          </div>
          <Field className="mb-4">
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Field>
          {sectionDef.fields.map(({ id }) => (
            <Field key={id} className="mb-4">
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </Field>
          ))}
          <div className="mt-4 flex flex-col gap-4 border-t pt-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-40" />
              </div>
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
            {(keywordsList.length > 0 ? keywordsList : [""]).map((_, index) => (
              <Field key={index}>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </Field>
            ))}
            <div className="mt-2 flex justify-end">
              <Skeleton className="h-7 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-6 border-b py-4"
      >
        {/* LEVEL 1: PRIMARY SECTION HEADER */}
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">{sectionDef.title}</h2>
            <h3 className="text-muted-foreground text-lg">
              {sectionDef.subTitle}
            </h3>
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
                  className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* LEVEL 1 CONTENT (ATS METADATA CONFIGURATION FIELDS) */}
        <CollapsibleContent className="space-y-4">
          <Field className="mb-4 scroll-mt-24" id="meta-lang">
            <div className="flex w-full flex-col gap-2">
              <FieldLabel className="text-left font-medium capitalize">
                {t("sections.meta_ats.metadataLanguageLabel")}
              </FieldLabel>
              <Input
                className="bg-muted w-full cursor-not-allowed opacity-80"
                disabled
                value={
                  locale === "pt" ? "Português (pt-BR)" : "English (en-US)"
                }
              />
            </div>
          </Field>

          {sectionDef.fields.map(({ id, label, placeholder }) => {
            const domId = `meta-${id}`;
            const fieldValue = getFieldValue(id);

            return (
              <Field key={id} className="mb-4 scroll-mt-24" id={domId}>
                <div className="flex w-full flex-col gap-2">
                  <FieldLabel className="text-left font-medium capitalize">
                    {label}
                  </FieldLabel>
                  {textareaFields.includes(id) ? (
                    <div>
                      <Textarea
                        className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                        rows={1}
                        placeholder={placeholder}
                        value={fieldValue}
                        onChange={(e) => {
                          handleAutoResize(e);
                          handleChange(id, e.target.value);
                        }}
                      />
                      <PdfMetrics text={fieldValue} charsPerLine={110} />
                    </div>
                  ) : (
                    <Input
                      className="w-full"
                      placeholder={placeholder}
                      value={fieldValue}
                      onChange={(e) => handleChange(id, e.target.value)}
                    />
                  )}
                </div>
              </Field>
            );
          })}

          {/* === LEVEL 2: KEYWORDS SECTION (DYNAMIC ARRAY & COLLAPSIBLE) === */}
          <Collapsible
            open={isKeywordsOpen}
            onOpenChange={setIsKeywordsOpen}
            id="meta-keywords"
            className="mt-4 flex w-full scroll-mt-24 flex-col gap-4 border-t pt-6"
          >
            <div className="flex w-full flex-row items-start justify-between gap-4">
              <div className="flex flex-col text-left">
                <h4 className="text-sm font-semibold">
                  {t("sections.meta_ats.keywordsOptimizerTitle")}
                </h4>
                <p className="text-muted-foreground text-xs">
                  {t("sections.meta_ats.keywordsCount", {
                    count: keywordsList.length,
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
                      className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                        isKeywordsOpen ? "rotate-180" : ""
                      } `}
                    />
                  </Button>
                </CollapsibleTrigger>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeyword}
                >
                  <Plus className="mr-2 h-4 w-4" />{" "}
                  {t("sections.meta_ats.addKeywordBtn")}
                </Button>
              </div>
            </div>

            <CollapsibleContent className="w-full space-y-2">
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
                    if (Array.isArray(draft.meta_ats.keywords)) {
                      const [movedKeyword] = draft.meta_ats.keywords.splice(
                        oldIndex,
                        1
                      );
                      draft.meta_ats.keywords.splice(newIndex, 0, movedKeyword);
                    }
                  });
                }}
              >
                {/* KEYWORDS LIST */}
                {keywordsList.map((keyword, index) => (
                  <KeywordItem
                    key={idsRef.current[index]}
                    sortableId={idsRef.current[index]}
                    keyword={keyword}
                    index={index}
                    keywordsListLength={keywordsList.length}
                    t={t}
                    handleAutoResize={handleAutoResize}
                    removeKeyword={removeKeyword}
                    updateKeyword={updateKeyword}
                  />
                ))}
              </DragDropProvider>

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={addKeyword}
                  className="gap-1 text-xs"
                >
                  <Plus className="size-3.5" />{" "}
                  {t("sections.meta_ats.addKeywordBtn")}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

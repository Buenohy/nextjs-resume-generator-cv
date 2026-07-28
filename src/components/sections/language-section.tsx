"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, ChevronDown, GripVertical } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
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

// --- PARSE "__LEVEL_X__" TOKENS ---
const parseLangString = (str?: string) => {
  if (!str) return { text: "", level: "" };
  const parts = str.split(" - ");
  let text = str;
  let level = "";
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (lastPart.startsWith("__LEVEL_")) {
      level = lastPart;
      parts.pop();
      text = parts.join(" - ");
    }
  }
  return { text: text.trim(), level: level.trim() };
};

interface LanguageItemProps {
  lang: string;
  index: number;
  sortableId: string;
  LANGUAGE_LEVELS: string[];
  cvDataLength: number;
  t: ReturnType<typeof useTranslations>;
  handleAutoResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  removeItem: (index: number) => void;
  handleLangChange: (index: number, text: string, level: string) => void;
}

function LanguageItem({
  lang,
  index,
  sortableId,
  LANGUAGE_LEVELS,
  cvDataLength,
  t,
  handleAutoResize,
  removeItem,
  handleLangChange,
}: LanguageItemProps) {
  const [isLangOpen, setIsLangOpen] = useSyncCollapse(
    `languages-item-${sortableId}`,
    false
  );
  const parsed = parseLangString(lang);

  const { ref, handleRef } = useSortable({
    id: sortableId,
    index,
    collisionDetector: closestCenter,
  });

  return (
    <div
      ref={ref}
      // touch-none here (not just on the handle) prevents the browser from
      // treating a fast touch/pointer drag as a page scroll gesture, which
      // is what causes drags to fail intermittently on touch devices/emulators.
      className="border-muted/50 mb-4 touch-none border-b pb-6 last:border-0 last:pb-0"
    >
      <Collapsible
        open={isLangOpen}
        onOpenChange={setIsLangOpen}
        id={`languages-item-${sortableId}`}
      >
        <div className="mb-4 flex w-full flex-row items-center justify-between gap-4">
          <div className="flex flex-1 flex-row items-center gap-3">
            {/* Drag handle — touch-none/select-none required for pointer/touch dragging to work reliably */}
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
                  {t("sections.languages.itemLabel", { num: index + 1 })}
                </FieldLabel>
                <ChevronDown
                  className={`text-muted-foreground mr-4 size-4 transition-transform duration-200 ${
                    isLangOpen ? "rotate-180" : ""
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
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Textarea
              className="min-h-[38px] w-full min-w-0 flex-1 resize-none overflow-hidden py-2"
              rows={1}
              placeholder={t("sections.languages.placeholder")}
              value={parsed.text}
              onBlur={(e) => {
                if (!e.target.value.trim() && cvDataLength > 1)
                  removeItem(index);
              }}
              onChange={(e) => {
                handleAutoResize(e);
                handleLangChange(index, e.target.value, parsed.level);
              }}
            />

            <div className="w-full min-w-0 flex-1">
              <Select
                value={parsed.level}
                onValueChange={(val) =>
                  handleLangChange(index, parsed.text, val)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("sections.languages.levelPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_LEVELS.map((level, i) => (
                    <SelectItem key={i} value={`__LEVEL_${i}__`}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function LanguagesSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("languages", false);

  // Virtual IDs used only by dnd-kit for stable sortable identity.
  // cvData.languages stays a plain string[] — this ref never touches the store directly.
  const idsRef = useRef<string[]>([]);

  const currentLength = cvData.languages.length;
  if (idsRef.current.length < currentLength) {
    for (let i = idsRef.current.length; i < currentLength; i++) {
      idsRef.current.push(Math.random().toString(36).substring(2, 9));
    }
  } else if (idsRef.current.length > currentLength) {
    idsRef.current = idsRef.current.slice(0, currentLength);
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const LANGUAGE_LEVELS = t.raw("language_levels") as string[];

  const addItem = () => {
    idsRef.current.push(Math.random().toString(36).substring(2, 9));
    updateCvData((draft) => {
      draft.languages.push("");
    });
  };

  const removeItem = (index: number) => {
    if (cvData.languages.length <= 1) return;
    idsRef.current.splice(index, 1);
    updateCvData((draft) => {
      draft.languages = draft.languages.filter((_, i) => i !== index);
    });
  };

  const updateItem = (index: number, value: string) =>
    updateCvData((draft) => {
      draft.languages[index] = value;
    });

  const handleLangChange = (index: number, text: string, level: string) => {
    const finalVal = level ? `${text} - ${level}` : text;
    updateItem(index, finalVal);
  };

  if (!isMounted) return <Skeleton className="h-20 w-full" />;

  return (
    <CardContent id="languages" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4 py-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.languages.title")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {t("sections.languages.subTitle")}
            </h3>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9 focus-visible:ring-0"
              >
                <ChevronDown
                  className={`text-muted-foreground size-5 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 size-4" /> {t("sections.languages.addBtn")}
            </Button>
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          <DragDropProvider
            onDragEnd={(event: any) => {
              if (event?.canceled) return;

              // IMPORTANT: @dnd-kit/react v0.5.0 already reorders the dragged
              // item internally (via its own renderer/startTransition) before
              // onDragEnd fires. Because of that, `operation.source.index`
              // and `operation.target.index` both reflect the FINAL
              // (post-drop) position and will always be equal — comparing
              // them here would silently no-op on every drag.
              //
              // The correct pair to diff is on `operation.source` alone:
              //   - source.initialIndex -> position BEFORE the drag started
              //   - source.index        -> position AFTER dnd-kit reordered it
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

              // Persist the real reorder in the Zustand store (source of truth).
              // This is what SideNav, PDF preview, and the item labels read from.
              updateCvData((draft) => {
                const [movedLang] = draft.languages.splice(oldIndex, 1);
                draft.languages.splice(newIndex, 0, movedLang);
              });
            }}
          >
            {cvData.languages.map((lang, index) => (
              <LanguageItem
                key={idsRef.current[index]}
                sortableId={idsRef.current[index]}
                lang={lang}
                index={index}
                LANGUAGE_LEVELS={LANGUAGE_LEVELS}
                cvDataLength={cvData.languages.length}
                t={t}
                handleAutoResize={handleAutoResize}
                removeItem={removeItem}
                handleLangChange={handleLangChange}
              />
            ))}
          </DragDropProvider>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

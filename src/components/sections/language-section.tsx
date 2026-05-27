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

export function LanguagesSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const LANGUAGE_LEVELS = t.raw("language_levels") as string[];

  const addItem = () => {
    updateCvData((draft) => {
      draft.languages.push("");
    });
  };

  const removeItem = (index: number) => {
    updateCvData((draft) => {
      if (draft.languages.length > 1) {
        draft.languages = draft.languages.filter((_, i) => i !== index);
      }
    });
  };

  const updateItem = (index: number, value: string) => {
    updateCvData((draft) => {
      draft.languages[index] = value;
    });
  };

  const parseLangString = (str?: string) => {
    if (!str) return { text: "", level: "" };
    const parts = str.split(" - ");
    let text = str;
    let level = "";
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      const hasLevel = LANGUAGE_LEVELS.some((l) => lastPart.includes(l));
      if (hasLevel) {
        level = parts.pop() || "";
        text = parts.join(" - ");
      }
    }
    return { text: text.trim(), level: level.trim() };
  };

  const handleLangChange = (index: number, text: string, level: string) => {
    const finalVal = level ? `${text} - ${level}` : text;
    updateItem(index, finalVal);
  };

  return (
    <CardContent>
      <div className="flex flex-col gap-4 py-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.languages.title")}
            </h2>
            <h3 className="border-b pb-2 text-lg">
              {t("sections.languages.subTitle")}
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {t("sections.languages.count", {
                count: cvData.languages.length,
              })}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> {t("sections.languages.addBtn")}
          </Button>
        </div>

        {/* LANGUAGES LIST */}
        {cvData.languages.map((lang, index) => {
          const parsed = parseLangString(lang);

          return (
            <Field key={index} className="mb-4">
              {/* 
                MAIN CONTAINER FOR EACH LANGUAGE ITEM
                - flex-col: Stacks the Label on top of the Inputs.
                - gap-4: Creates the required space between the Label row and the Inputs row.
              */}
              <div className="flex w-full flex-col gap-4">
                {/* 
                  TOP ROW: LABEL ONLY
                  - Sits alone at the top for a cleaner layout.
                */}
                <FieldLabel className="text-left font-medium capitalize">
                  {t("sections.languages.itemLabel", { num: index + 1 })}
                </FieldLabel>

                {/* 
                  BOTTOM ROW: INPUTS & DELETE BUTTON
                  - Mobile (< sm): Stacks items vertically (flex-col).
                  - Tablet/Desktop (sm+): Horizontal row (sm:flex-row) with items aligned to center.
                */}
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  {/* 
                    FIELD 1: LANGUAGE NAME (Textarea)
                    - flex-1: Takes exactly 50% of the remaining space on desktop.
                    - min-w-0: Prevents Flexbox from breaking if the user types a very long word.
                  */}
                  <Textarea
                    className="min-h-9.5 w-full min-w-0 flex-1 resize-none overflow-hidden py-2"
                    rows={1}
                    placeholder={t("sections.languages.placeholder")}
                    value={parsed.text}
                    onBlur={(e) => {
                      if (
                        !e.target.value.trim() &&
                        cvData.languages.length > 1
                      ) {
                        removeItem(index);
                      }
                    }}
                    onChange={(e) => {
                      handleAutoResize(e);
                      handleLangChange(index, e.target.value, parsed.level);
                    }}
                  />

                  {/* 
                    FIELD 2: LANGUAGE LEVEL (Select)
                    - flex-1: Takes the other 50% of the space on desktop.
                    - min-w-0: Required for Shadcn UI select to truncate text with "..." correctly.
                  */}
                  <div className="w-full min-w-0 flex-1">
                    <Select
                      value={parsed.level}
                      onValueChange={(val) =>
                        handleLangChange(index, parsed.text, val)
                      }
                      modal={false}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("sections.languages.levelPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 
                    DELETE BUTTON (Visible on all breakpoints now)
                    - shrink-0: Prevents the button from squishing.
                    - flex justify-end: Aligns the button to the right side on mobile screens.
                    - sm:block: Reverts to normal block flow on tablet/desktop.
                  */}
                  {cvData.languages.length > 1 && (
                    <div className="flex shrink-0 justify-end sm:block">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
            <Plus className="h-3.5 w-3.5" /> {t("sections.languages.addBtn")}
          </Button>
        </div>
      </div>
    </CardContent>
  );
}

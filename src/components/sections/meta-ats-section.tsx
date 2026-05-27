"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAutoResize } from "@/app/hooks/useAutoResize";

export function MetaAtsSection() {
  const t = useTranslations("ResumeBuilderPage");
  const locale = useLocale(); // Fetches active site language (pt/en)
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  {
    /* 
    DYNAMIC FLAT FIELDS
    - Filters out 'keywords' from flat rendering, since keywords are now managed as an array.
  */
  }
  const sectionDef = {
    id: "meta_ats",
    title: t("sections.meta_ats.title"),
    subTitle: t("sections.meta_ats.subTitle"),
    fields: Object.entries(t.raw("sections.meta_ats.fields"))
      .filter(([key]) => key !== "keywords")
      .map(([key, value]: [string, any]) => ({
        id: key,
        label: value.label,
        placeholder: value.placeholder,
      })),
  };

  const getFieldValue = (fieldId: string) =>
    cvData.meta_ats[fieldId as keyof typeof cvData.meta_ats] || "";

  {
    /* 
    STATE HANDLER WITH SYNCHRONIZATION
    - When 'contributor' changes, it automatically generates 'identifier' and 'rights' values.
  */
  }
  const handleChange = (fieldId: string, value: string) => {
    updateCvData((draft) => {
      draft.meta_ats[fieldId as keyof typeof draft.meta_ats] = value;

      if (fieldId === "contributor") {
        draft.meta_ats.identifier = value ? `CV-${value}` : "";
        draft.meta_ats.rights = value
          ? `Copyright © 2026 ${value}. All rights reserved.`
          : "";
      }
    });
  };

  const textareaFields = ["subject", "rights"];

  {
    /* 
    DYNAMIC KEYWORDS LIST HANDLING
    - Ensures keywords list is safely retrieved as an array.
  */
  }
  const keywordsList = Array.isArray(cvData.meta_ats.keywords)
    ? cvData.meta_ats.keywords
    : [];

  {
    /* 
    AUTOMATIC INITIALIZATION EFFECT
    - If the keywords array is empty or undefined, automatically initialize it with 1 empty keyword.
  */
  }
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
    updateCvData((draft) => {
      if (!Array.isArray(draft.meta_ats.keywords)) {
        draft.meta_ats.keywords = [];
      }
      draft.meta_ats.keywords.push("");
    });
  };

  const removeKeyword = (index: number) => {
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

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        {/* SECTION HEADER */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">{sectionDef.title}</h2>
            <h3 className="border-b pb-2 text-lg">{sectionDef.subTitle}</h3>
          </div>
        </div>

        {/* 
          READ-ONLY INFORMATIONAL FIELD (Metadata Language)
          - Displays the localized system language dynamically.
          - Helps users see which ISO standard language metadata will be embedded into the PDF.
        */}
        <Field className="mb-4">
          <div className="flex w-full flex-col gap-2">
            <FieldLabel className="text-left font-medium capitalize">
              {t("sections.meta_ats.metadataLanguageLabel")}
            </FieldLabel>
            <Input
              className="bg-muted w-full cursor-not-allowed opacity-80"
              disabled
              value={locale === "pt" ? "Português (pt-BR)" : "English (en-US)"}
            />
          </div>
        </Field>

        {/* RENDER FLAT METADATA FIELDS */}
        {sectionDef.fields.map(({ id, label, placeholder }) => (
          <Field key={id} className="mb-4">
            <div className="flex w-full flex-col gap-2">
              <FieldLabel className="text-left font-medium capitalize">
                {label}
              </FieldLabel>
              {textareaFields.includes(id) ? (
                <Textarea
                  className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                  rows={1}
                  placeholder={placeholder}
                  value={getFieldValue(id)}
                  onChange={(e) => {
                    handleAutoResize(e);
                    handleChange(id, e.target.value);
                  }}
                />
              ) : (
                <Input
                  className="w-full"
                  placeholder={placeholder}
                  value={getFieldValue(id)}
                  onChange={(e) => handleChange(id, e.target.value)}
                />
              )}
            </div>
          </Field>
        ))}

        {/* === KEYWORDS SECTION (DYNAMIC ARRAY) === */}
        <div className="mt-4 flex flex-col gap-4 border-t pt-6">
          {/* KEYWORDS HEADER */}
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h4 className="text-sm font-semibold">
                {t("sections.meta_ats.keywordsOptimizerTitle")}
              </h4>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("sections.meta_ats.keywordsCount", {
                  count: keywordsList.length,
                })}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={addKeyword}>
              <Plus className="mr-2 h-4 w-4" />{" "}
              {t("sections.meta_ats.addKeywordBtn")}
            </Button>
          </div>

          {keywordsList.map((keyword, index) => (
            <Field key={index}>
              <div className="flex w-full flex-col gap-2">
                {/* Keyword Row Title & Trash Icon */}
                <div className="flex w-full items-center justify-between">
                  <FieldLabel className="text-left text-xs font-medium capitalize">
                    {t("sections.meta_ats.keywordLabel", { num: index + 1 })}
                  </FieldLabel>

                  {keywordsList.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyword(index)}
                      className="h-8 w-8 shrink-0"
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Keyword Input Field */}
                <Textarea
                  className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                  rows={1}
                  placeholder={t("sections.meta_ats.keywordPlaceholder")}
                  value={keyword}
                  onBlur={(e) => {
                    if (!e.target.value.trim() && keywordsList.length > 1) {
                      removeKeyword(index);
                    }
                  }}
                  onChange={(e) => {
                    handleAutoResize(e);
                    updateKeyword(index, e.target.value);
                  }}
                />
              </div>
            </Field>
          ))}

          {/* Add Keyword Button (Bottom) */}
          <div className="mt-2 flex justify-end">
            <Button
              variant="outline"
              size="xs"
              onClick={addKeyword}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />{" "}
              {t("sections.meta_ats.addKeywordBtn")}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  );
}

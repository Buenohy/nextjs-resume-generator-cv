"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function LinksSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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

  {
    /* 
    DYNAMIC FIELDS EXTRACTION
    - Fetches the raw translation object from JSON files (en.json / pt.json).
    - Map entries into an array of objects containing the id, localized label, and placeholder.
  */
  }
  const fields = Object.entries(t.raw("sections.links.fields")).map(
    ([key, value]: [string, any]) => ({
      id: key,
      label: value.label,
      placeholder: value.placeholder,
    })
  );

  const getFieldValue = (fieldId: string) =>
    (cvData.links as any)[fieldId] || "";

  const handleChange = (fieldId: string, value: string) => {
    updateCvData((draft) => {
      (draft.links as any)[fieldId] = value;
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
        <div className="flex flex-col gap-6 border-b py-4">
          {/* Header Skeletons */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 sm:w-72" />
          </div>

          {/* Standard Inputs Skeletons mapping exactly the same amount of fields */}
          {fields.map(({ id }) => (
            <Field key={id} className="mb-4">
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </Field>
          ))}
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
        {/* CABEÇALHO CLICÁVEL (TRIGGER) */}
        <CollapsibleTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            className="group flex w-full cursor-pointer items-start justify-between text-left transition-opacity hover:opacity-80 focus:outline-none"
          >
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between pr-1">
                <h2 className="text-xl font-semibold">
                  {t("sections.links.title")}
                </h2>
                <ChevronDown
                  className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  } `}
                />
              </div>
              <h3 className="mt-1 w-full border-b pb-2 text-lg">
                {t("sections.links.subTitle")}
              </h3>
            </div>
          </div>
        </CollapsibleTrigger>

        {/* CONTEÚDO QUE SOME E APARECE */}
        <CollapsibleContent className="space-y-4">
          {fields.map(({ id, label, placeholder }) => {
            const domId = `links-${id}`;

            return (
              <Field key={id} className="mb-4 scroll-mt-24" id={domId}>
                <div className="flex w-full flex-col gap-2">
                  <FieldLabel className="text-left font-medium capitalize">
                    {label}
                  </FieldLabel>
                  <Input
                    className="w-full"
                    placeholder={placeholder}
                    value={getFieldValue(id)}
                    onChange={(e) => handleChange(id, e.target.value)}
                  />
                </div>
              </Field>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

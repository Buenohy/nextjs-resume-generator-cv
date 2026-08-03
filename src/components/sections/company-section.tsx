"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSyncCollapse } from "@/app/hooks/useSyncCollapse";
import { PdfMetrics } from "../pdf-metrics";

export function CompanySection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);

  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useSyncCollapse("company-info", false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const getLabel = (key: string, fallback: string) => {
    try {
      return t.has(key) ? t(key) : fallback;
    } catch {
      return fallback;
    }
  };

  if (!isMounted) {
    return (
      <CardContent>
        <div className="flex flex-col gap-6 border-b py-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56 sm:w-72" />
          </div>
          <Field className="mb-4">
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Field>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent id="company-info" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-6 border-b py-4"
      >
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {getLabel("sections.company.title", "Empresa Alvo")}
            </h2>
            <h3 className="text-muted-foreground text-lg">
              {getLabel(
                "sections.company.subTitle",
                "Informe o nome da empresa desta candidatura"
              )}
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

        <CollapsibleContent className="space-y-4">
          <Field className="mb-4">
            <div className="flex w-full flex-col gap-4">
              <Input
                placeholder={getLabel(
                  "sections.company.placeholder",
                  "Ex: Google, Uber, Meta"
                )}
                value={cvData.company || ""}
                onChange={(e) => {
                  updateCvData((draft) => {
                    draft.company = e.target.value;
                  });
                }}
                className="w-full"
              />
              <PdfMetrics
                text={cvData.company || ""}
                charsPerLine={110}
                maxLines={1}
              />
            </div>
          </Field>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

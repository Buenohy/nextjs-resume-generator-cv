"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SummarySection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

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

          {/* Textarea Input Skeleton mimicking identical minimum height */}
          <Field className="mb-4">
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[120px] w-full rounded-md" />
            </div>
          </Field>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent id="summary" className="scroll-mt-20">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-6 border-b py-4"
      >
        {/* SECTION HEADER */}
        <div className="flex w-full flex-row items-start justify-between gap-4">
          <div className="flex flex-col text-left">
            <h2 className="text-xl font-semibold">
              {t("sections.summary.title")}
            </h2>
            <h3 className="text-muted-foreground border-b pb-2 text-lg">
              {t("sections.summary.subTitle")}
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

        {/* CONTEÚDO QUE SOME E APARECE */}
        <CollapsibleContent className="space-y-4">
          <Field className="mb-4">
            <div className="flex w-full flex-col gap-4">
              <Textarea
                placeholder={t("sections.summary.placeholder")}
                value={cvData.summary}
                onChange={(e) => {
                  handleAutoResize(e);
                  updateCvData((draft) => {
                    draft.summary = e.target.value;
                  });
                }}
                className="min-h-[120px] resize-none overflow-hidden"
              />
            </div>
          </Field>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  );
}

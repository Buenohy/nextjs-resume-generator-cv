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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AiSection() {
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
    <CardContent id="ai" className="scroll-mt-20">
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
                  {t("sections.ai.title")}
                </h2>
                <ChevronDown
                  className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  } `}
                />
              </div>
              <h3 className="mt-1 w-full border-b pb-2 text-lg">
                {t("sections.ai.subTitle")}
              </h3>
            </div>
          </div>
        </CollapsibleTrigger>

        {/* CONTEÚDO QUE SOME E APARECE */}
        <CollapsibleContent className="space-y-4">
          <Field className="mb-4">
            <div className="flex w-full flex-col gap-4">
              <Textarea
                placeholder={t("sections.ai.placeholder")}
                value={cvData.ai}
                onChange={(e) => {
                  handleAutoResize(e);
                  updateCvData((draft) => {
                    draft.ai = e.target.value;
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

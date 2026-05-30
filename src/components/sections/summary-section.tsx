"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";
import { Skeleton } from "@/components/ui/skeleton";

export function SummarySection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();
  const [isMounted, setIsMounted] = useState(false);

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
      <div className="flex flex-col gap-6 border-b py-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.summary.title")}
            </h2>
            <h3 className="border-b pb-2 text-lg">
              {t("sections.summary.subTitle")}
            </h3>
          </div>
        </div>
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
      </div>
    </CardContent>
  );
}

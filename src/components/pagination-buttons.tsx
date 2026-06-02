"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const STEPS = [
  { id: 1, path: "/job-description" },
  { id: 2, path: "/resume-builder" },
  { id: 3, path: "/pdf-preview" },
];

export default function PaginationButtons() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("PaginationButtons");

  const currentStepIndex = STEPS.findIndex((step) =>
    pathname.includes(step.path)
  );

  const isFirstStep = currentStepIndex <= 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleBackStep = () => {
    if (!isFirstStep) {
      router.push(STEPS[currentStepIndex - 1].path);
    }
  };

  const handleNextStep = () => {
    if (!isLastStep && currentStepIndex !== -1) {
      router.push(STEPS[currentStepIndex + 1].path);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Button onClick={handleBackStep} disabled={isFirstStep} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("prev")}
      </Button>

      <Button onClick={handleNextStep} disabled={isLastStep}>
        {t("next")}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

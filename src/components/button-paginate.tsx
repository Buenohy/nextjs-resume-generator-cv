"use client";

import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const STEPS = [
  { id: 1, title: "Vaga", path: "/job-description" },
  { id: 2, title: "Currículo", path: "/resume-builder" },
  { id: 3, title: "Análise", path: "/job-parse" },
  { id: 4, title: "Match ATS", path: "/match-ats" },
  { id: 5, title: "Otimizar", path: "/optimizing-resume" },
  { id: 6, title: "Exportar PDF", path: "/pdf-preview" },
];

export default function ButtonPaginate() {
  const pathname = usePathname();
  const router = useRouter();

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
        Anterior
      </Button>

      <Button onClick={handleNextStep} disabled={isLastStep}>
        Próximo
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

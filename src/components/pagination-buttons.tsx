"use client";

import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/useResumeStore";

const STEPS = [
  { id: 1, path: "/job-description" },
  { id: 2, path: "/resume-builder" },
  { id: 3, path: "/pdf-preview" },
];

export default function PaginationButtons() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("PaginationButtons");

  // Gatilho do Zustand para salvar no histórico do backend
  const saveResumeToHistory = useResumeStore((s) => s.saveResumeToHistory);
  const [isSaving, setIsSaving] = useState(false);

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

  // --- ATUALIZADO: SALVAMENTO AUTOMÁTICO AO AVANÇAR ---
  const handleNextStep = async () => {
    if (!isLastStep && currentStepIndex !== -1) {
      const currentStep = STEPS[currentStepIndex];

      // Se o usuário estiver saindo do Resume Builder (Passo 2) para o Preview (Passo 3)
      if (currentStep.path === "/resume-builder") {
        setIsSaving(true);
        try {
          await saveResumeToHistory(); // Salva os dados de forma permanente no Postgres
        } catch (error) {
          console.error("Erro ao salvar histórico de criação:", error);
        } finally {
          setIsSaving(false);
        }
      }

      router.push(STEPS[currentStepIndex + 1].path);
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <Button
        onClick={handleBackStep}
        disabled={isFirstStep || isSaving}
        variant="outline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("prev")}
      </Button>

      <Button onClick={handleNextStep} disabled={isLastStep || isSaving}>
        {isSaving ? (
          <>
            Salvando...
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            {t("next")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

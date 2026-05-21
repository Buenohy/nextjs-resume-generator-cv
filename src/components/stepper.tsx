"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Definição dos seus passos e as rotas correspondentes
const STEPS = [
  { id: 1, title: "Vaga", path: "/job-description" },
  { id: 2, title: "Análise", path: "/job-parse" },
  { id: 3, title: "Match ATS", path: "/match-ats" },
  { id: 4, title: "Otimizar", path: "/optimizing-resume" },
  { id: 5, title: "Exportar PDF", path: "/preview-pdf" },
];

export function Stepper() {
  const pathname = usePathname();

  // Encontra o index do passo atual com base na URL
  const currentStepIndex = STEPS.findIndex((step) =>
    pathname.includes(step.path)
  );

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = currentStepIndex > index;

          return (
            <div
              key={step.id}
              className="relative z-10 flex w-full items-center"
            >
              {/* Círculo do Passo */}
              <div className="relative flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground" // Passo atual
                      : isCompleted
                        ? "border-primary bg-primary text-primary-foreground" // Passo concluído
                        : "border-muted bg-background text-muted-foreground" // Próximo passo
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>

                {/* Título do Passo */}
                <span
                  className={cn(
                    "absolute -bottom-6 w-max text-xs font-medium transition-colors md:text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {/* Linha conectora entre os passos */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-0.5 flex-1 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

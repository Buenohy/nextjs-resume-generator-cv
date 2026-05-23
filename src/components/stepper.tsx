"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Vaga", path: "/job-description" },
  { id: 2, title: "Currículo & Otimização", path: "/resume-builder" },
  { id: 3, title: "Exportar PDF", path: "/pdf-preview" },
];

export function Stepper() {
  const pathname = usePathname();
  const router = useRouter();

  const currentStepIndex = STEPS.findIndex((step) =>
    pathname.includes(step.path)
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-6">
      <div className="relative flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = currentStepIndex > index;
          const isLastStep = index === STEPS.length - 1;

          return (
            <div
              key={step.id}
              className={cn(
                "relative z-10 flex items-center",
                !isLastStep ? "w-full" : ""
              )}
            >
              <div
                onClick={() => router.push(step.path)}
                className="relative flex cursor-pointer flex-col items-center gap-2 hover:opacity-80"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>

                <span
                  className={cn(
                    "absolute -bottom-6 w-max text-[10px] font-medium transition-colors sm:text-xs md:text-sm",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>

              {!isLastStep && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors sm:mx-6",
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

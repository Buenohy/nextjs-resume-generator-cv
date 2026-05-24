"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, translationKey: "steps.job", path: "/job-description" },
  { id: 2, translationKey: "steps.resume", path: "/resume-builder" },
  { id: 3, translationKey: "steps.pdf", path: "/pdf-preview" },
];

export function Stepper() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Stepper");

  const currentStepIndex = STEPS.findIndex((step) =>
    pathname.includes(step.path)
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <div className="w-full overflow-x-auto pt-2 pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative flex min-w-160 items-center justify-between px-2 md:min-w-full">
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
                    {t(step.translationKey)}
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
    </div>
  );
}

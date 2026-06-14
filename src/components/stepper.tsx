"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, translationKey: "steps.job", path: "/job" },
  { id: 2, translationKey: "steps.resume", path: "/resume" },
  { id: 3, translationKey: "steps.pdf", path: "/pdf" },
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
      {/* 
        FLUID STEPPER CONTAINER
        - w-full: Stretches/shrinks dynamically to match 100% of any screen size.
        - pb-6: Padding bottom provides safe spacing for the absolutely positioned labels.
        - No horizontal scrollbars are needed anymore.
      */}
      <div className="relative flex w-full items-center justify-between px-2 pb-6">
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
              {/* Individual step item */}
              <div
                onClick={() => router.push(step.path)}
                className="relative flex cursor-pointer flex-col items-center hover:opacity-80"
              >
                {/* Step circle indicator */}
                <div
                  className={cn(
                    `flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors`,
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="size-5" /> : step.id}
                </div>

                {/* 
                  STEP FLOATING TEXT LABEL
                  - left-1/2 -translate-x-1/2: Absolutely centers the label under the circle.
                  - text-center: Centers multi-line text nicely.
                */}
                <span
                  className={cn(
                    `absolute -bottom-6 left-1/2 w-max -translate-x-1/2 text-center text-[10px] font-medium transition-colors sm:text-xs md:text-sm`,
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {t(step.translationKey)}
                </span>
              </div>

              {/* 
                FLUID CONNECTOR LINE
                - flex-1: Scales and shrinks dynamically based on viewport width.
                - mx-1: Tighter margins on mobile to make the stepper fit small screens beautifully.
                - sm:mx-4 md:mx-6: Restores standard padding on larger screens.
              */}
              {!isLastStep && (
                <div
                  className={cn(
                    `mx-1 h-0.5 flex-1 transition-colors sm:mx-4 md:mx-6`,
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

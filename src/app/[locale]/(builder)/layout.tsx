"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import PaginationButtons from "@/components/pagination-buttons";
import { Stepper } from "@/components/stepper";
import { Card, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("BuilderLayout");
  const [isMounted, setIsMounted] = useState(false);

  {
    /* 
    DEFERRED MOUNT EFFECT
    - Defers state mounting to the next tick to prevent synchronous render warnings on the client side.
  */
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-muted/30 rounded-[20px] py-6">
      <div className="mx-auto max-w-7xl sm:px-6">
        {/* LAYOUT HEADER SECTION */}
        {!isMounted ? (
          /* 
            TITLE & SUBTITLE SKELETON
            - Stays in place during first render to match the main layout spacing perfectly.
          */
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
        ) : (
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        )}

        {/* STEPPER SECTION */}
        <div className="mb-12">
          {!isMounted ? (
            /* STEPPER SKELETON LOADER */
            <div className="mx-auto w-full max-w-2xl px-4 py-6">
              <div className="relative flex w-full items-center justify-between px-2 pb-6">
                {[1, 2, 3].map((stepId) => (
                  <div
                    key={stepId}
                    className="relative z-10 flex w-full items-center last:w-auto"
                  >
                    <div className="relative flex flex-col items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-3.5 w-16" />
                    </div>
                    {stepId < 3 && (
                      <Skeleton className="mx-1 h-0.5 flex-1 sm:mx-4 md:mx-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Stepper />
          )}
        </div>

        {/* MAIN CARD SECTION */}
        <Card className="border-muted bg-background shadow-primary/5 p-2.5 shadow-lg sm:p-5">
          {/* 
            CHILDREN FORMS
            - Rendered directly inside the card wrapper.
            - Each individual form page will manage its own High-Fidelity Skeletons.
          */}
          {children}

          <CardFooter className="flex flex-col gap-6">
            {!isMounted ? (
              /* 
                PAGINATION BUTTONS SKELETON LOADER
                - Accurately replaces the back/next action buttons on load.
              */
              <div className="mt-4 flex w-full items-center justify-between">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            ) : (
              <PaginationButtons />
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

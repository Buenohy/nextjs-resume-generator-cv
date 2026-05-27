"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExperienceSectionFullContent } from "@/components/sections/experience-section-full-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function FullContentPage() {
  const t = useTranslations("FullContentPage");
  const [isMounted, setIsMounted] = useState(false);

  {
    /* 
    DEFERRED MOUNT EFFECT
    - Ensures the client-side state is fully loaded before swapping headers.
    - Prevents layout shifts on initial mount.
  */
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      {/* 
        PAGE TITLE SECTION
        - Renders a pulsing text bar matching the exact height of text-2xl on mount.
      */}
      {!isMounted ? (
        <Skeleton className="mb-6 h-8 w-64" />
      ) : (
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      )}

      <Card className="shadow-primary/50 border-muted shadow-lg">
        {/* 
          CARD HEADER SECTION
          - Displays structured pulsing shapes for both the title and description on load.
        */}
        <CardHeader>
          {!isMounted ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-96" />
            </div>
          ) : (
            <>
              <CardTitle>{t("cardTitle")}</CardTitle>
              <CardDescription>{t("cardDescription")}</CardDescription>
            </>
          )}
        </CardHeader>

        {/* Nested experience full content section will handle its own render state */}
        <ExperienceSectionFullContent />
      </Card>
    </div>
  );
}

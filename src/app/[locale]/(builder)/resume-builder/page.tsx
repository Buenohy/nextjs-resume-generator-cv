"use client";
"use no memo";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetaAtsSection } from "@/components/sections/meta-ats-section";
import { HeaderSection } from "@/components/sections/header-section";
import { LinksSection } from "@/components/sections/links-section";
import { SummarySection } from "@/components/sections/summary-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { EducationSection } from "@/components/sections/education-section";
import { CertificationsSection } from "@/components/sections/certification-section";
import { LanguagesSection } from "@/components/sections/language-section";
import { FeedbackCard } from "@/components/sections/ui/feed-back-card";

export default function ResumeBuilderPage() {
  const t = useTranslations("ResumeBuilderPage");
  const [isMounted, setIsMounted] = useState(false);

  {
    /* 
    DEFERRED MOUNT EFFECT
    - Ensures the client-side persisted store is completely hydrated 
      before swapping out global heading skeletons with actual translation texts.
  */
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* 
        PAGE TITLE SECTION
        - Renders a pulsing text bar matching the exact height of text-2xl on mount.
      */}
      {!isMounted ? (
        <Skeleton className="mb-6 h-8 w-64" />
      ) : (
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-muted shadow-primary/50 shadow-lg">
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
                  <CardTitle>{t("formCard.title")}</CardTitle>
                  <CardDescription>{t("formCard.description")}</CardDescription>
                </>
              )}
            </CardHeader>

            {/* Sub-sections are let through and will handle their own inner skeletons */}
            <MetaAtsSection />
            <HeaderSection />
            <LinksSection />
            <SummarySection />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <CertificationsSection />
            <LanguagesSection />
          </Card>
        </div>
        <div className="lg:sticky lg:top-5 lg:col-span-5">
          <FeedbackCard />
        </div>
      </div>
    </div>
  );
}

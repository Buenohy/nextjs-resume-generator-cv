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
import { AiSection } from "@/components/sections/ai-section";
import { SectionNav } from "@/components/sections/ui/section-nav";

export default function ResumeBuilderPage() {
  const t = useTranslations("ResumeBuilderPage");
  const [isMounted, setIsMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  const floatOffset = Math.max(0, scrollY - 1105);

  return (
    <div>
      {!isMounted ? (
        <Skeleton className="mb-6 h-8 w-64" />
      ) : (
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-muted shadow-primary/50 shadow-lg">
            <CardHeader>
              {!isMounted ? (
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-6 w-56" />
                  <Skeleton className="h-4 w-58 sm:w-96" />
                </div>
              ) : (
                <>
                  <CardTitle>{t("formCard.title")}</CardTitle>
                  <CardDescription>{t("formCard.description")}</CardDescription>
                </>
              )}
            </CardHeader>

            <div id="meta-ats" className="scroll-mt-20">
              <MetaAtsSection />
            </div>
            <div id="personal-info" className="scroll-mt-20">
              <HeaderSection />
            </div>
            <div id="links" className="scroll-mt-20">
              <LinksSection />
            </div>
            <div id="summary" className="scroll-mt-20">
              <SummarySection />
            </div>
            <div id="ai" className="scroll-mt-20">
              <AiSection />
            </div>
            <div id="skills" className="scroll-mt-20">
              <SkillsSection />
            </div>
            <div id="experience" className="scroll-mt-20">
              <ExperienceSection />
            </div>
            <div id="education" className="scroll-mt-20">
              <EducationSection />
            </div>
            <div id="certifications" className="scroll-mt-20">
              <CertificationsSection />
            </div>
            <div id="languages" className="scroll-mt-20">
              <LanguagesSection />
            </div>
          </Card>
        </div>
        <div className="space-y-6 lg:col-span-5">
          <div className="lg:sticky lg:top-5">
            <FeedbackCard />
          </div>
          <div
            style={{
              transform: `translateY(${floatOffset}px)`,
              transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <SectionNav t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

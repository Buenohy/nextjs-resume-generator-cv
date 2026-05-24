"use client";
"use no memo";

import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

  return (
    <div className="p-3 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-muted shadow-primary/50 shadow-lg">
            <CardHeader>
              <CardTitle>{t("formCard.title")}</CardTitle>
              <CardDescription>{t("formCard.description")}</CardDescription>
            </CardHeader>

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

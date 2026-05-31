"use client";
"use no memo";

import { useState, useEffect, useRef } from "react";
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

  // REFERÊNCIAS E ESTADOS PARA O SCROLL DINÂMICO INTELIGENTE
  const parentRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [floatOffset, setFloatOffset] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // LÓGICA DO SENSOR DE ALTURA E SCROLL SPY
  useEffect(() => {
    if (!isMounted) return;

    const handleScrollAndResize = () => {
      const parent = parentRef.current;
      const rightCol = rightColRef.current;
      if (!parent || !rightCol) return;

      // Altura total do Grid pai
      const parentHeight = parent.offsetHeight;

      // Resgata as divs dos cards de Feedback e Índice de forma segura
      const feedbackCard = rightCol.querySelector(
        '[data-sticky="feedback"]'
      ) as HTMLElement;
      const sectionNav = rightCol.querySelector(
        '[data-sticky="navigation"]'
      ) as HTMLElement;

      const feedbackHeight = feedbackCard?.offsetHeight || 380;
      const navHeight = sectionNav?.offsetHeight || 420;
      const gap = 24; // correspondente à classe space-y-6 (1.5rem = 24px)

      // Altura estática dos elementos da direita somados
      const rightColStaticHeight = feedbackHeight + navHeight + gap;

      // Limite máximo que o menu pode deslizar sem vazar a coluna
      const maxOffset = Math.max(0, parentHeight - rightColStaticHeight - 16); // 16px de margem inferior

      const currentScroll = window.scrollY;
      const targetOffset = currentScroll - 1105; // Ponto inicial do scroll flutuante

      // Aplica o "Clamp" limitador entre 0 e o MaxOffset calculado
      const clampedOffset = Math.min(Math.max(0, targetOffset), maxOffset);

      setFloatOffset(clampedOffset);
    };

    // 1. Listeners tradicionais de Scroll e Redimensionamento de Janela
    window.addEventListener("scroll", handleScrollAndResize, { passive: true });
    window.addEventListener("resize", handleScrollAndResize);

    // 2. SENSOR DE CLIQUES (ResizeObserver na coluna esquerda dos formulários)
    const leftCol = parentRef.current?.firstElementChild;
    let resizeObserver: ResizeObserver | null = null;

    if (leftCol) {
      resizeObserver = new ResizeObserver(() => {
        handleScrollAndResize();
      });
      resizeObserver.observe(leftCol);
    }

    // Executa a primeira vez para iniciar alinhado
    handleScrollAndResize();

    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isMounted]);

  return (
    <div>
      {!isMounted ? (
        <Skeleton className="mb-6 h-8 w-64" />
      ) : (
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      )}

      {/* PARENT GRID REF ADICIONADO */}
      <div
        ref={parentRef}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"
      >
        {/* COLUNA DA ESQUERDA: FORMULÁRIOS */}
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

        {/* COLUNA DA DIREITA: CARDS FLUTUANTES (RIGHT COL REF ADICIONADO) */}
        <div ref={rightColRef} className="space-y-6 lg:col-span-5">
          <div data-sticky="feedback">
            <FeedbackCard />
          </div>

          <div
            data-sticky="navigation"
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

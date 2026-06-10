"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import type { CvDataState } from "@/store/useResumeStore";

export interface HistoryItem {
  id: string;
  orderNumber: number;
  targetRole: string;
  targetCompany: string;
  cvPayload: CvDataState;
  createdAt: string;
}

interface HistoryTableProps {
  historyItems: HistoryItem[];
  emptyMessage: string;
}

export function HistoryTable({
  historyItems,
  emptyMessage,
}: HistoryTableProps) {
  const t = useTranslations("ResumeBuilderPage");
  const tJob = useTranslations("JobDescriptionPage");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} - ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-w-0 overflow-x-auto">
      <Table className="w-full table-fixed border-collapse">
        <TableBody>
          {historyItems.map((item) => {
            const isOpen = openItems[item.id] || false;
            const cv = item.cvPayload;
            const langCode = cv.language === "en" ? "en" : "pt";

            return (
              <TableRow
                key={item.id}
                className="block border-b last:border-0 hover:bg-transparent"
              >
                <TableCell className="block w-full p-4">
                  <Collapsible
                    open={isOpen}
                    onOpenChange={() => toggleItem(item.id)}
                  >
                    {/* CABEÇALHO DO ITEM DO HISTÓRICO */}
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="border-primary bg-primary/5 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold">
                          {item.orderNumber}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                          <span className="text-sm/tight font-bold break-all whitespace-normal sm:wrap-break-word">
                            {item.targetRole}
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">
                            •
                          </span>
                          <span className="text-muted-foreground text-xs/tight break-all whitespace-normal sm:wrap-break-word">
                            {item.targetCompany}
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">
                            •
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-muted-foreground text-xs whitespace-nowrap italic">
                              {formatDateTime(item.createdAt)}
                            </span>
                            <span className="text-muted-foreground hidden sm:inline">
                              •
                            </span>
                            <span className="bg-primary/10 text-primary w-fit shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-bold uppercase">
                              {langCode}
                            </span>
                          </div>
                        </div>
                      </div>

                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? `rotate-180` : ""} `}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    {/* CONTEÚDO EXPANSÍVEL DETALHADO */}
                    <CollapsibleContent className="mt-5 w-full">
                      <HistoryItemDetail cv={cv} t={t} tJob={tJob} />
                    </CollapsibleContent>
                  </Collapsible>
                </TableCell>
              </TableRow>
            );
          })}
          {historyItems.length === 0 && (
            <TableRow>
              <TableCell className="text-muted-foreground h-24 text-center text-sm">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// SUB-COMPONENTE COM ATRIBUIÇÃO DIRETA DE COR NOS TÍTULOS (SPAN) E ÍCONES (SVG)
interface HistoryItemDetailProps {
  cv: CvDataState;
  t: (key: string) => string;
  tJob: (key: string) => string;
}

function HistoryItemDetail({ cv, t, tJob }: HistoryItemDetailProps) {
  // Todos iniciam fechados (false) conforme especificado
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const months = t.raw("months") as string[];
  const languageLevels = t.raw("language_levels") as string[];
  const presentStr = t("sections.education.present");

  const parseTokens = (str: string) => {
    if (!str) return str;
    let res = str.replace(
      /__MONTH_(\d+)__/g,
      (_, d) => months[parseInt(d, 10)] || ""
    );
    res = res.replace(/__PRESENT__/g, presentStr);
    res = res.replace(
      /__LEVEL_(\d+)__/g,
      (_, d) => languageLevels[parseInt(d, 10)] || ""
    );
    return res;
  };

  const isEnglish = cv.language === "en";
  const metadataLang = isEnglish ? "English (en-US)" : "Português (pt-BR)";

  return (
    <Card className="bg-muted/10 border-muted/40 max-w-full overflow-hidden border">
      <CardContent className="max-w-full space-y-3 p-4 text-sm">
        {/* 1. DESCRIÇÃO DA VAGA */}
        {(cv.jobText || cv.platformText) && (
          <Collapsible
            open={isJobOpen}
            onOpenChange={setIsJobOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isJobOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {tJob("title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isJobOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 space-y-2 border-t p-3 text-xs">
              {cv.platformText && (
                <p className="flex flex-col gap-0.5 break-all whitespace-pre-wrap sm:wrap-break-word">
                  <strong className="shrink-0">
                    {tJob("plataformTitle")}:
                  </strong>
                  <span className="text-muted-foreground">
                    {cv.platformText}
                  </span>
                </p>
              )}
              {cv.jobText && (
                <p className="bg-muted/20 border-muted/20 text-muted-foreground max-w-full overflow-hidden rounded-sm border p-2.5 text-xs/relaxed wrap-break-word whitespace-pre-wrap italic">
                  {cv.jobText}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 2. METADADOS ATS */}
        {cv.meta_ats && (
          <Collapsible
            open={isMetaOpen}
            onOpenChange={setIsMetaOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isMetaOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.meta_ats.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isMetaOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 gap-2 space-y-2 border-t p-3 text-xs">
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.metadataLanguageLabel")}:
                </strong>
                <span className="text-muted-foreground">{metadataLang}</span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.role_target.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.role_target || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.subject.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.subject || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.category.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.category || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.contributor.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.contributor || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.coverage.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.coverage || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.identifier.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.identifier || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.publisher.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.publisher || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.relation.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.relation || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.rights.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.rights || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.source.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.source || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.type.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.type || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.meta_ats.fields.notes.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.meta_ats.notes || "—"}
                </span>
              </p>

              {/* Keywords */}
              {cv.meta_ats.keywords?.length > 0 &&
                cv.meta_ats.keywords[0] !== "" && (
                  <div className="mt-2 flex max-w-full flex-col gap-1.5 border-t pt-2">
                    {(() => {
                      const kwCount = cv.meta_ats.keywords.filter(
                        (k: string) => k.trim() !== ""
                      ).length;
                      return (
                        <span className="text-muted-foreground block text-xs font-semibold break-all whitespace-pre-wrap sm:wrap-break-word">
                          {t("sections.meta_ats.keywordsOptimizerTitle")} (
                          {kwCount})
                        </span>
                      );
                    })()}
                    <div className="flex flex-wrap gap-1 break-all sm:wrap-break-word">
                      {cv.meta_ats.keywords.map((kw, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[10px] break-all"
                        >
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 3. DADOS PESSOAIS */}
        {cv.info && (
          <Collapsible
            open={isInfoOpen}
            onOpenChange={setIsInfoOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isInfoOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.header.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isInfoOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 gap-2 space-y-2 border-t p-3 text-xs">
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.header.fields.name.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.info.name || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.header.fields.city.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.info.city || "—"}
                </span>
              </p>
              <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                <strong className="shrink-0">
                  {t("sections.header.fields.age.label")}:
                </strong>
                <span className="text-muted-foreground">
                  {cv.info.age || "—"}
                </span>
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 4. LINKS PROFISSIONAIS */}
        {cv.links && (
          <Collapsible
            open={isLinksOpen}
            onOpenChange={setIsLinksOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isLinksOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.links.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isLinksOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 gap-2 space-y-2 border-t p-3 text-xs">
              {Object.entries(cv.links).map(
                ([key, val]) =>
                  val && (
                    <span
                      key={key}
                      className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word"
                    >
                      <strong className="shrink-0">{key.toUpperCase()}:</strong>
                      {key === "email" ? (
                        <a
                          href={`mailto:${val}`}
                          className="text-primary inline-flex w-fit items-center gap-0.5 break-all hover:underline sm:wrap-break-word"
                        >
                          {val} <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : val.startsWith("http") ? (
                        <a
                          href={val}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary inline-flex w-fit items-center gap-0.5 break-all hover:underline sm:wrap-break-word"
                        >
                          {val} <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{val}</span>
                      )}
                    </span>
                  )
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 5. RESUMO PROFISSIONAL */}
        {cv.summary && (
          <Collapsible
            open={isSummaryOpen}
            onOpenChange={setIsSummaryOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isSummaryOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.summary.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isSummaryOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 border-t p-3 text-xs">
              <p className="bg-muted/20 border-muted/20 text-muted-foreground rounded-sm border p-2.5 wrap-break-word whitespace-pre-wrap italic">
                {cv.summary}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 6. RESUMO IA */}
        {cv.ai && (
          <Collapsible
            open={isAiOpen}
            onOpenChange={setIsAiOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isAiOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.ai.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isAiOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 border-t p-3 text-xs">
              <p className="bg-muted/20 border-muted/20 text-muted-foreground rounded-sm border p-2.5 wrap-break-word whitespace-pre-wrap italic">
                {cv.ai}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 7. HABILIDADES */}
        {cv.skills?.length > 0 && cv.skills[0] !== "" && (
          <Collapsible
            open={isSkillsOpen}
            onOpenChange={setIsSkillsOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isSkillsOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.skills.title")} (
                  {cv.skills.filter((s) => s.trim() !== "").length})
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isSkillsOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 border-t p-3">
              <div className="flex flex-wrap gap-1 break-all sm:wrap-break-word">
                {cv.skills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="default"
                    className="text-xs break-all"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 8. EXPERIÊNCIAS PROFISSIONAIS */}
        {cv.experiences?.length > 0 && cv.experiences[0].role !== "" && (
          <Collapsible
            open={isExperiencesOpen}
            onOpenChange={setIsExperiencesOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isExperiencesOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.experience.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isExperiencesOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 space-y-3 border-t p-3">
              {cv.experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-muted/5 overflow-hidden rounded-sm border p-3 text-xs break-all whitespace-pre-wrap sm:wrap-break-word"
                >
                  <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm font-bold break-all whitespace-pre-wrap sm:wrap-break-word">
                      {exp.role || "—"}
                    </span>
                    {exp.url ? (
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary inline-flex w-fit shrink-0 items-center gap-0.5 font-semibold break-all hover:underline sm:wrap-break-word"
                      >
                        {exp.company || "—"}{" "}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground shrink-0 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
                        {exp.company || "—"}
                      </span>
                    )}
                    <span className="text-muted-foreground text-xs break-all italic sm:wrap-break-word">
                      {parseTokens(exp.date)}
                    </span>
                  </div>

                  {exp.details?.length > 0 && (
                    <div className="text-muted-foreground mt-2 max-w-full space-y-1 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
                      {exp.details.map(
                        (det, dIdx) =>
                          det && (
                            <p
                              key={dIdx}
                              className="break-all whitespace-pre-wrap sm:wrap-break-word"
                            >
                              • {det}
                            </p>
                          )
                      )}
                    </div>
                  )}

                  {exp.stacks?.length > 0 && exp.stacks[0] !== "" && (
                    <div className="mt-3 flex flex-col gap-1.5 text-left">
                      <span className="text-muted-foreground block text-[11px] font-semibold break-all whitespace-pre-wrap sm:wrap-break-word">
                        {t("sections.experience.stacksTitle")} (
                        {exp.stacks.filter((st) => st.trim() !== "").length})
                      </span>
                      <div className="flex flex-wrap gap-1 break-all sm:wrap-break-word">
                        {exp.stacks.map((st, sIdx) => (
                          <Badge
                            key={sIdx}
                            variant="secondary"
                            className="text-[10px] break-all"
                          >
                            {st}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 9. EDUCAÇÃO */}
        {cv.education?.length > 0 && cv.education[0] !== "" && (
          <Collapsible
            open={isEduOpen}
            onOpenChange={setIsEduOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isEduOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.education.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isEduOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 text-muted-foreground space-y-1 border-t p-3 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
              {cv.education.map((edu, idx) => (
                <p
                  key={idx}
                  className="break-all whitespace-pre-wrap sm:wrap-break-word"
                >
                  • {parseTokens(edu)}
                </p>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 10. CERTIFICAÇÕES */}
        {cv.certifications?.length > 0 && cv.certifications[0] !== "" && (
          <Collapsible
            open={isCertOpen}
            onOpenChange={setIsCertOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isCertOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.certifications.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isCertOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 text-muted-foreground space-y-1 border-t p-3 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
              {cv.certifications.map((cert, idx) => (
                <p
                  key={idx}
                  className="break-all whitespace-pre-wrap sm:wrap-break-word"
                >
                  • {parseTokens(cert)}
                </p>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* 11. IDIOMAS */}
        {cv.languages?.length > 0 && cv.languages[0] !== "" && (
          <Collapsible
            open={isLangOpen}
            onOpenChange={setIsLangOpen}
            className="rounded-md border"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-3 text-left text-xs font-bold tracking-wider uppercase transition-colors"
              >
                <span
                  className={
                    isLangOpen ? "text-primary" : "text-muted-foreground"
                  }
                >
                  {t("sections.languages.title")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-all duration-200 ${
                    isLangOpen
                      ? "text-primary rotate-180"
                      : "text-muted-foreground"
                  } `}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-muted/5 text-muted-foreground space-y-1 border-t p-3 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
              {cv.languages.map((lang, idx) => (
                <p
                  key={idx}
                  className="break-all whitespace-pre-wrap sm:wrap-break-word"
                >
                  • {parseTokens(lang)}
                </p>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}

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

            const metadataLang = cv.meta_ats?.rights?.includes(
              "All rights reserved"
            )
              ? "English (en-US)"
              : "Português (pt-BR)";

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

                        <div className="flex flex-col truncate sm:flex-row sm:items-center sm:gap-2">
                          <span className="truncate text-sm font-bold">
                            {item.targetRole}
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">
                            •
                          </span>
                          <span className="text-muted-foreground truncate text-xs">
                            {item.targetCompany}
                          </span>
                          <span className="text-muted-foreground hidden sm:inline">
                            •
                          </span>
                          <span className="text-muted-foreground text-xs italic">
                            {formatDateTime(item.createdAt)}
                          </span>
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

                    {/* CONTEÚDO EXPANSÍVEL (TOTALMENTE UNIFICADO EM BLOCOS VERTICAIS) */}
                    <CollapsibleContent className="mt-5 w-full space-y-4 border-t pt-4">
                      <Card className="bg-muted/10 border-muted/40 max-w-full overflow-hidden border">
                        <CardContent className="max-w-full space-y-5 p-4 text-sm">
                          {/* 1. Metadados ATS (UNIFICADO: Empilhado verticalmente para todas as telas) */}
                          {cv.meta_ats && (
                            <div className="flex max-w-full flex-col space-y-1.5 overflow-hidden">
                              <h5 className="text-primary mb-1 block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                {t("sections.meta_ats.title")}
                              </h5>
                              <div className="flex flex-col gap-2.5 text-xs">
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.metadataLanguageLabel"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {metadataLang}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.role_target.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.role_target || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.subject.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.subject || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.category.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.category || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.contributor.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.contributor || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.coverage.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.coverage || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.identifier.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.identifier || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.publisher.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.publisher || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t(
                                      "sections.meta_ats.fields.relation.label"
                                    )}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.relation || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t("sections.meta_ats.fields.rights.label")}
                                    :
                                  </strong>
                                  <span className="text-muted-foreground">
                                    {cv.meta_ats.rights || "—"}
                                  </span>
                                </p>
                                <p className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word">
                                  <strong className="shrink-0">
                                    {t("sections.meta_ats.fields.source.label")}
                                    :
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
                              </div>

                              {/* Keywords */}
                              {cv.meta_ats.keywords?.length > 0 &&
                                cv.meta_ats.keywords[0] !== "" && (
                                  <div className="flex max-w-full flex-col gap-1.5 pt-2">
                                    {(() => {
                                      const kwCount =
                                        cv.meta_ats.keywords.filter(
                                          (k: string) => k.trim() !== ""
                                        ).length;
                                      return (
                                        <span className="text-muted-foreground block max-w-full text-xs font-semibold break-all whitespace-pre-wrap sm:wrap-break-word">
                                          {t(
                                            "sections.meta_ats.keywordsOptimizerTitle"
                                          )}{" "}
                                          ({kwCount})
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
                            </div>
                          )}

                          {/* 2. Cabeçalho Pessoal (UNIFICADO: Empilhado verticalmente para todas as telas) */}
                          {cv.info && (
                            <div className="flex max-w-full flex-col space-y-1.5 overflow-hidden border-t pt-3">
                              <h5 className="text-primary mb-1 block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                {t("sections.header.title")}
                              </h5>
                              <div className="flex flex-col gap-2.5 text-xs">
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
                              </div>
                            </div>
                          )}

                          {/* 3. Links Profissionais */}
                          {cv.links && (
                            <div className="flex max-w-full flex-col space-y-1.5 overflow-hidden border-t pt-3">
                              <h5 className="text-primary mb-1 block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                {t("sections.links.title")}
                              </h5>
                              <div className="flex flex-col gap-2.5 text-xs">
                                {Object.entries(cv.links).map(
                                  ([key, val]) =>
                                    val && (
                                      <span
                                        key={key}
                                        className="flex flex-col break-all whitespace-pre-wrap sm:wrap-break-word"
                                      >
                                        <strong className="shrink-0">
                                          {key.toUpperCase()}:
                                        </strong>
                                        {key === "email" ? (
                                          <a
                                            href={`mailto:${val}`}
                                            className="text-primary inline-flex w-fit items-center gap-0.5 break-all hover:underline sm:wrap-break-word"
                                          >
                                            {val}{" "}
                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                          </a>
                                        ) : val.startsWith("http") ? (
                                          <a
                                            href={val}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary inline-flex w-fit items-center gap-0.5 break-all hover:underline sm:wrap-break-word"
                                          >
                                            {val}{" "}
                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                          </a>
                                        ) : (
                                          <span className="text-muted-foreground">
                                            {val}
                                          </span>
                                        )}
                                      </span>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* 4. Resumos */}
                          {(cv.summary || cv.ai) && (
                            <div className="max-w-full space-y-3 overflow-hidden border-t pt-3">
                              {cv.summary && (
                                <div className="max-w-full space-y-1">
                                  <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                    {t("sections.summary.title")}
                                  </h5>
                                  <p className="bg-muted/20 border-muted/20 max-w-full overflow-hidden rounded-sm border p-2.5 leading-relaxed wrap-break-word whitespace-pre-wrap italic">
                                    {cv.summary}
                                  </p>
                                </div>
                              )}
                              {cv.ai && (
                                <div className="max-w-full space-y-1">
                                  <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                    {t("sections.ai.title")}
                                  </h5>
                                  <p className="bg-muted/20 border-muted/20 max-w-full overflow-hidden rounded-sm border p-2.5 leading-relaxed wrap-break-word whitespace-pre-wrap italic">
                                    {cv.ai}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 5. Habilidades (Skills) */}
                          {cv.skills?.length > 0 && cv.skills[0] !== "" && (
                            <div className="max-w-full space-y-1.5 overflow-hidden border-t pt-3">
                              {(() => {
                                const skillsCount = cv.skills.filter(
                                  (s: string) => s.trim() !== ""
                                ).length;
                                return (
                                  <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                    {t("sections.skills.title")} ({skillsCount})
                                  </h5>
                                );
                              })()}
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
                            </div>
                          )}

                          {/* 6. Experiências */}
                          {cv.experiences?.length > 0 &&
                            cv.experiences[0].role !== "" && (
                              <div className="max-w-full space-y-3 overflow-hidden border-t pt-3">
                                <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                  {t("sections.experience.title")}
                                </h5>
                                <div className="max-w-full space-y-3">
                                  {cv.experiences.map((exp, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-muted/5 max-w-full overflow-hidden rounded-sm border p-3 break-all whitespace-pre-wrap sm:wrap-break-word"
                                    >
                                      <div className="flex w-full flex-col gap-1 text-left sm:flex-row sm:items-center sm:justify-between">
                                        <span className="text-sm font-bold break-all whitespace-pre-wrap sm:wrap-break-word">
                                          {exp.role || "—"}
                                        </span>
                                        <span className="text-primary text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
                                          {exp.company || "—"}
                                        </span>
                                        <span className="text-muted-foreground text-xs break-all italic sm:wrap-break-word">
                                          {exp.date || "—"}
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

                                      {/* CORRIGIDO: Exibe o título localizado das stacks com a contagem dinâmica ao lado, e badges abaixo */}
                                      {exp.stacks?.length > 0 &&
                                        exp.stacks[0] !== "" && (
                                          <div className="mt-3 flex w-full flex-col gap-1.5 text-left">
                                            {(() => {
                                              const stacksCount =
                                                exp.stacks.filter(
                                                  (st: string) =>
                                                    st.trim() !== ""
                                                ).length;
                                              return (
                                                <span className="text-muted-foreground block text-[11px] font-semibold break-all whitespace-pre-wrap sm:wrap-break-word">
                                                  {t(
                                                    "sections.experience.stacksTitle"
                                                  )}{" "}
                                                  ({stacksCount})
                                                </span>
                                              );
                                            })()}
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
                                </div>
                              </div>
                            )}

                          {/* 7. Educação, Certificações e Idiomas */}
                          {(cv.education ||
                            cv.certifications ||
                            cv.languages) && (
                            <div className="flex max-w-full flex-col gap-4 overflow-hidden border-t pt-3">
                              {/* Educação */}
                              {cv.education?.length > 0 &&
                                cv.education[0] !== "" && (
                                  <div className="max-w-full space-y-1">
                                    <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                      {t("sections.education.title")}
                                    </h5>
                                    <div className="max-w-full space-y-1 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
                                      {cv.education.map((edu, idx) => (
                                        <p
                                          key={idx}
                                          className="break-all whitespace-pre-wrap sm:wrap-break-word"
                                        >
                                          • {edu}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              {/* Certificados */}
                              {cv.certifications?.length > 0 &&
                                cv.certifications[0] !== "" && (
                                  <div className="max-w-full space-y-1">
                                    <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                      {t("sections.certifications.title")}
                                    </h5>
                                    <div className="max-w-full space-y-1 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
                                      {cv.certifications.map((cert, idx) => (
                                        <p
                                          key={idx}
                                          className="break-all whitespace-pre-wrap sm:wrap-break-word"
                                        >
                                          • {cert}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              {/* Idiomas */}
                              {cv.languages?.length > 0 &&
                                cv.languages[0] !== "" && (
                                  <div className="max-w-full space-y-1">
                                    <h5 className="text-primary block max-w-full text-xs font-bold tracking-wider break-all whitespace-pre-wrap uppercase sm:wrap-break-word">
                                      {t("sections.languages.title")}
                                    </h5>
                                    <div className="max-w-full space-y-1 text-xs break-all whitespace-pre-wrap sm:wrap-break-word">
                                      {cv.languages.map((lang, idx) => (
                                        <p
                                          key={idx}
                                          className="break-all whitespace-pre-wrap sm:wrap-break-word"
                                        >
                                          • {lang}
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
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

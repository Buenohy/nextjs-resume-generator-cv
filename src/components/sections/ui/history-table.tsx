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
  createdAt: string; // ISO String vinda do Postgres
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
                    {/* CABEÇALHO DO ITEM DO HISTÓRICO (PROTÓTIPO IGUAL À IMAGEM) */}
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        {/* Círculo com número da ordem de criação */}
                        <div className="border-primary bg-primary/5 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold">
                          {item.orderNumber}
                        </div>

                        {/* Dados de texto principais */}
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

                      {/* Gatilho para expandir */}
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

                    {/* CONTEÚDO EXPANSÍVEL (TODOS OS CAMPOS DO CURRÍCULO DE FORMA LEITURA) */}
                    <CollapsibleContent className="mt-5 w-full space-y-4 border-t pt-4">
                      <Card className="bg-muted/10 border-muted/40 border">
                        <CardContent className="space-y-5 p-4 text-sm">
                          {/* 1. Metadados ATS */}
                          {cv.meta_ats && (
                            <div className="space-y-1">
                              <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                {t("sections.meta_ats.title")}
                              </h5>
                              <div className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs md:grid-cols-2">
                                <p>
                                  <strong>
                                    {t(
                                      "sections.meta_ats.fields.role_target.label"
                                    )}
                                    :
                                  </strong>{" "}
                                  {cv.meta_ats.role_target || "—"}
                                </p>
                                <p>
                                  <strong>
                                    {t(
                                      "sections.meta_ats.fields.subject.label"
                                    )}
                                    :
                                  </strong>{" "}
                                  {cv.meta_ats.subject || "—"}
                                </p>
                                <p>
                                  <strong>
                                    {t(
                                      "sections.meta_ats.fields.category.label"
                                    )}
                                    :
                                  </strong>{" "}
                                  {cv.meta_ats.category || "—"}
                                </p>
                                <p>
                                  <strong>
                                    {t(
                                      "sections.meta_ats.fields.contributor.label"
                                    )}
                                    :
                                  </strong>{" "}
                                  {cv.meta_ats.contributor || "—"}
                                </p>
                              </div>
                              {cv.meta_ats.keywords?.length > 0 &&
                                cv.meta_ats.keywords[0] !== "" && (
                                  <div className="flex flex-wrap gap-1 pt-2">
                                    {cv.meta_ats.keywords.map((kw, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="secondary"
                                        className="text-[10px]"
                                      >
                                        {kw}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          )}

                          {/* 2. Cabeçalho Pessoal */}
                          {cv.info && (
                            <div className="space-y-1 border-t pt-3">
                              <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                {t("sections.header.title")}
                              </h5>
                              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                                <p>
                                  <strong>
                                    {t("sections.header.fields.name.label")}:
                                  </strong>{" "}
                                  {cv.info.name || "—"}
                                </p>
                                <p>
                                  <strong>
                                    {t("sections.header.fields.city.label")}:
                                  </strong>{" "}
                                  {cv.info.city || "—"}
                                </p>
                                <p>
                                  <strong>
                                    {t("sections.header.fields.age.label")}:
                                  </strong>{" "}
                                  {cv.info.age || "—"}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* 3. Links Profissionais */}
                          {cv.links && (
                            <div className="space-y-1 border-t pt-3">
                              <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                {t("sections.links.title")}
                              </h5>
                              <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                                {Object.entries(cv.links).map(
                                  ([key, val]) =>
                                    val && (
                                      <span
                                        key={key}
                                        className="flex items-center gap-1"
                                      >
                                        <strong>{key.toUpperCase()}:</strong>
                                        {val.startsWith("http") ? (
                                          <a
                                            href={val}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-primary inline-flex items-center gap-0.5 hover:underline"
                                          >
                                            {val}{" "}
                                            <ExternalLink className="size-3" />
                                          </a>
                                        ) : (
                                          val
                                        )}
                                      </span>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {/* 4. Resumos (Profissional e IA) */}
                          {(cv.summary || cv.ai) && (
                            <div className="space-y-3 border-t pt-3">
                              {cv.summary && (
                                <div className="space-y-1">
                                  <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                    {t("sections.summary.title")}
                                  </h5>
                                  <p className="bg-muted/20 border-muted/20 rounded-sm border p-2.5 leading-relaxed italic">
                                    {cv.summary}
                                  </p>
                                </div>
                              )}
                              {cv.ai && (
                                <div className="space-y-1">
                                  <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                    {t("sections.ai.title")}
                                  </h5>
                                  <p className="bg-muted/20 border-muted/20 rounded-sm border p-2.5 leading-relaxed italic">
                                    {cv.ai}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 5. Habilidades (Skills) */}
                          {cv.skills?.length > 0 && cv.skills[0] !== "" && (
                            <div className="space-y-1.5 border-t pt-3">
                              <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                {t("sections.skills.title")}
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {cv.skills.map((skill, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="default"
                                    className="text-xs"
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
                              <div className="space-y-3 border-t pt-3">
                                <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                  {t("sections.experience.title")}
                                </h5>
                                <div className="space-y-3">
                                  {cv.experiences.map((exp, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-muted/5 rounded-sm border p-3"
                                    >
                                      <div className="flex justify-between text-xs font-bold">
                                        <span>
                                          {exp.role} - {exp.company}
                                        </span>
                                        <span className="italic">
                                          {exp.date}
                                        </span>
                                      </div>
                                      {exp.details?.length > 0 && (
                                        <div className="text-muted-foreground mt-2 space-y-1 text-xs">
                                          {exp.details.map(
                                            (det, dIdx) =>
                                              det && <p key={dIdx}>• {det}</p>
                                          )}
                                        </div>
                                      )}
                                      {exp.stacks?.length > 0 &&
                                        exp.stacks[0] !== "" && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            {exp.stacks.map((st, sIdx) => (
                                              <Badge
                                                key={sIdx}
                                                variant="secondary"
                                                className="text-[10px]"
                                              >
                                                {st}
                                              </Badge>
                                            ))}
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
                            <div className="grid grid-cols-1 gap-4 border-t pt-3 md:grid-cols-3">
                              {/* Educação */}
                              {cv.education?.length > 0 &&
                                cv.education[0] !== "" && (
                                  <div className="space-y-1">
                                    <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                      {t("sections.education.title")}
                                    </h5>
                                    <div className="space-y-1 text-xs">
                                      {cv.education.map((edu, idx) => (
                                        <p key={idx}>• {edu}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              {/* Certificados */}
                              {cv.certifications?.length > 0 &&
                                cv.certifications[0] !== "" && (
                                  <div className="space-y-1">
                                    <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                      {t("sections.certifications.title")}
                                    </h5>
                                    <div className="space-y-1 text-xs">
                                      {cv.certifications.map((cert, idx) => (
                                        <p key={idx}>• {cert}</p>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              {/* Idiomas */}
                              {cv.languages?.length > 0 &&
                                cv.languages[0] !== "" && (
                                  <div className="space-y-1">
                                    <h5 className="text-primary text-xs font-bold tracking-wider uppercase">
                                      {t("sections.languages.title")}
                                    </h5>
                                    <div className="space-y-1 text-xs">
                                      {cv.languages.map((lang, idx) => (
                                        <p key={idx}>• {lang}</p>
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

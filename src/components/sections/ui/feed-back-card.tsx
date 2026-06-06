"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  ShieldAlert,
  TableProperties,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import { getColumns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY_KEYWORDS: any[] = [];

export function FeedbackCard() {
  const t = useTranslations("ResumeBuilderPage");
  const [activeTab, setActiveTab] = useState<"parse" | "match" | "optimize">(
    "parse"
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const analysisResults = useResumeStore((s) => s.analysisResults);
  const isLoadingAnalysis = useResumeStore((s) => s.isLoadingAnalysis);
  const triggerAnalysis = useResumeStore((s) => s.triggerAnalysis);
  const cvData = useResumeStore((s) => s.cvData);

  const keywordsTableData = analysisResults?.keywordsTable || EMPTY_KEYWORDS;
  const columns = useMemo(() => getColumns(t), [t]);

  const table = useReactTable({
    data: keywordsTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const totalPendente = keywordsTableData.filter(
    (item) => item.status === "Pendente"
  ).length;
  const totalAprovado = keywordsTableData.filter(
    (item) => item.status === "Aprovado"
  ).length;

  if (!isMounted) {
    return (
      <Card className="border-muted shadow-primary/50 shadow-lg">
        <CardHeader className="relative border-b pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="mt-2 h-4 w-72" />

          <div className="mt-4 grid w-full grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:gap-1.5">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 flex-1 rounded-md" />
          </div>
        </CardHeader>

        <CardContent className="flex min-h-[400px] flex-col gap-5 pt-6">
          <div className="bg-card space-y-4 rounded-lg border p-4">
            <Skeleton className="mb-3 h-5 w-40" />
            <div className="space-y-3">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-muted shadow-primary/50 shadow-lg">
      <CardHeader className="relative border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("feedbackCard.title")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={triggerAnalysis}
              disabled={isLoadingAnalysis}
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoadingAnalysis && "animate-spin")}
              />
            </Button>
            {isLoadingAnalysis && (
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            )}
          </div>
        </div>
        <CardDescription>{t("feedbackCard.description")}</CardDescription>
        <div className="mt-4 grid w-full grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:gap-1.5">
          <Button
            variant={activeTab === "parse" ? "default" : "outline"}
            size="sm"
            className="xs:text-xs h-9 w-full gap-1 px-1 text-[11px] sm:flex-1 sm:gap-1.5 sm:px-3"
            onClick={() => setActiveTab("parse")}
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="truncate">{t("feedbackCard.tabs.parse")}</span>
          </Button>
          <Button
            variant={activeTab === "match" ? "default" : "outline"}
            size="sm"
            className="xs:text-xs h-9 w-full gap-1 px-1 text-[11px] sm:flex-1 sm:gap-1.5 sm:px-3"
            onClick={() => setActiveTab("match")}
          >
            <TableProperties className="h-4 w-4 shrink-0" />
            <span className="truncate">{t("feedbackCard.tabs.match")}</span>
          </Button>
          <Button
            variant={activeTab === "optimize" ? "default" : "outline"}
            size="sm"
            className="xs:text-xs h-9 w-full gap-1 px-1 text-[11px] sm:flex-1 sm:gap-1.5 sm:px-3"
            onClick={() => setActiveTab("optimize")}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">{t("feedbackCard.tabs.optimize")}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="min-h-[400px] pt-6">
        {!analysisResults ? (
          <div className="text-muted-foreground flex min-h-[300px] flex-col items-center justify-center gap-2 text-center text-sm">
            <Sparkles className="text-muted/60 h-8 w-8 animate-pulse" />
            <p>{t("feedbackCard.waiting")}</p>
          </div>
        ) : (
          <>
            {activeTab === "parse" && <ParseTab />}
            {activeTab === "match" && (
              // Rolagem horizontal nativa ativada via overflow-x-auto
              <div className="border-muted overflow-x-auto rounded-md border shadow-sm">
                <Table className="min-w-[640px] md:min-w-full">
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            // Primeira coluna do cabeçalho fixa via CSS
                            className="first:bg-card first:border-muted/50 pt-2 text-xs first:sticky first:left-0 first:z-20 first:border-r"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody className="text-xs">
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              // Primeira coluna do corpo fixa via CSS
                              className="first:bg-card first:border-muted/50 py-2 align-middle first:sticky first:left-0 first:z-10 first:border-r"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          {t("feedbackCard.empty")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter className="border-muted border-t bg-transparent text-xs">
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={4}
                        className="py-2 font-bold text-rose-500"
                      >
                        {t("feedbackCard.totalPending")}
                      </TableCell>
                      <TableCell className="py-2 font-bold text-rose-500">
                        {t("feedbackCard.pendingCount", {
                          count: totalPendente,
                        })}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell
                        colSpan={4}
                        className="py-2 font-bold text-emerald-500"
                      >
                        {t("feedbackCard.totalApproved")}
                      </TableCell>
                      <TableCell className="py-2 font-bold text-emerald-500">
                        {t("feedbackCard.approvedCount", {
                          count: totalAprovado,
                        })}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
            {activeTab === "optimize" && <OptimizeTab />}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Subcomponente ParseTab e OptimizeTab permanecem intactos abaixo

function ParseTab() {
  const t = useTranslations("ResumeBuilderPage");
  const analysisResults = useResumeStore((s) => s.analysisResults);
  const cvData = useResumeStore((s) => s.cvData);

  if (!analysisResults) return null;

  const roleText = analysisResults?.warnings?.infoRoleMismatch
    ? t("feedbackAnalysis.roleMismatch", { role: cvData?.info?.role || "N/A" })
    : t("feedbackAnalysis.roleMatch", { role: cvData?.info?.role || "N/A" });

  const keywordsTitle = t("sections.meta_ats.keywordsOptimizerTitle")
    .replace(/\(ATS\)/gi, "")
    .trim();

  return (
    <div className="flex flex-col gap-5 text-sm">
      <div className="bg-card space-y-4 rounded-lg border p-4">
        <h3 className="flex items-center gap-2 font-semibold text-rose-500">
          {t("feedbackAnalysis.inconsistencies")}
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-muted-foreground font-semibold">
              {`${keywordsTitle} (${t("sections.meta_ats.title")})`}
            </p>
            <Textarea
              readOnly
              value={
                Array.isArray(analysisResults?.warnings?.keywords) &&
                analysisResults.warnings.keywords.length > 0
                  ? analysisResults.warnings.keywords.join(", ")
                  : t("feedbackAnalysis.missingKeywordsEmpty")
              }
              className="bg-muted/50 mt-1.5 min-h-[60px] text-xs"
            />
          </div>
          <div>
            <p className="text-muted-foreground font-semibold">
              {`${t("sections.meta_ats.fields.role_target.label")} (${t("sections.meta_ats.title")})`}
            </p>
            <Textarea
              readOnly
              value={
                analysisResults?.warnings?.roleTarget ||
                t("feedbackAnalysis.roleNotFoundEmpty")
              }
              className="bg-muted/50 mt-1.5 min-h-[40px] text-xs"
            />
          </div>
          <div>
            <p className="text-muted-foreground font-semibold">
              {`${t("sections.meta_ats.fields.subject.label")} (${t("sections.meta_ats.title")})`}
            </p>
            <Textarea
              readOnly
              value={
                Array.isArray(analysisResults?.warnings?.subjectWords) &&
                analysisResults.warnings.subjectWords.length > 0
                  ? analysisResults.warnings.subjectWords.join(", ")
                  : t("feedbackAnalysis.missingSubjectEmpty")
              }
              className="bg-muted/50 mt-1.5 min-h-[60px] text-xs"
            />
          </div>
          <div>
            <p className="text-muted-foreground font-semibold">
              {`${t("sections.header.fields.role.label")} (${t("sections.header.title")})`}
            </p>
            <Textarea
              readOnly
              value={roleText}
              className={cn(
                "bg-muted/50 mt-1.5 min-h-[60px] text-xs",
                analysisResults?.warnings?.infoRoleMismatch
                  ? "text-rose-500"
                  : "text-emerald-500"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OptimizeTab() {
  const t = useTranslations("ResumeBuilderPage");
  const analysisResults = useResumeStore((s) => s.analysisResults);
  if (!analysisResults) return null;

  const verbIssues = Array.isArray(analysisResults?.verbIssues)
    ? analysisResults.verbIssues
    : [];
  const suspectWords = Array.isArray(analysisResults?.suspectWords)
    ? analysisResults.suspectWords
    : [];

  return (
    <div className="space-y-4 text-xs">
      {verbIssues.length === 0 ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center font-bold text-emerald-500">
          {t("feedbackOptimize.noWeakVerbs")}
        </div>
      ) : (
        verbIssues.map((issue, idx) => (
          <div key={idx} className="bg-card space-y-3 rounded-lg border p-4">
            <h3 className="flex items-center gap-1.5 font-semibold text-yellow-500">
              {t("feedbackOptimize.weakVerbsDetected")} ({issue.context})
            </h3>
            <div className="space-y-2">
              <p className="text-muted-foreground font-semibold">
                {t("feedbackOptimize.original")}
              </p>
              <p className="bg-muted w-fit rounded-sm px-2 py-1 font-mono text-rose-500">
                ...{issue.original}...
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground font-semibold">
                {t("feedbackOptimize.context")}
              </p>
              <p className="bg-muted/30 rounded-sm border p-2.5 leading-relaxed italic">
                {issue.context}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-emerald-500">
                {t("feedbackOptimize.suggestions")}
              </p>
              <div className="flex gap-1.5">
                {Array.isArray(issue.suggestions) &&
                  issue.suggestions.map((sug, sIdx) => (
                    <span
                      key={sIdx}
                      className="rounded-sm bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500"
                    >
                      {sug}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))
      )}
      {suspectWords.length > 0 && (
        <div className="bg-card space-y-2 rounded-lg border p-4">
          <h3 className="text-destructive font-semibold">
            {t("feedbackOptimize.suspectWords")}
          </h3>
          <p className="text-destructive bg-destructive/10 w-fit rounded-sm px-3 py-1.5 font-bold">
            {suspectWords.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

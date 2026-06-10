import { ExternalLink, Trash2, Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FullContentState } from "@/store/useFullContentStore";

type ExperienceItem = FullContentState["savedExperiences"][number];

interface ExperienceTableProps {
  experiences: ExperienceItem[];
  onDelete: (id: string) => void;
  onEdit: (exp: ExperienceItem) => void;
  tFull: (key: string) => string;
}

export function ExperienceTable({
  experiences,
  onDelete,
  onEdit,
  tFull,
}: ExperienceTableProps) {
  const t = useTranslations("ResumeBuilderPage");

  // Função para decodificar os tokens de data na exibição
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const months = t.raw("months") as string[];
    const presentText = t("sections.education.present");

    return dateStr
      .replace(/__PRESENT__/g, presentText)
      .replace(/__MONTH_(\d+)__/g, (_, idx) => {
        const mIndex = parseInt(idx, 10);
        return months[mIndex] || `__MONTH_${idx}__`;
      });
  };

  return (
    <div className="min-w-0 overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader className="hidden sm:table-header-group">
          <TableRow>
            <TableHead className="px-3 py-2 text-sm whitespace-nowrap">
              {tFull("tableHeaders.experience")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {experiences.map((exp) => (
            <TableRow
              key={exp.id}
              className="border-border mb-4 block border-b pb-4 sm:mb-0 sm:table-row sm:border-b-0 sm:pb-0"
            >
              <TableCell className="block w-full min-w-0 px-3 pt-4 align-top wrap-break-word sm:table-cell">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <div className="flex items-center justify-between sm:contents">
                    <span className="text-sm font-bold">{exp.role || "—"}</span>

                    {/* Ações no Mobile */}
                    <div className="flex gap-1 sm:hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(exp)}
                        className="text-primary h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(exp.id!)}
                        className="text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-muted-foreground text-xs">
                      {exp.company || "—"}
                    </span>
                    <span className="text-xs italic">
                      {formatDisplayDate(exp.date)}
                    </span>
                  </div>

                  {/* Ações no Desktop */}
                  <div className="ml-auto hidden gap-1 sm:flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(exp)}
                      className="text-primary hover:bg-primary/10 h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(exp.id!)}
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Conteúdo extra (url, detalhes, stacks) */}
                <div className="mt-3 flex flex-col gap-3 text-sm">
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary wrap-break-words flex items-center gap-1 break-all whitespace-normal hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      {exp.url}
                    </a>
                  )}
                  {exp.details.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {exp.details.map(
                        (detail, dIdx) =>
                          detail.trim() && (
                            <p
                              key={dIdx}
                              className="wrap-break-words leading-relaxed whitespace-normal"
                            >
                              • {detail}
                            </p>
                          )
                      )}
                    </div>
                  )}
                  {exp.stacks.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {exp.stacks.map(
                        (stack, sIdx) =>
                          stack.trim() && (
                            <Badge
                              key={sIdx}
                              variant="default"
                              className="text-xs font-medium"
                            >
                              {stack}
                            </Badge>
                          )
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {experiences.length === 0 && (
            <TableRow>
              <TableCell className="h-24 text-center">
                {tFull("emptyMessage")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

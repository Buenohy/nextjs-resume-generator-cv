import { ExternalLink, Trash2 } from "lucide-react";
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
  onDelete: (index: number) => void;
}

export function ExperienceTable({
  experiences,
  onDelete,
}: ExperienceTableProps) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Experiência</TableHead>
            <TableHead className="w-2/3">Dados</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((exp, index) => (
            <TableRow key={index}>
              <TableCell className="min-w-0 pt-4 align-top font-medium wrap-break-word">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">{exp.role || "—"}</span>
                  <span className="text-muted-foreground text-xs">
                    {exp.company || "—"}
                  </span>
                  <span className="text-xs italic">{exp.date || "—"}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-0 min-w-0 overflow-hidden pt-4 align-top">
                <div className="flex flex-col gap-3 text-sm">
                  {exp.url && (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary flex items-center gap-1 break-all hover:underline"
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
                              variant="secondary"
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
              <TableCell className="pt-4 align-top">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(index)}
                  className="text-destructive hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {experiences.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhuma experiência cadastrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

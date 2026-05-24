import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { FullContentState } from "@/store/useFullContentStore";

type ExperienceItem = FullContentState["experiences"][number];

interface ExperienceTableProps {
  experiences: ExperienceItem[];
}

export function ExperienceTable({ experiences }: ExperienceTableProps) {
  return (
    <div className="border-muted overflow-x-auto rounded-md border shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] sm:w-[220px]">
              Experiência
            </TableHead>
            <TableHead>Dados</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {experiences.map((exp, index) => (
            <TableRow key={index}>
              <TableCell className="pt-4 align-top font-medium wrap-break-word">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold">{exp.role || "—"}</span>
                  <span className="text-muted-foreground text-xs">
                    {exp.company || "—"}
                  </span>
                  <span className="text-xs italic">{exp.date || "—"}</span>
                </div>
              </TableCell>
              <TableCell className="pt-4 align-top wrap-break-word">
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
                  {exp.details.some((d) => d.trim()) && (
                    <div className="flex flex-col gap-2">
                      {exp.details.map(
                        (detail, dIdx) =>
                          detail.trim() && (
                            <p
                              key={dIdx}
                              className="leading-relaxed wrap-break-word"
                            >
                              • {detail}
                            </p>
                          )
                      )}
                    </div>
                  )}
                  {exp.stacks.some((s) => s.trim()) && (
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
            </TableRow>
          ))}
          {experiences.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                Nenhuma experiência cadastrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

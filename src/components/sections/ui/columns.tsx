import { ColumnDef, Column } from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { KeywordData } from "@/types/keywords";

const SortableHeader = ({
  column,
  title,
  align = "left",
}: {
  column: Column<KeywordData, unknown>;
  title: string;
  align?: "left" | "center";
}) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={`hover:text-primary ${align === "left" ? "-ml-4" : ""}`}
    >
      {title}
      <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="ml-2" />
    </Button>
  );
};

export const columns: ColumnDef<KeywordData>[] = [
  {
    accessorKey: "keyword",
    header: ({ column }) => (
      <SortableHeader column={column} title="Palavra-Chave" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-cyan-400 capitalize">
        {row.getValue("keyword")}
      </div>
    ),
  },
  {
    accessorKey: "inVacancy",
    header: ({ column }) => (
      <SortableHeader column={column} title="Na Vaga" align="center" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("inVacancy")}</div>
    ),
  },
  {
    accessorKey: "goal2x",
    header: ({ column }) => (
      <SortableHeader column={column} title="Meta (2x)" align="center" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("goal2x")}</div>
    ),
  },
  {
    accessorKey: "onResume",
    header: ({ column }) => (
      <SortableHeader column={column} title="No Currículo" align="center" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("onResume")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isApproved = status === "Aprovado";
      return (
        <div
          className={`flex items-center gap-2 font-bold ${
            isApproved ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isApproved ? "✅" : "❌"}
        </div>
      );
    },
  },
];

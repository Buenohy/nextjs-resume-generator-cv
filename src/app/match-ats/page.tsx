"use client"

import { useState } from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpDownIcon } from "@hugeicons/core-free-icons"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export type KeywordData = {
  id: string
  keyword: string
  inVacancy: number
  goal2x: number
  onResume: number
  status: "Pendente" | "Aprovado"
}

export const data: KeywordData[] = [
  { id: "1", keyword: "API", inVacancy: 3, goal2x: 6, onResume: 5, status: "Pendente" },
  { id: "2", keyword: "REACT", inVacancy: 2, goal2x: 4, onResume: 21, status: "Aprovado" },
  { id: "3", keyword: "NEXT.JS", inVacancy: 2, goal2x: 4, onResume: 3, status: "Pendente" },
  { id: "4", keyword: "TAILWIND", inVacancy: 2, goal2x: 4, onResume: 8, status: "Aprovado" },
  { id: "5", keyword: "CSS", inVacancy: 2, goal2x: 4, onResume: 11, status: "Aprovado" },
  { id: "6", keyword: "TYPESCRIPT", inVacancy: 1, goal2x: 2, onResume: 6, status: "Aprovado" },
  { id: "7", keyword: "FULLSTACK", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "8", keyword: "ENGINEER", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "9", keyword: "FRONTEND", inVacancy: 1, goal2x: 2, onResume: 6, status: "Aprovado" },
  { id: "10", keyword: "LEANING", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "11", keyword: "FEEBLE", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "12", keyword: "12K", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "13", keyword: "ACTIVEPOSTED", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "14", keyword: "AUTOMATION", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "15", keyword: "AND", inVacancy: 1, goal2x: 2, onResume: 21, status: "Aprovado" },
  { id: "16", keyword: "CUSTOM", inVacancy: 1, goal2x: 2, onResume: 3, status: "Aprovado" },
  { id: "17", keyword: "OPERATORS", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "18", keyword: "CLIENTS", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "19", keyword: "HIRE", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "20", keyword: "WHEN", inVacancy: 1, goal2x: 2, onResume: 1, status: "Pendente" },
  { id: "21", keyword: "THEIR", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "22", keyword: "WORK", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "23", keyword: "MESSY", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "24", keyword: "HELP", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
  { id: "25", keyword: "WORTH", inVacancy: 1, goal2x: 2, onResume: 0, status: "Pendente" },
]

export const columns: ColumnDef<KeywordData>[] = [
  {
    accessorKey: "keyword",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 text-pink-500 hover:text-pink-400">
          Palavra-Chave
          <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium text-cyan-400">{row.getValue("keyword")}</div>,
  },
  {
    accessorKey: "inVacancy",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-pink-500 hover:text-pink-400">
          Na Vaga
          <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("inVacancy")}</div>,
  },
  {
    accessorKey: "goal2x",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-pink-500 hover:text-pink-400">
          Meta (2x)
          <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("goal2x")}</div>,
  },
  {
    accessorKey: "onResume",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-pink-500 hover:text-pink-400">
          No Currículo
          <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("onResume")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-pink-500 hover:text-pink-400">
          Status
          <HugeiconsIcon icon={ArrowUpDownIcon} size={16} className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const isApproved = status === "Aprovado"
      
      return (
        <div className={`flex items-center gap-2 font-bold ${isApproved ? "text-emerald-500" : "text-rose-500"}`}>
          {isApproved ? "✅ Aprovado" : "❌ Pendente"}
        </div>
      )
    },
  },
]

export default function MatchAtsPage() {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  const totalPendente = data.filter((item) => item.status === "Pendente").length
  const totalAprovado = data.filter((item) => item.status === "Aprovado").length

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Match ATS Page</h1>
      <Card className="shadow-primary/50 shadow-lg border-muted">
        <CardHeader>
          <CardTitle>Match ATS</CardTitle>
          <CardDescription>Analisando Match ATS (Currículo vs Vaga)...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="rounded-md border border-muted">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Nenhum resultado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="border-t border-muted">
                <TableRow>
                  <TableCell colSpan={4} className="font-bold text-rose-500">Total Pendente ❌</TableCell>
                  <TableCell className="font-bold text-rose-500">{`${totalPendente} Pendentes`}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} className="font-bold text-emerald-500">Total Aprovado ✅</TableCell>
                  <TableCell className="font-bold text-emerald-500">{`${totalAprovado} Aprovados`}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
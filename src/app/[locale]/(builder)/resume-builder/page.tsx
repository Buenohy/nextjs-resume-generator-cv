"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
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
  ColumnDef,
  Column,
  SortingState,
} from "@tanstack/react-table";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpDownIcon } from "@hugeicons/core-free-icons";

import { useResumeStore, ExperienceState } from "@/store/useResumeStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

interface FormField {
  id: string;
  label: string;
  placeholder: string;
}

interface FormSection {
  id: string;
  title: string;
  subTitle: string;
  fields: FormField[];
}

export interface KeywordData {
  id: string;
  keyword: string;
  inVacancy: number;
  goal2x: number;
  onResume: number;
  status: "Pendente" | "Aprovado";
}

const EMPTY_KEYWORDS: KeywordData[] = [];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = Array.from({ length: 41 }, (_, i) =>
  String(new Date().getFullYear() + 10 - i)
);

const STATIC_SECTIONS: FormSection[] = [
  {
    id: "meta_ats",
    title: "Metadados ATS",
    subTitle: "Metadados para indexação do currículo",
    fields: [
      {
        id: "role_target",
        label: "role_target",
        placeholder: "Ex: Developer Frontend",
      },
      {
        id: "subject",
        label: "subject",
        placeholder:
          "Ex: Developer specializing in React, Angular, and Next.js...",
      },
      {
        id: "keywords",
        label: "keywords",
        placeholder: "Ex: React, Angular, Next.js, TypeScript, JavaScript...",
      },
      { id: "category", label: "category", placeholder: "Ex: Resume" },
      {
        id: "contributor",
        label: "contributor",
        placeholder: "Ex: Gabriel Bueno Hygino",
      },
      {
        id: "coverage",
        label: "coverage",
        placeholder: "Ex: Global / Remote / Hybrid / In Person",
      },
      {
        id: "identifier",
        label: "identifier",
        placeholder: "Ex: CV-Gabriel-Bueno-2026",
      },
      {
        id: "publisher",
        label: "publisher",
        placeholder: "Ex: Self-published via Python Automation",
      },
      {
        id: "relation",
        label: "relation",
        placeholder: "Ex: Application for Software Engineer Position",
      },
      {
        id: "rights",
        label: "rights",
        placeholder:
          "Ex: Copyright © 2026 Gabriel Bueno Hygino. All rights reserved.",
      },
      {
        id: "source",
        label: "source",
        placeholder: "Ex: http://bueno-portfolio-web.vercel.app/",
      },
      { id: "type", label: "type", placeholder: "Ex: Text/PDF" },
      {
        id: "notes",
        label: "notes",
        placeholder: "Ex: Optimized for ATS systems.",
      },
    ],
  },
  {
    id: "header",
    title: "Header",
    subTitle: "Coloque os dados",
    fields: [
      { id: "name", label: "name", placeholder: "Coloque o seu nome" },
      { id: "role", label: "role", placeholder: "Coloque o cargo desejado" },
      {
        id: "city",
        label: "city",
        placeholder: "Coloque a sua cidade e a sigla",
      },
      { id: "age", label: "age", placeholder: "Coloque a sua idade" },
    ],
  },
  {
    id: "links",
    title: "Links Profissionais",
    subTitle: "Coloque os seus links",
    fields: [
      {
        id: "linkedin",
        label: "LinkedIn",
        placeholder: "Coloque o link do seu LinkedIn",
      },
      {
        id: "phone",
        label: "Telefone",
        placeholder: "Coloque o link do seu Telefone",
      },
      {
        id: "website",
        label: "Site",
        placeholder: "Coloque o link do seu Site",
      },
      {
        id: "email",
        label: "E-mail",
        placeholder: "Coloque o link do seu E-mail",
      },
      {
        id: "github",
        label: "GitHub",
        placeholder: "Coloque o link do seu GitHub",
      },
    ],
  },
];

const BASE_EXPERIENCE_FIELDS: FormField[] = [
  {
    id: "role",
    label: "role",
    placeholder: "Coloque a função que você exerceu na empresa",
  },
  { id: "company", label: "company", placeholder: "Coloque o nome da empresa" },
  {
    id: "url",
    label: "url",
    placeholder: "Coloque o url do deploy do projeto",
  },
];

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
          className={`flex items-center gap-2 font-bold ${isApproved ? "text-emerald-500" : "text-rose-500"}`}
        >
          {isApproved ? "✅" : "❌"}
        </div>
      );
    },
  },
];

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<"parse" | "match" | "optimize">(
    "parse"
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const cvData = useResumeStore((state) => state.cvData);
  const updateCvData = useResumeStore((state) => state.updateCvData);
  const analysisResults = useResumeStore((state) => state.analysisResults);
  const isLoadingAnalysis = useResumeStore((state) => state.isLoadingAnalysis);
  const triggerAnalysis = useResumeStore((state) => state.triggerAnalysis);

  const keywordsTableData = analysisResults?.keywordsTable || EMPTY_KEYWORDS;

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      triggerAnalysis();
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [cvData, triggerAnalysis]);

  const getFieldValue = (sectionId: string, fieldId: string) => {
    if (sectionId === "header")
      return cvData.info[fieldId as keyof typeof cvData.info] || "";
    if (sectionId === "meta_ats")
      return cvData.meta_ats[fieldId as keyof typeof cvData.meta_ats] || "";
    if (sectionId === "links")
      return cvData.links[fieldId as keyof typeof cvData.links] || "";
    return "";
  };

  const handleFieldChange = (
    sectionId: string,
    fieldId: string,
    value: string
  ) => {
    updateCvData((draft) => {
      if (sectionId === "header")
        draft.info[fieldId as keyof typeof draft.info] = value;
      if (sectionId === "meta_ats")
        draft.meta_ats[fieldId as keyof typeof draft.meta_ats] = value;
      if (sectionId === "links")
        draft.links[fieldId as keyof typeof draft.links] = value;
    });
  };

  const handleAutoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleAddListItem = (
    key: "skills" | "education" | "certifications" | "languages"
  ) => {
    updateCvData((draft) => {
      draft[key].push("");
    });
  };

  const handleRemoveListItem = (
    key: "skills" | "education" | "certifications" | "languages",
    index: number
  ) => {
    updateCvData((draft) => {
      if (draft[key].length > 1) {
        draft[key] = draft[key].filter((_, i) => i !== index);
      }
    });
  };

  const handleUpdateListItem = (
    key: "skills" | "education" | "certifications" | "languages",
    index: number,
    value: string
  ) => {
    updateCvData((draft) => {
      draft[key][index] = value;
    });
  };

  const handleAddExperience = () => {
    updateCvData((draft) => {
      if (draft.experiences.length < 4) {
        draft.experiences.push({
          role: "",
          company: "",
          url: "",
          date: "",
          details: [""],
          stacks: [""],
        });
      }
    });
  };

  const handleRemoveExperience = (index: number) => {
    updateCvData((draft) => {
      if (draft.experiences.length > 1) {
        draft.experiences = draft.experiences.filter((_, i) => i !== index);
      }
    });
  };

  const handleUpdateExperienceField = (
    index: number,
    fieldId: keyof Omit<ExperienceState, "details" | "stacks">,
    value: string
  ) => {
    updateCvData((draft) => {
      draft.experiences[index][fieldId] = value;
    });
  };

  const parseDateString = (dateStr: string) => {
    const [startStr, endStr] = dateStr.split(" - ");
    const startParts = (startStr || "").trim().split(" ");
    const endParts = (endStr || "").trim().split(" ");

    return {
      startMonth: startParts[0] || "",
      startYear: startParts[1] || "",
      endMonth: endParts[0] || "",
      endYear: endParts[1] || "",
    };
  };

  const handleExpDateChange = (
    expIndex: number,
    sm: string,
    sy: string,
    em: string,
    ey: string
  ) => {
    const start = [sm, sy].filter(Boolean).join(" ");
    const end =
      em === "Present" ? "Present" : [em, ey].filter(Boolean).join(" ");
    const finalDate =
      start || end ? `${start}${start && end ? " - " : ""}${end}` : "";
    handleUpdateExperienceField(expIndex, "date", finalDate);
  };

  const handleAddDetail = (expIndex: number) => {
    updateCvData((draft) => {
      if (draft.experiences[expIndex].details.length < 3) {
        draft.experiences[expIndex].details.push("");
      }
    });
  };

  const handleRemoveDetail = (expIndex: number, detailIndex: number) => {
    updateCvData((draft) => {
      if (draft.experiences[expIndex].details.length > 1) {
        draft.experiences[expIndex].details = draft.experiences[
          expIndex
        ].details.filter((_, i) => i !== detailIndex);
      }
    });
  };

  const handleUpdateDetail = (
    expIndex: number,
    detailIndex: number,
    value: string
  ) => {
    updateCvData((draft) => {
      draft.experiences[expIndex].details[detailIndex] = value;
    });
  };

  const handleAddStack = (expIndex: number) => {
    updateCvData((draft) => {
      draft.experiences[expIndex].stacks.push("");
    });
  };

  const handleRemoveStack = (expIndex: number, stackIndex: number) => {
    updateCvData((draft) => {
      if (draft.experiences[expIndex].stacks.length > 1) {
        draft.experiences[expIndex].stacks = draft.experiences[
          expIndex
        ].stacks.filter((_, i) => i !== stackIndex);
      }
    });
  };

  const handleUpdateStack = (
    expIndex: number,
    stackIndex: number,
    value: string
  ) => {
    updateCvData((draft) => {
      draft.experiences[expIndex].stacks[stackIndex] = value;
    });
  };

  return (
    <div className="p-3 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Resume Builder & Optimization</h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-muted shadow-primary/50 shadow-lg">
            <CardHeader>
              <CardTitle>Resume Content</CardTitle>
              <CardDescription>
                Monte o conteúdo do seu currículo abaixo
              </CardDescription>
            </CardHeader>

            {STATIC_SECTIONS.map((section) => (
              <CardContent key={section.id}>
                <div className="flex flex-col gap-6 border-b py-4">
                  <div>
                    <h2 className="text-xl font-semibold">{section.title}</h2>
                    <h3 className="border-b pb-2 text-lg">
                      {section.subTitle}
                    </h3>
                  </div>
                  {section.fields.map(({ id: fieldId, label, placeholder }) => (
                    <Field key={fieldId} className="mb-4">
                      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          {label}
                        </FieldLabel>
                        {section.id === "meta_ats" &&
                        (fieldId === "subject" ||
                          fieldId === "keywords" ||
                          fieldId === "rights") ? (
                          <Textarea
                            className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                            rows={1}
                            placeholder={placeholder}
                            value={getFieldValue(section.id, fieldId)}
                            onChange={(e) => {
                              handleAutoResize(e);
                              handleFieldChange(
                                section.id,
                                fieldId,
                                e.target.value
                              );
                            }}
                          />
                        ) : (
                          <Input
                            className="w-full flex-1"
                            placeholder={placeholder}
                            value={getFieldValue(section.id, fieldId)}
                            onChange={(e) =>
                              handleFieldChange(
                                section.id,
                                fieldId,
                                e.target.value
                              )
                            }
                          />
                        )}
                      </div>
                    </Field>
                  ))}
                </div>
              </CardContent>
            ))}

            <CardContent>
              <div className="flex flex-col gap-6 border-b py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Resumo Profissional
                    </h2>
                    <h3 className="border-b pb-2 text-lg">
                      Coloque o seu resumo profissional
                    </h3>
                  </div>
                </div>
                <Field className="mb-4">
                  <div className="flex w-full flex-col gap-4">
                    <Textarea
                      placeholder="Coloque o seu resumo profissional"
                      value={cvData.summary}
                      onChange={(e) => {
                        handleAutoResize(e);
                        updateCvData((draft) => {
                          draft.summary = e.target.value;
                        });
                      }}
                      className="min-h-[120px] resize-none overflow-hidden"
                    />
                  </div>
                </Field>
              </div>
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 border-b py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Habilidades</h2>
                    <h3 className="text-lg">Coloque as suas habilidades</h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Atualmente: {cvData.skills.length} habilidade(s)
                      cadastrada(s).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem("skills")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Habilidade
                  </Button>
                </div>
                {cvData.skills.map((skill, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Skill {index + 1}
                        </FieldLabel>
                        {cvData.skills.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem("skills", index)
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                        rows={1}
                        placeholder="Coloque uma habilidade"
                        value={skill}
                        onBlur={(e) => {
                          if (
                            !e.target.value.trim() &&
                            cvData.skills.length > 1
                          ) {
                            handleRemoveListItem("skills", index);
                          }
                        }}
                        onChange={(e) => {
                          handleAutoResize(e);
                          handleUpdateListItem("skills", index, e.target.value);
                        }}
                      />
                      {cvData.skills.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveListItem("skills", index)}
                          className="hidden sm:inline-flex"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                ))}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddListItem("skills")}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Adicionar Habilidade
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 border-b py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Experiências Profissionais
                    </h2>
                    <h3 className="text-lg">
                      Cadastre suas experiências de atuação
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Limite máximo de 4 experiências. Atualmente usando:{" "}
                      {cvData.experiences.length}/4
                    </p>
                  </div>
                  {cvData.experiences.length < 4 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddExperience}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Experiência
                    </Button>
                  )}
                </div>
                {cvData.experiences.map((exp, expIndex) => {
                  const dateParsed = parseDateString(exp.date);

                  return (
                    <div
                      key={expIndex}
                      className="flex flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <h4 className="text-lg font-semibold">
                          Experiência {expIndex + 1}
                        </h4>
                        {cvData.experiences.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExperience(expIndex)}
                          >
                            <Trash2 className="text-destructive mr-1 h-4 w-4" />{" "}
                            Remover Experiência
                          </Button>
                        )}
                      </div>
                      {BASE_EXPERIENCE_FIELDS.map(
                        ({ id: fieldId, label, placeholder }) => (
                          <Field key={fieldId} className="mb-4">
                            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                              <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                                {label}
                              </FieldLabel>
                              <Input
                                className="w-full flex-1"
                                placeholder={placeholder}
                                value={
                                  exp[
                                    fieldId as keyof Omit<
                                      ExperienceState,
                                      "details" | "stacks"
                                    >
                                  ] || ""
                                }
                                onChange={(e) =>
                                  handleUpdateExperienceField(
                                    expIndex,
                                    fieldId as keyof Omit<
                                      ExperienceState,
                                      "details" | "stacks"
                                    >,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </Field>
                        )
                      )}

                      <Field className="mb-4">
                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                          <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                            Date
                          </FieldLabel>
                          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
                            <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                              <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
                                Início
                              </span>
                              <div className="flex w-full items-center gap-2 sm:w-auto">
                                <Select
                                  value={dateParsed.startMonth}
                                  onValueChange={(val) =>
                                    handleExpDateChange(
                                      expIndex,
                                      val,
                                      dateParsed.startYear,
                                      dateParsed.endMonth,
                                      dateParsed.endYear
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full sm:w-[110px]">
                                    <SelectValue placeholder="Mês" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MONTHS.map((m) => (
                                      <SelectItem key={m} value={m}>
                                        {m}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={dateParsed.startYear}
                                  onValueChange={(val) =>
                                    handleExpDateChange(
                                      expIndex,
                                      dateParsed.startMonth,
                                      val,
                                      dateParsed.endMonth,
                                      dateParsed.endYear
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full sm:w-[90px]">
                                    <SelectValue placeholder="Ano" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {YEARS.map((y) => (
                                      <SelectItem key={y} value={y}>
                                        {y}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <span className="text-muted-foreground hidden pb-2.5 sm:block">
                              -
                            </span>

                            <div className="flex w-full flex-col gap-1.5 sm:w-auto">
                              <span className="text-muted-foreground pl-1 text-[10px] font-semibold uppercase">
                                Término
                              </span>
                              <div className="flex w-full items-center gap-2 sm:w-auto">
                                <Select
                                  value={dateParsed.endMonth}
                                  onValueChange={(val) =>
                                    handleExpDateChange(
                                      expIndex,
                                      dateParsed.startMonth,
                                      dateParsed.startYear,
                                      val,
                                      dateParsed.endYear
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-full sm:w-[110px]">
                                    <SelectValue placeholder="Mês" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Present">
                                      Present
                                    </SelectItem>
                                    {MONTHS.map((m) => (
                                      <SelectItem key={m} value={m}>
                                        {m}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {dateParsed.endMonth !== "Present" && (
                                  <Select
                                    value={dateParsed.endYear}
                                    onValueChange={(val) =>
                                      handleExpDateChange(
                                        expIndex,
                                        dateParsed.startMonth,
                                        dateParsed.startYear,
                                        dateParsed.endMonth,
                                        val
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full sm:w-[90px]">
                                      <SelectValue placeholder="Ano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {YEARS.map((y) => (
                                        <SelectItem key={y} value={y}>
                                          {y}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Field>

                      <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div>
                            <h5 className="text-sm font-semibold">
                              Detalhes do Projeto
                            </h5>
                            <p className="text-muted-foreground text-xs">
                              Limite máximo de 3 detalhes. Atualmente:{" "}
                              {exp.details.length}/3
                            </p>
                          </div>
                          {exp.details.length < 3 && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => handleAddDetail(expIndex)}
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
                              Detalhe
                            </Button>
                          )}
                        </div>

                        {exp.details.map((detail, detailIndex) => (
                          <Field key={detailIndex} className="mb-2">
                            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                              <div className="flex w-full items-center justify-between sm:w-auto">
                                <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                                  Detalhe {detailIndex + 1}
                                </FieldLabel>
                                {exp.details.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveDetail(expIndex, detailIndex)
                                    }
                                    className="h-8 w-8 sm:hidden"
                                  >
                                    <Trash2 className="text-destructive h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                                rows={1}
                                placeholder={`Coloque a descrição sobre o projeto ${detailIndex + 1}`}
                                value={detail}
                                onBlur={(e) => {
                                  if (
                                    !e.target.value.trim() &&
                                    exp.details.length > 1
                                  ) {
                                    handleRemoveDetail(expIndex, detailIndex);
                                  }
                                }}
                                onChange={(e) => {
                                  handleAutoResize(e);
                                  handleUpdateDetail(
                                    expIndex,
                                    detailIndex,
                                    e.target.value
                                  );
                                }}
                              />
                              {exp.details.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveDetail(expIndex, detailIndex)
                                  }
                                  className="hidden sm:inline-flex"
                                >
                                  <Trash2 className="text-destructive h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </Field>
                        ))}
                      </div>

                      <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div>
                            <h5 className="text-sm font-semibold">
                              Tecnologias (Stacks)
                            </h5>
                            <p className="text-muted-foreground text-xs">
                              Atualmente usando: {exp.stacks.length}{" "}
                              tecnologia(s)
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleAddStack(expIndex)}
                          >
                            <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar
                            Stack
                          </Button>
                        </div>

                        {exp.stacks.map((stack, stackIndex) => (
                          <Field key={stackIndex} className="mb-2">
                            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                              <div className="flex w-full items-center justify-between sm:w-auto">
                                <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                                  Stack {stackIndex + 1}
                                </FieldLabel>
                                {exp.stacks.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveStack(expIndex, stackIndex)
                                    }
                                    className="h-8 w-8 sm:hidden"
                                  >
                                    <Trash2 className="text-destructive h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                                rows={1}
                                placeholder="Ex: React, Node.js, TypeScript"
                                value={stack}
                                onBlur={(e) => {
                                  if (
                                    !e.target.value.trim() &&
                                    exp.stacks.length > 1
                                  ) {
                                    handleRemoveStack(expIndex, stackIndex);
                                  }
                                }}
                                onChange={(e) => {
                                  handleAutoResize(e);
                                  handleUpdateStack(
                                    expIndex,
                                    stackIndex,
                                    e.target.value
                                  );
                                }}
                              />
                              {exp.stacks.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveStack(expIndex, stackIndex)
                                  }
                                  className="hidden sm:inline-flex"
                                >
                                  <Trash2 className="text-destructive h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </Field>
                        ))}
                        <div className="mt-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleAddStack(expIndex)}
                            className="gap-1 text-xs"
                          >
                            <Plus className="h-3.5 w-3.5" /> Adicionar Stack
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 border-b py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Educação</h2>
                    <h3 className="border-b pb-2 text-lg">
                      Coloque a sua formação acadêmica
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Atualmente: {cvData.education.length} formação(ões)
                      cadastrada(s).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem("education")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Formação
                  </Button>
                </div>
                {cvData.education.map((edu, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Educação {index + 1}
                        </FieldLabel>
                        {cvData.education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem("education", index)
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                        rows={1}
                        placeholder="Coloque a sua formação"
                        value={edu}
                        onBlur={(e) => {
                          if (
                            !e.target.value.trim() &&
                            cvData.education.length > 1
                          ) {
                            handleRemoveListItem("education", index);
                          }
                        }}
                        onChange={(e) => {
                          handleAutoResize(e);
                          handleUpdateListItem(
                            "education",
                            index,
                            e.target.value
                          );
                        }}
                      />
                      {cvData.education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem("education", index)
                          }
                          className="hidden sm:inline-flex"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                ))}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddListItem("education")}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Adicionar Formação
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 border-b py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Certificações</h2>
                    <h3 className="border-b pb-2 text-lg">
                      Coloque as suas certificações relevantes
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Atualmente: {cvData.certifications.length}{" "}
                      certificação(ões) cadastrada(s).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem("certifications")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Certificação
                  </Button>
                </div>
                {cvData.certifications.map((cert, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Certificado {index + 1}
                        </FieldLabel>
                        {cvData.certifications.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem("certifications", index)
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                        rows={1}
                        placeholder="Coloque o nome da sua certificação"
                        value={cert}
                        onBlur={(e) => {
                          if (
                            !e.target.value.trim() &&
                            cvData.certifications.length > 1
                          ) {
                            handleRemoveListItem("certifications", index);
                          }
                        }}
                        onChange={(e) => {
                          handleAutoResize(e);
                          handleUpdateListItem(
                            "certifications",
                            index,
                            e.target.value
                          );
                        }}
                      />
                      {cvData.certifications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem("certifications", index)
                          }
                          className="hidden sm:inline-flex"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                ))}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddListItem("certifications")}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Adicionar Certificação
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Idiomas</h2>
                    <h3 className="border-b pb-2 text-lg">
                      Coloque os idiomas que você fala
                    </h3>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Atualmente: {cvData.languages.length} idioma(s)
                      cadastrado(s).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem("languages")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Idioma
                  </Button>
                </div>
                {cvData.languages.map((lang, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Idioma {index + 1}
                        </FieldLabel>
                        {cvData.languages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem("languages", index)
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        className="min-h-[38px] w-full flex-1 resize-none overflow-hidden py-2"
                        rows={1}
                        placeholder="Coloque um idioma"
                        value={lang}
                        onBlur={(e) => {
                          if (
                            !e.target.value.trim() &&
                            cvData.languages.length > 1
                          ) {
                            handleRemoveListItem("languages", index);
                          }
                        }}
                        onChange={(e) => {
                          handleAutoResize(e);
                          handleUpdateListItem(
                            "languages",
                            index,
                            e.target.value
                          );
                        }}
                      />
                      {cvData.languages.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem("languages", index)
                          }
                          className="hidden sm:inline-flex"
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Field>
                ))}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleAddListItem("languages")}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Adicionar Idioma
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-5 lg:col-span-5">
          <Card className="border-muted shadow-primary/50 shadow-lg">
            <CardHeader className="relative border-b pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  ATS Optimization Feedbacks
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={triggerAnalysis}
                    disabled={isLoadingAnalysis}
                    className="text-muted-foreground hover:text-foreground h-8 w-8"
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4",
                        isLoadingAnalysis && "animate-spin"
                      )}
                    />
                  </Button>
                  {isLoadingAnalysis && (
                    <Loader2 className="text-primary h-5 w-5 animate-spin" />
                  )}
                </div>
              </div>
              <CardDescription>
                Analise os diagnósticos e ajuste o formulário ao lado
              </CardDescription>
              <div className="mt-4 grid w-full grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:gap-1.5">
                <Button
                  variant={activeTab === "parse" ? "default" : "outline"}
                  size="sm"
                  className="xs:text-xs h-9 w-full gap-1 px-1 text-[11px] sm:flex-1 sm:gap-1.5 sm:px-3"
                  onClick={() => setActiveTab("parse")}
                >
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span className="truncate">Análise</span>
                </Button>
                <Button
                  variant={activeTab === "match" ? "default" : "outline"}
                  size="sm"
                  className="xs:text-xs h-9 w-full gap-1 px-1 text-[11px] sm:flex-1 sm:gap-1.5 sm:px-3"
                  onClick={() => setActiveTab("match")}
                >
                  <TableProperties className="h-4 w-4 shrink-0" />
                  <span className="truncate">Keywords</span>
                </Button>
                <Button
                  variant={activeTab === "optimize" ? "default" : "outline"}
                  size="sm"
                  className="xs:text-xs h-9 w-full gap-1 px-1 text-[11px] sm:flex-1 sm:gap-1.5 sm:px-3"
                  onClick={() => setActiveTab("optimize")}
                >
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="truncate">Verbos</span>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="min-h-[400px] pt-6">
              {!analysisResults ? (
                <div className="text-muted-foreground flex min-h-[300px] flex-col items-center justify-center gap-2 text-center text-sm">
                  <Sparkles className="text-muted/60 h-8 w-8 animate-pulse" />
                  <p>Aguardando preenchimento para analisar...</p>
                </div>
              ) : (
                <>
                  {activeTab === "parse" && (
                    <div className="flex flex-col gap-5 text-sm">
                      <div className="bg-card space-y-4 rounded-lg border p-4">
                        <h3 className="flex items-center gap-2 font-semibold text-rose-500">
                          ⚠️ Inconsistências Detectadas
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-muted-foreground font-semibold">
                              Keywords ausentes na vaga:
                            </p>
                            <Textarea
                              readOnly
                              value={
                                analysisResults.warnings.keywords.join(", ") ||
                                "Nenhuma palavra-chave ausente!"
                              }
                              className="bg-muted/50 mt-1.5 min-h-[60px] text-xs"
                            />
                          </div>
                          <div>
                            <p className="text-muted-foreground font-semibold">
                              Role target não encontrado:
                            </p>
                            <Textarea
                              readOnly
                              value={
                                analysisResults.warnings.roleTarget ||
                                "Divergência de cargo não detectada!"
                              }
                              className="bg-muted/50 mt-1.5 min-h-[40px] text-xs"
                            />
                          </div>
                          <div>
                            <p className="text-muted-foreground font-semibold">
                              Palavras do subject ausentes:
                            </p>
                            <Textarea
                              readOnly
                              value={
                                analysisResults.warnings.subjectWords.join(
                                  ", "
                                ) || "Nenhum termo do subject ausente!"
                              }
                              className="bg-muted/50 mt-1.5 min-h-[60px] text-xs"
                            />
                          </div>
                          <div>
                            <p className="text-muted-foreground font-semibold">
                              Validação do cargo declarado:
                            </p>
                            <Textarea
                              readOnly
                              value={analysisRoleValidationText(
                                analysisResults.warnings.infoRoleMismatch,
                                cvData.info.role
                              )}
                              className={cn(
                                "bg-muted/50 mt-1.5 min-h-[60px] text-xs",
                                analysisResults.warnings.infoRoleMismatch
                                  ? "text-rose-500"
                                  : "text-emerald-500"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "match" && (
                    <div className="border-muted overflow-hidden rounded-md border shadow-sm">
                      <Table>
                        <TableHeader>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => (
                                <TableHead
                                  key={header.id}
                                  className="pt-2 text-xs"
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
                                    className="py-2 align-middle"
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
                                Nenhum resultado.
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
                              Total Pendente ❌
                            </TableCell>
                            <TableCell className="py-2 font-bold text-rose-500">
                              {totalPendente} Pendentes
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-transparent">
                            <TableCell
                              colSpan={4}
                              className="py-2 font-bold text-emerald-500"
                            >
                              Total Aprovado ✅
                            </TableCell>
                            <TableCell className="py-2 font-bold text-emerald-500">
                              {totalAprovado} Aprovados
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  )}

                  {activeTab === "optimize" && (
                    <div className="space-y-4 text-xs">
                      {analysisResults.verbIssues.length === 0 ? (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center font-bold text-emerald-500">
                          ✨ Nenhum verbo fraco encontrado! Sua linguagem de
                          atuação está forte.
                        </div>
                      ) : (
                        analysisResults.verbIssues.map((issue, index) => (
                          <div
                            key={index}
                            className="bg-card space-y-3 rounded-lg border p-4"
                          >
                            <h3 className="flex items-center gap-1.5 font-semibold text-yellow-500">
                              ⚠️ Verbo Fraco Detectado ({issue.context})
                            </h3>
                            <div className="space-y-2">
                              <p className="text-muted-foreground font-semibold">
                                Original:
                              </p>
                              <p className="bg-muted w-fit rounded px-2 py-1 font-mono text-rose-500">
                                ...{issue.original}...
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-muted-foreground font-semibold">
                                Contexto:
                              </p>
                              <p className="bg-muted/30 rounded border p-2.5 leading-relaxed italic">
                                {issue.context}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="font-semibold text-emerald-500">
                                🚀 Sugestões de Verbos de Ação:
                              </p>
                              <div className="flex gap-1.5">
                                {issue.suggestions.map((suggestion, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="rounded bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500"
                                  >
                                    {suggestion}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {analysisResults.suspectWords.length > 0 && (
                        <div className="bg-card space-y-2 rounded-lg border p-4">
                          <h3 className="text-destructive font-semibold">
                            Palavras Suspeitas Detectadas:
                          </h3>
                          <p className="text-destructive bg-destructive/10 w-fit rounded px-3 py-1.5 font-bold">
                            {analysisResults.suspectWords.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function analysisRoleValidationText(isMismatch: boolean, role: string) {
  if (isMismatch) {
    return `Atenção: O cargo '${role || "não informado"}' informado no formulário não parece estar relacionado à descrição da vaga.`;
  }
  return `Sucesso! O cargo '${role}' está perfeitamente alinhado com a descrição da vaga analisada.`;
}

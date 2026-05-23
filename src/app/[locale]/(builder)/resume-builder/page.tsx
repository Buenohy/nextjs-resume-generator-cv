"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ShieldAlert,
  TableProperties,
  Sparkles,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import ButtonPaginate from "@/components/button-paginate";

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

interface ExperienceState {
  role: string;
  company: string;
  url: string;
  date: string;
  details: string[];
  stacks: string[];
}

export interface KeywordData {
  id: string;
  keyword: string;
  inVacancy: number;
  goal2x: number;
  onResume: number;
  status: "Pendente" | "Aprovado";
}

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
  {
    id: "date",
    label: "date",
    placeholder: "Coloque a data de início e termino",
  },
];

const mockKeywordData: KeywordData[] = [
  {
    id: "1",
    keyword: "API",
    inVacancy: 3,
    goal2x: 6,
    onResume: 5,
    status: "Pendente",
  },
  {
    id: "2",
    keyword: "REACT",
    inVacancy: 2,
    goal2x: 4,
    onResume: 21,
    status: "Aprovado",
  },
  {
    id: "3",
    keyword: "NEXT.JS",
    inVacancy: 2,
    goal2x: 4,
    onResume: 3,
    status: "Pendente",
  },
  {
    id: "4",
    keyword: "TAILWIND",
    inVacancy: 2,
    goal2x: 4,
    onResume: 8,
    status: "Aprovado",
  },
  {
    id: "5",
    keyword: "CSS",
    inVacancy: 2,
    goal2x: 4,
    onResume: 11,
    status: "Aprovado",
  },
  {
    id: "6",
    keyword: "TYPESCRIPT",
    inVacancy: 1,
    goal2x: 2,
    onResume: 6,
    status: "Aprovado",
  },
  {
    id: "7",
    keyword: "FULLSTACK",
    inVacancy: 1,
    goal2x: 2,
    onResume: 0,
    status: "Pendente",
  },
  {
    id: "8",
    keyword: "ENGINEER",
    inVacancy: 1,
    goal2x: 2,
    onResume: 0,
    status: "Pendente",
  },
  {
    id: "9",
    keyword: "FRONTEND",
    inVacancy: 1,
    goal2x: 2,
    onResume: 6,
    status: "Aprovado",
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
  const [skills, setSkills] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);
  const [certifications, setCertifications] = useState<string[]>([""]);
  const [languages, setLanguages] = useState<string[]>([""]);
  const [experiences, setExperiences] = useState<ExperienceState[]>([
    { role: "", company: "", url: "", date: "", details: [""], stacks: [""] },
  ]);

  const table = useReactTable({
    data: mockKeywordData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  const totalPendente = mockKeywordData.filter(
    (item) => item.status === "Pendente"
  ).length;
  const totalAprovado = mockKeywordData.filter(
    (item) => item.status === "Aprovado"
  ).length;

  const handleAddListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, ""]);
  };

  const handleRemoveListItem = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.length > 1) {
      setList(list.filter((_, i) => i !== index));
    }
  };

  const handleUpdateListItem = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const handleAddExperience = () => {
    if (experiences.length < 4) {
      setExperiences([
        ...experiences,
        {
          role: "",
          company: "",
          url: "",
          date: "",
          details: [""],
          stacks: [""],
        },
      ]);
    }
  };

  const handleRemoveExperience = (index: number) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((_, i) => i !== index));
    }
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
                        <Input
                          className="w-full flex-1"
                          placeholder={placeholder}
                        />
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
                      className="sm:min-h-30 xl:min-h-60"
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
                    <h3 className="border-b pb-2 text-lg">
                      Coloque as suas habilidades
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem(skills, setSkills)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Habilidade
                  </Button>
                </div>
                {skills.map((skill, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Skill {index + 1}
                        </FieldLabel>
                        {skills.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem(index, skills, setSkills)
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        className="w-full flex-1"
                        placeholder="Coloque uma habilidade"
                        value={skill}
                        onChange={(e) =>
                          handleUpdateListItem(
                            index,
                            e.target.value,
                            skills,
                            setSkills
                          )
                        }
                      />
                      {skills.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem(index, skills, setSkills)
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
                  </div>
                  {experiences.length < 4 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddExperience}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Experiência
                    </Button>
                  )}
                </div>
                {experiences.map((exp, expIndex) => (
                  <div
                    key={expIndex}
                    className="flex flex-col gap-6 border-b pt-4 pb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h4 className="text-lg font-semibold">
                        Experiência {expIndex + 1}
                      </h4>
                      {experiences.length > 1 && (
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
                            />
                          </div>
                        </Field>
                      )
                    )}
                  </div>
                ))}
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
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem(education, setEducation)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Formação
                  </Button>
                </div>
                {education.map((edu, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Educação {index + 1}
                        </FieldLabel>
                        {education.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem(
                                index,
                                education,
                                setEducation
                              )
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        className="w-full flex-1"
                        placeholder="Coloque a sua formação"
                        value={edu}
                        onChange={(e) =>
                          handleUpdateListItem(
                            index,
                            e.target.value,
                            education,
                            setEducation
                          )
                        }
                      />
                      {education.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem(index, education, setEducation)
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
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 border-b py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Certificações</h2>
                    <h3 className="border-b pb-2 text-lg">
                      Coloque as suas certificações relevantes
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleAddListItem(certifications, setCertifications)
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Certificação
                  </Button>
                </div>
                {certifications.map((cert, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Certificado {index + 1}
                        </FieldLabel>
                        {certifications.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem(
                                index,
                                certifications,
                                setCertifications
                              )
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        className="w-full flex-1"
                        placeholder="Coloque o nome da sua certificação"
                        value={cert}
                        onChange={(e) =>
                          handleUpdateListItem(
                            index,
                            e.target.value,
                            certifications,
                            setCertifications
                          )
                        }
                      />
                      {certifications.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem(
                              index,
                              certifications,
                              setCertifications
                            )
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
            </CardContent>

            <CardContent>
              <div className="flex flex-col gap-6 py-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Idiomas</h2>
                    <h3 className="border-b pb-2 text-lg">
                      Coloque os idiomas que você fala
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddListItem(languages, setLanguages)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Idioma
                  </Button>
                </div>
                {languages.map((lang, index) => (
                  <Field key={index} className="mb-2">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex w-full items-center justify-between sm:w-auto">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Idioma {index + 1}
                        </FieldLabel>
                        {languages.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveListItem(
                                index,
                                languages,
                                setLanguages
                              )
                            }
                            className="h-8 w-8 sm:hidden"
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        className="w-full flex-1"
                        placeholder="Coloque um idioma"
                        value={lang}
                        onChange={(e) =>
                          handleUpdateListItem(
                            index,
                            e.target.value,
                            languages,
                            setLanguages
                          )
                        }
                      />
                      {languages.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleRemoveListItem(index, languages, setLanguages)
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-5 lg:col-span-5">
          <Card className="border-muted shadow-primary/50 shadow-lg">
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-lg">
                ATS Optimization Feedbacks
              </CardTitle>
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
                          readonly
                          value="angular, wordpress, landing pages"
                          className="bg-muted/50 mt-1.5 min-h-[60px] text-xs"
                        />
                      </div>
                      <div>
                        <p className="text-muted-foreground font-semibold">
                          Role target não encontrado:
                        </p>
                        <Textarea
                          readonly
                          value="desenvolvedor frontend"
                          className="bg-muted/50 mt-1.5 min-h-[40px] text-xs"
                        />
                      </div>
                      <div>
                        <p className="text-muted-foreground font-semibold">
                          Palavras do subject ausentes:
                        </p>
                        <Textarea
                          readonly
                          value="desenvolvedor, especialista, angular, focado, criar"
                          className="bg-muted/50 mt-1.5 min-h-[60px] text-xs"
                        />
                      </div>
                      <div>
                        <p className="text-muted-foreground font-semibold">
                          Validação do cargo declarado:
                        </p>
                        <Textarea
                          readonly
                          value="Atenção: O cargo 'frontend developer' informado no formulário não parece estar relacionado à descrição da vaga."
                          className="bg-muted/50 mt-1.5 min-h-[60px] text-xs text-rose-500"
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
                            <TableHead key={header.id} className="pt-2 text-xs">
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
                  <div className="bg-card space-y-3 rounded-lg border p-4">
                    <h3 className="flex items-center gap-1.5 font-semibold text-yellow-500">
                      ⚠️ Verbos Fracos Detectados
                    </h3>
                    <div className="space-y-2">
                      <p className="text-muted-foreground font-semibold">
                        Original:
                      </p>
                      <p className="bg-muted w-fit rounded px-2 py-1 font-mono">
                        ...using...
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground font-semibold">
                        Contexto:
                      </p>
                      <p className="bg-muted/30 rounded border p-2.5 leading-relaxed italic">
                        "Proactive and growth-focused Junior Front-End Developer
                        with solid hands-on experience developing web
                        applications using JavaScript, CSS, HTML, and the React
                        ecosystem."
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-emerald-500">
                        🚀 Sugestões de Verbos de Ação:
                      </p>
                      <div className="flex gap-1.5">
                        <span className="rounded bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500">
                          OPTIMIZED
                        </span>
                        <span className="rounded bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500">
                          IMPLEMENTED
                        </span>
                        <span className="rounded bg-emerald-500/10 px-2 py-1 font-bold text-emerald-500">
                          DEVELOPED
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card space-y-2 rounded-lg border p-4">
                    <h3 className="font-semibold text-rose-500">
                      Palavras Suspeitas Detectadas:
                    </h3>
                    <p className="w-fit rounded bg-rose-500/10 px-3 py-1.5 font-bold text-rose-500">
                      todo, url
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

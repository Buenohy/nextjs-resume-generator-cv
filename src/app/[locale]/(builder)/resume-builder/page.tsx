"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

const STATIC_SECTIONS: FormSection[] = [
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
  {
    id: "resume",
    title: "Resumo Profissional",
    subTitle: "Coloque o seu resumo profissional",
    fields: [
      { id: "resume", label: "resume", placeholder: "Coloque o seu resumo" },
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
    placeholder: "Coloque a data de início e termino Ex: April 2026 - Present",
  },
];

export default function ResumeBuilderPage() {
  const [skills, setSkills] = useState<string[]>([""]);
  const [education, setEducation] = useState<string[]>([""]);
  const [certifications, setCertifications] = useState<string[]>([""]);
  const [languages, setLanguages] = useState<string[]>([""]);

  const [experiences, setExperiences] = useState<ExperienceState[]>([
    { role: "", company: "", url: "", date: "", details: [""], stacks: [""] },
  ]);

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
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
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
      const newExp = experiences.filter((_, i) => i !== index);
      setExperiences(newExp);
    }
  };

  const handleUpdateExperienceField = (
    index: number,
    field: keyof Omit<ExperienceState, "details" | "stacks">,
    value: string
  ) => {
    const newExp = [...experiences];
    newExp[index][field] = value;
    setExperiences(newExp);
  };

  const handleAddDetail = (expIndex: number) => {
    const newExp = [...experiences];
    if (newExp[expIndex].details.length < 3) {
      newExp[expIndex].details.push("");
      setExperiences(newExp);
    }
  };

  const handleRemoveDetail = (expIndex: number, detailIndex: number) => {
    const newExp = [...experiences];
    if (newExp[expIndex].details.length > 1) {
      newExp[expIndex].details = newExp[expIndex].details.filter(
        (_, i) => i !== detailIndex
      );
      setExperiences(newExp);
    }
  };

  const handleUpdateDetail = (
    expIndex: number,
    detailIndex: number,
    value: string
  ) => {
    const newExp = [...experiences];
    newExp[expIndex].details[detailIndex] = value;
    setExperiences(newExp);
  };

  const handleAddStack = (expIndex: number) => {
    const newExp = [...experiences];
    newExp[expIndex].stacks.push("");
    setExperiences(newExp);
  };

  const handleRemoveStack = (expIndex: number, stackIndex: number) => {
    const newExp = [...experiences];
    if (newExp[expIndex].stacks.length > 1) {
      newExp[expIndex].stacks = newExp[expIndex].stacks.filter(
        (_, i) => i !== stackIndex
      );
      setExperiences(newExp);
    }
  };

  const handleUpdateStack = (
    expIndex: number,
    stackIndex: number,
    value: string
  ) => {
    const newExp = [...experiences];
    newExp[expIndex].stacks[stackIndex] = value;
    setExperiences(newExp);
  };

  return (
    <div className="p-3 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Resume Builder</h1>
      <Card className="shadow-primary/50 border-muted shadow-lg">
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
          <CardDescription>
            Gere um currículo a partir do conteúdo abaixo.
          </CardDescription>
        </CardHeader>

        {STATIC_SECTIONS.map((section) => (
          <CardContent key={section.id}>
            <div className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <h3 className="border-b pb-2 text-lg">{section.subTitle}</h3>
              </div>

              {/* Dynamic Header, Links and Resume */}
              {section.fields.map(({ id: fieldId, label, placeholder }) => (
                <Field key={fieldId} className="mb-4">
                  <div className="flex w-full items-center gap-4">
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

        {/* Dynamic Skills */}
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
                <div className="flex w-full items-center gap-4">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    Skill {index + 1}
                  </FieldLabel>
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
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Field>
            ))}
          </div>
        </CardContent>

        {/* Dynamic Experiences */}
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
                  {experiences.length}/4
                </p>
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
                <div className="flex items-center justify-between">
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
                      <div className="flex w-full items-center gap-4">
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

                {/* Sub-section: Dynamic Details */}
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
                        <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Detalhe
                      </Button>
                    )}
                  </div>

                  {exp.details.map((detail, detailIndex) => (
                    <Field key={detailIndex} className="mb-2">
                      <div className="flex w-full items-center gap-4">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Detalhe {detailIndex + 1}
                        </FieldLabel>
                        <Input
                          className="w-full flex-1"
                          placeholder={`Coloque a descrição sobre o projeto ${detailIndex + 1}`}
                          value={detail}
                          onChange={(e) =>
                            handleUpdateDetail(
                              expIndex,
                              detailIndex,
                              e.target.value
                            )
                          }
                        />
                        {exp.details.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveDetail(expIndex, detailIndex)
                            }
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Field>
                  ))}
                </div>

                {/* Sub-section: Dynamic Stacks */}
                <div className="border-muted my-2 flex flex-col gap-4 border-l-2 pl-6">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h5 className="text-sm font-semibold">
                        Tecnologias (Stacks)
                      </h5>
                      <p className="text-muted-foreground text-xs">
                        Adicione as tecnologias utilizadas nesta experiência
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleAddStack(expIndex)}
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Adicionar Stack
                    </Button>
                  </div>

                  {exp.stacks.map((stack, stackIndex) => (
                    <Field key={stackIndex} className="mb-2">
                      <div className="flex w-full items-center gap-4">
                        <FieldLabel className="w-20 min-w-20 shrink-0 text-left text-xs font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                          Stack {stackIndex + 1}
                        </FieldLabel>
                        <Input
                          className="w-full flex-1"
                          placeholder="Ex: React, Node.js, TypeScript"
                          value={stack}
                          onChange={(e) =>
                            handleUpdateStack(
                              expIndex,
                              stackIndex,
                              e.target.value
                            )
                          }
                        />
                        {exp.stacks.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveStack(expIndex, stackIndex)
                            }
                          >
                            <Trash2 className="text-destructive h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Field>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        {/* Dynamic Education */}
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
                <div className="flex w-full items-center gap-4">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    Educação {index + 1}
                  </FieldLabel>
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
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Field>
            ))}
          </div>
        </CardContent>

        {/* Dynamic Certifications */}
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
                <div className="flex w-full items-center gap-4">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    Certificado {index + 1}
                  </FieldLabel>
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
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Field>
            ))}
          </div>
        </CardContent>

        {/* Dynamic Languages */}
        <CardContent>
          <div className="flex flex-col gap-6 border-b py-4">
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
                <div className="flex w-full items-center gap-4">
                  <FieldLabel className="w-20 min-w-20 shrink-0 text-left font-medium whitespace-nowrap capitalize sm:w-28 sm:min-w-28">
                    Idioma {index + 1}
                  </FieldLabel>
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
                    >
                      <Trash2 className="text-destructive h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Field>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
              <Button>Gerar currículo</Button>
            </CardAction>
          </div>
          <ButtonPaginate />
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

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

const experienceFields: FormField[] = [
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
  {
    id: "details1",
    label: "details",
    placeholder: "Coloque a descrição sobre o projeto 1",
  },
  {
    id: "details2",
    label: "details",
    placeholder: "Coloque a descrição sobre o projeto 2",
  },
  {
    id: "details3",
    label: "details",
    placeholder: "Coloque a descrição sobre o projeto 3",
  },
  {
    id: "stacks",
    label: "stacks",
    placeholder: "Coloque as stacks usadas na empresa",
  },
];

export const ResumeData: FormSection[] = [
  // {/* Header */}
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

  // {/* Links Profissionais */}
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

  // {/* Resumo Profissional */}
  {
    id: "resume",
    title: "Resumo Profissional",
    subTitle: "Coloque o seu resumo profissional",
    fields: [
      { id: "resume", label: "resume", placeholder: "Coloque o seu resumo" },
    ],
  },

  // {/* Habilidades */}
  {
    id: "skills",
    title: "Habilidades",
    subTitle: "Coloque as suas habilidades",
    fields: [
      {
        id: "skills",
        label: "skills",
        placeholder: "Coloque as suas habilidades",
      },
    ],
  },

  // {/* Experiências (1 a 4) */}
  {
    id: "exp1",
    title: "Experiência 1",
    subTitle: "Crie uma nova experiência 1",
    fields: experienceFields,
  },
  {
    id: "exp2",
    title: "Experiência 2",
    subTitle: "Crie uma nova experiência 2",
    fields: experienceFields,
  },
  {
    id: "exp3",
    title: "Experiência 3",
    subTitle: "Crie uma nova experiência 3",
    fields: experienceFields,
  },
  {
    id: "exp4",
    title: "Experiência 4",
    subTitle: "Crie uma nova experiência 4",
    fields: experienceFields,
  },

  // {/* Educação */}
  {
    id: "education",
    title: "Educação",
    subTitle: "Coloque a sua formação",
    fields: [
      {
        id: "education",
        label: "education",
        placeholder: "Coloque a sua formação",
      },
    ],
  },

  // {/* Certificações */}
  {
    id: "certifications",
    title: "Certificações",
    subTitle: "Coloque as suas certificações",
    fields: [
      {
        id: "certification",
        label: "certification",
        placeholder: "Coloque a sua certificação",
      },
    ],
  },

  // {/* Idiomas */}
  {
    id: "languages",
    title: "Idiomas",
    subTitle: "Coloque os idiomas que você fala",
    fields: [
      {
        id: "languages",
        label: "languages",
        placeholder: "Coloque os idiomas",
      },
    ],
  },
];

export default function ResumeBuilderPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Resume Builder</h1>
      <Card className="shadow-primary/50 border-muted shadow-lg">
        <ButtonPaginate />
        <CardHeader>
          <CardTitle>Resume Builder</CardTitle>
          <CardDescription>
            Gere um currículo a partir do conteúdo abaixo.
          </CardDescription>
        </CardHeader>

        {ResumeData.map((section) => (
          <CardContent key={section.id}>
            <div className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <h3 className="border-b pb-2 text-lg">{section.subTitle}</h3>
              </div>

              {section.fields.map(({ id: fieldId, label, placeholder }) => (
                <Field key={fieldId} className="mb-4">
                  <div className="flex w-full items-center gap-4">
                    <FieldLabel className="w-18.75 min-w-18.75 shrink-0 text-left font-medium capitalize">
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

        <CardFooter className="pt-6">
          <CardAction>
            <Button>Gerar currículo</Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}

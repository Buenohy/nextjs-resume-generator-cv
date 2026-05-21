import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Field,
  FieldLabel,
} from "@/components/ui/field"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Header {
  id: string
  title: string
  subTitle: string
  fields: {
    id: string
    label: string
    placeholder: string
  }[]
}

export const HeaderExperience: Header[] = [
  {
    id: "1",
    title: "Header",
    subTitle: "Coloque os dados",
    fields: [
      {
        id: "1",
        label: "name",
        placeholder: "Coloque o seu nome",
      },
      {
        id: "2",
        label: "role",
        placeholder: "Coloque o cargo desejado",
      },
      {
        id: "3",
        label: "city",
        placeholder: "Coloque a sua cidade e a sigla",
      },
      {
        id: "4",
        label: "age",
        placeholder: "Coloque a sua idade",
      },
    ]
  },
]

interface Link {
  id: string
  title: string
  subTitle: string
  links: {
    linkedin: string
    phone: string
    webSite: string
    email: string
    github: string
  }
  placeholder?: string
}

export const LinkExperience: Link[] = [
  {
    id: "1",
    title: "Links Profissionais",
    subTitle: "Coloque os seus links",
    links: {
      linkedin: "linkedin",
      phone: "phone",
      webSite: "web site",
      email: "email",
      github: "github",
    },
  },
]

interface Resume {
  id: string
  title: string
  subTitle: string
  resume: string
  placeholder: string
}

export const ResumeExperience: Resume[] = [
  {
    id: "1",
    title: "Resumo Profissional",
    subTitle: "Coloque o seu resumo profissional",
    resume: "resume",
    placeholder: "Coloque o seu resumo",
  },
]

interface Skills {
  id: string
  title: string
  subTitle: string
  skills: string
  placeholder: string
}

export const SkillsExperience: Skills[] = [
  {
    id: "1",
    title: "Habilidades",
    subTitle: "Coloque as suas habilidades",
    skills: "skills",
    placeholder: "Coloque as suas habilidades",
  },
]

interface Title {
  id: string
  title: string
  subTitle: string
}

export const TitleExperience: Title[] = [
  {
    id: "1",
    title: "Experiência 1",
    subTitle: "Crie uma nova experiência 1",
  },
  {
    id: "2",
    title: "Experiência 2",
    subTitle: "Crie uma nova experiência 2",
  },
  {
    id: "3",
    title: "Experiência 3",
    subTitle: "Crie uma nova experiência 3",
  },
  {
    id: "4",
    title: "Experiência 4",
    subTitle: "Crie uma nova experiência 4",
  },
]

interface Create {
  id: string
  title?: string
  placeholder: string
}

export const CreateExperience: Create[] = [
  {
    id: "1",
    title: "role",
    placeholder: "Coloque a função que você exerceu na empresa",
  },
  {
    id: "2",
    title: "company",
    placeholder: "Coloque o nome da empresa",
  },
  {
    id: "3",
    title: "url",
    placeholder: "Coloque o url do deploy do projeto",
  },
  {
    id: "4",
    title: "date",
    placeholder: "Coloque a data de início e termino Ex: April 2026 - Present",
  },
  {
    id: "5",
    title: "details",
    placeholder: "Coloque a descrição sobre o projeto 1",
  },
  {
    id: "6",
    placeholder: "Coloque a descrição sobre o projeto 2",
  },
  {
    id: "7",
    placeholder: "Coloque a descrição sobre o projeto 3",
  },
  {
    id: "8",
    title: "stacks",
    placeholder: "Coloque as stacks usadas na empresa",
  },
]

interface CreateEducation {
  id: string
  title: string
  subTitle: string
  education: string
  placeholder: string
}

export const EducationExperience: CreateEducation[] = [
  {
    id: "1",
    title: "Educação",
    subTitle: "Coloque a sua formação",
    education: "education",
    placeholder: "Coloque a sua formação",
  },
]

interface CreateCertifications {
  id: string
  title: string
  subTitle: string
  education: string
  placeholder: string
}

export const CertificationsExperience: CreateCertifications[] = [
  {
    id: "1",
    title: "Certificações",
    subTitle: "Coloque as suas certificações",
    education: "certification",
    placeholder: "Coloque a sua certificação",
  },
]

interface CreateLanguages {
  id: string
  title: string
  subTitle: string
  education: string
  placeholder: string
}

export const LanguegesExperience: CreateLanguages[] = [
  {
    id: "1",
    title: "Idiomas",
    subTitle: "Coloque os idiomas que você fala",
    education: "languages",
    placeholder: "Coloque os idiomas",
  },
]

export default function ContentEnUsPage() {
  const friendlyLinkNames: Record<string, string> = {
    linkedin: "LinkedIn",
    phone: "Telefone",
    webSite: "Site",
    email: "E-mail",
    github: "GitHub",
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content En Us Page</h1>
      <Card className="shadow-primary/50 shadow-lg border-muted">
        <CardHeader>
          <CardTitle>Content En Us</CardTitle>
          <CardDescription>
            Gere um currículo a partir do conteúdo abaixo.
          </CardDescription>
        </CardHeader>

        {/* Header */}
        <CardContent>
          {HeaderExperience.map(({ id, title, subTitle, fields }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              {fields.map(({ id: fieldId, label, placeholder }) => (
                <Field key={fieldId} className="mb-4">
                  <div className="flex w-full items-center gap-4">
                    <FieldLabel className="w-18.75 min-w-18.75 shrink-0 font-medium text-left capitalize">
                      {label}
                    </FieldLabel>
                    <Input
                      className="flex-1 w-full"
                      placeholder={placeholder}
                    />
                  </div>
                </Field>
              ))}
            </div>
          ))}
        </CardContent>

        {/* Links Profissionais */}
        <CardContent>
          {LinkExperience.map(({ id, title, subTitle, links }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>

              {Object.entries(links).map(([key, value]) => {
                const friendlyName = friendlyLinkNames[key] || value
                return (
                  <div key={key} className="flex gap-4 items-start">
                    <h2 className="w-24 mt-2 font-medium capitalize">
                      {friendlyName}
                    </h2>
                    <Textarea
                      className="flex-1"
                      placeholder={`Coloque o link do seu ${friendlyName}`}
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </CardContent>

        {/* Resumo Profissional */}
        <CardContent>
          {ResumeExperience.map(({ id, title, subTitle, resume, placeholder }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              <div className="flex gap-4 items-start">
                <h2 className="w-24 mt-2 font-medium">{resume}</h2>
                <Textarea className="flex-1" placeholder={placeholder} />
              </div>
            </div>
          ))}
        </CardContent>

        {/* Habilidades */}
        <CardContent>
          {SkillsExperience.map(({ id, title, subTitle, skills, placeholder }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              <div className="flex gap-4 items-start">
                <h2 className="w-24 mt-2 font-medium">{skills}</h2>
                <Textarea className="flex-1" placeholder={placeholder} />
              </div>
            </div>
          ))}
        </CardContent>

        {/* Experiências (Título + campos dinâmicos) */}
        <CardContent>
          {TitleExperience.map(({ id, title, subTitle }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              {CreateExperience.map(
                ({ id: createId, title: createTitle, placeholder }) => (
                  <div key={createId} className="flex gap-4 items-start">
                    <h2 className="w-24 mt-2 font-medium capitalize">
                      {createTitle || "Descrição"}
                    </h2>
                    <Textarea className="flex-1" placeholder={placeholder} />
                  </div>
                )
              )}
            </div>
          ))}
        </CardContent>

        {/* Educação */}
        <CardContent>
          {EducationExperience.map(({ id, title, subTitle, education, placeholder }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              <div className="flex gap-4 items-start">
                <h2 className="w-24 mt-2 font-medium">{education}</h2>
                <Textarea className="flex-1" placeholder={placeholder} />
              </div>
            </div>
          ))}
        </CardContent>

        {/* Certificações */}
        <CardContent>
          {CertificationsExperience.map(
            ({ id, title, subTitle, education, placeholder }) => (
              <div key={id} className="flex flex-col gap-6 border-b py-4">
                <div>
                  <h2 className="text-xl font-semibold">{title}</h2>
                  <h3 className="text-lg border-b pb-2">{subTitle}</h3>
                </div>
                <div className="flex gap-4 items-start">
                  <h2 className="w-24 mt-2 font-medium">{education}</h2>
                  <Textarea className="flex-1" placeholder={placeholder} />
                </div>
              </div>
            )
          )}
        </CardContent>

        {/* Idiomas */}
        <CardContent>
          {LanguegesExperience.map(({ id, title, subTitle, education, placeholder }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              <div className="flex gap-4 items-start">
                <h2 className="w-24 mt-2 font-medium">{education}</h2>
                <Textarea className="flex-1" placeholder={placeholder} />
              </div>
            </div>
          ))}
        </CardContent>

        <Button>Gerar currículo</Button>
        <CardFooter />
      </Card>
    </div>
  )
}
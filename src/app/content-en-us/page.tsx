import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Textarea } from "@/components/ui/textarea"

interface Title {
  id: string,
  title: string,
  subTitle: string
}

export const TitleExperience: Title[] = [
  {
    id: "1",
    title: "Experiência 1",
    subTitle: "Crie uma nova experiência 1"
  },
  {
    id: "2",
    title: "Experiência 2",
    subTitle: "Crie uma nova experiência 2" 
  },
  {
    id: "3",
    title: "Experiência 3",
    subTitle: "Crie uma nova experiência 3"
  },
  {
    id: "4",
    title: "Experiência 4",
    subTitle: "Crie uma nova experiência 4"
  },
]

interface Create {
  id: string,
  title?: string,
  placeholder: string,
}

export const CreateExperience: Create[] = [
  {
    id: "1",
    title: "role",
    placeholder: "Coloque a função que você exerceu na empresa"
  },
  {
    id: "2",
    title: "company",
    placeholder: "Coloque o nome da empresa"
  },
  {
    id: "3",
    title: "url",
    placeholder: "Coloque o url do deploy do projeto"
  },
  {
    id: "4",
    title: "date",
    placeholder: "Coloque a data de início e termino Ex: April 2026 - Present"
  },
  {
    id: "5",
    title: "details",
    placeholder: "Coloque a descrição sobre o projeto 1"
  },
  {
    id: "6",
    placeholder: "Coloque a descrição sobre o projeto 2"
  },
  {
    id: "7",
    placeholder: "Coloque a descrição sobre o projeto 3"
  },
  {
    id: "8",
    title: "stacks",
    placeholder: "Coloque as stacks usadas na empresa"
  },
]

interface CreateEducation {
  id: string,
  title: string,
  subTitle: string,
  education: string,
  placeholder: string
}

export const EducationExperience: CreateEducation[] = [
  {
    id: "1",
    title: "Educação",
    subTitle: "Coloque a sua formação",
    education: "education",
    placeholder: "Coloque a sua formação"
  }
]

interface CreateCertifications {
  id: string,
  title: string,
  subTitle: string,
  education: string,
  placeholder: string
}

export const CertificationsExperience: CreateCertifications[] = [
  {
    id: "1",
    title: "Certificações",
    subTitle: "Coloque as suas certificações",
    education: "certification",
    placeholder: "Coloque a sua certificação"
  }
]

export default function ContentEnUsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content En Us Page</h1>
      <Card className="shadow-primary/50 shadow-lg border-muted">
        <CardHeader>
          <CardTitle>Content En Us</CardTitle>
          <CardDescription>Gere um currículo apartir do conteúdo abaixo.</CardDescription>
        </CardHeader>

        <CardContent>
          {TitleExperience.map(({ id, title, subTitle }) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>
              {CreateExperience.map(({ id: createId, title: createTitle, placeholder }) => (
                <div key={createId} className="flex gap-4 items-start">
                  <h2 className="w-24 mt-2 font-medium">{createTitle}</h2>
                  <Textarea className="flex-1" placeholder={placeholder} />
                </div>
              ))}
            </div>
          ))}
        </CardContent>

        <CardContent>
          {EducationExperience.map(({id, title, subTitle, education, placeholder}) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>

              <div key={null} className="flex gap-4 items-start">
                <h2 className="w-24 mt-2 font-medium">{education}</h2>
                <Textarea className="flex-1" placeholder={placeholder} />
              </div>
            </div>
          ))}
        </CardContent>

        <CardContent>
          {CertificationsExperience.map(({id, title, subTitle, education, placeholder}) => (
            <div key={id} className="flex flex-col gap-6 border-b py-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <h3 className="text-lg border-b pb-2">{subTitle}</h3>
              </div>

              <div key={null} className="flex gap-4 items-start">
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
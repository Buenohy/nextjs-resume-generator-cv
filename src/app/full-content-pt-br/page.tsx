import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

import { Textarea } from "@/components/ui/textarea"

interface Rows  {
  id: string,
  title: string
}

export const rows :Rows[] = [
  {
    id: "1",
    title: "Experiência"
  },
  {
    id: "2",
    title: "Dados"
  }
]

interface Columns  {
  id: string,
  title: string
}

export const columns :Columns[] = [
  {
    id: "1",
    title: "role"
  },
  {
    id: "2",
    title: "company"
  },
  {
    id: "3",
    title: "url"
  },
  {
    id: "4",
    title: "date"
  },
  {
    id: "5",
    title: "details"
  },
  {
    id: "6",
    title: "stacks"
  },
]

interface ExperienceData  {
  id: string,
  role: string,
  company: string,
  deployUrl: string,
  date: string,
  details1: string,
  details2: string,
  details3: string,
  stacks: string
}

export const data :ExperienceData[] = [
  {
    id: "1", 
    role: "Developer Frontend", 
    company: "Gallery Plus",
    deployUrl: "https://bueno-gallery-plus.vercel.app/",
    date: "April 2026 - Present",
    details1: "Developed the gallery's caching and dynamic filtering architecture, optimizing image loading and enabling state persistence via URL search parameters by integrating TanStack React Query with the Nuqs library.",
    details2: "Optimized backend API consumption (hosted on Railway), significantly reducing excessive network requests and improving search performance by implementing a custom debounce algorithm using React Hooks.",
    details3: "Guaranteed data integrity and request safety during photo uploads and album creation by implementing robust schema validations using Zod and inferring strict static typing with TypeScript.",
    stacks: "React, TypeScript, Tailwind CSS, TanStack Query (React Query), Nuqs, Zod, React Router, Vite",
  },
]

export default function FullContentPtBrPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Full Content Pt Br Page</h1>
      <Card className="shadow-primary/50 shadow-lg border-muted">
        <CardHeader>
          <CardTitle>Full Content Pt Br</CardTitle>
          <CardDescription>Todo o conteúdo do currículo Pt Br</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold border-b pb-2">Experience</h2>
          
          <div className="flex gap-4 items-start">
            <h2 className="w-24 mt-2 font-medium">role</h2>
            <Textarea placeholder="Coloque a função que você exerceu na empresa" className="flex-1" />
          </div>
          <div className="flex gap-4 items-start">
            <h2 className="w-24 mt-2 font-medium">company</h2>
            <Textarea placeholder="Coloque o nome da empresa" className="flex-1" />
          </div>
          <div className="flex gap-4 items-start">
            <h2 className="w-24 mt-2 font-medium">url</h2>
            <Textarea placeholder="Coloque o url do deploy do projeto" className="flex-1" />
          </div>
          <div className="flex gap-4 items-start">
            <h2 className="w-24 mt-2 font-medium">date</h2>
            <Textarea placeholder="Coloque a data de início e termino Ex: April 2026 - Present" className="flex-1" />
          </div>
          <div className="flex gap-4 items-start">
            <h2 className="w-24 mt-2 font-medium">details</h2>
            <div className="flex flex-col gap-3 flex-1 w-full">
              <Textarea placeholder="Coloque a descrição sobre o projeto 1" />
              <Textarea placeholder="Coloque a descrição sobre o projeto 2" />
              <Textarea placeholder="Coloque a descrição sobre o projeto 3" />
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <h2 className="w-24 mt-2 font-medium">stacks</h2>
            <Textarea placeholder="Coloque as stacks usadas na empresa" className="flex-1" />
          </div>
          <Button>Adicionar nova experiência</Button>
        </CardContent>

        <CardContent>
          <div className="flex flex-col gap-4">
            {data.map(({id, company}) => (
              <div key={id} className="flex flex-col gap-1">
                <CardTitle>{company}</CardTitle>
                <CardDescription>{`Descrição de quando eu trabalhei na empresa ${company}`}</CardDescription>
              </div>
            ))}
          </div>
          <div className="rounded-md border border-muted mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {rows.map(({id, title}) => (
                    <TableHead key={id} className="w-25">{title}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">role</TableCell>
                  <TableCell>Developer Frontend</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">company</TableCell>
                  <TableCell>Gallery Plus</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">url</TableCell>
                  <TableCell className="text-blue-400 hover:underline">
                    <a href="https://bueno-gallery-plus.vercel.app/" target="_blank" rel="noreferrer">
                      https://bueno-gallery-plus.vercel.app/
                    </a>
                  </TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">date</TableCell>
                  <TableCell>April 2026 - Present</TableCell>
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium align-top pt-4">details</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-4 text-wrap leading-relaxed py-2">
                      <p>
                        • Developed the gallery's caching and dynamic filtering architecture, optimizing image loading and enabling state persistence via URL search parameters by integrating TanStack React Query with the Nuqs library.
                      </p>
                      <p>
                        • Optimized backend API consumption (hosted on Railway), significantly reducing excessive network requests and improving search performance by implementing a custom debounce algorithm using React Hooks.
                      </p>
                      <p>
                        • Guaranteed data integrity and request safety during photo uploads and album creation by implementing robust schema validations using Zod and inferring strict static typing with TypeScript.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">stacks</TableCell>
                  <TableCell>React, TypeScript, Tailwind CSS, TanStack Query (React Query), Nuqs, Zod, React Router, Vite</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
              </TableFooter>
            </Table>
          </div>
        </CardContent>

        <CardFooter>
        </CardFooter>
      </Card>
    </div>
  )
}
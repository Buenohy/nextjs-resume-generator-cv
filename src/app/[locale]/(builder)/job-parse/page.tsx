"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";

import ButtonPaginate from "@/components/button-paginate";

export default function JobParsePage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Job Parse</h1>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>Job Parse</CardTitle>
          <CardDescription>Está faltando no seu currículo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <h1>Inconsistências entre meta_ats e a vaga</h1>
          <h2>Keywords ausentes na vaga:</h2>
          <Textarea placeholder="Keywords ausentes na vaga:" />
          <h2>Role target não encontrado:</h2>
          <Textarea placeholder="Role target encontrado:" />
          <h2>Palavras do subject ausentes</h2>
          <Textarea placeholder="Palavras do subject ausentes" />
          <h2>Validando cargo declarado (info.role: frontend developer)...</h2>
          <Textarea placeholder="Atenção: O cargo 'frontend developer' informado no YAML não parece estar relacionado à descrição da vaga." />
        </CardContent>
        <CardFooter>
          <ButtonPaginate />
        </CardFooter>
      </Card>
    </div>
  );
}

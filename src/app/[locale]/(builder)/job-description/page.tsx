"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { useRouter } from "next/navigation";

export default function JobDescriptionPage() {
  const router = useRouter();

  const handleNextStep = () => {
    router.push("/resume-builder");
  };
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Job Description</h1>
      <Card className="shadow-primary/50 shadow-lg">
        <div className="flex items-center justify-end px-6">
          <CardAction>
            <Button onClick={handleNextStep}>Dados Currículo</Button>
          </CardAction>
        </div>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Coloque os detalhes da vaga abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Cole a descrição completa da vaga do Wellfound aqui..." />
        </CardContent>
        <CardFooter>
          <Button>Enviar descrição da vaga</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

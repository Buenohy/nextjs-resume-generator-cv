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
    <div>
      <div>Job Description Page</div>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Coloque os detalhes da vaga abaixo</CardDescription>
          <CardAction>
            <Button onClick={handleNextStep}>Dados Currículo</Button>
          </CardAction>
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

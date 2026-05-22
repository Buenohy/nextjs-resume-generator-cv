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

  const handleBackStep = () => {
    router.push("/resume-builder");
  };

  const handleNextStep = () => {
    router.push("/resume-builder");
  };
  return (
    <div>
      <div>Job Description Page</div>
      <Card className="shadow-primary/50 shadow-lg">
        <div className="flex items-center justify-between px-6">
          <CardAction>
            <Button disabled onClick={handleBackStep}>
              Dados Currículo
            </Button>
          </CardAction>
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

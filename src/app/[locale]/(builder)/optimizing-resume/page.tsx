"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function OptimizingResumePage() {
  const router = useRouter();

  const handleBackStep = () => {
    router.push("/match-ats");
  };

  const handleNextStep = () => {
    router.push("/pdf-preview");
  };
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Optimizing Resume</h1>
      <Card className="shadow-primary/50 shadow-lg">
        <div className="flex items-center justify-between px-6">
          <CardAction>
            <Button onClick={handleBackStep}>Otimizar Currículo</Button>
          </CardAction>
          <CardAction>
            <Button onClick={handleNextStep}>Exportar Currículo</Button>
          </CardAction>
        </div>
        <CardHeader>
          <CardTitle>Optimizing Resume</CardTitle>
          <CardDescription>
            Otimizando verbos e linguagem do currículo...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <h2>⚠️ [VERBO FRACO] em Resumo (Summary)</h2>
          <h3>Original:</h3>
          <h4>'...using...'</h4>
          <h2>Contexto:</h2>
          <h3>
            "Proactive and growth-focused Junior Front-End Developer with solid
            hands-on experience developing web applications using JavaScript,
            CSS, HTML, and the React ecosystem."
          </h3>
          <h2>🚀 Sugestão ATS:</h2>
          <h3>['OPTIMIZED', 'IMPLEMENTED', 'DEVELOPED']</h3>
          <h2>Palavras Suspeitas:</h2>
          <h2 className="text-destructive">todo, url </h2>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

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

  const handleNextStep = () => {
    router.push("/pdf-preview");
  };
  return (
    <div>
      <div>Optimizing Resume Page</div>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>Optimizing Resume</CardTitle>
          <CardDescription>
            Otimizando verbos e linguagem do currículo...
          </CardDescription>
          <CardAction>
            <Button onClick={handleNextStep}>Exportar Currículo</Button>
          </CardAction>
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

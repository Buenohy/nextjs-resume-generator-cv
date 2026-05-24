"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useResumeStore } from "@/store/useResumeStore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function JobDescriptionPage() {
  const router = useRouter();
  const globalJobText = useResumeStore((state) => state.jobText);
  const setGlobalJobText = useResumeStore((state) => state.setJobText);

  const [localText, setLocalText] = useState(globalJobText);

  const handleSubmit = () => {
    setGlobalJobText(localText);
    router.push("/resume-builder");
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Job Description</h1>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Coloque os detalhes da vaga abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Cole a descrição completa da vaga do Wellfound aqui..."
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            className="sm:min-h-62.5"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
              <Button onClick={handleSubmit} disabled={!localText.trim()}>
                Enviar descrição da vaga
              </Button>
            </CardAction>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

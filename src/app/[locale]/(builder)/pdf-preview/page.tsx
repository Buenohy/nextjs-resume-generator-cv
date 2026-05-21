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

export default function PdfPreviewPage() {
  const router = useRouter();

  const handleNextStep = () => {
    router.push("/pdf-preview");
  };
  return (
    <div>
      <div>Pdf Preview Page</div>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>Pdf Preview</CardTitle>
          <CardDescription>Baixe o pdf do seu currículo...</CardDescription>
          <CardAction>
            <Button onClick={handleNextStep}>Exportar Currículo</Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5"></CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

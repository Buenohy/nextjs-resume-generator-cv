"use client";

import ButtonPaginate from "@/components/button-paginate";
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
  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Job Description</h1>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>Coloque os detalhes da vaga abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Cole a descrição completa da vaga do Wellfound aqui..." />
        </CardContent>
        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
              <Button>Enviar descrição da vaga</Button>
            </CardAction>
          </div>
          <ButtonPaginate />
        </CardFooter>
      </Card>
    </div>
  );
}

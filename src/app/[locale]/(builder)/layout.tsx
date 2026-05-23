import ButtonPaginate from "@/components/button-paginate";
import { Stepper } from "@/components/stepper";
import { Card, CardFooter } from "@/components/ui/card";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 min-h-screen pt-8 pb-12">
      <div className="mx-auto max-w-5xl sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Gerador de Currículo ATS
          </h1>
          <p className="text-muted-foreground">
            Siga os passos abaixo para analisar e otimizar seu currículo para a
            vaga.
          </p>
        </div>

        <div className="mb-12">
          <Stepper />
        </div>

        <Card className="border-muted bg-background shadow-primary/5 p-3 shadow-lg sm:p-6">
          {children}
          <CardFooter className="flex flex-col gap-6">
            <ButtonPaginate />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

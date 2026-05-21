import { Stepper } from "@/components/stepper";
import { Card } from "@/components/ui/card";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 min-h-screen pt-8 pb-12">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Cabeçalho do App */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Gerador de Currículo ATS
          </h1>
          <p className="text-muted-foreground">
            Siga os passos abaixo para analisar e otimizar seu currículo para a
            vaga.
          </p>
        </div>

        {/* Componente Stepper */}
        <div className="mb-12">
          <Stepper />
        </div>

        {/* Container Central (Onde as páginas vão renderizar) */}
        <Card className="border-muted bg-background shadow-primary/5 min-h-125 p-0 shadow-lg">
          {children}
        </Card>
      </div>
    </div>
  );
}

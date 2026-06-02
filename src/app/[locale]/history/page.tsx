import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
// IMPORTAÇÃO CORRETA PARA COMPONENTES DE SERVIDOR (SERVER COMPONENTS)
import { getTranslations } from "next-intl/server";
import { HistoryTable } from "@/components/sections/ui/history-table";

// Força o Next.js a sempre buscar dados frescos do Postgres a cada carregamento, sem cache estático
export const revalidate = 0;

export default async function HistoryPage() {
  // CORRIGIDO: Usa getTranslations com await para ler as chaves de tradução de forma assíncrona no servidor
  const t = await getTranslations("FullContentPage");

  let historyItems = [];

  try {
    // Busca os dados diretamente do nosso NestJS/PostgreSQL antes da página carregar
    const res = await fetch("http://localhost:3001/history", {
      cache: "no-store",
    });

    if (res.ok) {
      historyItems = await res.json();
    }
  } catch (error) {
    console.error(
      "Erro ao carregar histórico do banco de dados no Server Component:",
      error
    );
  }

  return (
    <div className="container mx-auto min-h-screen p-6">
      <h1 className="mb-6 text-2xl font-bold">Histórico de Otimizações</h1>
      <Card className="shadow-primary/50 mx-auto w-full shadow-lg">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Currículos Otimizados</CardTitle>
            <CardDescription>
              Visualize todos os currículos criados e salvos permanentemente no
              seu banco de dados.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* 
            Renders the new dynamic history table, passing the database records 
          */}
          <div className="border-muted overflow-hidden rounded-md border shadow-sm">
            <HistoryTable
              historyItems={historyItems}
              emptyMessage="Nenhum currículo otimizado no histórico."
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6" />
      </Card>
    </div>
  );
}

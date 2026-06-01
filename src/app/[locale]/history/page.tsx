import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function HistoryPage() {
  const t = useTranslations("HistoryPage");
  return (
    <div className="container mx-auto min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Card className="shadow-primary/50 mx-auto w-full shadow-lg">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>{t("cardTitle")}</CardTitle>
            <CardDescription>{t("cardDescription")}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="bg-card h-50 overflow-hidden rounded-lg border p-1 shadow-sm sm:h-100">
            History Page
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction></CardAction>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useTranslations } from "next-intl";
import PaginationButtons from "@/components/pagination-buttons";
import { Stepper } from "@/components/stepper";
import { Card, CardFooter } from "@/components/ui/card";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("BuilderLayout");

  return (
    <div className="bg-muted/30 rounded-[20px] py-6">
      <div className="mx-auto max-w-7xl sm:px-6">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mb-12">
          <Stepper />
        </div>

        <Card className="border-muted bg-background shadow-primary/5 p-2.5 shadow-lg sm:p-5">
          {children}
          <CardFooter className="flex flex-col gap-6">
            <PaginationButtons />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

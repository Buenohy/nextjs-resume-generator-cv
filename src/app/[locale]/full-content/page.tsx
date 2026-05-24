import { useTranslations } from "next-intl";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExperienceSectionFullContent } from "@/components/sections/experience-section-full-content";

export default function FullContentPage() {
  const t = useTranslations("FullContentPage");

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Card className="shadow-primary/50 border-muted shadow-lg">
        <CardHeader>
          <CardTitle>{t("cardTitle")}</CardTitle>
          <CardDescription>{t("cardDescription")}</CardDescription>
        </CardHeader>

        <ExperienceSectionFullContent />
      </Card>
    </div>
  );
}

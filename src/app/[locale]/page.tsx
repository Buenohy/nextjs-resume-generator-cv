import ButtonPaginate from "@/components/pagination-buttons";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="bg-background flex min-h-screen items-center justify-center font-sans">
      <main className="flex h-screen w-full flex-col items-center justify-center overflow-hidden p-4 sm:items-start">
        <div>{t("title")}</div>
        <ButtonPaginate />
      </main>
    </div>
  );
}

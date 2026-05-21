import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white p-4 sm:items-start">
        <div>{t("title")}</div>
      </main>
    </div>
  );
}

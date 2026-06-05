"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { useTranslations } from "next-intl";

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
import { Skeleton } from "@/components/ui/skeleton";

export default function JobDescriptionPage() {
  const router = useRouter();
  const t = useTranslations("JobDescriptionPage");

  // USAMOS APENAS O ESTADO GLOBAL AGORA
  const globalJobText = useResumeStore((state) => state.jobText);
  const setGlobalJobText = useResumeStore((state) => state.setJobText);

  const globalPlatformText = useResumeStore((state) => state.platformText);
  const setGlobalPlatformText = useResumeStore(
    (state) => state.setPlatformText
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    // Como os dados já estão salvos globalmente a cada digitação,
    // o submit agora apenas avança a página.
    router.push("/resume-builder");
  };

  if (!isMounted) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-64" />
        <Card className="shadow-primary/50 shadow-lg">
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-56 sm:w-80" />
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-[60px] w-full rounded-md" />
            </div>
            <div className="flex flex-col gap-2 border-t pt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[120px] w-full rounded-md sm:h-[250px]" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6">
            <div className="flex w-full justify-center">
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Card className="shadow-primary/50 shadow-lg">
        <CardHeader>
          <CardTitle>{t("cardTitle")}</CardTitle>
          <CardDescription>{t("cardDescription")}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* CAMPO 1: PLATAFORMA DA VAGA */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">{t("plataformTitle")}</span>
            <p className="text-muted-foreground text-xs">
              {t("plataformDescription")}
            </p>
            <Textarea
              placeholder={t("plataformPlaceholder")}
              value={globalPlatformText}
              // Atualiza direto no Zustand
              onChange={(e) => setGlobalPlatformText(e.target.value)}
              className="min-h-[60px] resize-none overflow-hidden py-2"
              rows={1}
            />
          </div>

          {/* CAMPO 2: DESCRIÇÃO DA VAGA */}
          <div className="flex flex-col gap-2 border-t pt-4">
            <span className="text-sm font-semibold">{t("cardTitle")}</span>
            <Textarea
              placeholder={t("placeholder")}
              value={globalJobText}
              // Atualiza direto no Zustand
              onChange={(e) => setGlobalJobText(e.target.value)}
              className="sm:min-h-62.5"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
              <Button onClick={handleSubmit} disabled={!globalJobText.trim()}>
                {t("button")}
              </Button>
            </CardAction>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

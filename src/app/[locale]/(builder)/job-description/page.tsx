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

  // Resgata os estados e ações do Zustand global
  const globalJobText = useResumeStore((state) => state.jobText);
  const setGlobalJobText = useResumeStore((state) => state.setJobText);
  const globalPlatformText = useResumeStore((state) => state.platformText);
  const setGlobalPlatformText = useResumeStore(
    (state) => state.setPlatformText
  );

  const [localText, setLocalText] = useState(globalJobText);
  const [localPlatform, setLocalPlatform] = useState(globalPlatformText); // Estado local para plataforma
  const [isMounted, setIsMounted] = useState(false);

  {
    /* 
    DEFERRED MOUNT EFFECT
    - Ensures the client-side state is fully loaded before rendering the active form.
    - Prevents hydration issues and linter warnings.
  */
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    setGlobalJobText(localText);
    setGlobalPlatformText(localPlatform); // Salva a plataforma na Store antes de avançar
    router.push("/resume-builder");
  };

  {
    /* 
    HIGH-FIDELITY SKELETON LOADER
    - Corrigido: Invertida a ordem para carregar Plataforma primeiro e Vaga em segundo.
  */
  }
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
            {/* 1. Plataforma Skeleton (Agora primeiro) */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-[60px] w-full rounded-md" />
            </div>

            {/* 2. Descrição da vaga Skeleton (Agora em segundo) */}
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

        {/* CORRIGIDO: Invertida a ordem de exibição (Plataforma primeiro, Vaga em segundo) */}
        <CardContent className="flex flex-col gap-6">
          {/* CAMPO 1: PLATAFORMA DA VAGA */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">{t("plataformTitle")}</span>
            <p className="text-muted-foreground text-xs">
              {t("plataformDescription")}
            </p>
            <Textarea
              placeholder={t("plataformPlaceholder")}
              value={localPlatform}
              onChange={(e) => setLocalPlatform(e.target.value)}
              className="min-h-[60px] resize-none overflow-hidden py-2"
              rows={1}
            />
          </div>

          {/* CAMPO 2: DESCRIÇÃO DA VAGA */}
          <div className="flex flex-col gap-2 border-t pt-4">
            <span className="text-sm font-semibold">{t("cardTitle")}</span>
            <Textarea
              placeholder={t("placeholder")}
              value={localText}
              onChange={(e) => setLocalText(e.target.value)}
              className="sm:min-h-62.5"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
              {/* Desabilita se o campo de texto da vaga estiver em branco */}
              <Button onClick={handleSubmit} disabled={!localText.trim()}>
                {t("button")}
              </Button>
            </CardAction>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

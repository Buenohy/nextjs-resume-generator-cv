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
  const globalJobText = useResumeStore((state) => state.jobText);
  const setGlobalJobText = useResumeStore((state) => state.setJobText);

  const [localText, setLocalText] = useState(globalJobText);
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
    router.push("/resume-builder");
  };

  {
    /* 
    HIGH-FIDELITY SKELETON LOADER
    - Rendered only on first mount.
    - Copies the exact heights, spacing, and alignment of the actual card, textarea, and action button.
  */
  }
  if (!isMounted) {
    return (
      <div>
        {/* Title Skeleton */}
        <Skeleton className="mb-6 h-8 w-64" />

        <Card className="shadow-primary/50 shadow-lg">
          <CardHeader>
            {/* Card Title & Description Skeletons */}
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            {/* 
              Textarea Skeleton 
              - Matches the identical responsive minimum heights of the actual Textarea.
            */}
            <Skeleton className="h-[120px] w-full rounded-md sm:h-[250px]" />
          </CardContent>
          <CardFooter className="flex flex-col gap-6">
            {/* Centered Button Skeleton */}
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
        <CardContent>
          <Textarea
            placeholder={t("placeholder")}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            className="sm:min-h-62.5"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
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

"use client";

import { useTranslations } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";

export function SummarySection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {t("sections.summary.title")}
            </h2>
            <h3 className="border-b pb-2 text-lg">
              {t("sections.summary.subTitle")}
            </h3>
          </div>
        </div>
        <Field className="mb-4">
          <div className="flex w-full flex-col gap-4">
            <Textarea
              placeholder={t("sections.summary.placeholder")}
              value={cvData.summary}
              onChange={(e) => {
                handleAutoResize(e);
                updateCvData((draft) => {
                  draft.summary = e.target.value;
                });
              }}
              className="min-h-[120px] resize-none overflow-hidden"
            />
          </div>
        </Field>
      </div>
    </CardContent>
  );
}

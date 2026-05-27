"use client";

import { useTranslations } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { useAutoResize } from "@/app/hooks/useAutoResize";

export function MetaAtsSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);
  const handleAutoResize = useAutoResize();

  const sectionDef = {
    id: "meta_ats",
    title: t("sections.meta_ats.title"),
    subTitle: t("sections.meta_ats.subTitle"),
    fields: Object.entries(t.raw("sections.meta_ats.fields")).map(
      ([key, value]: [string, any]) => ({
        id: key,
        label: value.label,
        placeholder: value.placeholder,
      })
    ),
  };

  const getFieldValue = (fieldId: string) =>
    cvData.meta_ats[fieldId as keyof typeof cvData.meta_ats] || "";

  const handleChange = (fieldId: string, value: string) => {
    updateCvData((draft) => {
      draft.meta_ats[fieldId as keyof typeof draft.meta_ats] = value;
    });
  };

  const textareaFields = ["subject", "keywords", "rights"];

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        <div>
          <h2 className="text-xl font-semibold">{sectionDef.title}</h2>
          <h3 className="border-b pb-2 text-lg">{sectionDef.subTitle}</h3>
        </div>
        {sectionDef.fields.map(({ id, label, placeholder }) => (
          <Field key={id} className="mb-4">
            {/* 
              STACKED CONTAINER FOR THE FIELD
              - flex-col: Positions the label at the top and the field directly below it.
              - gap-2: Small, consistent gap between the Label and the Input/Textarea.
            */}
            <div className="flex w-full flex-col gap-2">
              {/* Label on top */}
              <FieldLabel className="text-left font-medium capitalize">
                {label}
              </FieldLabel>
              {/* Conditional rendering for either a Textarea or an Input taking full width */}
              {textareaFields.includes(id) ? (
                <Textarea
                  className="min-h-[38px] w-full resize-none overflow-hidden py-2"
                  rows={1}
                  placeholder={placeholder}
                  value={getFieldValue(id)}
                  onChange={(e) => {
                    handleAutoResize(e);
                    handleChange(id, e.target.value);
                  }}
                />
              ) : (
                <Input
                  className="w-full"
                  placeholder={placeholder}
                  value={getFieldValue(id)}
                  onChange={(e) => handleChange(id, e.target.value)}
                />
              )}
            </div>
          </Field>
        ))}
      </div>
    </CardContent>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";

export function LinksSection() {
  const t = useTranslations("ResumeBuilderPage");
  const cvData = useResumeStore((s) => s.cvData);
  const updateCvData = useResumeStore((s) => s.updateCvData);

  {
    /* 
    DYNAMIC FIELDS EXTRACTION
    - Fetches the raw translation object from JSON files (en.json / pt.json).
    - Map entries into an array of objects containing the id, localized label, and placeholder.
  */
  }
  const fields = Object.entries(t.raw("sections.links.fields")).map(
    ([key, value]: [string, any]) => ({
      id: key,
      label: value.label,
      placeholder: value.placeholder,
    })
  );

  const getFieldValue = (fieldId: string) =>
    (cvData.links as any)[fieldId] || "";

  const handleChange = (fieldId: string, value: string) => {
    updateCvData((draft) => {
      (draft.links as any)[fieldId] = value;
    });
  };

  return (
    <CardContent>
      <div className="flex flex-col gap-6 border-b py-4">
        {/* SECTION HEADER */}
        <div>
          <h2 className="text-xl font-semibold">{t("sections.links.title")}</h2>
          <h3 className="border-b pb-2 text-lg">
            {t("sections.links.subTitle")}
          </h3>
        </div>

        {/* DYNAMIC FIELDS MAP */}
        {fields.map(({ id, label, placeholder }) => (
          <Field key={id} className="mb-4">
            {/* 
              STACKED CONTAINER FOR THE FIELD
              - flex-col: Positions the label at the top and the input field directly below it.
              - gap-2: Small, consistent gap between the Label and the Input.
            */}
            <div className="flex w-full flex-col gap-2">
              {/* Label on top */}
              <FieldLabel className="text-left font-medium capitalize">
                {label}
              </FieldLabel>
              {/* Input field on bottom taking full width */}
              <Input
                className="w-full"
                placeholder={placeholder}
                value={getFieldValue(id)}
                onChange={(e) => handleChange(id, e.target.value)}
              />
            </div>
          </Field>
        ))}
      </div>
    </CardContent>
  );
}

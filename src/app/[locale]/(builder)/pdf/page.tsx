"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resume } from "@/components/resume";
import { Printer, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    ),
  }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

export default function PdfPreviewPage() {
  const t = useTranslations("PdfPreviewPage");
  const tResume = useTranslations("ResumeComponent.sections");
  const tBuilder = useTranslations("ResumeBuilderPage");
  const locale = useLocale();
  const cvData = useResumeStore((state) => state.cvData);
  const saveResumeToHistory = useResumeStore(
    (state) => state.saveResumeToHistory
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // --- TOKEN PARSING TRANSLATOR ---
  const months = tBuilder.raw("months") as string[];
  const languageLevels = tBuilder.raw("language_levels") as string[];
  const presentStr = tBuilder("sections.education.present");

  const parseTokens = (str: string) => {
    if (!str) return str;
    let res = str.replace(
      /__MONTH_(\d+)__/g,
      (_, d) => months[parseInt(d, 10)] || ""
    );
    res = res.replace(/__PRESENT__/g, presentStr);
    res = res.replace(
      /__LEVEL_(\d+)__/g,
      (_, d) => languageLevels[parseInt(d, 10)] || ""
    );
    return res;
  };

  useEffect(() => {
    if (!isMounted) return;
    const meta = cvData.meta_ats || {};
    const prevTitle = document.title;

    // Dynamic browser tab title including target company details
    const role = meta.role_target || "Resume";
    const name = cvData.info.name || "Gabriel Bueno Hygino";
    const company = cvData.company ? ` - ${cvData.company}` : "";

    document.title = `${role} - ${name}${company}`;

    return () => {
      document.title = prevTitle;
    };
  }, [cvData, isMounted]);

  const infoProp = {
    ...cvData.info,
    // MAP: Associates the form field value "city" with the property "location" expected by the PDF component
    location: cvData.info.city || "",
    age: cvData.info.age ? `${cvData.info.age} ${tResume("yearsOld")}` : "",
    email: cvData.links.email,
    linkedin: cvData.links.linkedin ? t("contactLabels.linkedin") : "",
    linkedin_url: cvData.links.linkedin,
    phone: cvData.links.phone || "",
    phone_url: cvData.links.phone_url || cvData.links.phone,
    website: cvData.links.website || "",
    website_url: cvData.links.website_url || "",
    github: cvData.links.github ? t("contactLabels.github") : "",
    github_url: cvData.links.github,
  };

  // Apply token translator on dates and language proficiency levels
  const experienceProp = cvData.experiences.map((exp) => ({
    role: exp.role,
    company: exp.company,
    url: exp.url,
    date: parseTokens(exp.date),
    details: exp.details,
    stacks: Array.isArray(exp.stacks) ? exp.stacks.join(", ") : exp.stacks,
  }));

  const educationProp = cvData.education.map((e) => parseTokens(e));
  const certsProp = cvData.certifications.map((c) => parseTokens(c));
  const languagesProp = cvData.languages.map((l) => parseTokens(l));

  const resumeTranslations = {
    professionalSummary: tResume("professionalSummary"),
    ai: tResume("ai"),
    skills: tResume("skills"),
    experience: tResume("experience"),
    stacks: tResume("stacks"),
    education: tResume("education"),
    certifications: tResume("certifications"),
    languages: tResume("languages"),
  };

  const resumeDocument = (
    <Resume
      locale={locale}
      info={infoProp}
      company={cvData.company}
      meta={cvData.meta_ats}
      summary={cvData.summary}
      ai={cvData.ai}
      skills_list={cvData.skills}
      experience={experienceProp}
      education={educationProp}
      certifications={certsProp}
      languages={languagesProp}
      translations={resumeTranslations}
    />
  );

  // NOTE: @react-pdf/renderer's <PDFViewer> renders into an <iframe> that
  // does not reliably re-render on deep prop changes (e.g. reordering an
  // array). Forcing a fresh `key` remounts the viewer whenever the actual
  // PDF content changes, guaranteeing the preview stays in sync.
  //
  // We build this key from only the fields that actually feed into
  // `resumeDocument` (already-derived props), instead of JSON.stringify-ing
  // the entire `cvData` object. This avoids remounting the PDF viewer on
  // every keystroke for fields that don't affect the PDF at all (e.g.
  // `jobText`, `platformText`, other internal form-only state).
  const pdfKey = JSON.stringify({
    info: infoProp,
    company: cvData.company,
    summary: cvData.summary,
    ai: cvData.ai,
    skills: cvData.skills,
    experience: experienceProp,
    education: educationProp,
    certifications: certsProp,
    languages: languagesProp,
  });

  // Dynamically format file name based on sanitized user name and target company
  const namePart = (cvData.info.name || "Resume").trim().replace(/\s+/g, "_");
  const companyPart = cvData.company
    ? cvData.company.trim().replace(/\s+/g, "_")
    : "";

  const formattedFileName = companyPart
    ? `CV_${namePart}_${companyPart}.pdf`
    : `CV_${namePart}.pdf`;

  if (!isMounted) return <Skeleton className="h-[80vh] w-full" />;

  return (
    <div className="container mx-auto min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Card className="shadow-primary/50 mx-auto w-full shadow-lg">
        <CardHeader>
          <CardTitle>{t("cardTitle")}</CardTitle>
          <CardDescription>{t("cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-card h-150 overflow-hidden rounded-lg border p-1 shadow-sm sm:h-200">
            <PDFViewer
              key={pdfKey}
              showToolbar={false}
              className="h-full w-full rounded-md border-0"
            >
              {resumeDocument}
            </PDFViewer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <PDFDownloadLink
            document={resumeDocument}
            fileName={formattedFileName}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                onClick={() => saveResumeToHistory(locale)}
              >
                {loading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Printer className="mr-2 size-4" />
                )}
                {loading ? t("generatingBtn") : t("exportBtn")}
              </Button>
            )}
          </PDFDownloadLink>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resume } from "@/components/resume";
import { Printer, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[400px] w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
  const cvData = useResumeStore((state) => state.cvData);

  useEffect(() => {
    const meta = cvData.meta_ats || {};
    const prevTitle = document.title;

    document.title = `${meta.role_target || "Resume"} - ${cvData.info.name || "Gabriel Bueno"}`;

    const createdMetaTags: HTMLMetaElement[] = [];
    const metaMappings = [
      { name: "keywords", content: meta.keywords },
      { name: "subject", content: meta.subject },
      { name: "author", content: meta.contributor },
      { name: "rights", content: meta.rights },
      { name: "coverage", content: meta.coverage },
      { name: "identifier", content: meta.identifier },
      { name: "publisher", content: meta.publisher },
      { name: "relation", content: meta.relation },
      { name: "source", content: meta.source },
      { name: "type", content: meta.type },
    ];

    metaMappings.forEach(({ name, content }) => {
      if (content) {
        const metaTag = document.createElement("meta");
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
        createdMetaTags.push(metaTag);
      }
    });

    return () => {
      document.title = prevTitle;
      createdMetaTags.forEach((tag) => {
        if (document.head.contains(tag)) {
          document.head.removeChild(tag);
        }
      });
    };
  }, [cvData]);

  const infoProp = {
    name: cvData.info.name,
    role: cvData.info.role,
    location: cvData.info.city,
    age: cvData.info.age,
    email: cvData.links.email,
    linkedin: cvData.links.linkedin ? t("contactLabels.linkedin") : "",
    linkedin_url: cvData.links.linkedin,
    phone: cvData.links.phone ? t("contactLabels.phone") : "",
    phone_url: cvData.links.phone,
    website: cvData.links.website || "",
    website_url: cvData.links.website_url || "",
    github: cvData.links.github ? t("contactLabels.github") : "",
    github_url: cvData.links.github,
  };

  const experienceProp = cvData.experiences.map((exp) => ({
    role: exp.role,
    company: exp.company,
    url: exp.url,
    date: exp.date,
    details: exp.details,
    stacks: Array.isArray(exp.stacks) ? exp.stacks.join(", ") : exp.stacks,
  }));

  const resumeDocument = (
    <Resume
      info={infoProp}
      meta={cvData.meta_ats}
      summary={cvData.summary}
      skills_list={cvData.skills}
      experience={experienceProp}
      education={cvData.education}
      certifications={cvData.certifications}
      languages={cvData.languages}
    />
  );

  const formattedFileName = `CV_${(cvData.info.name || "Resume").replace(/\s+/g, "_")}.pdf`;

  return (
    <div className="container mx-auto min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
      <Card className="shadow-primary/50 mx-auto max-w-4xl shadow-lg">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>{t("cardTitle")}</CardTitle>
            <CardDescription>{t("cardDescription")}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="bg-card h-[600px] overflow-hidden rounded-lg border p-1 shadow-sm sm:h-[800px]">
            <PDFViewer className="h-full w-full rounded-md border-0">
              {resumeDocument}
            </PDFViewer>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6">
          <div className="flex w-full justify-center">
            <CardAction>
              <PDFDownloadLink
                document={resumeDocument}
                fileName={formattedFileName}
              >
                {({ loading }) => (
                  <Button disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Printer className="mr-2 h-4 w-4" />
                    )}
                    {loading ? t("generatingBtn") : t("exportBtn")}
                  </Button>
                )}
              </PDFDownloadLink>
            </CardAction>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

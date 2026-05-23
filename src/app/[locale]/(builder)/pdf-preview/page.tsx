"use client";

import { useState, useEffect } from "react";
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
import ButtonPaginate from "@/components/button-paginate";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

export default function PdfPreviewPage() {
  const cvData = useResumeStore((state) => state.cvData);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const infoProp = {
    name: cvData.info.name,
    role: cvData.info.role,
    location: cvData.info.city,
    age: cvData.info.age,
    email: cvData.links.email,
    linkedin: cvData.links.linkedin ? "LinkedIn" : "",
    linkedin_url: cvData.links.linkedin,
    phone: cvData.links.phone ? "Telefone" : "",
    phone_url: cvData.links.phone,
    website: cvData.links.website ? "Site" : "",
    website_url: cvData.links.website,
    github: cvData.links.github ? "GitHub" : "",
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

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen p-3 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold">Pdf Preview</h1>
      <Card className="shadow-primary/50 mx-auto max-w-4xl shadow-lg">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Pdf Preview</CardTitle>
            <CardDescription>
              Verifique os seus dados e exporte o documento final.
            </CardDescription>
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
                    {loading ? "Gerando PDF..." : "Exportar Currículo"}
                  </Button>
                )}
              </PDFDownloadLink>
            </CardAction>
          </div>
          <ButtonPaginate />
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import { useEffect } from "react";
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
import { Printer } from "lucide-react";
import ButtonPaginate from "@/components/button-paginate";

export default function PdfPreviewPage() {
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

  const handleExportPDF = () => {
    window.print();
  };

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

  return (
    <div className="container mx-auto min-h-screen p-3 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold print:hidden">Pdf Preview</h1>
      <Card className="shadow-primary/50 mx-auto max-w-4xl shadow-lg print:m-0 print:border-none print:p-0 print:shadow-none">
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center print:hidden">
          <div>
            <CardTitle>Pdf Preview</CardTitle>
            <CardDescription>
              Verifique os seus dados e exporte o documento final.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 print:p-0">
          <div className="bg-card overflow-x-auto rounded-lg border p-3 shadow-sm sm:p-6 print:m-0 print:border-none print:p-0 print:shadow-none">
            <Resume
              info={infoProp}
              summary={cvData.summary}
              skills_list={cvData.skills}
              experience={experienceProp}
              education={cvData.education}
              certifications={cvData.certifications}
              languages={cvData.languages}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-6 print:hidden">
          <div className="flex w-full justify-center">
            <CardAction>
              <Button onClick={handleExportPDF}>
                <Printer className="mr-2 h-4 w-4" />
                Exportar Currículo
              </Button>
            </CardAction>
          </div>
          <ButtonPaginate />
        </CardFooter>
      </Card>
    </div>
  );
}

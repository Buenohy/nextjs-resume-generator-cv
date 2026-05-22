"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resume } from "@/components/resume";
import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PdfPreviewPage() {
  const router = useRouter();

  const handleBackStep = () => {
    router.push("/optimizing-resume");
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="container mx-auto min-h-screen p-4 md:p-8">
      <Card className="shadow-primary/50 mx-auto max-w-4xl shadow-lg print:m-0 print:border-none print:p-0 print:shadow-none">
        <div className="flex items-center justify-between px-6">
          <CardAction>
            <Button onClick={handleBackStep}>Otimizar Currículo</Button>
          </CardAction>
          <CardAction>
            <Button onClick={handleExportPDF}>
              <Printer className="mr-2 h-4 w-4" />
              Exportar Currículo
            </Button>
          </CardAction>
        </div>
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center print:hidden">
          <div>
            <CardTitle className="text-2xl">Pdf Preview</CardTitle>
            <CardDescription>
              Verifique os seus dados e exporte o documento final.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 print:p-0">
          <div className="bg-card overflow-x-auto rounded-lg border p-4 shadow-sm md:p-8 print:m-0 print:border-none print:p-0 print:shadow-none">
            <Resume
              info={{
                name: "Gabriel Bueno Hygino",
                role: "Frontend Developer",
                location: "Brazil (UTC-3)",
                age: "23 Years",
                linkedin: "LinkedIn",
                linkedin_url: "http://www.linkedin.com/in/gabriel-bueno-hygino",
                phone: "+55 11 9 8873-5414",
                phone_url: "https://wa.me/5511988735414",
                website: "Bueno.com",
                website_url: "http://bueno-portfolio-web.vercel.app/",
                email: "gabriel.buenohyginoc@gmail.com",
                github: "GitHub",
                github_url: "https://github.com/Buenohy",
              }}
              summary="Developer focused on Test. Proactive and growth-focused Junior Front-End Developer with solid hands-on experience developing web applications using JavaScript, CSS, HTML, and the React ecosystem."
              skills_list={[
                "React | Angular | Next.js | TypeScript | JavaScript | Node.js | Express | Git | HTML | CSS | Tailwind CSS | Frontend | Agile Methodologies | UI/UX | Figma | Web Performance",
              ]}
              experience={[
                {
                  role: "Developer Frontend",
                  company: "Gallery Plus",
                  date: "April 2026 - Present",
                  url: "https://github.com/Buenohy",
                  details: [
                    "Developed the gallery's caching and dynamic filtering architecture, optimizing image loading and enabling state persistence via URL search parameters by integrating TanStack React Query with the Nuqs library.",
                    "Optimized backend API consumption (hosted on Railway), significantly reducing excessive network requests and improving search performance by implementing a custom debounce algorithm using React Hooks.",
                    "Guaranteed data integrity and request safety during photo uploads and album creation by implementing robust schema validations using Zod and inferring strict static typing with TypeScript.",
                  ],
                  stacks:
                    "React, TypeScript, Tailwind CSS, TanStack Query (React Query), Nuqs, Zod, React Router, Vite",
                },
                {
                  role: "Developer Frontend",
                  company: "Professional Portfolio",
                  date: "May 2025 - April 2025",
                  url: "http://bueno-portfolio-web.vercel.app/",
                  details: [
                    "Optimized overall web performance and SEO ranking, achieving a Grade 'A' (99%) on GTmetrix with a 610ms LCP, alongside >90 scores in Accessibility and SEO on Google PageSpeed Insights, by implementing Server-Side Rendering (SSR) with Next.js.",
                    "Optimized the recruiter navigation experience by ensuring zero latency when exploring portfolio items, implementing a dynamic categorization system using React's state management.",
                    "Implemented a highly accessible user interface with prolonged visual comfort (persistent Dark Mode), building modular components with Tailwind CSS, Shadcn UI, and the Next-Theme library.",
                  ],
                  stacks: "React, Next.js, TypeScript, Tailwind CSS",
                },
                {
                  role: "Developer Frontend",
                  company: "React To-Do List",
                  date: "April 2026 - Present",
                  url: "https://github.com/Buenohy",
                  details: [
                    "Developed state management and data persistence for the CRUD application by building React Custom Hooks, utilizing the browser Local Storage API as a local database to retain user tasks across sessions.",
                    "Optimized user experience (UX) by implementing Skeleton Loaders for visual feedback during data fetching and building a responsive Light/Dark theme toggle using Tailwind CSS.",
                    "Implemented a scalable front-end architecture using React Router for navigation and class-variance-authority (CVA) to build a standardized UI component library, deployed continuously on Vercel.",
                  ],
                  stacks:
                    "React, TypeScript, Tailwind CSS, React Router, class-variance-authority (CVA), Vite",
                },
                {
                  role: "Developer Frontend",
                  company: "Calculator React",
                  date: "March 2026 - Present",
                  url: "https://github.com/Buenohy",
                  details: [
                    "Developed the calculation engine and global state management by implementing React Context API and Custom Hooks, ensuring a modular architecture and clear separation of concerns between math logic and the UI.",
                    "Implemented a persistent mathematical operation history panel, optimizing user data retention across page reloads through seamless integration with the browser's Local Storage API.",
                    "Optimized user interface (UI) construction by building reusable components based on variant props (internal Design System) and applying modern, responsive styling using Tailwind CSS.",
                  ],
                  stacks:
                    "React, JavaScript/ES6+, Tailwind CSS, CSS Variables, Local Storage API",
                },
              ]}
              education={[
                "Bachelor in Systems Analysis and Development - University, Senac | Feb 2026 - Expected: Dec 2028",
              ]}
              certifications={[
                "Full Stack JavaScript Program: Project with React and Node.js - Course, Alura | Feb 2026",
                "React with TypeScript: Developing an Administrative Area - Course, Alura | Feb 2026",
              ]}
              languages={[
                "English - Professional Working Proficiency",
                "Portuguese - Native",
                "Spanish - Basic",
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

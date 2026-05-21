"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Resume } from "@/components/resume"; // Importe o componente que criamos acima
import { Printer } from "lucide-react"; // Opcional: Ícone legal para o botão de exportar

export default function PdfPreviewPage() {
  const handleExportPDF = () => {
    // Essa é a maneira nativa de gerar PDF no frontend
    window.print();
  };

  return (
    <div className="container mx-auto min-h-screen p-4 md:p-8">
      {/* 
        As classes "print:border-none print:shadow-none print:m-0 print:p-0" 
        tiram todo o estilo de "Card" durante a geração do PDF, 
        deixando a folha branca padrão.
      */}
      <Card className="shadow-primary/50 mx-auto max-w-4xl shadow-lg print:m-0 print:border-none print:p-0 print:shadow-none">
        {/* "print:hidden" esconde esse cabeçalho e o botão na hora de salvar o PDF */}
        <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center print:hidden">
          <div>
            <CardTitle className="text-2xl">Pdf Preview</CardTitle>
            <CardDescription>
              Verifique como ficou e baixe o pdf do seu currículo.
            </CardDescription>
          </div>
          <Button onClick={handleExportPDF} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Exportar Currículo
          </Button>
        </CardHeader>

        {/* Aqui injetamos o componente e os dados */}
        <CardContent className="flex flex-col gap-5 print:p-0">
          {/* Adicionando um container com fundo branco pra destacar bem na tela (Dark mode) */}
          <div className="overflow-x-auto rounded-lg border bg-white p-4 shadow-sm md:p-8 print:m-0 print:border-none print:p-0 print:shadow-none">
            <Resume
              info={{
                name: "Gabriel Bueno Hygino",
                linkedin: "LinkedIn",
                linkedin_url: "http://www.linkedin.com/in/gabriel-bueno-hygino",
                phone: "+55 11 9 8873-5414",
                website: "bueno.com",
                website_url: "http://bueno-portfolio-web.vercel.app/",
                email: "gabriel.buenohyiginoc@gmail.com",
                github: "GitHub",
                github_url: "https://github.com/Buenohy",
              }}
              summary="Software Engineer enthusiastic about driving impact at Google. Proactive and growth-focused Junior Front-End Developer with solid hands-on experience developing web applications using JavaScript, CSS, HTML, and the React ecosystem. I have experience in projects that demonstrate the creation of responsive, high-performance interfaces. I have solid experience in React and a strong interest and ability to quickly learn Angular. I'm seeking an opportunity to apply my skills, collaborate with a team, and grow in an environment that values professional development."
              skills_list={[
                "React | Next.js | TypeScript | JavaScript | Node.js | Express | Git | HTML | CSS | Sass | Tailwind CSS",
                "Frontend | Backend | English – All professional proficiency or above",
              ]}
              experience={[
                {
                  role: "Software Engineer",
                  company: "Crypto DashBoard",
                  date: "06/2025",
                  url: "http://bueno-crypto-dashboard.vercel.app/",
                  details: [
                    "Engineered a comprehensive cryptocurrency dashboard using Next.js, React, and TypeScript to provide a fluid, high-performance user experience for real-time market monitoring and portfolio management.",
                    "Optimized application performance by implementing Server-Side Rendering (SSR) with Next.js, resulting in a 70% reduction in initial load time and ensuring real-time market data delivery.",
                    'Developed the "My Portfolio" feature from scratch, allowing users to track the performance of their assets in real time, leveraged TypeScript to ensure type safety and data integrity for all financial data handled by the application.',
                    "Built a modern and fully responsive UI with Tailwind CSS and Shadcn UI, featuring interactive charts and a user-friendly Dark Mode to enhance the overall user experience (UX).",
                  ],
                },
                {
                  role: "Software Engineer",
                  company: "Professional Portfolio",
                  date: "05/2025",
                  url: "http://bueno-portfolio-web.vercel.app/",
                  details: [
                    "Engineered a professional portfolio with Next.js and TypeScript, implementing Server-Side Rendering (SSR) to optimize SEO and achieve sub-1-second page load times.",
                    "Implemented a dynamic and interactive project gallery with zero-latency filtering by category, managed efficiently with React's state management capabilities.",
                    "Built a visually striking modern UI using Tailwind CSS and Shadcn UI, integrating Next-Theme for a persistent and professional Dark Mode experience that enhances user comfort.",
                  ],
                },
                {
                  role: "Software Engineer",
                  company: "Code Connect",
                  date: "04/2025",
                  url: "http://bueno-code-connect.vercel.app/",
                  details: [
                    "Implemented a robust authentication system, including social logins with Google and GitHub, to streamline the user onboarding process and improve the new user experience.",
                    "Developed a complete authentication flow (Login/Registration) as a Single-Page Application (SPA) using React Router, enabling seamless and instant navigation between routes without page reloads.",
                    "Built a modern, responsive user interface with Tailwind CSS, implementing real-time, client-side form validation to provide instant feedback and ensure an intuitive registration experience.",
                  ],
                },
                {
                  role: "Software Engineer",
                  company: "Bueno Books",
                  date: "03/2025",
                  url: "http://bueno-books.vercel.app/",
                  details: [
                    "Developed a dynamic search functionality in React that filters and displays real-time results from a book API, utilizing component state to manage queries and update the UI instantly.",
                    "Architected and implemented the user interface following a reusable, component-based architecture in React (e.g., Header, BookCard) and styled with Tailwind CSS for rapid, consistent development, ensuring code scalability and maintainability.",
                    'Created dynamic content sections like "Latest Releases" and "Suggestions" by consuming multiple API endpoints to boost user engagement and content discovery on the platform.',
                  ],
                },
              ]}
              education={[
                "Full Stack JavaScript Program: Project with React and Node.js – Alura (Expected 2025)",
                "React with TypeScript: Developing an Administrative Area – Alura (Expected 2025)",
              ]}
              languages={[
                "English: Advanced Professional Proficiency",
                "Spanish: Basic Proficiency",
                "Portuguese: Native Speaker",
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

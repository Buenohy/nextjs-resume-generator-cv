import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Textarea } from "@/components/ui/textarea"

interface Rows {
  id: string
  title: string
}

export const rows: Rows[] = [
  { id: "1", title: "Experiência" },
  { id: "2", title: "Dados" },
]

interface Columns {
  id: string
  title: string
}

export const columns: Columns[] = [
  { id: "1", title: "role" },
  { id: "2", title: "company" },
  { id: "3", title: "url" },
  { id: "4", title: "date" },
  { id: "5", title: "details" },
  { id: "6", title: "stacks" },
]

interface ExperienceData {
  id: string
  role: string
  company: string
  deployUrl: string
  date: string
  details1: string
  details2: string
  details3: string
  stacks: string
}

export const data: ExperienceData[] = [
  {
    id: "1",
    role: "Developer Frontend",
    company: "Gallery Plus",
    deployUrl: "https://bueno-gallery-plus.vercel.app/",
    date: "April 2026 - Present",
    details1: "Developed the gallery's caching and dynamic filtering architecture, optimizing image loading and enabling state persistence via URL search parameters by integrating TanStack React Query with the Nuqs library.",
    details2: "Optimized backend API consumption (hosted on Railway), significantly reducing excessive network requests and improving search performance by implementing a custom debounce algorithm using React Hooks.",
    details3: "Guaranteed data integrity and request safety during photo uploads and album creation by implementing robust schema validations using Zod and inferring strict static typing with TypeScript.",
    stacks: "React, TypeScript, Tailwind CSS, TanStack Query (React Query), Nuqs, Zod, React Router, Vite",
  },
  {
    id: "2",
    role: "Developer Frontend",
    company: "Professional Portfolio",
    deployUrl: "http://bueno-portfolio-web.vercel.app/",
    date: "May 2025 - April 2025",
    details1: "Optimized overall web performance and SEO ranking, achieving a Grade 'A' (99%) on GTmetrix with a 610ms LCP, alongside >90 scores in Accessibility and SEO on Google PageSpeed Insights, by implementing Server-Side Rendering (SSR) with Next.js.",
    details2: "Optimized the recruiter navigation experience by ensuring zero latency when exploring portfolio items, implementing a dynamic categorization system using React's state management.",
    details3: "Implemented a highly accessible user interface with prolonged visual comfort (persistent Dark Mode), building modular components with Tailwind CSS, Shadcn UI, and the Next-Theme library.",
    stacks: "React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    id: "3",
    role: "Developer Frontend",
    company: "React To-Do List",
    deployUrl: "https://bueno-react-todo.vercel.app/",
    date: "April 2026 - Present",
    details1: "Developed state management and data persistence for the CRUD application by building React Custom Hooks, utilizing the browser Local Storage API as a local database to retain user tasks across sessions.",
    details2: "Optimized user experience (UX) by implementing Skeleton Loaders for visual feedback during data fetching and building a responsive Light/Dark theme toggle using Tailwind CSS.",
    details3: "Implemented a scalable front-end architecture using React Router for navigation and class-variance-authority (CVA) to build a standardized UI component library, deployed continuously on Vercel.",
    stacks: "React, TypeScript, Tailwind CSS, React Router, class-variance-authority (CVA), Vite",
  },
  {
    id: "4",
    role: "Developer Frontend",
    company: "Calculator React",
    deployUrl: "https://bueno-calculator-react.vercel.app/",
    date: "March 2026 - Present",
    details1: "Developed the calculation engine and global state management by implementing React Context API and Custom Hooks, ensuring a modular architecture and clear separation of concerns between math logic and the UI.",
    details2: "Implemented a persistent mathematical operation history panel, optimizing user data retention across page reloads through seamless integration with the browser's Local Storage API.",
    details3: "Optimized user interface (UI) construction by building reusable components based on variant props (internal Design System) and applying modern, responsive styling using Tailwind CSS.",
    stacks: "React, JavaScript/ES6+, Tailwind CSS, CSS Variables, Local Storage API",
  },
  {
    id: "5",
    role: "Developer Frontend",
    company: "Crypto DashBoard",
    deployUrl: "http://bueno-crypto-dashboard.vercel.app/",
    date: "June 2025 - Present",
    details1: "Architected the front-end of a high-performance financial dashboard for cryptocurrency monitoring, building a reactive and scalable interface utilizing Next.js, React, and TypeScript.",
    details2: "Reduced initial load times by 70% and ensured the delivery of real-time market data by integrating the CoinGecko REST API coupled with Next.js Server-Side Rendering (SSR).",
    details3: "Enabled personalized asset management by engineering the 'My Portfolio' feature from scratch, guaranteeing mathematical precision and financial data integrity through strict TypeScript typing.",
    stacks: "React, Next.js, TypeScript, Tailwind CSS",
  },
  {
    id: "6",
    role: "Developer Frontend",
    company: "Code Connect",
    deployUrl: "http://bueno-code-connect.vercel.app/",
    date: "April 2025 - March 2025",
    details1: "Optimized the conversion rate and new user onboarding flow, significantly reducing registration friction by implementing a robust social authentication system via OAuth integration (Google and GitHub).",
    details2: "Engineered the Single-Page Application (SPA) routing architecture, ensuring zero-latency screen transitions without page reloads by structuring the complete access flow with React Router DOM.",
    details3: "Ensured data integrity and reduced invalid server requests by implementing responsive forms with Tailwind CSS alongside strict client-side validation for real-time user feedback.",
    stacks: "React, React Router, OAuth, Tailwind CSS",
  },
  {
    id: "7",
    role: "Developer Frontend",
    company: "Cypress",
    deployUrl: "https://github.com/Buenohy/bytebank-cypress-e2e",
    date: "March 2025 - February 2025",
    details1: "Ensured the stability of core features (authentication, transactions, and logout) and prevented production regressions by automating the end-to-end (E2E) user journey validation using Cypress.",
    details2: "Mitigated systemic flaws and UX issues in the access flow by implementing test coverage for edge cases (invalid data and blank fields) to strictly validate error handling in forms.",
    details3: "Ensured a consistent navigation experience across mobile devices by developing automated responsiveness and viewport transition tests to validate the correct rendering of menus and layouts.",
    stacks: "Cypress, React",
  },
]

interface Create {
  id: string,
  title?: string,
  placeholder: string,
}

export const CreateExperience: Create[] = [
  {
    id: "1",
    title: "role",
    placeholder: "Coloque a função que você exerceu na empresa"
  },
  {
    id: "2",
    title: "company",
    placeholder: "Coloque o nome da empresa"
  },
  {
    id: "3",
    title: "url",
    placeholder: "Coloque o url do deploy do projeto"
  },
  {
    id: "4",
    title: "date",
    placeholder: "Coloque a data de início e termino Ex: April 2026 - Present"
  },
  {
    id: "5",
    title: "details",
    placeholder: "Coloque a descrição sobre o projeto 1"
  },
  {
    id: "6",
    placeholder: "Coloque a descrição sobre o projeto 2"
  },
  {
    id: "7",
    placeholder: "Coloque a descrição sobre o projeto 3"
  },
  {
    id: "8",
    title: "stacks",
    placeholder: "Coloque as stacks usadas na empresa"
  },
]

export default function ContentEnUsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content En Us Page</h1>
      <Card className="shadow-primary/50 shadow-lg border-muted">
        <CardHeader>
          <CardTitle>Content En Us</CardTitle>
          <CardDescription>Gere um currículo apartir do conteúdo abaixo.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Experiência</h2>
          <h3 className="text-lg border-b pb-2">Crie uma nova experiência</h3>

            {CreateExperience.map(({id, title, placeholder}) => (
              <div key={id} className="flex gap-4 items-start">
                <h2 className="w-24 mt-2 font-medium">{title}</h2>
                <Textarea placeholder={placeholder} className="flex-1" />
              </div>
            ))}

          <Button>Gerar currículo</Button>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}
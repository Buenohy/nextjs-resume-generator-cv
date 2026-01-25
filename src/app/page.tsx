import Card from "./components/Card";
import Input from "./components/Input";
import Resume from "./components/Resume";
import Skills from "./components/Skills";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white p-8 sm:items-start dark:bg-black">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-start-1 flex flex-col gap-8">
            <Card title="Personal Details">
              <Input title="Full name" placeholder="Enter your full name" />
            </Card>
            <Card title="Links">
              <div className="grid grid-cols-2 gap-4">
                <Input title="Linkedin" placeholder="Enter linkedin" />
                <Input title="Phone" placeholder="Enter phone" />
                <Input title="Site" placeholder="Enter site" />
                <Input title="Email" placeholder="Enter email" />
                <Input title="Github" placeholder="Enter github" />
              </div>
            </Card>
            <Card title="Professional Summary">
              <Input title="" placeholder="Enter your full summary" />
            </Card>
            <Card title="Skills">
              <Skills title="" placeholder="Enter skill" />
            </Card>
            <Card title="Experience">
              <div className="grid grid-cols-3 gap-4">
                <Input title="Role Title" placeholder="Enter your role title" />
                <Input title="Job Title" placeholder="Enter your job title" />
                <Input title="Date" placeholder="Enter your date" />
              </div>
              <Input
                title="Summary"
                placeholder="Enter your experience summary"
              />
              <Input title="" placeholder="Enter your experience summary" />
              <Input title="" placeholder="Enter your experience summary" />
              <Input title="" placeholder="Enter your experience summary" />
            </Card>
            <Card title="Education">
              <Input title="" placeholder="Enter your education" />
              <Input title="" placeholder="Enter your education" />
            </Card>
            <Card title="Languages">
              <Input title="" placeholder="Enter your languages" />
              <Input title="" placeholder="Enter your languages" />
              <Input title="" placeholder="Enter your languages" />
            </Card>
          </div>
          <div className="col-start-2 hidden sm:grid">
            <Card title="Preview Resume">
              <Resume
                info={{
                  name: "Gabriel Bueno Hygino",
                  linkedin: "LinkedIn",
                  linkedin_url:
                    "http://www.linkedin.com/in/gabriel-bueno-hygino",
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
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

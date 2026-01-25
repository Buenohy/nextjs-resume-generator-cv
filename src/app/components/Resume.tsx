import React from "react";

// --- Interfaces de Tipagem ---
interface Info {
  name: string;
  linkedin_url?: string;
  linkedin?: string;
  phone?: string;
  website_url?: string;
  website?: string;
  email: string;
  github_url?: string;
  github?: string;
}

interface Job {
  role: string;
  company: string;
  url?: string;
  date: string;
  details: string[];
}

interface ResumeProps {
  info: Info;
  summary: string;
  skills_list: string[];
  experience: Job[];
  education: string[];
  languages: string[];
}

// --- Componente de Ícone Reutilizável ---
const Icon = ({ path }: { path: string }) => (
  <svg
    viewBox="0 0 24 24"
    className="relative -top-[1px] mr-[5px] inline-block h-[13px] w-[13px] align-middle"
  >
    <path fill="currentColor" d={path} />
  </svg>
);

const Resume: React.FC<ResumeProps> = ({
  info,
  summary,
  skills_list,
  experience,
  education,
  languages,
}) => {
  return (
    <>
      {/* Estilos globais de impressão que o Tailwind não cobre nativamente */}
      <style>{`
        @page {
          size: A4;
          margin: 1cm 1cm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Container Principal - Configurações de fonte base */}
      <div className="m-0 mx-auto max-w-[210mm] bg-white p-0 font-sans text-[9pt] leading-[1.3] text-black">
        {/* --- HEADER --- */}
        <header className="mb-2.5 text-center">
          <h1 className="m-0 mb-[5px] font-serif text-[18pt] font-normal">
            {info.name}
          </h1>

          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-[15px] text-[10pt]">
            {/* LinkedIn */}
            {info.linkedin && (
              <a
                href={info.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border-b border-emerald-500 leading-none whitespace-nowrap text-emerald-500 no-underline hover:text-emerald-500"
              >
                <Icon path="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                {info.linkedin}
              </a>
            )}

            {/* Phone */}
            {info.phone && (
              <span className="inline-flex items-center leading-none whitespace-nowrap">
                <Icon path="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                {info.phone}
              </span>
            )}

            {/* Website */}
            {info.website && (
              <a
                href={info.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border-b border-emerald-500 leading-none whitespace-nowrap text-emerald-500 no-underline hover:text-emerald-500"
              >
                <Icon path="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.86.64 3.57 1.71 4.94l.89-.9c.7-.7.96-1.09.96-1.54 0-.41-.31-.83-.96-1.5l-1.35-1.34V8l2.5 2.5v2.5l2.5-2.5V8.5l-2-2H9v-2h2v1l3 3 2-2h1.34c.43.95.66 2 .66 3.1 0 1.67-.53 3.23-1.44 4.5l-1.56-1.56c-.25-.26-.64-.26-.9 0-.25.26-.25.64 0 .9l1.64 1.63A7.95 7.95 0 0 0 20 12a8 8 0 0 0-8-8z" />
                {info.website}
              </a>
            )}

            {/* Email */}
            <a
              href={`mailto:${info.email}`}
              className="inline-flex items-center border-b border-emerald-500 leading-none whitespace-nowrap text-emerald-500 no-underline hover:text-emerald-500"
            >
              <Icon path="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              {info.email}
            </a>

            {/* GitHub */}
            {info.github && (
              <a
                href={info.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border-b border-emerald-500 leading-none whitespace-nowrap text-emerald-500 no-underline hover:text-emerald-500"
              >
                <Icon path="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                {info.github}
              </a>
            )}
          </div>
        </header>

        {/* --- SUMMARY --- */}
        <section>
          <h3 className="mt-2.5 mb-1 text-[12pt] font-bold text-blue-600 normal-case">
            Professional Summary
          </h3>
          <p className="m-0 text-justify leading-[1.35]">{summary}</p>
        </section>

        {/* --- SKILLS --- */}
        <section>
          <h3 className="mt-2.5 mb-1 text-[12pt] font-bold text-blue-600 normal-case">
            Skills
          </h3>
          <ul className="m-0 list-disc pl-[18px] marker:text-blue-600">
            {skills_list.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* --- EXPERIENCE --- */}
        <section>
          <h3 className="mt-2.5 mb-1 text-[12pt] font-bold text-blue-600 normal-case">
            Experience
          </h3>
          {experience.map((job, index) => (
            <div key={index} className="mb-2">
              <div className="mb-0.5 grid w-full grid-cols-[1fr_auto_1fr] items-baseline">
                {/* Role */}
                <span className="text-left text-[10pt] font-bold">
                  {job.role}
                </span>

                {/* Company (Link or Span) */}
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer text-center text-[10pt] font-normal whitespace-nowrap text-emerald-500 underline decoration-emerald-500 hover:text-emerald-500"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-center text-[10pt] font-normal whitespace-nowrap text-emerald-500 underline decoration-emerald-500">
                    {job.company}
                  </span>
                )}

                {/* Date */}
                <span className="text-right text-[10pt] font-bold whitespace-nowrap text-black">
                  {job.date}
                </span>
              </div>

              <ul className="m-0 list-disc pl-[18px] marker:text-blue-600">
                {job.details.map((detail, idx) => (
                  <li key={idx} className="mb-px text-justify">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* --- EDUCATION --- */}
        <section>
          <h3 className="mt-2.5 mb-1 text-[12pt] font-bold text-blue-600 normal-case">
            Education
          </h3>
          <ul className="m-0 list-disc pl-[18px] marker:text-blue-600">
            {education.map((edu, index) => (
              <li key={index} className="mb-px text-justify">
                {edu}
              </li>
            ))}
          </ul>
        </section>

        {/* --- LANGUAGES --- */}
        <section>
          <h3 className="mt-2.5 mb-1 text-[12pt] font-bold text-blue-600 normal-case">
            Languages
          </h3>
          <ul className="m-0 list-disc pl-[18px] marker:text-blue-600">
            {languages.map((lang, index) => (
              <li key={index} className="mb-px text-justify">
                {lang}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Resume;

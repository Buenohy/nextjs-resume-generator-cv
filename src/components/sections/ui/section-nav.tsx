"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface SectionNavProps {
  t: any;
}

export function SectionNav({ t }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -50% 0px",
      }
    );

    const sections = [
      "meta-ats",
      "personal-info",
      "links",
      "summary",
      "ai",
      "skills",
      "experience",
      "education",
      "certifications",
      "languages",
    ];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMounted]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getLabel = (key: string, fallback: string) => {
    try {
      return t.has(key) ? t(key) : fallback;
    } catch {
      return fallback;
    }
  };

  const navItems = [
    { id: "meta-ats", label: "Meta ATS" },
    {
      id: "personal-info",
      label: getLabel("sections.personal.title", "Header / Personal"),
    },
    { id: "links", label: getLabel("sections.links.title", "Links") },
    { id: "summary", label: getLabel("sections.summary.title", "Summary") },
    { id: "ai", label: "IA Assistant" },
    { id: "skills", label: getLabel("sections.skills.title", "Skills") },
    {
      id: "experience",
      label: getLabel("sections.experience.title", "Experience"),
    },
    {
      id: "education",
      label: getLabel("sections.education.title", "Education"),
    },
    {
      id: "certifications",
      label: getLabel("sections.certifications.title", "Certifications"),
    },
    {
      id: "languages",
      label: getLabel("sections.languages.title", "Languages"),
    },
  ];

  if (!isMounted) return null;

  return (
    <Card className="border-muted p-4 shadow-lg">
      <h4 className="text-muted-foreground mb-3 pl-1 text-sm font-semibold tracking-wider uppercase">
        {getLabel("formCard.navigation", "Seções do Currículo")}
      </h4>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex items-center rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors ${
              activeSection === item.id
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span
              className={`mr-2 h-1.5 w-1.5 rounded-full transition-all ${
                activeSection === item.id
                  ? "bg-primary scale-110"
                  : "bg-transparent"
              }`}
            />
            {item.label}
          </button>
        ))}
      </nav>
    </Card>
  );
}

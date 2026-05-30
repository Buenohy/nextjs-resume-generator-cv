"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useResumeStore } from "@/store/useResumeStore";

interface SectionNavProps {
  t: any;
}

type SubChildItem = { id: string; label: string };
type ChildItem = { id: string; label: string; children?: SubChildItem[] };
type NavItem = { id: string; label: string; children?: ChildItem[] };

export function SectionNav({ t }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const cvData = useResumeStore((s) => s.cvData);
  const keywordsList = Array.isArray(cvData?.meta_ats?.keywords)
    ? cvData.meta_ats.keywords
    : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getLabel = (key: string, fallback: string) => {
    try {
      return t.has(key) ? t(key) : fallback;
    } catch {
      return fallback;
    }
  };

  const navItems: NavItem[] = useMemo(
    () => {
      const dynamicKeywords = keywordsList.map((_, index) => ({
        id: `meta-keyword-${index}`,
        label: `Keyword ${index + 1}`,
      }));

      return [
        {
          id: "meta-ats",
          label: "ATS Metadata",
          children: [
            {
              id: "meta-lang",
              label: getLabel(
                "sections.meta_ats.metadataLanguageLabel",
                "Metadata Language"
              ),
            },
            {
              id: "meta-role_target",
              label: getLabel(
                "sections.meta_ats.fields.role_target.label",
                "Role"
              ),
            },
            {
              id: "meta-subject",
              label: getLabel(
                "sections.meta_ats.fields.subject.label",
                "Subject"
              ),
            },
            {
              id: "meta-category",
              label: getLabel(
                "sections.meta_ats.fields.category.label",
                "Category"
              ),
            },
            {
              id: "meta-contributor",
              label: getLabel(
                "sections.meta_ats.fields.contributor.label",
                "Contributor"
              ),
            },
            {
              id: "meta-coverage",
              label: getLabel(
                "sections.meta_ats.fields.coverage.label",
                "Coverage"
              ),
            },
            {
              id: "meta-identifier",
              label: getLabel(
                "sections.meta_ats.fields.identifier.label",
                "Identifier"
              ),
            },
            {
              id: "meta-publisher",
              label: getLabel(
                "sections.meta_ats.fields.publisher.label",
                "Publisher"
              ),
            },
            {
              id: "meta-relation",
              label: getLabel(
                "sections.meta_ats.fields.relation.label",
                "Relation"
              ),
            },
            {
              id: "meta-rights",
              label: getLabel(
                "sections.meta_ats.fields.rights.label",
                "Rights"
              ),
            },
            {
              id: "meta-source",
              label: getLabel(
                "sections.meta_ats.fields.source.label",
                "Source"
              ),
            },
            {
              id: "meta-type",
              label: getLabel("sections.meta_ats.fields.type.label", "Type"),
            },
            {
              id: "meta-notes",
              label: getLabel("sections.meta_ats.fields.notes.label", "Notes"),
            },
            {
              id: "meta-keywords",
              label: getLabel(
                "sections.meta_ats.keywordsOptimizerTitle",
                "Keywords Optimizer (ATS)"
              ),
              children: dynamicKeywords,
            },
          ],
        },
        {
          id: "personal-info",
          label: getLabel("sections.personal.title", "Header / Personal"),
          // ATUALIZADO PARA CONTER APENAS OS 4 CAMPOS DA IMAGEM
          children: [
            {
              id: "personal-name",
              label: getLabel("sections.header.fields.name.label", "Name"),
            },
            {
              id: "personal-role",
              label: getLabel("sections.header.fields.role.label", "Role"),
            },
            {
              id: "personal-location",
              label: getLabel(
                "sections.header.fields.location.label",
                "City/State"
              ),
            },
            {
              id: "personal-age",
              label: getLabel("sections.header.fields.age.label", "Age"),
            },
          ],
        },
        {
          id: "links",
          label: getLabel("sections.links.title", "Links"),
          children: [
            {
              id: "links-linkedin",
              label: getLabel(
                "sections.links.fields.linkedin.label",
                "LinkedIn"
              ),
            },
            {
              id: "links-phone",
              label: getLabel("sections.links.fields.phone.label", "Phone"),
            },
            {
              id: "links-websiteName",
              label: getLabel(
                "sections.links.fields.websiteName.label",
                "Website Name"
              ),
            },
            {
              id: "links-websiteUrl",
              label: getLabel(
                "sections.links.fields.websiteUrl.label",
                "Website URL"
              ),
            },
            {
              id: "links-email",
              label: getLabel("sections.links.fields.email.label", "E-Mail"),
            },
            {
              id: "links-github",
              label: getLabel("sections.links.fields.github.label", "GitHub"),
            },
          ],
        },
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keywordsList]
  );

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
        rootMargin: "-80px 0px -60% 0px",
      }
    );

    const allSectionIds = navItems.flatMap((item) => [
      item.id,
      ...(item.children?.flatMap((child) => [
        child.id,
        ...(child.children?.map((sub) => sub.id) || []),
      ]) || []),
    ]);

    allSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMounted, navItems]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isMounted) return null;

  return (
    <Card className="border-muted max-h-[85vh] overflow-y-auto p-4 shadow-lg">
      <h4 className="text-muted-foreground mb-4 pl-1 text-sm font-semibold tracking-wider uppercase">
        {getLabel("formCard.navigation", "Índice")}
      </h4>
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isParentActive =
            activeSection === item.id ||
            item.children?.some(
              (c) =>
                c.id === activeSection ||
                c.children?.some((sc) => sc.id === activeSection)
            );

          return (
            <div key={item.id} className="flex flex-col">
              <button
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors ${
                  isParentActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span
                  className={`mr-2 h-1.5 w-1.5 rounded-full transition-all ${
                    isParentActive ? "bg-primary scale-110" : "bg-transparent"
                  }`}
                />
                {item.label}
              </button>

              {item.children && item.children.length > 0 && (
                <div className="border-muted/50 mt-1 ml-5 flex flex-col gap-1 border-l-2 pl-2">
                  {item.children.map((child) => {
                    const isChildActive =
                      activeSection === child.id ||
                      child.children?.some((sc) => sc.id === activeSection);
                    const isChildStrictlyActive = activeSection === child.id;

                    return (
                      <div key={child.id} className="flex flex-col">
                        <button
                          onClick={() => scrollToSection(child.id)}
                          className={`relative rounded-r-md px-2 py-1 text-left text-xs transition-colors ${
                            isChildActive
                              ? "text-primary bg-primary/5 font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {isChildStrictlyActive && (
                            <span className="bg-primary absolute top-0 bottom-0 -left-[2px] w-[2px]" />
                          )}
                          {child.label}
                        </button>

                        {child.children && child.children.length > 0 && (
                          <div className="border-muted/30 mt-1 ml-3 flex flex-col gap-1 border-l-2 pl-2">
                            {child.children.map((subChild) => {
                              const isSubActive = activeSection === subChild.id;
                              return (
                                <button
                                  key={subChild.id}
                                  onClick={() => scrollToSection(subChild.id)}
                                  className={`relative rounded-r-md px-2 py-1 text-left text-[11px] transition-colors ${
                                    isSubActive
                                      ? "text-primary bg-primary/5 font-medium"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                  }`}
                                >
                                  {isSubActive && (
                                    <span className="bg-primary absolute top-0 bottom-0 -left-[2px] w-[2px]" />
                                  )}
                                  {subChild.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </Card>
  );
}

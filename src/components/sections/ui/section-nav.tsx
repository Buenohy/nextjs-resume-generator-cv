"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useResumeStore } from "@/store/useResumeStore";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SectionNavProps {
  t: any;
}

type LeafItem = { id: string; label: string };
type SubChildItem = { id: string; label: string; children?: LeafItem[] };
type ChildItem = { id: string; label: string; children?: SubChildItem[] };
type NavItem = { id: string; label: string; children?: ChildItem[] };

export function SectionNav({ t }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );

  const cvData = useResumeStore((s) => s.cvData);

  const keywordsList = Array.isArray(cvData?.meta_ats?.keywords)
    ? cvData.meta_ats.keywords
    : [];

  const skillsList = Array.isArray(cvData?.skills) ? cvData.skills : [];

  const experiencesList = Array.isArray(cvData?.experiences)
    ? cvData.experiences
    : [];

  const educationList = Array.isArray(cvData?.education)
    ? cvData.education
    : [];

  const certificationsList = Array.isArray(cvData?.certifications)
    ? cvData.certifications
    : [];

  const languagesList = Array.isArray(cvData?.languages)
    ? cvData.languages
    : [];

  useEffect(() => {
    setIsMounted(true);
    setExpandedNodes((prev) => {
      const initial: Record<string, boolean> = {};
      [
        "meta-ats",
        "personal-info",
        "links",
        "skills",
        "experience",
        "education",
        "certifications",
        "languages",
      ].forEach((key) => {
        initial[key] = true;
      });
      return initial;
    });
  }, []);

  const getLabel = (key: string, fallback: string) => {
    try {
      return t.has(key) ? t(key) : fallback;
    } catch {
      return fallback;
    }
  };

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navItems: NavItem[] = useMemo(
    () => {
      const dynamicKeywords = keywordsList.map((_, index) => ({
        id: `meta-keyword-${index}`,
        label: t.has("sections.meta_ats.keywordLabel")
          ? t("sections.meta_ats.keywordLabel", { num: index + 1 })
          : `Keyword ${index + 1}`,
      }));

      const dynamicSkills = skillsList.map((_, index) => ({
        id: `skills-item-${index}`,
        label: t.has("sections.skills.itemLabel")
          ? t("sections.skills.itemLabel", { num: index + 1 })
          : `Skill ${index + 1}`,
      }));

      const dynamicExperiences = experiencesList.map((exp, expIndex) => {
        const detailChildren = (exp.details || []).map((_, dIdx) => ({
          id: `experience-${expIndex}-detail-${dIdx}`,
          label: t.has("sections.experience.detailLabel")
            ? t("sections.experience.detailLabel", { num: dIdx + 1 })
            : `Detail ${dIdx + 1}`,
        }));

        const stackChildren = (exp.stacks || []).map((_, sIdx) => ({
          id: `experience-${expIndex}-stack-${sIdx}`,
          label: t.has("sections.experience.stackLabel")
            ? t("sections.experience.stackLabel", { num: sIdx + 1 })
            : `Stack ${sIdx + 1}`,
        }));

        const expSubChildren = [
          {
            id: `experience-${expIndex}-role`,
            label: getLabel("sections.experience.fields.role.label", "Role"),
          },
          {
            id: `experience-${expIndex}-company`,
            label: getLabel(
              "sections.experience.fields.company.label",
              "Company"
            ),
          },
          {
            id: `experience-${expIndex}-url`,
            label: getLabel(
              "sections.experience.fields.url.label",
              "Company URL"
            ),
          },
          {
            id: `experience-${expIndex}-date`,
            label: getLabel("sections.experience.dateTitle", "Date"),
          },
          {
            id: `experience-details-${expIndex}`,
            label: `${getLabel(
              "sections.experience.detailsTitle",
              "Project Details"
            )} (${detailChildren.length})`,
            children: detailChildren,
          },
          {
            id: `experience-stacks-${expIndex}`,
            label: `${getLabel(
              "sections.experience.stacksTitle",
              "Technologies (Stacks)"
            )} (${stackChildren.length})`,
            children: stackChildren,
          },
        ];

        return {
          id: `experience-item-${expIndex}`,
          label: `${
            t.has("sections.experience.itemLabel")
              ? t("sections.experience.itemLabel", { num: expIndex + 1 })
              : `Experience ${expIndex + 1}`
          } (${expSubChildren.length})`,
          children: expSubChildren,
        };
      });

      const dynamicEducation = educationList.map((_, index) => {
        const eduSubChildren = [
          {
            id: `education-${index}-period`,
            label: getLabel("sections.education.period", "Period"),
          },
        ];

        return {
          id: `education-item-${index}`,
          label: `${
            t.has("sections.education.itemLabel")
              ? t("sections.education.itemLabel", { num: index + 1 })
              : `Education ${index + 1}`
          } (${eduSubChildren.length})`,
          children: eduSubChildren,
        };
      });

      const dynamicCertifications = certificationsList.map((_, index) => {
        const certSubChildren = [
          {
            id: `certification-${index}-date`,
            label: getLabel("sections.certifications.date", "Date"),
          },
        ];

        return {
          id: `certification-item-${index}`,
          label: `${
            t.has("sections.certifications.itemLabel")
              ? t("sections.certifications.itemLabel", { num: index + 1 })
              : `Certificate ${index + 1}`
          } (${certSubChildren.length})`,
          children: certSubChildren,
        };
      });

      const dynamicLanguages = languagesList.map((_, index) => ({
        id: `languages-item-${index}`,
        label: t.has("sections.languages.itemLabel")
          ? t("sections.languages.itemLabel", { num: index + 1 })
          : `Language ${index + 1}`,
      }));

      const metaAtsChildren = [
        {
          id: "meta-lang",
          label: getLabel(
            "sections.meta_ats.metadataLanguageLabel",
            "Metadata Language"
          ),
        },
        {
          id: "meta-role_target",
          label: getLabel("sections.meta_ats.fields.role_target.label", "Role"),
        },
        {
          id: "meta-subject",
          label: getLabel("sections.meta_ats.fields.subject.label", "Subject"),
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
          label: getLabel("sections.meta_ats.fields.rights.label", "Rights"),
        },
        {
          id: "meta-source",
          label: getLabel("sections.meta_ats.fields.source.label", "Source"),
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
          label: `${getLabel(
            "sections.meta_ats.keywordsOptimizerTitle",
            "Keywords Optimizer (ATS)"
          )} (${dynamicKeywords.length})`,
          children: dynamicKeywords,
        },
      ];

      const personalChildren = [
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
      ];

      const linksChildren = [
        {
          id: "links-linkedin",
          label: getLabel("sections.links.fields.linkedin.label", "LinkedIn"),
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
      ];

      return [
        {
          id: "meta-ats",
          label: `${getLabel("sections.meta_ats.title", "ATS Metadata")} (${metaAtsChildren.length})`,
          children: metaAtsChildren,
        },
        {
          id: "personal-info",
          label: `${getLabel("sections.personal.title", "Header / Personal")} (${personalChildren.length})`,
          children: personalChildren,
        },
        {
          id: "links",
          label: `${getLabel("sections.links.title", "Links")} (${linksChildren.length})`,
          children: linksChildren,
        },
        { id: "summary", label: getLabel("sections.summary.title", "Summary") },
        { id: "ai", label: getLabel("sections.ai.title", "AI Assistant") },
        {
          id: "skills",
          label: `${getLabel("sections.skills.title", "Skills")} (${dynamicSkills.length})`,
          children: dynamicSkills,
        },
        {
          id: "experience",
          label: `${getLabel("sections.experience.title", "Experience")} (${dynamicExperiences.length})`,
          children: dynamicExperiences,
        },
        {
          id: "education",
          label: `${getLabel("sections.education.title", "Education")} (${dynamicEducation.length})`,
          children: dynamicEducation,
        },
        {
          id: "certifications",
          label: `${getLabel("sections.certifications.title", "Certifications")} (${dynamicCertifications.length})`,
          children: dynamicCertifications,
        },
        {
          id: "languages",
          label: `${getLabel("sections.languages.title", "Languages")} (${dynamicLanguages.length})`,
          children: dynamicLanguages,
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      keywordsList,
      skillsList,
      experiencesList,
      educationList,
      certificationsList,
      languagesList,
    ]
  );

  useEffect(() => {
    if (!isMounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            setActiveSection(activeId);

            setExpandedNodes((prev) => {
              const next = { ...prev };
              navItems.forEach((item) => {
                if (item.id === activeId) next[item.id] = true;
                item.children?.forEach((child) => {
                  if (child.id === activeId) {
                    next[item.id] = true;
                    next[child.id] = true;
                  }
                  child.children?.forEach((sub) => {
                    if (sub.id === activeId) {
                      next[item.id] = true;
                      next[child.id] = true;
                      next[sub.id] = true;
                    }
                    sub.children?.forEach((leaf) => {
                      if (leaf.id === activeId) {
                        next[item.id] = true;
                        next[child.id] = true;
                        next[sub.id] = true;
                      }
                    });
                  });
                });
              });
              return next;
            });
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
        ...(child.children?.flatMap((sub) => [
          sub.id,
          ...(sub.children?.map((leaf) => leaf.id) || []),
        ]) || []),
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
                c.children?.some(
                  (sc) =>
                    sc.id === activeSection ||
                    sc.children?.some((leaf) => leaf.id === activeSection)
                )
            );

          return (
            <div key={item.id} className="flex flex-col">
              {/* LEVEL 1 ITEM */}
              <div className="hover:bg-muted/50 flex items-center rounded-md px-1 py-1 transition-colors">
                {item.children && item.children.length > 0 ? (
                  <button
                    onClick={(e) => toggleNode(item.id, e)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted mr-1 shrink-0 rounded-md rounded-sm p-1 transition-colors"
                  >
                    {expandedNodes[item.id] ? (
                      <ChevronDown className="size-3.5" />
                    ) : (
                      <ChevronRight className="size-3.5" />
                    )}
                  </button>
                ) : (
                  <span className="w-6 shrink-0" />
                )}
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`flex-1 text-left text-sm font-medium transition-colors ${
                    isParentActive
                      ? "text-primary font-semibold"
                      : `text-muted-foreground hover:text-foreground`
                  } `}
                >
                  {item.label}
                </button>
              </div>

              {item.children &&
                item.children.length > 0 &&
                expandedNodes[item.id] && (
                  <div className="border-muted/50 mt-1 ml-5 flex flex-col gap-1 border-l-2 pl-2">
                    {item.children.map((child) => {
                      const isChildActive =
                        activeSection === child.id ||
                        child.children?.some(
                          (sc) =>
                            sc.id === activeSection ||
                            sc.children?.some(
                              (leaf) => leaf.id === activeSection
                            )
                        );
                      const isChildStrictlyActive = activeSection === child.id;

                      return (
                        <div key={child.id} className="flex flex-col">
                          {/* LEVEL 2 ITEM */}
                          <div className="hover:bg-muted/30 flex items-center rounded-md px-1 py-0.5 transition-colors">
                            {child.children && child.children.length > 0 ? (
                              <button
                                onClick={(e) => toggleNode(child.id, e)}
                                className="text-muted-foreground hover:text-foreground hover:bg-muted mr-1 shrink-0 rounded-md p-0.5 transition-colors"
                              >
                                {expandedNodes[child.id] ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>
                            ) : (
                              <span className="w-5 shrink-0" />
                            )}
                            <button
                              onClick={() => scrollToSection(child.id)}
                              className={`flex-1 text-left text-xs transition-colors ${
                                isChildActive
                                  ? "text-primary font-medium"
                                  : `text-muted-foreground hover:text-foreground`
                              } `}
                            >
                              {child.label}
                            </button>
                          </div>

                          {child.children &&
                            child.children.length > 0 &&
                            expandedNodes[child.id] && (
                              <div className="border-muted/30 mt-1 ml-3 flex flex-col gap-1 border-l-2 pl-2">
                                {child.children.map((subChild) => {
                                  const isSubActive =
                                    activeSection === subChild.id ||
                                    subChild.children?.some(
                                      (leaf) => leaf.id === activeSection
                                    );
                                  const isSubStrictlyActive =
                                    activeSection === subChild.id;

                                  return (
                                    <div
                                      key={subChild.id}
                                      className="flex flex-col"
                                    >
                                      {/* LEVEL 3 ITEM */}
                                      <div className="hover:bg-muted/20 flex items-center rounded-md px-1 py-0.5 transition-colors">
                                        {subChild.children &&
                                        subChild.children.length > 0 ? (
                                          <button
                                            onClick={(e) =>
                                              toggleNode(subChild.id, e)
                                            }
                                            className="text-muted-foreground hover:text-foreground hover:bg-muted mr-1 shrink-0 rounded-md p-0.5 transition-colors"
                                          >
                                            {expandedNodes[subChild.id] ? (
                                              <ChevronDown className="size-3" />
                                            ) : (
                                              <ChevronRight className="size-3" />
                                            )}
                                          </button>
                                        ) : (
                                          <span className="w-4 shrink-0" />
                                        )}
                                        <button
                                          onClick={() =>
                                            scrollToSection(subChild.id)
                                          }
                                          className={`flex-1 text-left text-[11px] transition-colors ${
                                            isSubActive
                                              ? "text-primary font-medium"
                                              : `text-muted-foreground hover:text-foreground`
                                          } `}
                                        >
                                          {subChild.label}
                                        </button>
                                      </div>

                                      {subChild.children &&
                                        subChild.children.length > 0 &&
                                        expandedNodes[subChild.id] && (
                                          <div className="border-muted/20 mt-1 ml-3 flex flex-col gap-1 border-l-2 pl-2">
                                            {subChild.children.map((leaf) => {
                                              const isLeafActive =
                                                activeSection === leaf.id;

                                              return (
                                                <button
                                                  key={leaf.id}
                                                  onClick={() =>
                                                    scrollToSection(leaf.id)
                                                  }
                                                  className={`relative rounded-md px-2 py-0.5 pl-4 text-left text-[10px] transition-colors ${
                                                    isLeafActive
                                                      ? `text-primary bg-primary/5 font-medium`
                                                      : `text-muted-foreground hover:text-foreground hover:bg-muted/50`
                                                  } `}
                                                >
                                                  {isLeafActive && (
                                                    <span className="bg-primary absolute inset-y-0 left-0 w-[2px]" />
                                                  )}
                                                  {leaf.label}
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
                  </div>
                )}
            </div>
          );
        })}
      </nav>
    </Card>
  );
}

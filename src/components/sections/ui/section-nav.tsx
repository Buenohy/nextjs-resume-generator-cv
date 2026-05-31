"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useResumeStore } from "@/store/useResumeStore";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  subscribeToSection,
  publishSectionToggle,
} from "@/app/hooks/useSyncCollapse";
import { Skeleton } from "@/components/ui/skeleton";

interface SectionNavProps {
  t: any;
}

type LeafItem = { id: string; label: string };
type SubChildItem = { id: string; label: string; children?: LeafItem[] };
type ChildItem = { id: string; label: string; children?: SubChildItem[] };
type NavItem = { id: string; label: string; children?: ChildItem[] };

// --- CONFIGURAÇÕES ESTÁTICAS DOS CAMPOS ---
const STATIC_META_FIELDS = [
  {
    id: "meta-lang",
    key: "sections.meta_ats.metadataLanguageLabel",
    fallback: "Metadata Language",
  },
  {
    id: "meta-role_target",
    key: "sections.meta_ats.fields.role_target.label",
    fallback: "Role",
  },
  {
    id: "meta-subject",
    key: "sections.meta_ats.fields.subject.label",
    fallback: "Subject",
  },
  {
    id: "meta-category",
    key: "sections.meta_ats.fields.category.label",
    fallback: "Category",
  },
  {
    id: "meta-contributor",
    key: "sections.meta_ats.fields.contributor.label",
    fallback: "Contributor",
  },
  {
    id: "meta-coverage",
    key: "sections.meta_ats.fields.coverage.label",
    fallback: "Coverage",
  },
  {
    id: "meta-identifier",
    key: "sections.meta_ats.fields.identifier.label",
    fallback: "Identifier",
  },
  {
    id: "meta-publisher",
    key: "sections.meta_ats.fields.publisher.label",
    fallback: "Publisher",
  },
  {
    id: "meta-relation",
    key: "sections.meta_ats.fields.relation.label",
    fallback: "Relation",
  },
  {
    id: "meta-rights",
    key: "sections.meta_ats.fields.rights.label",
    fallback: "Rights",
  },
  {
    id: "meta-source",
    key: "sections.meta_ats.fields.source.label",
    fallback: "Source",
  },
  {
    id: "meta-type",
    key: "sections.meta_ats.fields.type.label",
    fallback: "Type",
  },
  {
    id: "meta-notes",
    key: "sections.meta_ats.fields.notes.label",
    fallback: "Notes",
  },
];

const STATIC_PERSONAL_FIELDS = [
  {
    id: "personal-name",
    key: "sections.header.fields.name.label",
    fallback: "Name",
  },
  {
    id: "personal-role",
    key: "sections.header.fields.role.label",
    fallback: "Role",
  },
  {
    id: "personal-location",
    key: "sections.header.fields.location.label",
    fallback: "City/State",
  },
  {
    id: "personal-age",
    key: "sections.header.fields.age.label",
    fallback: "Age",
  },
];

const STATIC_LINKS_FIELDS = [
  {
    id: "links-linkedin",
    key: "sections.links.fields.linkedin.label",
    fallback: "LinkedIn",
  },
  {
    id: "links-phone",
    key: "sections.links.fields.phone.label",
    fallback: "Phone",
  },
  {
    id: "links-websiteName",
    key: "sections.links.fields.websiteName.label",
    fallback: "Website Name",
  },
  {
    id: "links-websiteUrl",
    key: "sections.links.fields.websiteUrl.label",
    fallback: "Website URL",
  },
  {
    id: "links-email",
    key: "sections.links.fields.email.label",
    fallback: "E-Mail",
  },
  {
    id: "links-github",
    key: "sections.links.fields.github.label",
    fallback: "GitHub",
  },
];

// --- FUNÇÃO AUXILIAR: ACHA O CAMINHO EXATO DO ITEM NO MENU ---
function getActivePath(items: NavItem[], targetId: string): string[] {
  for (const item of items) {
    if (item.id === targetId) return [item.id];
    if (item.children) {
      const childPath = getActivePath(item.children as NavItem[], targetId);
      if (childPath.length > 0) {
        return [item.id, ...childPath];
      }
    }
  }
  return [];
}

// --- FUNÇÃO GERADORA DE ITENS DO MENU ---
function generateNavItems(
  t: any,
  getLabel: (key: string, fallback: string) => string,
  data: {
    keywordsList: any[];
    skillsList: any[];
    experiencesList: any[];
    educationList: any[];
    certificationsList: any[];
    languagesList: any[];
  }
): NavItem[] {
  const {
    keywordsList,
    skillsList,
    experiencesList,
    educationList,
    certificationsList,
    languagesList,
  } = data;

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
        label: getLabel("sections.experience.fields.company.label", "Company"),
      },
      {
        id: `experience-${expIndex}-url`,
        label: getLabel("sections.experience.fields.url.label", "Company URL"),
      },
      {
        id: `experience-${expIndex}-date`,
        label: getLabel("sections.experience.dateTitle", "Date"),
      },
      {
        id: `experience-details-${expIndex}`,
        label: `${getLabel("sections.experience.detailsTitle", "Project Details")} (${detailChildren.length})`,
        children: detailChildren,
      },
      {
        id: `experience-stacks-${expIndex}`,
        label: `${getLabel("sections.experience.stacksTitle", "Technologies (Stacks)")} (${stackChildren.length})`,
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

  const dynamicEducation = educationList.map((_, index) => ({
    id: `education-item-${index}`,
    label: `${
      t.has("sections.education.itemLabel")
        ? t("sections.education.itemLabel", { num: index + 1 })
        : `Education ${index + 1}`
    } (1)`,
    children: [
      {
        id: `education-${index}-period`,
        label: getLabel("sections.education.period", "Period"),
      },
    ],
  }));

  const dynamicCertifications = certificationsList.map((_, index) => ({
    id: `certification-item-${index}`,
    label: `${
      t.has("sections.certifications.itemLabel")
        ? t("sections.certifications.itemLabel", { num: index + 1 })
        : `Certificate ${index + 1}`
    } (1)`,
    children: [
      {
        id: `certification-${index}-date`,
        label: getLabel("sections.certifications.date", "Date"),
      },
    ],
  }));

  const dynamicLanguages = languagesList.map((_, index) => ({
    id: `languages-item-${index}`,
    label: t.has("sections.languages.itemLabel")
      ? t("sections.languages.itemLabel", { num: index + 1 })
      : `Language ${index + 1}`,
  }));

  const metaAtsChildren = [
    ...STATIC_META_FIELDS.map((field) => ({
      id: field.id,
      label: getLabel(field.key, field.fallback),
    })),
    {
      id: "meta-keywords",
      label: `${getLabel("sections.meta_ats.keywordsOptimizerTitle", "Keywords Optimizer (ATS)")} (${dynamicKeywords.length})`,
      children: dynamicKeywords,
    },
  ];

  const personalChildren = STATIC_PERSONAL_FIELDS.map((field) => ({
    id: field.id,
    label: getLabel(field.key, field.fallback),
  }));
  const linksChildren = STATIC_LINKS_FIELDS.map((field) => ({
    id: field.id,
    label: getLabel(field.key, field.fallback),
  }));

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
}

// --- COMPONENTE PRINCIPAL ---
export function SectionNav({ t }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // CORRIGIDO: Inicia os nós do Índice abertos por padrão para espelhar as seções (Evita desincronização no F5)
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    "meta-ats": true,
    "personal-info": true,
    links: true,
    summary: true,
    ai: true,
    skills: true,
    experience: true,
    education: true,
    certifications: true,
    languages: true,
  });

  const cvData = useResumeStore((s) => s.cvData);

  const lists = useMemo(
    () => ({
      keywordsList: Array.isArray(cvData?.meta_ats?.keywords)
        ? cvData.meta_ats.keywords
        : [],
      skillsList: Array.isArray(cvData?.skills) ? cvData.skills : [],
      experiencesList: Array.isArray(cvData?.experiences)
        ? cvData.experiences
        : [],
      educationList: Array.isArray(cvData?.education) ? cvData.education : [],
      certificationsList: Array.isArray(cvData?.certifications)
        ? cvData.certifications
        : [],
      languagesList: Array.isArray(cvData?.languages) ? cvData.languages : [],
    }),
    [cvData]
  );

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

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !expandedNodes[id];
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: next,
    }));
    publishSectionToggle(id, next);
  };

  const navItems: NavItem[] = useMemo(
    () => generateNavItems(t, getLabel, lists),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lists]
  );

  useEffect(() => {
    if (!isMounted) return;

    const activateSection = (activeId: string) => {
      setActiveSection(activeId);
    };

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

    const unsubscribes = allSectionIds.map((id) => {
      return subscribeToSection(id, (nextOpen) => {
        setExpandedNodes((prev) => {
          if (prev[id] === nextOpen) return prev;
          return { ...prev, [id]: nextOpen };
        });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
      }
    );

    allSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      let current: HTMLElement | null = target;
      while (current && current !== document.body) {
        const id = current.getAttribute("id");
        if (id && allSectionIds.includes(id)) {
          activateSection(id);
          publishSectionToggle(id, true);
          break;
        }
        current = current.parentElement;
      }
    };

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      observer.disconnect();
      document.removeEventListener("focusin", handleFocusIn);
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [isMounted, navItems]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      publishSectionToggle(id, true);

      setExpandedNodes((prev) => ({
        ...prev,
        [id]: true,
      }));

      if (id.startsWith("meta-")) {
        publishSectionToggle("meta-ats", true);
        setExpandedNodes((prev) => ({ ...prev, "meta-ats": true }));
      } else if (id.startsWith("personal-")) {
        publishSectionToggle("personal-info", true);
        setExpandedNodes((prev) => ({ ...prev, "personal-info": true }));
      } else if (id.startsWith("links-")) {
        publishSectionToggle("links", true);
        setExpandedNodes((prev) => ({ ...prev, links: true }));
      } else if (id.startsWith("experience-")) {
        publishSectionToggle("experience", true);
        setExpandedNodes((prev) => ({ ...prev, experience: true }));
      } else if (id.startsWith("education-")) {
        publishSectionToggle("education", true);
        setExpandedNodes((prev) => ({ ...prev, education: true }));
      } else if (id.startsWith("certification-")) {
        publishSectionToggle("certifications", true);
        setExpandedNodes((prev) => ({ ...prev, certifications: true }));
      } else if (id.startsWith("languages-")) {
        publishSectionToggle("languages", true);
        setExpandedNodes((prev) => ({ ...prev, languages: true }));
      }
    }
  };

  // --- SKELETON LOADER ALINHADO SOB MEDIDA ---
  if (!isMounted) {
    return (
      <Card className="border-muted flex max-h-[85vh] flex-col gap-4 p-4 shadow-lg">
        <Skeleton className="mb-2 h-4 w-16 pl-1" />
        <div className="flex flex-col gap-3.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

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
                <button
                  onClick={(e) => toggleNode(item.id, e)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted mr-1 shrink-0 rounded-md rounded-sm p-1 transition-colors"
                >
                  {expandedNodes[item.id] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
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
                                  <ChevronDown className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5" />
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
                                              <ChevronDown className="h-3 w-3" />
                                            ) : (
                                              <ChevronRight className="h-3 w-3" />
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

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useResumeStore } from "@/store/useResumeStore";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  subscribeToSection,
  publishSectionToggle,
} from "@/app/hooks/useSyncCollapse";

// Import structural navigation data from external source
import {
  META_FIELDS,
  PERSONAL_FIELDS,
  LINKS_FIELDS,
  PARENT_SECTIONS,
} from "./nav-data";

type TranslationFn = (key: string, values?: Record<string, unknown>) => string;

interface SectionNavProps {
  t: TranslationFn;
}

interface ListsData {
  keywordsList: string[];
  skillsList: string[];
  experiencesList: Array<{
    role: string;
    company: string;
    url?: string;
    date: string;
    details: string[];
    stacks: string[];
  }>;
  educationList: string[];
  certificationsList: string[];
  languagesList: string[];
}

type NavItem = { id: string; label: string; children?: NavItem[] };

// --- NAVIGATION HELPER FUNCTIONS ---
const isNodeActive = (node: NavItem, activeId: string): boolean => {
  if (node.id === activeId) return true;
  if (node.children)
    return node.children.some((c) => isNodeActive(c, activeId));
  return false;
};

const getAllIds = (items: NavItem[]): string[] => {
  return items.reduce((acc: string[], item) => {
    acc.push(item.id);
    if (item.children) acc.push(...getAllIds(item.children));
    return acc;
  }, []);
};

// --- RECURSIVE MENU COMPONENT (UI & TAILWIND STYLES) ---
const NavNode = ({
  item,
  level = 0,
  activeSection,
  expandedNodes,
  toggleNode,
  scrollToSection,
}: {
  item: NavItem;
  level?: number;
  activeSection: string;
  expandedNodes: Record<string, boolean>;
  toggleNode: (id: string, e: React.MouseEvent) => void;
  scrollToSection: (id: string) => void;
}) => {
  // Base case: Maximum level (Leaf nodes / sub-items)
  if (level === 3) {
    const isLeafActive = activeSection === item.id;
    return (
      <button
        onClick={() => scrollToSection(item.id)}
        className={`relative rounded-md px-2 py-0.5 pl-4 text-left text-[10px] transition-colors ${
          isLeafActive
            ? "text-primary bg-primary/5 font-medium"
            : `text-muted-foreground hover:text-foreground hover:bg-muted/50`
        } `}
      >
        {isLeafActive && (
          <span className="bg-primary absolute inset-y-0 left-0 w-[2px]" />
        )}
        {item.label}
      </button>
    );
  }

  const hasChildren = item.children && item.children.length > 0;
  const isOpen = expandedNodes[item.id];
  const isActive = isNodeActive(item, activeSection);

  // Tailwind style configurations based on node level (0, 1, or 2)
  const isLvl0 = level === 0;
  const isLvl1 = level === 1;

  const headerClass = `flex items-center rounded-md px-1 transition-colors ${
    isLvl0
      ? "hover:bg-muted/50 py-1"
      : isLvl1
        ? "hover:bg-muted/30 py-0.5"
        : "hover:bg-muted/20 py-0.5"
  }`;

  const textClass = isLvl0 ? "text-sm" : isLvl1 ? "text-xs" : "text-[11px]";
  const activeTextClass = isActive
    ? `text-primary ${isLvl0 ? "font-semibold" : "font-medium"}`
    : "text-muted-foreground hover:text-foreground";

  const chevronSize = isLvl0 || isLvl1 ? "size-3.5" : "size-3";
  const spacerSize = isLvl0 ? "w-[22px]" : isLvl1 ? "w-5" : "w-4";

  const childrenBoxClass = `flex flex-col gap-1 border-l-2 ${
    isLvl0
      ? "border-muted/50 ml-5 pl-2 mt-1"
      : isLvl1
        ? "border-muted/30 ml-3 pl-2 mt-1"
        : "border-muted/20 ml-3 pl-2 mt-1"
  }`;

  return (
    <div className="flex flex-col">
      <div className={headerClass}>
        {hasChildren ? (
          <button
            onClick={(e) => toggleNode(item.id, e)}
            className={`text-muted-foreground hover:text-foreground hover:bg-muted mr-1 shrink-0 rounded-md transition-colors ${
              isLvl0 ? "p-1" : "p-0.5"
            } `}
          >
            {isOpen ? (
              <ChevronDown className={chevronSize} />
            ) : (
              <ChevronRight className={chevronSize} />
            )}
          </button>
        ) : (
          <span className={`mr-1 shrink-0 ${spacerSize} `} />
        )}
        <button
          onClick={() => scrollToSection(item.id)}
          className={`flex-1 text-left transition-colors ${textClass} ${activeTextClass} `}
        >
          {item.label}
        </button>
      </div>

      {hasChildren && isOpen && (
        <div className={childrenBoxClass}>
          {item.children!.map((child) => (
            <NavNode
              key={child.id}
              item={child}
              level={level + 1}
              activeSection={activeSection}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              scrollToSection={scrollToSection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- DYNAMIC NAVIGATION MENU GENERATION ---
function generateNavItems(
  t: TranslationFn,
  getLabel: (
    key: string,
    fallback: string,
    values?: Record<string, unknown>
  ) => string,
  data: ListsData
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
    label: getLabel("sections.meta_ats.keywordLabel", `Keyword ${index + 1}`, {
      num: index + 1,
    }),
  }));

  const metaAtsChildren: NavItem[] = [
    {
      id: "meta-lang",
      label: getLabel(
        "sections.meta_ats.metadataLanguageLabel",
        "Metadata Language"
      ),
    },
    ...META_FIELDS.map((f) => ({
      id: `meta-${f}`,
      label: getLabel(`sections.meta_ats.fields.${f}.label`, f),
    })),
    {
      id: "meta-keywords",
      label: `${getLabel("sections.meta_ats.keywordsOptimizerTitle", "Keywords Optimizer")} (${dynamicKeywords.length})`,
      children: dynamicKeywords,
    },
  ];

  const personalChildren: NavItem[] = PERSONAL_FIELDS.map((f) => ({
    id: f.id,
    label: getLabel(`sections.header.fields.${f.key}.label`, f.key),
  }));

  const linksChildren: NavItem[] = LINKS_FIELDS.map((f) => ({
    id: f.id,
    label: getLabel(`sections.links.fields.${f.key}.label`, f.key),
  }));

  const dynamicExperiences: NavItem[] = experiencesList.map((exp, expIndex) => {
    const detailChildren = (exp.details || []).map((_, dIdx) => ({
      id: `experience-${expIndex}-detail-${dIdx}`,
      label: getLabel("sections.experience.detailLabel", `Detail ${dIdx + 1}`, {
        num: dIdx + 1,
      }),
    }));

    const stackChildren = (exp.stacks || []).map((_, sIdx) => ({
      id: `experience-${expIndex}-stack-${sIdx}`,
      label: getLabel("sections.experience.stackLabel", `Stack ${sIdx + 1}`, {
        num: sIdx + 1,
      }),
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
        label: getLabel("sections.experience.fields.date.label", "Date"),
      },
      {
        id: `experience-details-${expIndex}`,
        label: `${getLabel("sections.experience.detailsTitle", "Project Details")} (${detailChildren.length})`,
        children: detailChildren,
      },
      {
        id: `experience-stacks-${expIndex}`,
        label: `${getLabel("sections.experience.stacksTitle", "Technologies")} (${stackChildren.length})`,
        children: stackChildren,
      },
    ];

    return {
      id: `experience-item-${expIndex}`,
      label: `${getLabel("sections.experience.itemLabel", `Experience ${expIndex + 1}`, { num: expIndex + 1 })} (${expSubChildren.length})`,
      children: expSubChildren,
    };
  });

  const dynamicSkills: NavItem[] = skillsList.map((_, i) => ({
    id: `skills-item-${i}`,
    label: getLabel("sections.skills.itemLabel", `Skill ${i + 1}`, {
      num: i + 1,
    }),
  }));

  const dynamicEducation: NavItem[] = educationList.map((_, i) => ({
    id: `education-item-${i}`,
    label: `${getLabel("sections.education.itemLabel", `Education ${i + 1}`, { num: i + 1 })} (1)`,
    children: [
      {
        id: `education-${i}-period`,
        label: getLabel("sections.education.period", "Period"),
      },
    ],
  }));

  const dynamicCertifications: NavItem[] = certificationsList.map((_, i) => ({
    id: `certification-item-${i}`,
    label: `${getLabel("sections.certifications.itemLabel", `Certificate ${i + 1}`, { num: i + 1 })} (1)`,
    children: [
      {
        id: `certification-${i}-date`,
        label: getLabel("sections.certifications.date", "Date"),
      },
    ],
  }));

  const dynamicLanguages: NavItem[] = languagesList.map((_, i) => ({
    id: `languages-item-${i}`,
    label: getLabel("sections.languages.itemLabel", `Language ${i + 1}`, {
      num: i + 1,
    }),
  }));

  return [
    {
      id: "company-info",
      label: getLabel("sections.company.title", "Target Company"),
    },
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
      label: `${getLabel("sections.skills.title", "Skills")} (${skillsList.length})`,
      children: dynamicSkills,
    },
    {
      id: "experience",
      label: `${getLabel("sections.experience.title", "Experience")} (${dynamicExperiences.length})`,
      children: dynamicExperiences,
    },
    {
      id: "education",
      label: `${getLabel("sections.education.title", "Education")} (${educationList.length})`,
      children: dynamicEducation,
    },
    {
      id: "certifications",
      label: `${getLabel("sections.certifications.title", "Certifications")} (${certificationsList.length})`,
      children: dynamicCertifications,
    },
    {
      id: "languages",
      label: `${getLabel("sections.languages.title", "Languages")} (${languagesList.length})`,
      children: dynamicLanguages,
    },
  ];
}

// --- MAIN NAVIGATIONAL COMPONENT (STATE & SCROLL LOGIC) ---
export function SectionNav({ t }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    {}
  );
  const cvData = useResumeStore((s) => s.cvData);

  const lists: ListsData = useMemo(
    () => ({
      keywordsList: Array.isArray(cvData?.meta_ats?.keywords)
        ? (cvData.meta_ats.keywords as string[])
        : [],
      skillsList: Array.isArray(cvData?.skills)
        ? (cvData.skills as string[])
        : [],
      experiencesList: Array.isArray(cvData?.experiences)
        ? (cvData.experiences as ListsData["experiencesList"])
        : [],
      educationList: Array.isArray(cvData?.education)
        ? (cvData.education as string[])
        : [],
      certificationsList: Array.isArray(cvData?.certifications)
        ? (cvData.certifications as string[])
        : [],
      languagesList: Array.isArray(cvData?.languages)
        ? (cvData.languages as string[])
        : [],
    }),
    [cvData]
  );

  useEffect(() => setIsMounted(true), []);

  const getLabel = (
    key: string,
    fallback: string,
    values?: Record<string, unknown>
  ) => {
    try {
      return t.has(key) ? t(key, values) : fallback;
    } catch {
      return fallback;
    }
  };

  const navItems = useMemo(
    () => generateNavItems(t, getLabel, lists),
    [lists, t]
  );

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !expandedNodes[id];
    setExpandedNodes((prev) => ({ ...prev, [id]: next }));
    publishSectionToggle(id, next);
  };

  useEffect(() => {
    if (!isMounted) return;

    const allSectionIds = getAllIds(navItems);

    const unsubscribes = allSectionIds.map((id) =>
      subscribeToSection(id, (nextOpen) => {
        setExpandedNodes((prev) =>
          prev[id] === nextOpen ? prev : { ...prev, [id]: nextOpen }
        );
      })
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    allSectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleFocusIn = (e: FocusEvent) => {
      let current = e.target as HTMLElement | null;
      while (current && current !== document.body) {
        const id = current.getAttribute("id");
        if (id && allSectionIds.includes(id)) {
          setActiveSection(id);
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
      setExpandedNodes((prev) => ({ ...prev, [id]: true }));

      // Synchronize parent section collapse state via section map
      const prefix = id.split("-")[0];
      const parentId = PARENT_SECTIONS[prefix];
      if (parentId) {
        publishSectionToggle(parentId, true);
        setExpandedNodes((prev) => ({ ...prev, [parentId]: true }));
      }
    }
  };

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
        {getLabel("formCard.navigation", "Navigation Index")}
      </h4>
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => (
          <NavNode
            key={item.id}
            item={item}
            activeSection={activeSection}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            scrollToSection={scrollToSection}
          />
        ))}
      </nav>
    </Card>
  );
}

import { NextResponse } from "next/server";
import { extractKeywords, extractExperience } from "@/lib/job-parser";
import { analyzeVerbs } from "@/lib/auto-optimizer";
import { validateMetaWithJob } from "@/lib/meta-validator";
import { getTranslations } from "next-intl/server";

interface ExperienceInput {
  role?: string;
  company?: string;
  stacks?: string | string[];
  details?: string[];
}

interface CvDataInput {
  info?: {
    name?: string;
    role?: string;
    city?: string;
  };
  summary?: string;
  skills?: string[];
  experiences?: ExperienceInput[];
  education?: string[];
  certifications?: string[];
  languages?: string[];
  company?: string;
}

interface KeywordData {
  meta?: number;
  vaga?: number;
}

interface VerbIssue {
  original: string;
  suggestions: string[];
  context: string;
}

interface ValidationWarnings {
  keywords: string[];
  roleTarget: string | null;
  subjectWords: string[];
  infoRoleMismatch: boolean;
}

// Extract and aggregate text from nested CV sections defensively
function extractCvText(cvData: CvDataInput | undefined): string {
  let text = "";
  if (!cvData) return text;

  if (cvData.info) {
    text += ` ${cvData.info.name || ""} ${cvData.info.role || ""} ${cvData.info.city || ""}`;
  }

  if (cvData.summary && typeof cvData.summary === "string") {
    text += ` ${cvData.summary}`;
  }

  if (Array.isArray(cvData.skills)) {
    const cleanSkills = cvData.skills.filter(
      (s): s is string => typeof s === "string" && s.trim() !== ""
    );
    text += ` ${cleanSkills.join(" ")}`;
  }

  if (Array.isArray(cvData.experiences)) {
    for (const exp of cvData.experiences) {
      if (!exp) continue;
      const role = exp.role || "";
      const company = exp.company || "";
      const stacks = Array.isArray(exp.stacks)
        ? exp.stacks.join(" ")
        : exp.stacks || "";

      text += ` ${role} ${company} ${stacks}`;

      if (Array.isArray(exp.details)) {
        const cleanDetails = exp.details.filter(
          (d): d is string => typeof d === "string" && d.trim() !== ""
        );
        text += ` ${cleanDetails.join(" ")}`;
      }
    }
  }

  if (Array.isArray(cvData.education)) {
    const cleanEdu = cvData.education.filter(
      (e): e is string => typeof e === "string" && e.trim() !== ""
    );
    text += ` ${cleanEdu.join(" ")}`;
  }
  if (Array.isArray(cvData.certifications)) {
    const cleanCert = cvData.certifications.filter(
      (c): c is string => typeof c === "string" && c.trim() !== ""
    );
    text += ` ${cleanCert.join(" ")}`;
  }
  if (Array.isArray(cvData.languages)) {
    const cleanLang = cvData.languages.filter(
      (l): l is string => typeof l === "string" && l.trim() !== ""
    );
    text += ` ${cleanLang.join(" ")}`;
  }

  return text.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { jobText = "", cvData } = body as {
      jobText?: string;
      cvData?: CvDataInput;
    };

    const referer = request.headers.get("referer") || "";
    const isPtUrl = referer.includes("/pt/") || referer.endsWith("/pt");
    const currentLocale = isPtUrl ? "pt" : "en";

    const cvTextLower = extractCvText(cvData);

    // 1. Metadata Validation Setup with correct Typing
    const defaultWarnings: ValidationWarnings = {
      keywords: [],
      roleTarget: null,
      subjectWords: [],
      infoRoleMismatch: false,
    };

    let validation = { warnings: defaultWarnings };

    try {
      if (jobText && cvData) {
        validation = (validateMetaWithJob(jobText, cvData) as {
          warnings: ValidationWarnings;
        }) || {
          warnings: defaultWarnings,
        };
      }
    } catch (e) {
      console.error("Safely caught metadata validation error:", e);
    }

    // 2. Job Description Keywords Parsing
    const parsedKeywords = (extractKeywords(jobText) || {}) as Record<
      string,
      KeywordData
    >;
    const keywordsTable = Object.entries(parsedKeywords).map(
      ([keyword, data], index) => {
        const escapedKw = (keyword || "").replace(
          /[-\/\\^$*+?.()|[\]{}]/g,
          "\\$&"
        );
        const regex = new RegExp(`(?<!\\w)${escapedKw}(?!\\w)`, "gi");

        const onResume = cvTextLower
          ? (cvTextLower.match(regex) || []).length
          : 0;

        const goal2x = data?.meta ?? 1;
        const inVacancy = data?.vaga ?? 1;
        const isApproved = onResume >= goal2x;

        return {
          id: String(index + 1),
          keyword: (keyword || "").toUpperCase(),
          inVacancy,
          goal2x,
          onResume,
          status: isApproved ? ("Approved" as const) : ("Pending" as const),
        };
      }
    );

    // 2.5 Dynamic Multi-year Experience Requirements Parsing
    const requiredYearsList = extractExperience(jobText) as number[];

    for (const years of requiredYearsList) {
      const exactJobRegex = new RegExp(
        `\\b${years}\\s*\\+?\\s*(?:anos?|years?|yrs?)\\b`,
        "gi"
      );
      const inVacancyCount = (jobText.match(exactJobRegex) || []).length;

      // Fallback to 1 if exact matching pattern is not located but requirement exists
      const inVacancy = inVacancyCount > 0 ? inVacancyCount : 1;
      const goal2x = inVacancy * 2;

      const expRegex = new RegExp(
        `\\b${years}\\s*(?:anos?|years?|yrs?)\\b`,
        "gi"
      );
      const onResume = cvTextLower
        ? (cvTextLower.match(expRegex) || []).length
        : 0;
      const isApproved = onResume >= goal2x;

      let expKeywordName = "";
      try {
        const t = await getTranslations({
          locale: currentLocale,
          namespace: "ResumeBuilderPage",
        });
        expKeywordName = t("feedbackCard.experienceWord", { years: years });
      } catch (e) {
        expKeywordName =
          currentLocale === "pt"
            ? `Experiência (${years} Anos)`
            : `Experience (${years} Years)`;
      }

      // Prepend elements so larger requirements appear first in the UI
      keywordsTable.unshift({
        id: `exp-${years}`,
        keyword: expKeywordName.toUpperCase(),
        inVacancy,
        goal2x,
        onResume,
        status: isApproved ? ("Approved" as const) : ("Pending" as const),
      });
    }

    // 3. Action Verbs Analysis
    const verbIssues: VerbIssue[] = [];

    if (cvData?.summary && typeof cvData.summary === "string") {
      const summaryIssues = analyzeVerbs(
        cvData.summary,
        "Resumo (Summary)",
        currentLocale
      ) as VerbIssue[];
      if (Array.isArray(summaryIssues)) {
        verbIssues.push(...summaryIssues);
      }
    }

    if (Array.isArray(cvData?.experiences)) {
      for (const exp of cvData.experiences) {
        if (exp && Array.isArray(exp.details)) {
          for (const detail of exp.details) {
            if (detail && typeof detail === "string") {
              const expIssues = analyzeVerbs(
                detail,
                `Exp: ${exp.company || "Company"}`,
                currentLocale
              ) as VerbIssue[];
              if (Array.isArray(expIssues)) {
                verbIssues.push(...expIssues);
              }
            }
          }
        }
      }
    }

    // 4. Highlight Flagged/Suspect Words
    const suspectWords: string[] = [];
    if (cvTextLower) {
      if (/\btodo\b/i.test(cvTextLower)) suspectWords.push("todo");
    }

    return NextResponse.json({
      success: true,
      warnings: validation.warnings || [],
      keywordsTable,
      verbIssues,
      suspectWords,
    });
  } catch (error) {
    console.error("Critical API error caught in /api/analyze:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error handled safely.",
      },
      { status: 500 }
    );
  }
}

export interface ValidationResult {
  isValid: boolean;
  warnings: {
    keywords: string[];
    roleTarget: string | null;
    subjectWords: string[];
    infoRoleMismatch: boolean;
  };
}

export interface ValidationCvInput {
  meta_ats?: {
    keywords?: string | string[];
    role_target?: string;
    subject?: string;
  };
  info?: {
    role?: string;
  };
}

// Bilingual list of generic filler terms to filter out when parsing specific role niches
const FILLER_WORDS = new Set([
  // Portuguese (PT)
  "desenvolvedor",
  "desenvolvedora",
  "engenheiro",
  "engenheira",
  "programador",
  "programadora",
  "analista",
  "senior",
  "pleno",
  "junior",
  "de",
  "para",
  "em",
  "especialista",
  "lider",
  "coordenador",
  "gerente",
  // English (EN)
  "developer",
  "engineer",
  "programmer",
  "analyst",
  "senior",
  "mid",
  "pleno",
  "junior",
  "lead",
  "staff",
  "principal",
  "manager",
  "specialist",
  "of",
  "for",
  "in",
]);

export function validateMetaWithJob(
  jobText: string,
  cvData: ValidationCvInput | undefined
): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    warnings: {
      keywords: [],
      roleTarget: null,
      subjectWords: [],
      infoRoleMismatch: false,
    },
  };

  if (!jobText || !cvData) return result;

  const jobLower = jobText.toLowerCase();
  const meta = cvData.meta_ats || {};

  // Keywords validation logic
  if (meta.keywords) {
    const kwList = Array.isArray(meta.keywords)
      ? meta.keywords.map((k) => String(k).trim().toLowerCase())
      : String(meta.keywords)
          .split(",")
          .map((k: string) => k.trim().toLowerCase());

    for (const kw of kwList) {
      if (kw && isNaN(Number(kw)) && !jobLower.includes(kw)) {
        result.warnings.keywords.push(kw);
      }
    }
  }

  // Target role metadata validation (with filler word exclusion)
  if (meta.role_target) {
    const target = meta.role_target.toLowerCase();
    const targetParts = target.split(/\s+/).filter((w: string) => w.length > 2);

    // Filter out common filler words (e.g., skip "developer", match against "ios")
    const specificParts = targetParts.filter(
      (part: string) => !FILLER_WORDS.has(part)
    );

    // Default back to full parts if only filler words are present
    const partsToValidate =
      specificParts.length > 0 ? specificParts : targetParts;

    const hasMatch = partsToValidate.some((part: string) =>
      jobLower.includes(part)
    );
    if (!hasMatch) {
      result.warnings.roleTarget = meta.role_target;
    }
  }

  // Subject metadata validation
  if (meta.subject) {
    const subjectClean = meta.subject.toLowerCase();
    const subjectWords = subjectClean.match(/[a-zA-ZÀ-ÿ]{4,}/g) || [];
    const missingSubject = subjectWords.filter(
      (w: string) => !jobLower.includes(w)
    );
    if (missingSubject.length > 0) {
      result.warnings.subjectWords = Array.from(new Set(missingSubject));
    }
  }

  // Header job title validation (with filler word exclusion)
  const infoRole = (cvData.info?.role || "").toLowerCase();
  if (infoRole) {
    const roleParts = infoRole.split(/\s+/).filter((w: string) => w.length > 3);

    const specificRoleParts = roleParts.filter(
      (part: string) => !FILLER_WORDS.has(part)
    );
    const partsToValidate =
      specificRoleParts.length > 0 ? specificRoleParts : roleParts;

    const hasRoleMatch = partsToValidate.some((part: string) =>
      jobLower.includes(part)
    );
    if (hasRoleMatch === false && partsToValidate.length > 0) {
      result.warnings.infoRoleMismatch = true;
    }
  }

  const hasAnyWarning =
    result.warnings.keywords.length > 0 ||
    result.warnings.roleTarget !== null ||
    result.warnings.subjectWords.length > 0 ||
    result.warnings.infoRoleMismatch;

  if (hasAnyWarning) {
    result.isValid = false;
  }

  return result;
}

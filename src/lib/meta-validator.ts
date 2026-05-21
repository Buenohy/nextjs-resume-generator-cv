export interface ValidationResult {
  isValid: boolean;
  warnings: {
    keywords: string[];
    roleTarget: string | null;
    subjectWords: string[];
    infoRoleMismatch: boolean;
  };
}

export function validateMetaWithJob(
  jobText: string,
  cvData: any
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

  if (!jobText) return result;

  const jobLower = jobText.toLowerCase();
  const meta = cvData.meta_ats || {};

  if (meta.keywords) {
    const kwList = meta.keywords
      .split(",")
      .map((k: string) => k.trim().toLowerCase());
    for (const kw of kwList) {
      if (kw && !jobLower.includes(kw)) {
        result.warnings.keywords.push(kw);
      }
    }
  }

  if (meta.role_target) {
    const target = meta.role_target.toLowerCase();
    const targetParts = target.split(/\s+/).filter((w: string) => w.length > 2);
    const hasMatch = targetParts.some((part: string) =>
      jobLower.includes(part)
    );
    if (!hasMatch) {
      result.warnings.roleTarget = meta.role_target;
    }
  }

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

  const infoRole = (cvData.info?.role || "").toLowerCase();
  if (infoRole) {
    const roleParts = infoRole.split(/\s+/).filter((w: string) => w.length > 3);
    const hasRoleMatch = roleParts.some((part: string) =>
      jobLower.includes(part)
    );
    if (hasRoleMatch === false && roleParts.length > 0) {
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

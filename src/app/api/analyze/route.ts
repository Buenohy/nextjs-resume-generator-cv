import { NextResponse } from "next/server";
import { extractKeywords, extractExperience } from "@/lib/job-parser";
import { analyzeVerbs } from "@/lib/auto-optimizer";
import { validateMetaWithJob } from "@/lib/meta-validator";
import { getTranslations } from "next-intl/server";

// FUNÇÃO EXTRATORA DE TEXTO COM FILTRAGEM DEFENSIVA DE SEÇÃO
function extractCvText(cvData: any): string {
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
      (s: any) => s && typeof s === "string"
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
          (d: any) => d && typeof d === "string"
        );
        text += ` ${cleanDetails.join(" ")}`;
      }
    }
  }

  if (Array.isArray(cvData.education)) {
    const cleanEdu = cvData.education.filter(
      (e: any) => e && typeof e === "string"
    );
    text += ` ${cleanEdu.join(" ")}`;
  }
  if (Array.isArray(cvData.certifications)) {
    const cleanCert = cvData.certifications.filter(
      (c: any) => c && typeof c === "string"
    );
    text += ` ${cleanCert.join(" ")}`;
  }
  if (Array.isArray(cvData.languages)) {
    const cleanLang = cvData.languages.filter(
      (l: any) => l && typeof l === "string"
    );
    text += ` ${cleanLang.join(" ")}`;
  }

  return text.trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { jobText = "", cvData } = body;

    // NOVO: Captura a URL de onde o usuário fez a requisição (ex: http://meusite.com/pt/...)
    const referer = request.headers.get("referer") || "";
    // Se a URL contiver "/pt", usamos "pt", senão "en"
    const isPtUrl = referer.includes("/pt/") || referer.endsWith("/pt");
    const currentLocale = isPtUrl ? "pt" : "en";

    const cvTextLower = extractCvText(cvData);

    // 1. VALIDAÇÃO DOS METADADOS
    let validation = { warnings: [] as string[] };
    try {
      if (jobText && cvData) {
        validation = validateMetaWithJob(jobText, cvData) || { warnings: [] };
      }
    } catch (e) {
      console.error("Erro seguro interceptado na validação de metadados:", e);
    }

    // 2. PARSE DAS PALAVRAS-CHAVE DA VAGA
    const parsedKeywords = extractKeywords(jobText) || {};
    const keywordsTable = Object.entries(parsedKeywords).map(
      ([keyword, data]: [string, any], index) => {
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
          status: isApproved ? ("Aprovado" as const) : ("Pendente" as const),
        };
      }
    );

    // 2.5 PARSE DA EXPERIÊNCIA (INJETADO NA TABELA)
    const expResults = extractExperience(jobText);
    if (expResults.minYears > 0) {
      const exactJobRegex = new RegExp(
        `\\b${expResults.minYears}\\s*\\+?\\s*(?:anos?|years?|yrs?)\\b`,
        "gi"
      );
      const inVacancyCount = (jobText.match(exactJobRegex) || []).length;
      const inVacancy = inVacancyCount > 0 ? inVacancyCount : 1;

      const goal2x = inVacancy * 2;

      const expRegex = new RegExp(
        `\\b${expResults.minYears}\\s*(?:anos?|years?|yrs?)\\b`,
        "gi"
      );
      const onResume = cvTextLower
        ? (cvTextLower.match(expRegex) || []).length
        : 0;
      const isApproved = onResume >= goal2x;

      // CORRIGIDO: Passando o exato 'currentLocale' (pt ou en) extraído da URL para o next-intl
      let expKeywordName = "";
      try {
        const t = await getTranslations({
          locale: currentLocale,
          namespace: "ResumeBuilderPage",
        });
        expKeywordName = t("feedbackCard.experienceWord", {
          years: expResults.minYears,
        });
      } catch (e) {
        // Fallback blindado caso o next-intl falhe na rota serverless
        expKeywordName =
          currentLocale === "pt"
            ? `Experiência (${expResults.minYears} Anos)`
            : `Experience (${expResults.minYears} Years)`;
      }

      keywordsTable.unshift({
        id: "exp-0",
        keyword: expKeywordName.toUpperCase(),
        inVacancy,
        goal2x,
        onResume,
        status: isApproved ? ("Aprovado" as const) : ("Pendente" as const),
      });
    }

    // 3. ANÁLISE DOS VERBOS DE AÇÃO
    const verbIssues: any[] = [];

    if (cvData?.summary && typeof cvData.summary === "string") {
      const summaryIssues = analyzeVerbs(
        cvData.summary,
        "Resumo (Summary)",
        currentLocale // Usando o locale detectado pela URL
      );
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
                `Exp: ${exp.company || "Empresa"}`,
                currentLocale // Usando o locale detectado pela URL
              );
              if (Array.isArray(expIssues)) {
                verbIssues.push(...expIssues);
              }
            }
          }
        }
      }
    }

    // 4. PALAVRAS SUSPEITAS
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
    console.error("Erro crítico na API /api/analyze interceptado:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno no servidor tratado com segurança.",
      },
      { status: 500 }
    );
  }
}

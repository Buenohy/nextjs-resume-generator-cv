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

    const referer = request.headers.get("referer") || "";
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

    // 2.5 PARSE DA EXPERIÊNCIA MULTIPLA (INJETADO NA TABELA)
    // Agora requiredYearsList retorna algo como [2, 3]
    const requiredYearsList = extractExperience(jobText);

    // Usamos um for...of para poder lidar com a tradução (await getTranslations) para cada número
    for (const years of requiredYearsList) {
      const exactJobRegex = new RegExp(
        `\\b${years}\\s*\\+?\\s*(?:anos?|years?|yrs?)\\b`,
        "gi"
      );
      const inVacancyCount = (jobText.match(exactJobRegex) || []).length;

      // Se não achou com o regex exato (ex: "experience \n 3+"), garante que pelo menos foi 1 vez
      const inVacancy = inVacancyCount > 0 ? inVacancyCount : 1;
      const goal2x = inVacancy * 2;

      // Busca na vaga
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

      // Ao usar unshift com Array [2, 3], o 2 entra primeiro.
      // Depois o 3 entra EMPURRANDO o 2 para baixo.
      // Fica perfeito: O maior requisito (3 anos) aparece no topo da lista.
      keywordsTable.unshift({
        id: `exp-${years}`,
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
        currentLocale
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
                currentLocale
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

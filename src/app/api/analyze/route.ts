import { NextResponse } from "next/server";
import { extractKeywords } from "@/lib/job-parser";
import { analyzeVerbs } from "@/lib/auto-optimizer";
import { validateMetaWithJob } from "@/lib/meta-validator";

// FUNÇÃO EXTRATORA DE TEXTO COM FILTRAGEM DEFENSIVA DE SEÇÃO
function extractCvText(cvData: any): string {
  let text = "";
  if (!cvData) return text;

  // Informações Pessoais
  if (cvData.info) {
    text += ` ${cvData.info.name || ""} ${cvData.info.role || ""} ${cvData.info.city || ""}`;
  }

  // Resumo Profissional
  if (cvData.summary && typeof cvData.summary === "string") {
    text += ` ${cvData.summary}`;
  }

  // Habilidades (Filtra apenas strings válidas)
  if (Array.isArray(cvData.skills)) {
    const cleanSkills = cvData.skills.filter(
      (s: any) => s && typeof s === "string"
    );
    text += ` ${cleanSkills.join(" ")}`;
  }

  // Experiências Profissionais
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

  // Educação, Certificações e Idiomas
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

    const language = cvData?.info?.language === "pt-BR" ? "pt" : "en";
    const cvTextLower = extractCvText(cvData);

    // 1. VALIDAÇÃO DOS METADADOS (Envelopado em try/catch para evitar crash com formulário vazio)
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

        // Garante que o matcher de regex rode em cima de uma string válida
        const onResume = cvTextLower
          ? (cvTextLower.match(regex) || []).length
          : 0;

        // Fallbacks seguros de número para evitar crashes de tipagem
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

    // 3. ANÁLISE DOS VERBOS DE AÇÃO
    const verbIssues: any[] = [];

    if (cvData?.summary && typeof cvData.summary === "string") {
      const summaryIssues = analyzeVerbs(
        cvData.summary,
        "Resumo (Summary)",
        language
      );
      if (Array.isArray(summaryIssues)) {
        verbIssues.push(...summaryIssues);
      }
    }

    if (Array.isArray(cvData?.experiences)) {
      for (const exp of cvData.experiences) {
        if (exp && Array.isArray(exp.details)) {
          for (const detail of exp.details) {
            // Só manda analisar se o detalhe for uma string preenchida
            if (detail && typeof detail === "string") {
              const expIssues = analyzeVerbs(
                detail,
                `Exp: ${exp.company || "Empresa"}`,
                language
              );
              if (Array.isArray(expIssues)) {
                verbIssues.push(...expIssues);
              }
            }
          }
        }
      }
    }

    // 4. PALAVRAS SUSPEITAS (TODO, URL)
    const suspectWords: string[] = [];
    if (cvTextLower) {
      if (cvTextLower.includes("todo")) suspectWords.push("todo");
      if (cvTextLower.includes("url")) suspectWords.push("url");
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

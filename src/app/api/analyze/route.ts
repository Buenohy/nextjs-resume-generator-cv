import { NextResponse } from "next/server";
import { extractKeywords } from "@/lib/job-parser";
import { analyzeVerbs } from "@/lib/auto-optimizer";
import { validateMetaWithJob } from "@/lib/meta-validator";

function extractCvText(cvData: any): string {
  let text = "";
  if (!cvData) return text;

  if (cvData.info) {
    text += ` ${cvData.info.name || ""} ${cvData.info.role || ""} ${cvData.info.city || ""}`;
  }

  if (cvData.summary) {
    text += ` ${cvData.summary}`;
  }

  if (Array.isArray(cvData.skills)) {
    text += ` ${cvData.skills.join(" ")}`;
  }

  if (Array.isArray(cvData.experiences)) {
    for (const exp of cvData.experiences) {
      text += ` ${exp.role || ""} ${exp.company || ""} ${exp.stacks || ""}`;
      if (Array.isArray(exp.details)) {
        text += ` ${exp.details.join(" ")}`;
      }
    }
  }

  if (Array.isArray(cvData.education)) text += ` ${cvData.education.join(" ")}`;
  if (Array.isArray(cvData.certifications))
    text += ` ${cvData.certifications.join(" ")}`;
  if (Array.isArray(cvData.languages)) text += ` ${cvData.languages.join(" ")}`;

  return text.toLowerCase();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobText, cvData } = body;

    const language = cvData?.info?.language === "pt-BR" ? "pt" : "en";
    const cvTextLower = extractCvText(cvData);

    const validation = validateMetaWithJob(jobText, cvData);

    const parsedKeywords = extractKeywords(jobText) || {};
    const keywordsTable = Object.entries(parsedKeywords).map(
      ([keyword, data]: [string, any], index) => {
        const escapedKw = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(`(?<!\\w)${escapedKw}(?!\\w)`, "gi");
        const onResume = (cvTextLower.match(regex) || []).length;
        const isApproved = onResume >= data.meta;

        return {
          id: String(index + 1),
          keyword: keyword.toUpperCase(),
          inVacancy: data.vaga,
          goal2x: data.meta,
          onResume,
          status: isApproved ? ("Aprovado" as const) : ("Pendente" as const),
        };
      }
    );

    const verbIssues: any[] = [];
    if (cvData?.summary) {
      const summaryIssues = analyzeVerbs(
        cvData.summary,
        "Resumo (Summary)",
        language
      );
      verbIssues.push(...summaryIssues);
    }

    if (Array.isArray(cvData?.experiences)) {
      for (const exp of cvData.experiences) {
        if (Array.isArray(exp.details)) {
          for (const detail of exp.details) {
            const expIssues = analyzeVerbs(
              detail,
              `Exp: ${exp.company || "Empresa"}`,
              language
            );
            verbIssues.push(...expIssues);
          }
        }
      }
    }

    const suspectWords: string[] = [];
    if (cvTextLower.includes("todo")) suspectWords.push("todo");
    if (cvTextLower.includes("url")) suspectWords.push("url");

    return NextResponse.json({
      success: true,
      warnings: validation.warnings,
      keywordsTable,
      verbIssues,
      suspectWords,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

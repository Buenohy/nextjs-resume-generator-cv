import { NextResponse } from "next/server";
import { extractKeywords } from "@/lib/job-parser";
import { analyzeVerbs } from "@/lib/auto-optimizer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobText, cvData, language } = body;

    const keywords = extractKeywords(jobText);

    const verbIssues = [];
    if (cvData.summary) {
      const summaryIssues = analyzeVerbs(cvData.summary, "Resumo", language);
      verbIssues.push(...summaryIssues);
    }

    if (cvData.experience) {
      for (const exp of cvData.experience) {
        if (exp.details) {
          for (const detail of exp.details) {
            const expIssues = analyzeVerbs(
              detail,
              `Exp: ${exp.company}`,
              language
            );
            verbIssues.push(...expIssues);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      keywords,
      verbIssues,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

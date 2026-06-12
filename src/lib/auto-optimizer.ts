export interface ImprovementSuggestion {
  original: string;
  suggestions: string[];
  context: string;
}

interface OptimizerConfig {
  weakVerbs: string[];
  powerVerbs: string[];
}

const CONFIGS: Record<"en" | "pt", OptimizerConfig> = {
  en: {
    // Expanded list containing past, gerund, and present conjugations (EN)
    weakVerbs: [
      "help",
      "helped",
      "helping",
      "helps",
      "make",
      "made",
      "making",
      "makes",
      "do",
      "did",
      "doing",
      "does",
      "done",
      "use",
      "used",
      "using",
      "uses",
      "work",
      "worked",
      "working",
      "works",
      "try",
      "tried",
      "trying",
      "tries",
      "know",
      "knew",
      "knowing",
      "knows",
      "known",
      "participate",
      "participated",
      "participating",
      "participates",
    ],
    powerVerbs: [
      "engineered",
      "architected",
      "developed",
      "implemented",
      "spearheaded",
      "built",
      "deployed",
      "refactored",
      "optimized",
      "enhanced",
      "orchestrated",
    ],
  },
  pt: {
    // Expanded list containing past, gerund, and present conjugations (PT)
    weakVerbs: [
      "ajudar",
      "ajudei",
      "ajudava",
      "ajudou",
      "ajudando",
      "ajudado",
      "ajudamos",
      "ajudaram",
      "fazer",
      "fiz",
      "fazia",
      "fez",
      "fazendo",
      "feito",
      "fazemos",
      "fizeram",
      "usar",
      "usei",
      "usava",
      "usou",
      "usando",
      "usado",
      "usamos",
      "usaram",
      "trabalhar",
      "trabalhei",
      "trabalhava",
      "trabalhou",
      "trabalhando",
      "trabalhado",
      "trabalhamos",
      "trabalharam",
      "tentar",
      "tentei",
      "tentava",
      "tentou",
      "tentando",
      "tentado",
      "tentamos",
      "tentaram",
      "ter",
      "tive",
      "tinha",
      "teve",
      "tendo",
      "tido",
      "temos",
      "tiveram",
      "participar",
      "participei",
      "participava",
      "participou",
      "participando",
      "participado",
      "participamos",
      "participaram",
    ],
    powerVerbs: [
      "arquitetou",
      "desenvolveu",
      "implementou",
      "liderou",
      "engenharia",
      "construiu",
      "otimizou",
      "aprimorou",
      "gerenciou",
      "estruturou",
    ],
  },
};

export function analyzeVerbs(
  text: string,
  contextName: string,
  language: "en" | "pt" = "en"
): ImprovementSuggestion[] {
  const config = CONFIGS[language] || CONFIGS["en"];
  const suggestions: ImprovementSuggestion[] = [];
  const words = text.toLowerCase().split(/\s+/);

  for (const word of words) {
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    if (config.weakVerbs.includes(cleanWord)) {
      suggestions.push({
        original: cleanWord,
        suggestions: [...config.powerVerbs]
          .slice(0, 3)
          .map((v) => v.toUpperCase()),
        context: contextName,
      });
    }
  }

  return suggestions;
}

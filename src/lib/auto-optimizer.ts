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
    weakVerbs: [
      "help",
      "make",
      "do",
      "use",
      "work",
      "try",
      "know",
      "participate",
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
    weakVerbs: [
      "ajudar",
      "fazer",
      "usar",
      "trabalhar",
      "tentar",
      "ter",
      "participar",
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

export interface KeywordMatch {
  vaga: number;
  meta: number;
}

export type KeywordResults = Record<string, KeywordMatch>;

const TECH_WHITELIST = [
  "python",
  "javascript",
  "typescript",
  "node.js",
  "nodejs",
  "react",
  "vue",
  "angular",
  "java",
  "c#",
  ".net",
  "php",
  "django",
  "flask",
  "fastapi",
  "html",
  "css",
  "sass",
  "tailwind",
  "sql",
  "mysql",
  "postgresql",
  "postgres",
  "mongodb",
  "nosql",
  "redis",
  "oracle",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "linux",
  "git",
  "jenkins",
  "scrum",
  "kanban",
  "agile",
  "rest",
  "restful",
  "api",
  "tdd",
  "solid",
  "next.js",
  "ia",
  "n8n",
  "claude",
  "agentes",
  "integrações",
  "automações",
  "automação",
  "manutenção",
  "refatoração",
  "devops",
  "bullmq",
  "saas",
];

const COMPOSITE_PATTERNS = [
  { name: "node.js", regex: /\bnode\s*\.\s*js\b/gi },
  { name: "react.js", regex: /\breact\s*\.\s*js\b/gi },
  { name: "next.js", regex: /\bnext\s*\.\s*js\b/gi },
  { name: "ci/cd", regex: /\bci\s*[\/-]\s*cd\b/gi },
  { name: "metodologias ágeis", regex: /\bmetodologia(s)?\s+ágil(eis)?\b/gi },
  { name: "agile methodology", regex: /\bagile\s+methodolog(y|ies)\b/gi },
];

const BLOCK_END_MARKERS = [
  "benefícios",
  "o que oferecemos",
  "nossos benefícios",
  "vantagens",
  "sobre a empresa",
  "culture code",
  "etapas do processo",
];

function cleanJobText(text: string): string {
  const textLower = text.toLowerCase();
  let cutIndex = text.length;

  for (const marker of BLOCK_END_MARKERS) {
    const idx = textLower.indexOf(marker);
    if (idx !== -1 && idx < cutIndex) {
      cutIndex = idx;
    }
  }

  return text.substring(0, cutIndex);
}

export function extractKeywords(jobText: string): KeywordResults {
  if (!jobText) return {};

  const cleanText = cleanJobText(jobText);
  const cleanTextLower = cleanText.toLowerCase();
  const matches: Record<string, number> = {};

  for (const pattern of COMPOSITE_PATTERNS) {
    const count = (cleanText.match(pattern.regex) || []).length;
    if (count > 0) {
      matches[pattern.name] = count;
    }
  }

  for (const tech of TECH_WHITELIST) {
    if (matches[tech]) continue;

    const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(?<!\\w)${escapedTech}(?!\\w)`, "gi");
    const count = (cleanTextLower.match(regex) || []).length;

    if (count > 0) {
      matches[tech] = count;
    }
  }

  const sortedResults: KeywordResults = {};
  const sortedKeys = Object.keys(matches)
    .sort((a, b) => matches[b] - matches[a])
    .slice(0, 25);

  for (const key of sortedKeys) {
    const count = matches[key];
    sortedResults[key] = {
      vaga: count,
      meta: count * 2,
    };
  }

  return sortedResults;
}

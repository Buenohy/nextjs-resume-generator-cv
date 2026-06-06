export interface KeywordMatch {
  vaga: number;
  meta: number;
}

export type KeywordResults = Record<string, KeywordMatch>;

// LISTA DE PALAVRAS SIMPLES (BILINGUE)
const TECH_WHITELIST = [
  // IA / Machine Learning (Simples)
  "ai",
  "ia",
  "llm",
  "llms",
  "gpt",
  "chatgpt",
  "openai",
  "gemini",
  "llama",
  "anthropic",
  "claude",
  "agents",
  "agentes",
  "rag",
  "fine-tuning",
  "nlp",
  "pln",
  "langchain",
  "llamaindex",
  "crewai",
  "autogen",
  "pinecone",
  "pgvector",

  // Cloud / DevOps (Simples)
  "aws",
  "gcp",
  "azure",
  "serverless",
  "terraform",
  "ansible",
  "multicloud",
  "multi-cloud",
  "cloud",
  "nuvem",
  "devops",
  "s3",
  "ec2",
  "rds",
  "dynamodb",
  "fargate",
  "cloudformation",
  "cosmosdb",
  "firebase",
  "bigquery",

  // Tecnologias Gerais
  "python",
  "javascript",
  "typescript",
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
  "n8n",
  "integrações",
  "automações",
  "automação",
  "manutenção",
  "refatoração",
  "bullmq",
  "saas",
];

// LISTA DE PADRÕES COMPOSTOS (Mapeados antes das palavras simples)
const COMPOSITE_PATTERNS = [
  // IA / Machine Learning (Compostas)
  { name: "artificial intelligence", regex: /\bartificial\s+intelligence\b/gi },
  {
    name: "inteligência artificial",
    regex: /\bintelig[êe]ncia\s+artificial\b/gi,
  },
  { name: "prompt engineering", regex: /\bprompt\s+engineering\b/gi },
  { name: "engenharia de prompt", regex: /\bengenharia\s+de\s+prompt\b/gi },
  { name: "machine learning", regex: /\bmachine\s+learning\b/gi },
  {
    name: "aprendizado de máquina",
    regex: /\baprendizado\s+de\s+m[áa]quina\b/gi,
  },
  { name: "claude code", regex: /\bclaude\s+code\b/gi },
  { name: "vercel ai sdk", regex: /\bvercel\s+ai\s+sdk\b/gi },

  // Cloud / DevOps (Compostas)
  { name: "amazon web services", regex: /\bamazon\s+web\s+services\b/gi },
  { name: "aws lambda", regex: /\baws\s+lambda\b/gi },
  { name: "microsoft azure", regex: /\bmicrosoft\s+azure\b/gi },
  { name: "azure devops", regex: /\bazure\s+devops\b/gi },
  { name: "azure functions", regex: /\bazure\s+functions\b/gi },
  { name: "google cloud", regex: /\bgoogle\s+cloud\b/gi },
  { name: "google cloud platform", regex: /\bgoogle\s+cloud\s+platform\b/gi },
  { name: "cloud run", regex: /\bcloud\s+run\b/gi },
  { name: "cloud functions", regex: /\bcloud\s+functions\b/gi },
  { name: "infrastructure as code", regex: /\binfrastructure\s+as\s+code\b/gi },
  {
    name: "infraestrutura como código",
    regex: /\binfraestrutura\s+como\s+c[óo]digo\b/gi,
  },
  { name: "api gateway", regex: /\bapi\s+gateway\b/gi },
  { name: "blob storage", regex: /\bblob\s+storage\b/gi },

  // Tecnologias Gerais (Compostas)
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

// ALGORITMO DESCOLADOR (UN-GLUER): Separa CamelCase e colagens do Wellfound/Gupy
function unglueText(text: string): string {
  if (!text) return "";

  // 1. Separa minúsculas de maiúsculas (ex: "PythonJavascript" -> "Python Javascript")
  let cleaned = text.replace(/([a-z])([A-Z])/g, "$1 $2");

  // 2. Separa siglas maiúsculas grudadas em palavras Capitalizadas (ex: "AWSLambda" ou "SQLTypeScript" -> "AWS Lambda")
  cleaned = cleaned.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

  return cleaned;
}

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

  // Roda o Descolador e limpa as sessões redundantes de rodapé
  const ungluedText = unglueText(jobText);
  const cleanText = cleanJobText(ungluedText);
  let workingText = cleanText.toLowerCase();

  const matches: Record<string, number> = {};

  // Ordena padrões compostos por tamanho para garantir que os termos maiores mascarem o texto primeiro
  const sortedComposite = [...COMPOSITE_PATTERNS].sort(
    (a, b) => b.name.length - a.name.length
  );

  // 1. Processa e Mascara os padrões compostos
  for (const pattern of sortedComposite) {
    const regex = pattern.regex;
    const matchesArray = workingText.match(regex) || [];
    const count = matchesArray.length;

    if (count > 0) {
      matches[pattern.name] = count;
      // Mascara as ocorrências com espaços em branco do mesmo tamanho do termo para não quebrar índices das outras palavras
      workingText = workingText.replace(regex, (match) =>
        " ".repeat(match.length)
      );
    }
  }

  // Ordena a whitelist simples pelo tamanho das palavras (evita colisões com sub-strings)
  const sortedWhitelist = [...TECH_WHITELIST].sort(
    (a, b) => b.length - a.length
  );

  // 2. Processa e Mascara as palavras simples
  for (const tech of sortedWhitelist) {
    if (matches[tech]) continue; // Se já contou como parte de palavra composta, ignora

    const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(?<!\\w)${escapedTech}(?!\\w)`, "gi");
    const matchesArray = workingText.match(regex) || [];
    const count = matchesArray.length;

    if (count > 0) {
      matches[tech] = count;
      // Mascara o termo processado
      workingText = workingText.replace(regex, (match) =>
        " ".repeat(match.length)
      );
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

export function extractExperience(jobText: string): number[] {
  if (!jobText) return [];

  const cleanText = jobText.replace(/[\r\n]+/g, " ").toLowerCase();
  const yearsFound = new Set<number>();

  const rangeRegex =
    /\b(\d+)\s*(?:a|-|to)\s*(\d+)\s*\+?\s*(?:anos?|years?|yrs?)\b/gi;
  const minRegex = /\b(\d+)\s*\+?\s*(?:anos?|years?|yrs?)\b/gi;
  const contextRegex =
    /(?:experi[êe]ncia|experience)\W+(\d+)\s*\+?(?:\s*(?:anos?|years?|yrs?))?/gi;

  let match;

  while ((match = rangeRegex.exec(cleanText)) !== null) {
    const val = parseInt(match[1], 10);
    if (val >= 1 && val < 30) yearsFound.add(val);
  }

  while ((match = minRegex.exec(cleanText)) !== null) {
    const val = parseInt(match[1], 10);
    if (val >= 1 && val < 30) yearsFound.add(val);
  }

  while ((match = contextRegex.exec(cleanText)) !== null) {
    const val = parseInt(match[1], 10);
    if (val >= 1 && val < 30) yearsFound.add(val);
  }

  return Array.from(yearsFound).sort((a, b) => a - b);
}

export interface KeywordMatch {
  vaga: number;
  meta: number;
}

export type KeywordResults = Record<string, KeywordMatch>;

// ==========================================
// LISTA DE PALAVRAS SIMPLES (TECH WHITELIST)
// ==========================================
const TECH_WHITELIST = [
  // --- IA / Machine Learning (Simples) ---
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
  "ollama",
  "pydantic",
  "uv",
  "polars",
  "langgraph",
  "ultralytics",
  "deepseek",
  "grok",
  "mistral",
  "perplexity",
  "qwen",
  "cohere",
  "reka",

  // --- Cloud / DevOps / Infraestrutura (Simples) ---
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
  "npm",
  "pip",
  "homebrew",
  "vite",
  "make",
  "yarn",
  "cloudflare",
  "nuget",
  "apt",
  "webpack",
  "maven",
  "cargo",
  "gradle",
  "pnpm",
  "prometheus",
  "podman",
  "chocolatey",
  "composer",
  "msbuild",
  "poetry",
  "datadog",
  "pacman",
  "netlify",
  "bun",
  "heroku",
  "ninja",
  "splunk",
  "newrelic",
  "railway",
  "ibmcloud",
  "yandexcloud",

  // --- Bancos de Dados (Simples) ---
  "postgresql",
  "postgres",
  "mysql",
  "sqlite",
  "redis",
  "mongodb",
  "mariadb",
  "elasticsearch",
  "oracle",
  "dynamodb",
  "supabase",
  "h2",
  "snowflake",
  "influxdb",
  "duckdb",
  "cassandra",
  "neo4j",
  "valkey",
  "clickhouse",
  "cockroachdb",
  "pocketbase",
  "datomic",

  // --- Linguagens de Programação e Scripting (Simples) ---
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
  "nosql",
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
  "powershell",
  "c++",
  "c",
  "go",
  "rust",
  "kotlin",
  "lua",
  "assembly",
  "ruby",
  "dart",
  "swift",
  "r",
  "groovy",
  "vba",
  "matlab",
  "perl",
  "gdscript",
  "elixir",
  "scala",
  "delphi",
  "lisp",
  "micropython",
  "zig",
  "erlang",
  "fortran",
  "ada",
  "f#",
  "ocaml",
  "gleam",
  "prolog",
  "cobol",
  "mojo",

  // --- Frameworks e Tecnologias Web (Simples) ---
  "jquery",
  "express",
  "wordpress",
  "laravel",
  "angularjs",
  "svelte",
  "blazor",
  "nestjs",
  "astro",
  "deno",
  "symfony",
  "fastify",
  "axum",
  "phoenix",
  "drupal",
  "hostinger",
  "odoo",
  "swiftdata",

  // --- IDEs e Editores de Código (Simples) ---
  "vscode",
  "vim",
  "neovim",
  "pycharm",
  "cursor",
  "nano",
  "xcode",
  "webstorm",
  "zed",
  "rider",
  "eclipse",
  "vscodium",
  "phpstorm",
  "windsurf",
  "rustrover",
  "lovable",
  "bolt",
  "cline",
  "roo",
  "aider",
  "trae",

  // --- Documentação e Colaboração (Simples) ---
  "github",
  "jira",
  "gitlab",
  "markdown",
  "confluence",
  "notion",
  "obsidian",
  "miro",
  "trello",
  "lucidchart",
  "asana",
  "doxygen",
  "clickup",
  "linear",
  "airtable",
  "monday",
  "redmine",
  "youtrack",
  "coda",

  // --- Sistemas Operacionais (Simples) ---
  "windows",
  "macos",
  "android",
  "ubuntu",
  "ios",
  "debian",
  "arch",
  "fedora",
  "nixos",
  "visionos",
  "ipados",
];

// ==========================================
// LISTA DE PADRÕES COMPOSTOS (REGEX DE COINCIDÊNCIA)
// ==========================================
const COMPOSITE_PATTERNS = [
  // --- IA / Machine Learning (Compostas) ---
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
  { name: "google gemini", regex: /\bgoogle\s+gemini\b/gi },
  { name: "large language model", regex: /\blarge\s+language\s+models?\b/gi },
  { name: "openai gpt", regex: /\bopenai\s+gpts?\b/gi },
  { name: "claude sonnet", regex: /\bclaude\s+sonnets?\b/gi },
  { name: "gemini flash", regex: /\bgemini\s+flash\b/gi },
  { name: "openai reasoning", regex: /\bopenai\s+reasoning\b/gi },
  { name: "deepseek reasoning", regex: /\bdeepseek\s+reasoning\b/gi },
  { name: "deepseek general", regex: /\bdeepseek\s+general\b/gi },
  { name: "meta llama", regex: /\bmeta\s+llama\b/gi },
  { name: "perplexity sonar", regex: /\bperplexity\s+sonar\b/gi },
  { name: "alibaba qwen", regex: /\balibaba\s+qwen\b/gi },
  { name: "phi-4 models", regex: /\bphi-4\s+models?\b/gi },
  { name: "amazon bedrock", regex: /\bamazon\s+bedrock\b/gi },
  { name: "amazon titan", regex: /\bamazon\s+titan\s+models?\b/gi },

  // --- Cloud / DevOps (Compostas) ---
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
  { name: "digital ocean", regex: /\bdigital\s*ocean\b/gi },

  // --- Bancos de Dados (Compostas) ---
  { name: "microsoft sql server", regex: /\bmicrosoft\s+sql\s+server\b/gi },
  { name: "cloud firestore", regex: /\bcloud\s+firestore\b/gi },
  {
    name: "firebase realtime database",
    regex: /\bfirebase\s+realtime\s+database\b/gi,
  },
  { name: "microsoft access", regex: /\bmicrosoft\s+access\b/gi },
  { name: "cosmos db", regex: /\bcosmos\s+db\b/gi },
  { name: "databricks sql", regex: /\bdatabricks\s+sql\b/gi },
  { name: "ibm db2", regex: /\bibm\s+db2\b/gi },
  { name: "amazon redshift", regex: /\bamazon\s+redshift\b/gi },

  // --- Tecnologias e Frameworks Gerais (Compostas) ---
  { name: "node.js", regex: /\bnode\s*\.\s*js\b/gi },
  { name: "react.js", regex: /\breact\s*\.\s*js\b/gi },
  { name: "next.js", regex: /\bnext\s*\.\s*js\b/gi },
  { name: "nuxt.js", regex: /\bnuxt\s*\.\s*js\b/gi },
  { name: "ci/cd", regex: /\bci\s*[\/-]\s*cd\b/gi },
  { name: "metodologias ágeis", regex: /\bmetodologia(s)?\s+ágil(eis)?\b/gi },
  { name: "agile methodology", regex: /\bagile\s+methodolog(y|ies)\b/gi },
  { name: "tailwind css 4", regex: /\btailwind\s+css\s+4\b/gi },
  { name: "tailwind css", regex: /\btailwind\s+css\b/gi },
  { name: "asp.net core", regex: /\basp\.net\s+core\b/gi },
  { name: "spring boot", regex: /\bspring\s+boot\b/gi },
  { name: "ruby on rails", regex: /\bruby\s+on\s+rails\b/gi },
  { name: "microsoft fabric", regex: /\bmicrosoft\s+fabric\b/gi },
  { name: "delphi 12", regex: /\bdelphi\s+12\b/gi },

  // --- Linguagens e Caracteres Complexos ---
  { name: "html/css", regex: /\bhtml\s*[\/-]\s*css\b/gi },
  { name: "bash/shell", regex: /\bbash\s*[\/-]\s*shell\b/gi },
  { name: "visual basic", regex: /\bvisual\s+basic\b/gi },
  { name: "micro python", regex: /\bmicro\s+python\b/gi },

  // --- IDEs e Ferramentas Corporativas (Compostas) ---
  { name: "visual studio code", regex: /\bvisual\s+studio\s+code\b/gi },
  { name: "visual studio", regex: /\bvisual\s+studio\b/gi },
  { name: "intellij idea", regex: /\bintellij\s+idea\b/gi },
  { name: "android studio", regex: /\bandroid\s+studio\b/gi },
  { name: "sublime text", regex: /\bsublime\s+text\b/gi },
  { name: "google workspace", regex: /\bgoogle\s+workspace\b/gi },
  { name: "google colab", regex: /\bgoogle\s+colab\b/gi },
  { name: "microsoft planner", regex: /\bmicrosoft\s+planner\b/gi },
  { name: "stack overflow", regex: /\bstack\s+overflow\b/gi },

  // --- Sistemas Operacionais (Compostas) ---
  {
    name: "windows subsystem for linux",
    regex: /\bwindows\s+subsystem\s+for\s+linux\b/gi,
  },
  { name: "red hat", regex: /\bred\s+hat\b/gi },
  { name: "arch linux", regex: /\barch\s+linux\b/gi },
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

// ALGORITMO DESCOLADOR (UN-GLUER)
function unglueText(text: string): string {
  if (!text) return "";
  let cleaned = text.replace(/([a-z])([A-Z])/g, "$1 $2");
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

  const ungluedText = unglueText(jobText);
  const cleanText = cleanJobText(ungluedText);
  let workingText = cleanText.toLowerCase();

  const matches: Record<string, number> = {};

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
      workingText = workingText.replace(regex, (match) =>
        " ".repeat(match.length)
      );
    }
  }

  const sortedWhitelist = [...TECH_WHITELIST].sort(
    (a, b) => b.length - a.length
  );

  // 2. Processa e Mascara as palavras simples
  for (const tech of sortedWhitelist) {
    if (matches[tech]) continue;

    const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(?<!\\w)${escapedTech}(?!\\w)`, "gi");
    const matchesArray = workingText.match(regex) || [];
    const count = matchesArray.length;

    if (count > 0) {
      matches[tech] = count;
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

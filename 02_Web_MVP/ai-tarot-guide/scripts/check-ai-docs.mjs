import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const requiredFiles = [
  "00_START_HERE.md",
  "AGENTS.md",
  "docs/PROJECT_STATUS.md",
  "docs/NEXT_TASK.md",
  "docs/DECISIONS.md",
  "docs/EXTERNAL_SERVICES.md",
  "docs/ENVIRONMENT.md",
  "docs/OPERATIONS_LOG.md",
  "docs/CHANGELOG.md",
  "docs/archive/README.md",
  "templates/NEXT_TASK.template.md",
  "templates/DECISION.template.md",
  "templates/OPERATION.template.md",
  "templates/HANDOFF.template.md",
  "scripts/check-ai-docs.mjs",
];

const coreDocs = [
  "00_START_HERE.md",
  "AGENTS.md",
  "docs/PROJECT_STATUS.md",
  "docs/NEXT_TASK.md",
  "docs/DECISIONS.md",
  "docs/EXTERNAL_SERVICES.md",
  "docs/ENVIRONMENT.md",
  "docs/OPERATIONS_LOG.md",
  "docs/CHANGELOG.md",
];

const scanRoots = [
  "00_START_HERE.md",
  "AGENTS.md",
  "docs",
  "templates",
  "scripts/check-ai-docs.mjs",
];

const secretPatterns = [
  { name: "OpenAI-style key", pattern: /\bsk-[A-Za-z0-9_-]{8,}/ },
  { name: "Bearer token", pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/i },
  {
    name: "OPENAI_API_KEY assignment",
    pattern: /\bOPENAI_API_KEY\s*=\s*["']?[^"'\s#]+/i,
  },
  {
    name: "ANTHROPIC_AUTH_TOKEN assignment",
    pattern: /\bANTHROPIC_AUTH_TOKEN\s*=\s*["']?[^"'\s#]+/i,
  },
  {
    name: "SUPABASE_SECRET_KEY assignment",
    pattern: /\bSUPABASE_SECRET_KEY\s*=\s*["']?[^"'\s#]+/i,
  },
];

const archiveWarningPattern = /\b(archived|archive|historical|outdated)\b/i;

const errors = [];

async function pathExists(relativePath) {
  try {
    await stat(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function listMarkdownFiles(relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(relativePath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(relativePath);
    }
  }

  return files;
}

async function listScanFiles(relativePath) {
  const absolutePath = path.join(root, relativePath);
  const info = await stat(absolutePath);

  if (info.isFile()) {
    return [relativePath];
  }

  const entries = await readdir(absolutePath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const childPath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listScanFiles(childPath)));
    } else if (entry.isFile() && /\.(md|mjs|js|ts|tsx|json)$/i.test(entry.name)) {
      files.push(childPath);
    }
  }

  return files;
}

for (const file of requiredFiles) {
  if (!(await pathExists(file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

for (const file of coreDocs) {
  if (await pathExists(file)) {
    const text = await readText(file);
    if (!/Last updated:/i.test(text)) {
      errors.push(`Missing "Last updated" header: ${file}`);
    }
  }
}

if (await pathExists("docs/NEXT_TASK.md")) {
  const nextTask = (await readText("docs/NEXT_TASK.md")).trim();
  if (nextTask.length < 80) {
    errors.push("docs/NEXT_TASK.md is empty or too thin.");
  }
}

if (await pathExists("docs/archive")) {
  const archiveFiles = await listMarkdownFiles("docs/archive");
  for (const file of archiveFiles) {
    const text = await readText(file);
    if (!archiveWarningPattern.test(text)) {
      errors.push(`Archive doc lacks archived/outdated warning: ${file}`);
    }
  }
}

const filesToScan = [];
for (const item of scanRoots) {
  if (await pathExists(item)) {
    filesToScan.push(...(await listScanFiles(item)));
  }
}

for (const file of new Set(filesToScan)) {
  const text = await readText(file);
  for (const { name, pattern } of secretPatterns) {
    if (pattern.test(text)) {
      errors.push(`Possible secret pattern (${name}) in ${file}`);
    }
  }
}

if (errors.length > 0) {
  console.error("AI docs check failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("AI docs check passed.");

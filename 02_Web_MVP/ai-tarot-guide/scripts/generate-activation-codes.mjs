import { randomInt } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";

const CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_GROUP_LENGTH = 4;
const CODE_GROUPS = 3;
const DEFAULT_PREFIX = "OA";
const DEFAULT_CREDITS = 50;
const DEFAULT_DAILY_LIMIT = 5;
const DEFAULT_VALID_DAYS = 365;
const STATUS = "unclaimed";

function printHelp() {
  console.log(`Usage:
  node scripts/generate-activation-codes.mjs \\
    --batch <batch_name> \\
    --product <product_name> \\
    --count <number> \\
    [--credits <number>] \\
    [--daily-limit <number>] \\
    [--valid-days <number>] \\
    [--prefix <prefix>]

Required:
  --batch        Batch name. Used as output folder name.
  --product      Product name written into CSV and SQL.
  --count        Number of activation codes to generate.

Optional:
  --credits      Credits per code. Default: 50.
  --daily-limit  Daily limit value. Default: 5.
  --valid-days   Valid days value. Default: 365.
  --prefix       Code prefix. Default: OA.
  --help         Show this help.

Output:
  exports/activation-codes/<batch_name>/codes.csv
  exports/activation-codes/<batch_name>/insert.sql
  exports/activation-codes/<batch_name>/manifest.json
`);
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help") {
      args.help = true;
      continue;
    }

    if (!token.startsWith("--")) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

function requiredString(args, key) {
  const value = args[key]?.trim();

  if (!value) {
    throw new Error(`Missing required argument: --${key}`);
  }

  return value;
}

function positiveInteger(args, key, defaultValue) {
  const rawValue = args[key] ?? String(defaultValue);
  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`--${key} must be a positive integer.`);
  }

  return value;
}

function safeBatchName(value) {
  if (!/^[A-Za-z0-9._-]+$/.test(value)) {
    throw new Error(
      "--batch may only contain letters, numbers, dots, underscores, and hyphens.",
    );
  }

  if (value === "." || value === ".." || value.includes("..")) {
    throw new Error("--batch cannot contain path traversal segments.");
  }

  return value;
}

function normalizePrefix(value) {
  const prefix = value.trim().toUpperCase();

  if (!/^[A-Z0-9]{1,12}$/.test(prefix)) {
    throw new Error("--prefix must be 1-12 uppercase letters or numbers.");
  }

  return prefix;
}

function randomCode(prefix) {
  const groups = [];

  for (let groupIndex = 0; groupIndex < CODE_GROUPS; groupIndex += 1) {
    let group = "";

    for (let charIndex = 0; charIndex < CODE_GROUP_LENGTH; charIndex += 1) {
      group += CHARSET[randomInt(CHARSET.length)];
    }

    groups.push(group);
  }

  return `${prefix}-${groups.join("-")}`;
}

function generateCodes({ count, prefix }) {
  const codes = new Set();

  while (codes.size < count) {
    codes.add(randomCode(prefix));
  }

  return [...codes];
}

function csvValue(value) {
  const text = String(value);

  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function buildCsv({
  codes,
  creditAmount,
  batchName,
  productName,
  createdAt,
}) {
  const header = "code,credit_amount,batch_name,product_name,created_at,status";
  const rows = codes.map((code) =>
    [
      code,
      creditAmount,
      batchName,
      productName,
      createdAt,
      STATUS,
    ]
      .map(csvValue)
      .join(","),
  );

  return `${[header, ...rows].join("\n")}\n`;
}

function buildInsertSql({
  codes,
  batchName,
  productName,
  creditAmount,
  dailyLimit,
  validDays,
  createdAt,
}) {
  const values = codes
    .map((code) =>
      [
        sqlString(code),
        sqlString(STATUS),
        sqlString(batchName),
        sqlString(productName),
        creditAmount,
        dailyLimit,
        validDays,
        creditAmount,
        sqlString(createdAt),
      ].join(", "),
    )
    .map((row) => `  (${row})`)
    .join(",\n");

  return `begin;

insert into public.activation_codes (
  code,
  status,
  batch_name,
  product_name,
  grants_total,
  daily_limit,
  valid_days,
  credit_amount,
  created_at
)
values
${values};

commit;
`;
}

function buildManifest({
  batchName,
  productName,
  count,
  creditAmount,
  dailyLimit,
  validDays,
  prefix,
  createdAt,
}) {
  return {
    batch_name: batchName,
    product_name: productName,
    count,
    credit_amount: creditAmount,
    grants_total: creditAmount,
    daily_limit: dailyLimit,
    valid_days: validDays,
    status: STATUS,
    prefix,
    code_format: `${prefix}-XXXX-XXXX-XXXX`,
    charset: CHARSET,
    created_at: createdAt,
    output_files: {
      codes_csv: "codes.csv",
      insert_sql: "insert.sql",
      manifest_json: "manifest.json",
    },
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const batchName = safeBatchName(requiredString(args, "batch"));
  const productName = requiredString(args, "product");
  const count = positiveInteger(args, "count");
  const creditAmount = positiveInteger(args, "credits", DEFAULT_CREDITS);
  const dailyLimit = positiveInteger(
    args,
    "daily-limit",
    DEFAULT_DAILY_LIMIT,
  );
  const validDays = positiveInteger(args, "valid-days", DEFAULT_VALID_DAYS);
  const prefix = normalizePrefix(args.prefix ?? DEFAULT_PREFIX);
  const createdAt = new Date().toISOString();
  const outputRoot = path.resolve(
    process.cwd(),
    "exports",
    "activation-codes",
  );
  const outputDir = path.join(outputRoot, batchName);

  if (!outputDir.startsWith(`${outputRoot}${path.sep}`)) {
    throw new Error("Resolved output directory is outside activation code exports.");
  }

  if (existsSync(outputDir)) {
    throw new Error(
      `Output directory already exists: ${path.relative(process.cwd(), outputDir)}`,
    );
  }

  const codes = generateCodes({ count, prefix });
  const csv = buildCsv({
    codes,
    creditAmount,
    batchName,
    productName,
    createdAt,
  });
  const insertSql = buildInsertSql({
    codes,
    batchName,
    productName,
    creditAmount,
    dailyLimit,
    validDays,
    createdAt,
  });
  const manifest = buildManifest({
    batchName,
    productName,
    count,
    creditAmount,
    dailyLimit,
    validDays,
    prefix,
    createdAt,
  });

  mkdirSync(outputRoot, { recursive: true });
  mkdirSync(outputDir);
  writeFileSync(path.join(outputDir, "codes.csv"), csv, "utf8");
  writeFileSync(path.join(outputDir, "insert.sql"), insertSql, "utf8");
  writeFileSync(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log("Activation code batch generated:");
  console.log(`  batch: ${batchName}`);
  console.log(`  count: ${count}`);
  console.log(`  output: ${path.relative(process.cwd(), outputDir)}`);
  console.log("Review insert.sql before manually running it in Supabase.");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

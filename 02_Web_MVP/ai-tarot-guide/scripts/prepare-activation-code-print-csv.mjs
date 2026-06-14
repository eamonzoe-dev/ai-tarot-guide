import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_REDEEM_URL = "oraarcana.com/ai-guide";
const DEFAULT_LABEL_TITLE = "Ora Arcana Activation Code";
const OUTPUT_HEADER = [
  "label_title",
  "code",
  "credits_text",
  "redeem_url",
  "batch_name",
  "product_name",
];

function printHelp() {
  console.log(`Usage:
  node scripts/prepare-activation-code-print-csv.mjs \\
    --input <path> \\
    --output <path> \\
    [--redeem-url <url>] \\
    [--label-title <text>]

Required:
  --input        Existing activation code CSV.
  --output       New print-ready CSV path. Must not already exist.

Optional:
  --redeem-url   Redeem URL printed on labels. Default: ${DEFAULT_REDEEM_URL}
  --label-title  Label title printed on labels. Default: ${DEFAULT_LABEL_TITLE}
  --help         Show this help.

Input CSV fields:
  code,credit_amount,batch_name,product_name,created_at,status

Output CSV fields:
  label_title,code,credits_text,redeem_url,batch_name,product_name
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

function optionalString(args, key, defaultValue) {
  const value = args[key]?.trim();
  return value || defaultValue;
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let fieldStarted = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];

    if (inQuotes) {
      if (char === '"') {
        if (content[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }

      continue;
    }

    if (char === '"') {
      if (fieldStarted) {
        throw new Error("Invalid CSV: unexpected quote in unquoted field.");
      }

      inQuotes = true;
      fieldStarted = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      fieldStarted = false;
      continue;
    }

    if (char === "\r" || char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      fieldStarted = false;

      if (char === "\r" && content[index + 1] === "\n") {
        index += 1;
      }

      continue;
    }

    field += char;
    fieldStarted = true;
  }

  if (inQuotes) {
    throw new Error("Invalid CSV: unterminated quoted field.");
  }

  if (field.length > 0 || fieldStarted || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((csvRow) => csvRow.some((value) => value.trim() !== ""));
}

function csvValue(value) {
  const text = String(value);

  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function buildHeaderMap(headerRow) {
  const headerMap = new Map();

  headerRow.forEach((name, index) => {
    const key = index === 0 ? name.replace(/^\uFEFF/, "") : name;
    headerMap.set(key, index);
  });

  return headerMap;
}

function getField(row, headerMap, fieldName, rowNumber) {
  const index = headerMap.get(fieldName);

  if (index === undefined) {
    throw new Error(`Missing required CSV field: ${fieldName}`);
  }

  if (index >= row.length) {
    throw new Error(`Missing value for ${fieldName} on row ${rowNumber}.`);
  }

  return row[index].trim();
}

function buildPrintCsv({ rows, headerMap, labelTitle, redeemUrl }) {
  const outputRows = [OUTPUT_HEADER];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const code = getField(row, headerMap, "code", rowNumber);
    const creditAmount = getField(row, headerMap, "credit_amount", rowNumber);
    const status = getField(row, headerMap, "status", rowNumber);
    const batchName = getField(row, headerMap, "batch_name", rowNumber);
    const productName = getField(row, headerMap, "product_name", rowNumber);

    if (!code) {
      throw new Error(`Empty code on row ${rowNumber}.`);
    }

    if (status !== "unclaimed") {
      throw new Error(
        `Row ${rowNumber} is not unclaimed. Refusing to prepare print CSV.`,
      );
    }

    outputRows.push([
      labelTitle,
      code,
      `${creditAmount} Reading Credits`,
      redeemUrl,
      batchName,
      productName,
    ]);
  });

  return `${outputRows.map((row) => row.map(csvValue).join(",")).join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const inputPath = path.resolve(process.cwd(), requiredString(args, "input"));
  const outputPath = path.resolve(process.cwd(), requiredString(args, "output"));
  const redeemUrl = optionalString(args, "redeem-url", DEFAULT_REDEEM_URL);
  const labelTitle = optionalString(args, "label-title", DEFAULT_LABEL_TITLE);

  if (!existsSync(inputPath)) {
    throw new Error(`Input file does not exist: ${path.relative(process.cwd(), inputPath)}`);
  }

  if (existsSync(outputPath)) {
    throw new Error(
      `Output file already exists: ${path.relative(process.cwd(), outputPath)}`,
    );
  }

  const parsedRows = parseCsv(readFileSync(inputPath, "utf8"));

  if (parsedRows.length === 0) {
    throw new Error("Input CSV is empty.");
  }

  const [headerRow, ...dataRows] = parsedRows;
  const headerMap = buildHeaderMap(headerRow);

  if (!headerMap.has("code")) {
    throw new Error("Missing required CSV field: code");
  }

  const printCsv = buildPrintCsv({
    rows: dataRows,
    headerMap,
    labelTitle,
    redeemUrl,
  });

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, printCsv, "utf8");

  console.log(`count: ${dataRows.length}`);
  console.log(`input: ${path.relative(process.cwd(), inputPath)}`);
  console.log(`output: ${path.relative(process.cwd(), outputPath)}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

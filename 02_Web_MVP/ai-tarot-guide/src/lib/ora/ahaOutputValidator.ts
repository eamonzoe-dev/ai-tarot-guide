import { ahaPromptForbiddenPatterns } from "./ahaPromptContract";
import {
  Locale as localeValues,
  RiskLevel as riskLevelValues,
  type Locale,
  type RiskLevel,
} from "./reflectionSignal";

export type AhaAiOutput = {
  sentence: string;
  usedAnchors: string[];
  riskLevel: RiskLevel;
  notes?: string;
};

export type AhaOutputValidationContext = {
  locale: Locale;
  cardName: string;
  exactAnchors: string[];
  expectedRiskLevel: RiskLevel;
  mustIncludeUserAnchor: boolean;
};

export type AhaOutputValidationResult = {
  ok: boolean;
  output?: AhaAiOutput;
  errors: string[];
  warnings: string[];
};

const dangerousExtraFields = [
  "prediction",
  "futureOutcome",
  "externalFact",
  "thirdPartyMind",
  "diagnosis",
] as const;

const predictionCopyPatterns = [
  /\bwill happen\b/i,
  /\bis going to happen\b/i,
  /\bthey will come back\b/i,
  /\bhe will come back\b/i,
  /\bshe will come back\b/i,
];

const thirdPartyMindPatterns = [
  /他(?:一定)?(?:觉得|认为|想|会想|感到|在乎)/,
  /她(?:一定)?(?:觉得|认为|想|会想|感到|在乎)/,
  /\b(?:he|she|they)\s+(?:thinks?|feels?|wants?|will feel|will think)\b/i,
];

const externalFactPatterns = [
  /事实是/,
  /真相是/,
  /我看见了/,
  /\bthe fact is\b/i,
  /\bwhat really happened\b/i,
  /\bi can see that\b/i,
];

const advicePatterns = [
  /你应该/,
  /你必须/,
  /你需要(?!倾听内心)/,
  /\byou should\b/i,
  /\byou need to\b/i,
  /\byou must\b/i,
];

const zhLifeSliceClues = [
  "时候",
  "晚上",
  "该睡",
  "手机",
  "消息",
  "打开",
  "删掉",
  "反复",
  "等",
  "看着",
  "安静",
  "白天",
  "旧决定",
  "选错",
  "证明",
  "白费",
  "标签页",
  "不舒服",
  "喘口气",
];

const enLifeSliceClues = [
  "night",
  "sleep",
  "phone",
  "message",
  "reread",
  "wait",
  "quiet",
  "before starting",
  "open",
  "delete",
  "prove",
  "wasted",
];

export const sampleAhaOutputValidationContext: AhaOutputValidationContext = {
  locale: "zh",
  cardName: "宝剑二",
  exactAnchors: ["睡不下", "旧决定", "选错"],
  expectedRiskLevel: "low",
  mustIncludeUserAnchor: true,
};

export const sampleValidAhaAiOutputRaw = JSON.stringify(
  {
    sentence:
      "宝剑二像是在照见：你说的「睡不下」，可能不是白天最混乱，而是到了该睡的时候，脑子才开始转那些白天不敢认真想的事。",
    usedAnchors: ["睡不下"],
    riskLevel: "low",
    notes: "Uses the user's anchor and a concrete life-slice without prediction.",
  },
  null,
  2,
);

export const sampleInvalidPredictionAhaAiOutputRaw = JSON.stringify(
  {
    sentence: "宝剑二说明他一定会回来，你未来会得到答案。",
    usedAnchors: ["回来"],
    riskLevel: "low",
    notes: "Contains future prediction and third-party outcome language.",
  },
  null,
  2,
);

export const sampleInvalidSurveillanceAhaAiOutputRaw = JSON.stringify(
  {
    sentence: "根据你的历史记录，这是你第好几次在宝剑二这里反复纠结。",
    usedAnchors: [],
    riskLevel: "low",
    notes: "Contains surveillance-style memory language.",
  },
  null,
  2,
);

export function parseAhaAiOutput(
  raw: string,
): { ok: true; value: unknown } | { ok: false; errors: string[] } {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (error) {
    return {
      ok: false,
      errors: [
        `Aha AI output must be parseable JSON: ${
          error instanceof Error ? error.message : "unknown parse error"
        }`,
      ],
    };
  }
}

export function validateAhaAiOutputShape(
  value: unknown,
): { ok: true; value: AhaAiOutput } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: ["Aha AI output must be a JSON object."] };
  }

  for (const fieldPath of findDangerousFieldPaths(value)) {
    errors.push(`Aha AI output contains dangerous field: ${fieldPath}`);
  }

  if (!isNonEmptyString(value.sentence)) {
    errors.push("sentence must be a non-empty string.");
  }

  if (!Array.isArray(value.usedAnchors)) {
    errors.push("usedAnchors must be a string array.");
  } else {
    value.usedAnchors.forEach((anchor, index) => {
      if (typeof anchor !== "string") {
        errors.push(`usedAnchors[${index}] must be a string.`);
      }
    });
  }

  if (!riskLevelValues.includes(value.riskLevel as RiskLevel)) {
    errors.push("riskLevel must be low, medium, or high.");
  }

  if (value.notes !== undefined && typeof value.notes !== "string") {
    errors.push("notes must be a string when provided.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: value as AhaAiOutput };
}

export function validateAhaAiOutput(
  output: AhaAiOutput,
  context: AhaOutputValidationContext,
): AhaOutputValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sentence = output.sentence.trim();
  const suitableAnchors = getSuitableAnchors(context.exactAnchors);

  validateContext(context, errors);
  validateForbiddenPatterns(sentence, errors);
  validateOneSentence(sentence, errors);
  validateCardMirror(sentence, context.cardName, errors);
  validateSafetyPatterns(sentence, errors);
  validateAnchors(output, sentence, suitableAnchors, context, warnings);
  validateRiskLevel(output, context, warnings);
  validateConcreteLifeSlice(sentence, context.locale, warnings);

  return {
    ok: errors.length === 0,
    output,
    errors,
    warnings,
  };
}

export function parseAndValidateAhaAiOutput(
  raw: string,
  context: AhaOutputValidationContext,
): AhaOutputValidationResult {
  const parsed = parseAhaAiOutput(raw);
  if (!parsed.ok) {
    return { ok: false, errors: parsed.errors, warnings: [] };
  }

  const shaped = validateAhaAiOutputShape(parsed.value);
  if (!shaped.ok) {
    return { ok: false, errors: shaped.errors, warnings: [] };
  }

  return validateAhaAiOutput(shaped.value, context);
}

function validateContext(
  context: AhaOutputValidationContext,
  errors: string[],
): void {
  if (!localeValues.includes(context.locale)) {
    errors.push("context.locale must be zh or en.");
  }

  if (!isNonEmptyString(context.cardName)) {
    errors.push("context.cardName must be a non-empty string.");
  }

  if (!Array.isArray(context.exactAnchors)) {
    errors.push("context.exactAnchors must be a string array.");
  }

  if (!riskLevelValues.includes(context.expectedRiskLevel)) {
    errors.push("context.expectedRiskLevel must be low, medium, or high.");
  }
}

function validateForbiddenPatterns(sentence: string, errors: string[]): void {
  const lowerSentence = sentence.toLowerCase();

  for (const pattern of ahaPromptForbiddenPatterns) {
    const lowerPattern = pattern.toLowerCase();
    if (lowerSentence.includes(lowerPattern)) {
      errors.push(`sentence contains forbidden pattern: ${pattern}`);
    }
  }

  for (const pattern of predictionCopyPatterns) {
    if (pattern.test(sentence)) {
      errors.push(`sentence contains prediction copy: ${pattern.source}`);
    }
  }
}

function validateOneSentence(sentence: string, errors: string[]): void {
  const sentenceEndings = sentence.match(/[。！？.!?]/g) ?? [];

  if (sentenceEndings.length !== 1) {
    errors.push("Sentence must be exactly one sentence.");
  }
}

function validateCardMirror(
  sentence: string,
  cardName: string,
  errors: string[],
): void {
  if (cardName && !sentence.includes(cardName)) {
    errors.push("Sentence must include the card name as mirror.");
  }
}

function validateSafetyPatterns(sentence: string, errors: string[]): void {
  for (const pattern of thirdPartyMindPatterns) {
    if (pattern.test(sentence)) {
      errors.push(`sentence judges third-party inner state: ${pattern.source}`);
    }
  }

  for (const pattern of externalFactPatterns) {
    if (pattern.test(sentence)) {
      errors.push(`sentence claims external facts: ${pattern.source}`);
    }
  }

  for (const pattern of advicePatterns) {
    if (pattern.test(sentence)) {
      errors.push(`sentence gives advice: ${pattern.source}`);
    }
  }
}

function validateAnchors(
  output: AhaAiOutput,
  sentence: string,
  suitableAnchors: string[],
  context: AhaOutputValidationContext,
  warnings: string[],
): void {
  const usedAnchorSet = new Set(output.usedAnchors.map((anchor) => anchor.trim()));
  const hasAnchorInSentence = suitableAnchors.some((anchor) =>
    sentence.includes(anchor),
  );
  const hasAnchorInUsedAnchors = suitableAnchors.some((anchor) =>
    usedAnchorSet.has(anchor),
  );

  if (
    context.mustIncludeUserAnchor &&
    suitableAnchors.length > 0 &&
    !hasAnchorInSentence &&
    !hasAnchorInUsedAnchors
  ) {
    warnings.push("No suitable exact anchor appeared in sentence or usedAnchors.");
  }

  for (const usedAnchor of usedAnchorSet) {
    if (!usedAnchor) {
      continue;
    }

    if (!suitableAnchors.includes(usedAnchor)) {
      warnings.push(`usedAnchors includes anchor not provided by context: ${usedAnchor}`);
    }

    if (!sentence.includes(usedAnchor)) {
      warnings.push(`usedAnchors marks an anchor absent from sentence: ${usedAnchor}`);
    }
  }
}

function validateRiskLevel(
  output: AhaAiOutput,
  context: AhaOutputValidationContext,
  warnings: string[],
): void {
  if (output.riskLevel !== context.expectedRiskLevel) {
    warnings.push(
      `riskLevel ${output.riskLevel} does not match expected ${context.expectedRiskLevel}.`,
    );
  }
}

function validateConcreteLifeSlice(
  sentence: string,
  locale: Locale,
  warnings: string[],
): void {
  const clues = locale === "zh" ? zhLifeSliceClues : enLifeSliceClues;
  const normalizedSentence = sentence.toLowerCase();
  const hasConcreteClue = clues.some((clue) =>
    normalizedSentence.includes(clue.toLowerCase()),
  );

  if (!hasConcreteClue) {
    warnings.push("Sentence may lack concrete life-slice language.");
  }
}

function getSuitableAnchors(exactAnchors: string[]): string[] {
  const seen = new Set<string>();
  const anchors: string[] = [];

  for (const rawAnchor of exactAnchors) {
    const anchor = rawAnchor.trim();
    if (!isSuitableAnchor(anchor) || seen.has(anchor)) {
      continue;
    }

    seen.add(anchor);
    anchors.push(anchor);
  }

  return anchors;
}

function isSuitableAnchor(anchor: string): boolean {
  if (!anchor) {
    return false;
  }

  if (anchor.length > 24) {
    return false;
  }

  if (/[。！？.!?，,；;]/.test(anchor)) {
    return false;
  }

  return true;
}

function findDangerousFieldPaths(value: unknown): string[] {
  const paths: string[] = [];
  visitForDangerousFields(value, "$", paths);
  return paths;
}

function visitForDangerousFields(
  value: unknown,
  path: string,
  paths: string[],
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      visitForDangerousFields(item, `${path}[${index}]`, paths);
    });
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, childValue] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (dangerousExtraFields.includes(key as (typeof dangerousExtraFields)[number])) {
      paths.push(childPath);
    }
    visitForDangerousFields(childValue, childPath, paths);
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

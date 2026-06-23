import {
  defaultFinalAhaConstraints,
  Locale as localeValues,
  RiskLevel as riskLevelValues,
  type FinalAhaConstraints,
  type Locale,
  type RiskLevel,
} from "./reflectionSignal";

export type AhaPromptContractInput = {
  locale: Locale;
  surfaceQuestion: string;
  exactAnchors: string[];
  dialogueSummary: {
    selectedState?: string;
    userSelectedBehavior?: string;
    ruminationType?: string;
    agencyPosition?: string;
    hiddenCost?: string;
  };
  card: {
    id: string;
    name: string;
    symbolicLens: string;
  };
  microSlice: {
    sliceId: string;
    stateKey: string;
    concreteLineZh?: string;
    concreteLineEn?: string;
    softenedVersionZh?: string;
    riskLevel: RiskLevel;
  };
  constraints: FinalAhaConstraints;
};

export type AhaPromptContract = {
  systemPrompt: string;
  userPrompt: string;
  expectedOutputShape: string;
  forbiddenPatterns: string[];
  requiredChecks: string[];
};

export type AhaPromptContractValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export const ahaPromptForbiddenPatterns = [
  "我知道你",
  "你一定",
  "命中注定",
  "他一定",
  "她一定",
  "未来会",
  "注定会",
  "必然会",
  "你需要倾听内心",
  "你最近压力很大",
  "根据你的历史记录",
  "这是你第",
  "你又",
  "你总是",
  "我早就说过",
  "I know that you",
  "you will definitely",
  "destined",
  "fate has decided",
  "based on your history",
  "you always",
  "here you are again",
] as const;

export const ahaPromptRequiredChecks = [
  "exactly one sentence",
  "contains card name",
  "contains or reasonably uses one suitable exact anchor when available",
  "does not include forbidden prediction language",
  "does not claim external facts",
  "does not judge third-party inner state",
  "does not give advice",
  "contains concrete life-slice language",
  "risk level matches microSlice.riskLevel",
  "if no anchor is used, notes must explain why",
] as const;

const expectedOutputShape = JSON.stringify(
  {
    sentence: "...",
    usedAnchors: ["..."],
    riskLevel: "low|medium|high",
    notes: "short internal rationale",
  },
  null,
  2,
);

export function buildAhaSystemPrompt(locale: Locale): string {
  const languageInstruction =
    locale === "zh"
      ? "Write the final sentence in Chinese unless the user anchors are clearly English."
      : "Write the final sentence in English unless the user anchors are clearly Chinese.";

  return [
    "You are Ora Arcana's Aha Sentence Generator.",
    "Your task is reflection, not prediction.",
    "Generate exactly one aha sentence.",
    "Use the tarot card as a mirror, not as evidence.",
    "Use descriptive specificity: a concrete lived moment, behavior, time texture, or private contradiction.",
    "Ground the sentence in the provided reflection signal and micro-slice.",
    "Use at least one suitable exact anchor when possible.",
    "Do not invent external facts.",
    "Do not predict future events.",
    "Do not say what another person thinks, feels, or will do.",
    "Do not diagnose the user.",
    "Do not give advice.",
    "Do not write a paragraph.",
    "Do not mention history records or surveillance-style memory.",
    "Do not say I know you.",
    "If evidence is weak, soften the sentence instead of faking precision.",
    languageInstruction,
    "Return JSON only. Do not wrap the JSON in markdown.",
  ].join("\n");
}

export function buildAhaUserPrompt(input: AhaPromptContractInput): string {
  return [
    "## Locale",
    input.locale,
    "",
    "## Surface question",
    input.surfaceQuestion.trim(),
    "",
    "## Exact anchors",
    formatJson(input.exactAnchors),
    "",
    "## Dialogue summary",
    formatJson(input.dialogueSummary),
    "",
    "## Card as mirror",
    formatJson(input.card),
    "",
    "## Matched micro-slice",
    formatJson(input.microSlice),
    "",
    "## Constraints",
    formatJson(input.constraints),
    "",
    "## Output requirements",
    "Return JSON only.",
    "Do not include markdown, commentary, or extra keys.",
    "The sentence must be exactly one sentence.",
    "The sentence must contain the card name.",
    "Use the card only as a mirror, not as proof.",
    "Use at least one suitable exact anchor when possible.",
    "If no anchor is used, explain why in notes.",
    "Do not predict, advise, diagnose, claim external facts, or infer a third party's inner state.",
    "Shape:",
    expectedOutputShape,
  ].join("\n");
}

export function buildAhaPromptContract(
  input: AhaPromptContractInput,
): AhaPromptContract {
  return {
    systemPrompt: buildAhaSystemPrompt(input.locale),
    userPrompt: buildAhaUserPrompt(input),
    expectedOutputShape,
    forbiddenPatterns: [...ahaPromptForbiddenPatterns],
    requiredChecks: [...ahaPromptRequiredChecks],
  };
}

export function validateAhaPromptContract(
  input: AhaPromptContractInput,
): AhaPromptContractValidationResult {
  const errors: string[] = [];

  if (!localeValues.includes(input.locale)) {
    errors.push("locale must be en or zh");
  }

  if (!isNonEmptyString(input.surfaceQuestion)) {
    errors.push("surfaceQuestion must be a non-empty string");
  }

  validateStringArray(input.exactAnchors, "exactAnchors", errors);
  validateDialogueSummary(input.dialogueSummary, errors);
  validateCard(input.card, errors);
  validateMicroSlice(input.microSlice, errors);
  validateConstraints(input.constraints, errors);

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export const sampleAhaPromptContractInput: AhaPromptContractInput = {
  locale: "zh",
  surfaceQuestion: "我最近很迷茫",
  exactAnchors: ["睡不下", "旧决定", "选错"],
  dialogueSummary: {
    selectedState: "late night rumination",
    userSelectedBehavior: "翻旧决定有没有选错",
    ruminationType: "past_choice_regret",
    agencyPosition: "waiting_for_confirmation",
    hiddenCost: "sleep and present attention",
  },
  card: {
    id: "two-of-swords",
    name: "宝剑二",
    symbolicLens: "回避选择、暂停判断、用不看见来维持暂时平衡",
  },
  microSlice: {
    sliceId: "late_night_rumination_001",
    stateKey: "late_night_rumination",
    concreteLineZh:
      "你可能不是白天最混乱，而是到了该睡的时候，脑子才开始转那些白天不敢认真想的事。",
    concreteLineEn:
      "It may not be the daytime that feels most tangled; it may be the hour when you try to sleep and your mind starts turning the things you avoided looking at directly.",
    softenedVersionZh:
      "如果这个画面不完全贴合，可以只保留一点：有些念头像是在安静下来之后才追上你。",
    riskLevel: "low",
  },
  constraints: defaultFinalAhaConstraints,
};

export const sampleAhaPromptContract = buildAhaPromptContract(
  sampleAhaPromptContractInput,
);

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function validateDialogueSummary(
  value: AhaPromptContractInput["dialogueSummary"],
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push("dialogueSummary must be an object");
    return;
  }

  validateOptionalString(value.selectedState, "dialogueSummary.selectedState", errors);
  validateOptionalString(
    value.userSelectedBehavior,
    "dialogueSummary.userSelectedBehavior",
    errors,
  );
  validateOptionalString(value.ruminationType, "dialogueSummary.ruminationType", errors);
  validateOptionalString(value.agencyPosition, "dialogueSummary.agencyPosition", errors);
  validateOptionalString(value.hiddenCost, "dialogueSummary.hiddenCost", errors);
}

function validateCard(
  value: AhaPromptContractInput["card"],
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push("card must be an object");
    return;
  }

  validateRequiredString(value.id, "card.id", errors);
  validateRequiredString(value.name, "card.name", errors);
  validateRequiredString(value.symbolicLens, "card.symbolicLens", errors);
}

function validateMicroSlice(
  value: AhaPromptContractInput["microSlice"],
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push("microSlice must be an object");
    return;
  }

  validateRequiredString(value.sliceId, "microSlice.sliceId", errors);
  validateRequiredString(value.stateKey, "microSlice.stateKey", errors);
  validateOptionalString(value.concreteLineZh, "microSlice.concreteLineZh", errors);
  validateOptionalString(value.concreteLineEn, "microSlice.concreteLineEn", errors);
  validateOptionalString(
    value.softenedVersionZh,
    "microSlice.softenedVersionZh",
    errors,
  );

  if (!riskLevelValues.includes(value.riskLevel)) {
    errors.push("microSlice.riskLevel must be low, medium, or high");
  }
}

function validateConstraints(
  value: AhaPromptContractInput["constraints"],
  errors: string[],
): void {
  if (!isRecord(value)) {
    errors.push("constraints must be an object");
    return;
  }

  if (value.maxSentences !== 1) {
    errors.push("constraints.maxSentences must be 1");
  }

  validateRequiredTrue(value.mustUseCardAsMirror, "constraints.mustUseCardAsMirror", errors);
  validateRequiredTrue(value.mustNotPredict, "constraints.mustNotPredict", errors);
  validateRequiredTrue(value.mustNotClaimFact, "constraints.mustNotClaimFact", errors);
  validateRequiredTrue(value.mustIncludeLifeSlice, "constraints.mustIncludeLifeSlice", errors);
  validateRequiredTrue(value.mustIncludeUserAnchor, "constraints.mustIncludeUserAnchor", errors);
}

function validateStringArray(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array`);
    return;
  }

  value.forEach((item, index) => {
    if (typeof item !== "string") {
      errors.push(`${path}[${index}] must be a string`);
    }
  });
}

function validateRequiredString(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (!isNonEmptyString(value)) {
    errors.push(`${path} must be a non-empty string`);
  }
}

function validateOptionalString(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (value !== undefined && typeof value !== "string") {
    errors.push(`${path} must be a string when provided`);
  }
}

function validateRequiredTrue(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (value !== true) {
    errors.push(`${path} must be true`);
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

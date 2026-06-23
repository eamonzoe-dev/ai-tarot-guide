import type { Locale, RiskLevel } from "./reflectionSignal";

export type AhaSentenceInput = {
  locale: Locale;
  surfaceQuestion: string;
  exactAnchors: string[];
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
};

export type AhaSentenceResult = {
  sentence: string;
  riskLevel: RiskLevel;
  usedSliceId: string;
  usedAnchors: string[];
  warnings: string[];
};

const FORBIDDEN_AHA_TERMS = [
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
];

const EN_FORBIDDEN_AHA_PATTERNS = [
  /\bi know you\b/i,
  /\byou must\b/i,
  /\bwill definitely\b/i,
  /\bdestined to\b/i,
  /\bneed to listen to your heart\b/i,
];

function compactAnchors(exactAnchors: string[]): string[] {
  return exactAnchors.map((anchor) => anchor.trim()).filter(Boolean).slice(0, 3);
}

function getZhMicroLine(input: AhaSentenceInput): string {
  const { riskLevel, softenedVersionZh, concreteLineZh, concreteLineEn } =
    input.microSlice;

  if (riskLevel !== "low" && softenedVersionZh?.trim()) {
    return softenedVersionZh.trim();
  }

  return (
    concreteLineZh?.trim() ||
    softenedVersionZh?.trim() ||
    concreteLineEn?.trim() ||
    ""
  );
}

function getEnMicroLine(input: AhaSentenceInput): string {
  const { concreteLineEn, concreteLineZh, softenedVersionZh } = input.microSlice;
  return (
    concreteLineEn?.trim() ||
    concreteLineZh?.trim() ||
    softenedVersionZh?.trim() ||
    ""
  );
}

function countSentenceEndings(sentence: string): number {
  return (sentence.match(/[。！？.!?]/g) ?? []).length;
}

export function validateAhaSentence(
  sentence: string,
): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const trimmed = sentence.trim();

  if (!trimmed) {
    errors.push("Aha sentence must not be empty.");
  }

  if (countSentenceEndings(trimmed) > 1) {
    errors.push("Aha sentence must be one sentence.");
  }

  for (const term of FORBIDDEN_AHA_TERMS) {
    if (trimmed.includes(term)) {
      errors.push(`Aha sentence contains forbidden phrase: ${term}`);
    }
  }

  for (const pattern of EN_FORBIDDEN_AHA_PATTERNS) {
    if (pattern.test(trimmed)) {
      errors.push(
        `Aha sentence contains forbidden English prediction or advice pattern: ${pattern.source}`,
      );
    }
  }

  if (!trimmed.includes("照见") && !/\bmirrors\b/i.test(trimmed)) {
    errors.push("Card must be used as a mirror, not as evidence.");
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}

export function generateAhaSentence(input: AhaSentenceInput): AhaSentenceResult {
  const candidateAnchors = compactAnchors(input.exactAnchors);
  const isZh = input.locale === "zh";
  const riskLevel = input.microSlice.riskLevel;
  const line = isZh ? getZhMicroLine(input) : getEnMicroLine(input);

  const sentence =
    isZh && riskLevel !== "low" && input.microSlice.softenedVersionZh?.trim()
      ? `【${input.card.name}】像是在照见一种状态：${line}`
      : isZh
        ? `【${input.card.name}】像是在照见：${line}`
        : `${input.card.name} mirrors this pattern: ${line}`;

  const usedAnchors = candidateAnchors.filter((anchor) =>
    sentence.includes(anchor),
  );
  const warnings: string[] = [];
  const validation = validateAhaSentence(sentence);

  if (usedAnchors.length === 0) {
    warnings.push("No exact anchor appeared in generated sentence.");
  }

  if (!validation.ok) {
    warnings.push(...validation.errors);
  }

  return {
    sentence,
    riskLevel,
    usedSliceId: input.microSlice.sliceId,
    usedAnchors,
    warnings,
  };
}

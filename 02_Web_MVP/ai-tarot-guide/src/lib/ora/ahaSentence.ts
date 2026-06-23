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
  "根据你的历史记录",
  "这是你第",
  "你又",
  "你总是",
  "我早就说过",
];

const EN_FORBIDDEN_AHA_PATTERNS = [
  /\bi know you\b/i,
  /\byou must\b/i,
  /\bwill definitely\b/i,
  /\bdestined to\b/i,
  /\bneed to listen to your heart\b/i,
  /\bbased on your history\b/i,
  /\byou always\b/i,
  /\bi told you before\b/i,
];

const PREFERRED_ANCHOR_PARTS = [
  "睡不下",
  "旧决定",
  "选错",
  "回来",
  "还是一样",
  "白费",
  "证明",
  "没准备好",
  "不敢发",
  "装没事",
  "一停下来",
  "空掉",
  "等回复",
  "旧消息",
  "语气",
  "第一步",
  "打不开",
  "查资料",
  "小事",
  "卡住",
  "边界",
  "敏感",
  "受伤",
] as const;

const GENERIC_ANCHORS = [
  "迷茫",
  "想太多",
  "方向",
  "问题",
  "选择",
  "confused",
  "lost",
  "question",
  "choice",
] as const;

type AnchorCandidate = {
  value: string;
  score: number;
};

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

function selectSuitableAnchors(exactAnchors: string[]): string[] {
  const candidates = exactAnchors.flatMap(expandAnchorCandidates);
  const bestByValue = new Map<string, AnchorCandidate>();

  for (const candidate of candidates) {
    if (!isSuitableAnchor(candidate.value)) {
      continue;
    }

    const previous = bestByValue.get(candidate.value);
    if (!previous || candidate.score > previous.score) {
      bestByValue.set(candidate.value, candidate);
    }
  }

  return Array.from(bestByValue.values())
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((candidate) => candidate.value);
}

function expandAnchorCandidates(anchor: string, anchorIndex: number): AnchorCandidate[] {
  const normalized = normalizeAnchor(anchor);
  if (!normalized) {
    return [];
  }

  const preferredParts = PREFERRED_ANCHOR_PARTS.filter((part) =>
    normalized.includes(part),
  ).map((part, partIndex) => ({
    value: part,
    score: 120 - anchorIndex * 4 - partIndex,
  }));

  return [
    ...preferredParts,
    {
      value: normalized,
      score: scoreAnchor(normalized, anchorIndex),
    },
  ];
}

function normalizeAnchor(anchor: string): string {
  return anchor
    .trim()
    .replace(/[“”"']/g, "")
    .replace(/\s+/g, " ");
}

function scoreAnchor(anchor: string, anchorIndex: number): number {
  let score = 40 - anchorIndex * 3;

  if (PREFERRED_ANCHOR_PARTS.some((part) => anchor.includes(part))) {
    score += 40;
  }

  if (GENERIC_ANCHORS.some((generic) => anchor.toLowerCase() === generic)) {
    score -= 80;
  }

  if (anchor.length >= 2 && anchor.length <= 6) {
    score += 16;
  }

  return score;
}

function isSuitableAnchor(anchor: string): boolean {
  if (!anchor) {
    return false;
  }

  if (anchor.length > 14) {
    return false;
  }

  if (/[。！？.!?，,；;]/.test(anchor)) {
    return false;
  }

  if (/^(我|你|他|她).{4,}/.test(anchor)) {
    return false;
  }

  if (GENERIC_ANCHORS.some((generic) => anchor.toLowerCase() === generic)) {
    return false;
  }

  return true;
}

const CARD_MIRROR_PREFIX = "它像是在照见";

function stripCardMirrorPrefix(line: string): string {
  return line.startsWith(CARD_MIRROR_PREFIX)
    ? line.slice(CARD_MIRROR_PREFIX.length)
    : line;
}

function buildZhSentence(input: AhaSentenceInput, line: string, anchor?: string): string {
  const riskLevel = input.microSlice.riskLevel;
  const shouldUseSoftened =
    riskLevel !== "low" && Boolean(input.microSlice.softenedVersionZh?.trim());
  const normalizedLine = stripCardMirrorPrefix(line);
  const bridgedLine = anchor
    ? bridgeZhAnchor(anchor, normalizedLine, shouldUseSoftened)
    : normalizedLine;

  return shouldUseSoftened
    ? `【${input.card.name}】像是在照见一种状态：${bridgedLine}`
    : `【${input.card.name}】像是在照见：${bridgedLine}`;
}

function bridgeZhAnchor(
  anchor: string,
  line: string,
  shouldUseSoftened: boolean,
): string {
  if (line.includes(anchor)) {
    return line;
  }

  if (line.startsWith("如果")) {
    return `你说的「${anchor}」，${line}`;
  }

  if (shouldUseSoftened) {
    return `你说的「${anchor}」，也许可以先放轻成这个画面：${line}`;
  }

  if (line.startsWith("你可能")) {
    return line.replace("你可能", `你说的「${anchor}」，可能`);
  }

  return `你说的「${anchor}」，${line}`;
}

function buildEnSentence(input: AhaSentenceInput, line: string, anchor?: string): string {
  if (anchor && !line.includes(anchor)) {
    return `${input.card.name} mirrors the moment around "${anchor}": ${line}`;
  }

  return `${input.card.name} mirrors this pattern: ${line}`;
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
  const candidateAnchors = selectSuitableAnchors(input.exactAnchors);
  const isZh = input.locale === "zh";
  const riskLevel = input.microSlice.riskLevel;
  const line = isZh ? getZhMicroLine(input) : getEnMicroLine(input);
  const anchor = candidateAnchors[0];

  const sentence = isZh
    ? buildZhSentence(input, line, anchor)
    : buildEnSentence(input, line, anchor);

  const usedAnchors = candidateAnchors.filter((anchor) =>
    sentence.includes(anchor),
  );
  const warnings: string[] = [];
  const validation = validateAhaSentence(sentence);

  if (usedAnchors.length === 0) {
    warnings.push("No suitable exact anchor appeared in generated sentence.");
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

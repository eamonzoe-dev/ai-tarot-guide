export const Locale = ["en", "zh"] as const;
export type Locale = (typeof Locale)[number];

export const DialogueRole = ["user", "ora"] as const;
export type DialogueRole = (typeof DialogueRole)[number];

export const RiskLevel = ["low", "medium", "high"] as const;
export type RiskLevel = (typeof RiskLevel)[number];

const forbiddenPredictionFields = [
  "predictsFuture",
  "futureOutcome",
  "externalFactClaim",
] as const;

export type DialogueTurn = {
  role: DialogueRole;
  text: string;
};

export type ReflectionDialogueSignals = {
  selectedState?: string;
  userSelectedBehavior?: string;
  ruminationType?: string;
  agencyPosition?: string;
  hiddenCost?: string;
  exactAnchors: string[];
};

export type MicroSliceCandidate = {
  sliceId: string;
  stateKey: string;
  lineZh?: string;
  lineEn?: string;
  riskLevel: RiskLevel;
  confidence: number;
};

export type ReflectionDrawnCard = {
  id: string;
  name: string;
  symbolicLens: string;
};

export type FinalAhaConstraints = {
  maxSentences: number;
  mustUseCardAsMirror: boolean;
  mustNotPredict: boolean;
  mustNotClaimFact: boolean;
  mustIncludeLifeSlice: boolean;
  mustIncludeUserAnchor: boolean;
};

export type ReflectionSignalInput = {
  locale: Locale;
  surfaceQuestion: string;
  dialogueTurns: DialogueTurn[];
  dialogueSignals: ReflectionDialogueSignals;
  microSliceCandidates: MicroSliceCandidate[];
  drawnCard: ReflectionDrawnCard;
  finalAhaConstraints: FinalAhaConstraints;
};

export type ReflectionSignalValidationResult =
  | { ok: true; value: ReflectionSignalInput }
  | { ok: false; errors: string[] };

export const defaultFinalAhaConstraints: FinalAhaConstraints = {
  maxSentences: 1,
  mustUseCardAsMirror: true,
  mustNotPredict: true,
  mustNotClaimFact: true,
  mustIncludeLifeSlice: true,
  mustIncludeUserAnchor: true,
};

export const sampleReflectionSignalInput: ReflectionSignalInput = {
  locale: "zh",
  surfaceQuestion: "我最近很迷茫",
  dialogueTurns: [
    {
      role: "user",
      text: "我最近很迷茫",
    },
    {
      role: "ora",
      text: "这种迷茫更像是想太多睡不下，还是白天看起来正常，但一停下来就空掉？",
    },
    {
      role: "user",
      text: "想太多睡不下",
    },
    {
      role: "ora",
      text: "那些想法更像是在推演未来，还是在翻旧决定有没有选错？",
    },
    {
      role: "user",
      text: "翻旧决定有没有选错",
    },
  ],
  dialogueSignals: {
    selectedState: "late_night_rumination",
    userSelectedBehavior: "想太多睡不下",
    ruminationType: "past_choice_regret",
    agencyPosition: "waiting_for_confirmation",
    hiddenCost: "sleep and present attention",
    exactAnchors: ["迷茫", "想太多睡不下", "翻旧决定有没有选错"],
  },
  microSliceCandidates: [
    {
      sliceId: "late_night_rumination_001",
      stateKey: "late_night_rumination",
      lineZh:
        "它像是在照见：你不是白天最混乱，而是到了该睡的时候，脑子才开始转那些旧决定。",
      lineEn:
        "It looks like the day is not the most chaotic part; the old decision starts turning in your mind when it is time to sleep.",
      riskLevel: "low",
      confidence: 0.82,
    },
  ],
  drawnCard: {
    id: "two-of-swords",
    name: "宝剑二",
    symbolicLens: "在两个选项之间暂停，并把确认感交还给自己。",
  },
  finalAhaConstraints: defaultFinalAhaConstraints,
};

export function isReflectionSignalInput(
  value: unknown,
): value is ReflectionSignalInput {
  return validateReflectionSignalInput(value).ok;
}

export function validateReflectionSignalInput(
  value: unknown,
): ReflectionSignalValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: ["input must be an object"] };
  }

  for (const fieldPath of findForbiddenPredictionFields(value)) {
    errors.push(`forbidden prediction-related field: ${fieldPath}`);
  }

  if (!isOneOf(value.locale, Locale)) {
    errors.push("locale must be en or zh");
  }

  if (!isNonEmptyString(value.surfaceQuestion)) {
    errors.push("surfaceQuestion must be a non-empty string");
  }

  validateDialogueTurns(value.dialogueTurns, errors);
  validateDialogueSignals(value.dialogueSignals, errors);
  validateMicroSliceCandidates(value.microSliceCandidates, errors);
  validateDrawnCard(value.drawnCard, errors);
  validateFinalAhaConstraints(value.finalAhaConstraints, errors);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: value as ReflectionSignalInput };
}

function validateDialogueTurns(value: unknown, errors: string[]): void {
  if (!Array.isArray(value)) {
    errors.push("dialogueTurns must be an array");
    return;
  }

  if (value.length < 1) {
    errors.push("dialogueTurns must include at least one turn");
  }

  value.forEach((turn, index) => {
    const path = `dialogueTurns[${index}]`;

    if (!isRecord(turn)) {
      errors.push(`${path} must be an object`);
      return;
    }

    if (!isOneOf(turn.role, DialogueRole)) {
      errors.push(`${path}.role must be user or ora`);
    }

    if (!isNonEmptyString(turn.text)) {
      errors.push(`${path}.text must be a non-empty string`);
    }
  });
}

function validateDialogueSignals(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("dialogueSignals must be an object");
    return;
  }

  validateOptionalString(value.selectedState, "dialogueSignals.selectedState", errors);
  validateOptionalString(
    value.userSelectedBehavior,
    "dialogueSignals.userSelectedBehavior",
    errors,
  );
  validateOptionalString(value.ruminationType, "dialogueSignals.ruminationType", errors);
  validateOptionalString(
    value.agencyPosition,
    "dialogueSignals.agencyPosition",
    errors,
  );
  validateOptionalString(value.hiddenCost, "dialogueSignals.hiddenCost", errors);

  if (!Array.isArray(value.exactAnchors)) {
    errors.push("dialogueSignals.exactAnchors must be an array");
    return;
  }

  value.exactAnchors.forEach((anchor, index) => {
    if (typeof anchor !== "string") {
      errors.push(`dialogueSignals.exactAnchors[${index}] must be a string`);
    }
  });
}

function validateMicroSliceCandidates(value: unknown, errors: string[]): void {
  if (!Array.isArray(value)) {
    errors.push("microSliceCandidates must be an array");
    return;
  }

  value.forEach((candidate, index) => {
    const path = `microSliceCandidates[${index}]`;

    if (!isRecord(candidate)) {
      errors.push(`${path} must be an object`);
      return;
    }

    if (!isNonEmptyString(candidate.sliceId)) {
      errors.push(`${path}.sliceId must be a non-empty string`);
    }

    if (!isNonEmptyString(candidate.stateKey)) {
      errors.push(`${path}.stateKey must be a non-empty string`);
    }

    validateOptionalString(candidate.lineZh, `${path}.lineZh`, errors);
    validateOptionalString(candidate.lineEn, `${path}.lineEn`, errors);

    if (!isOneOf(candidate.riskLevel, RiskLevel)) {
      errors.push(`${path}.riskLevel must be low, medium, or high`);
    }

    if (!isConfidence(candidate.confidence)) {
      errors.push(`${path}.confidence must be a number between 0 and 1`);
    }
  });
}

function validateDrawnCard(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("drawnCard must be an object");
    return;
  }

  if (!isNonEmptyString(value.id)) {
    errors.push("drawnCard.id must be a non-empty string");
  }

  if (!isNonEmptyString(value.name)) {
    errors.push("drawnCard.name must be a non-empty string");
  }

  if (!isNonEmptyString(value.symbolicLens)) {
    errors.push("drawnCard.symbolicLens must be a non-empty string");
  }
}

function validateFinalAhaConstraints(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("finalAhaConstraints must exist and be an object");
    return;
  }

  if (
    typeof value.maxSentences !== "number" ||
    !Number.isInteger(value.maxSentences) ||
    value.maxSentences < 1
  ) {
    errors.push("finalAhaConstraints.maxSentences must be a positive integer");
  }

  validateRequiredBoolean(
    value.mustUseCardAsMirror,
    "finalAhaConstraints.mustUseCardAsMirror",
    errors,
  );
  validateRequiredBoolean(
    value.mustNotPredict,
    "finalAhaConstraints.mustNotPredict",
    errors,
  );
  validateRequiredBoolean(
    value.mustNotClaimFact,
    "finalAhaConstraints.mustNotClaimFact",
    errors,
  );
  validateRequiredBoolean(
    value.mustIncludeLifeSlice,
    "finalAhaConstraints.mustIncludeLifeSlice",
    errors,
  );
  validateRequiredBoolean(
    value.mustIncludeUserAnchor,
    "finalAhaConstraints.mustIncludeUserAnchor",
    errors,
  );
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

function validateRequiredBoolean(
  value: unknown,
  path: string,
  errors: string[],
): void {
  if (typeof value !== "boolean") {
    errors.push(`${path} must be a boolean`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isConfidence(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}

function isOneOf<const T extends readonly string[]>(
  value: unknown,
  allowedValues: T,
): value is T[number] {
  return typeof value === "string" && allowedValues.includes(value);
}

function findForbiddenPredictionFields(value: unknown): string[] {
  const paths: string[] = [];
  visitForForbiddenFields(value, "$", paths);
  return paths;
}

function visitForForbiddenFields(
  value: unknown,
  path: string,
  paths: string[],
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      visitForForbiddenFields(item, `${path}[${index}]`, paths);
    });
    return;
  }

  if (!isRecord(value)) {
    return;
  }

  for (const [key, childValue] of Object.entries(value)) {
    const childPath = `${path}.${key}`;
    if (isOneOf(key, forbiddenPredictionFields)) {
      paths.push(childPath);
    }
    visitForForbiddenFields(childValue, childPath, paths);
  }
}

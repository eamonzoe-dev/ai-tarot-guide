import { DrawClient } from "./DrawClient";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeRitualStep(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number.parseInt(rawValue ?? "0", 10);

  if (parsedValue === 1 || parsedValue === 2) {
    return parsedValue;
  }

  return 0;
}

export default async function DrawPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    question?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
    ritualStep?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    question: questionParam,
    spread: spreadParam,
    lang: langParam,
    ritualStep: ritualStepParam,
  } = await searchParams;
  const spreadValue = normalizeValue(spreadParam);
  const spread: Spread = spreadValue === "three-card" ? "three-card" : "single";
  const ritualStep = normalizeRitualStep(ritualStepParam);

  return (
    <DrawClient
      initialMode={normalizeMode(modeParam)}
      initialQuestion={normalizeValue(questionParam)}
      initialSpread={spread}
      initialLang={normalizeLanguage(langParam)}
      hasLangParam={Boolean(langParam)}
      initialRitualStep={ritualStep}
    />
  );
}

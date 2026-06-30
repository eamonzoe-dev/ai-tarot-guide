import { AskForm } from "./AskForm";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";
type Orientation = "upright";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
    question?: string | string[];
    ritual?: string | string[];
    preparation?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    spread: spreadParam,
    orientation: orientationParam,
    lang: langParam,
    question: questionParam,
    ritual: ritualParam,
    preparation: preparationParam,
  } = await searchParams;
  const mode = normalizeMode(modeParam);
  const lang = normalizeLanguage(langParam);
  const spreadValue = normalizeValue(spreadParam);
  const orientationValue = normalizeValue(orientationParam);
  const spread: Spread = spreadValue === "three-card" ? "three-card" : "single";
  const orientation: Orientation =
    orientationValue === "upright" ? "upright" : "upright";
  const initialQuestion = normalizeValue(questionParam).trim();
  const ritualValue = normalizeValue(ritualParam) || normalizeValue(preparationParam);
  const initialRitualEnabled = ritualValue === "1" || ritualValue === "true";

  return (
    <AskForm
      mode={mode}
      spread={spread}
      orientation={orientation}
      lang={lang}
      hasLangParam={Boolean(langParam)}
      initialQuestion={initialQuestion}
      initialRitualEnabled={initialRitualEnabled}
    />
  );
}

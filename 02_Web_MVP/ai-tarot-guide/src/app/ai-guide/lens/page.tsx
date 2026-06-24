import { PreDrawClarifier } from "@/components/ai-guide/PreDrawClarifier";
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

export default async function LensPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    question?: string | string[];
    lang?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    spread: spreadParam,
    orientation: orientationParam,
    question: questionParam,
    lang: langParam,
  } = await searchParams;

  const mode = normalizeMode(modeParam);
  const lang = normalizeLanguage(langParam);
  const spreadValue = normalizeValue(spreadParam);
  const spread: Spread = spreadValue === "three-card" ? "three-card" : "single";
  const orientationValue = normalizeValue(orientationParam);
  const orientation: Orientation =
    orientationValue === "upright" ? "upright" : "upright";
  const question = normalizeValue(questionParam);

  return (
    <PreDrawClarifier
      lang={lang}
      mode={mode}
      spread={spread}
      orientation={orientation}
      initialQuestion={question}
    />
  );
}

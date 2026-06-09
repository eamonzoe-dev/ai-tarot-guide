import { ResultClient } from "./ResultClient";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeMode(value: string | string[] | undefined) {
  const mode = normalizeValue(value);
  return mode === "online" || mode === "physical" ? mode : "";
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    card?: string | string[];
    orientation?: string | string[];
    question?: string | string[];
    lang?: string | string[];
  }>;
}) {
  const { mode, spread, card, orientation, question, lang } =
    await searchParams;

  return (
    <ResultClient
      initialMode={normalizeMode(mode)}
      initialSpread={normalizeValue(spread)}
      initialCard={normalizeValue(card)}
      initialOrientation={normalizeValue(orientation)}
      initialQuestion={normalizeValue(question)}
      initialLang={normalizeLanguage(lang)}
      hasLangParam={Boolean(lang)}
    />
  );
}

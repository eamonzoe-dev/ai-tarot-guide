import { RevealClient } from "./RevealClient";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildDebugSearchParams(
  params: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, normalizeValue(value)]),
  );
}

export default async function RevealPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    question?: string | string[];
    spread?: string | string[];
    card?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
  }>;
}) {
  const { mode, question, spread, card, orientation, lang } =
    await searchParams;
  const initialSearchParams = buildDebugSearchParams({
    mode,
    question,
    spread,
    card,
    orientation,
    lang,
  });

  return (
    <RevealClient
      initialMode={normalizeValue(mode)}
      initialQuestion={normalizeValue(question)}
      initialSpread={normalizeValue(spread)}
      initialCard={normalizeValue(card)}
      initialOrientation={normalizeValue(orientation)}
      initialLang={normalizeLanguage(lang)}
      hasLangParam={Boolean(lang)}
      initialSearchParams={initialSearchParams}
    />
  );
}

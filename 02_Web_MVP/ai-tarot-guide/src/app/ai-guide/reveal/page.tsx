import { RevealClient } from "./RevealClient";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function RevealPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    question?: string | string[];
    spread?: string | string[];
    card?: string | string[];
    cards?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
    clarifyId?: string | string[];
    clarifyLabel?: string | string[];
    clarifyFocus?: string | string[];
    clarifyNote?: string | string[];
  }>;
}) {
  const {
    mode,
    question,
    spread,
    card,
    cards,
    orientation,
    lang,
    clarifyId,
    clarifyLabel,
    clarifyFocus,
    clarifyNote,
  } = await searchParams;

  return (
    <RevealClient
      initialMode={normalizeValue(mode)}
      initialQuestion={normalizeValue(question)}
      initialSpread={normalizeValue(spread)}
      initialCard={normalizeValue(card)}
      initialCards={normalizeValue(cards)}
      initialOrientation={normalizeValue(orientation)}
      initialLang={normalizeLanguage(lang)}
      hasLangParam={Boolean(lang)}
      initialClarifyId={normalizeValue(clarifyId)}
      initialClarifyLabel={normalizeValue(clarifyLabel)}
      initialClarifyFocus={normalizeValue(clarifyFocus)}
      initialClarifyNote={normalizeValue(clarifyNote)}
    />
  );
}

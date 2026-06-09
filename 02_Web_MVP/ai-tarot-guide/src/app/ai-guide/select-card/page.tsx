import { SelectCardClient } from "./SelectCardClient";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SelectCardPage({
  searchParams,
}: {
  searchParams: Promise<{
    question?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
  }>;
}) {
  const { question, spread, orientation, lang } = await searchParams;

  return (
    <SelectCardClient
      initialQuestion={normalizeValue(question)}
      initialSpread={normalizeValue(spread)}
      initialOrientation={normalizeValue(orientation)}
      initialLang={normalizeLanguage(lang)}
      hasLangParam={Boolean(lang)}
    />
  );
}

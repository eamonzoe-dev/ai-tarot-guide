import { OracleShowroomHome } from "@/components/ai-guide/OracleShowroomHome";
import { normalizeLanguage, withLang } from "@/lib/ai-guide/i18n";

export default async function AiGuidePage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = normalizeLanguage(langParam);
  const homeHref = withLang("/ai-guide", {}, lang);
  const physicalHref = withLang(
    "/ai-guide/ask",
    { mode: "physical", spread: "single", orientation: "upright" },
    lang,
  );
  const onlineHref = withLang(
    "/ai-guide/ask",
    { mode: "online", spread: "single", orientation: "upright" },
    lang,
  );
  const threeCardHref = withLang(
    "/ai-guide/ask",
    { mode: "online", spread: "three-card", orientation: "upright" },
    lang,
  );
  const readingsHref = withLang("/ai-guide/readings", {}, lang);

  return (
    <OracleShowroomHome
      lang={lang}
      hasLangParam={Boolean(langParam)}
      homeHref={homeHref}
      physicalHref={physicalHref}
      onlineHref={onlineHref}
      threeCardHref={threeCardHref}
      readingsHref={readingsHref}
    />
  );
}

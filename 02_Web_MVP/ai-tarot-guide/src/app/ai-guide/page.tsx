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
    "/ai-guide/prepare",
    { mode: "physical", spread: "single", orientation: "upright" },
    lang,
  );
  const onlineHref = withLang(
    "/ai-guide/prepare",
    { mode: "online", spread: "single", orientation: "upright" },
    lang,
  );
  const readingsHref = withLang("/ai-guide/readings", {}, lang);
  const askOnlineHref = withLang("/ai-guide/ask", { mode: "online" }, lang);
  const clarityHref = withLang(
    "/ai-guide/ask",
    { mode: "online", intent: "clarity" },
    lang,
  );
  const mirrorHref = withLang(
    "/ai-guide/ask",
    { mode: "online", intent: "mirror" },
    lang,
  );
  const nextStepHref = withLang(
    "/ai-guide/ask",
    { mode: "online", intent: "next-step" },
    lang,
  );

  return (
    <OracleShowroomHome
      lang={lang}
      hasLangParam={Boolean(langParam)}
      homeHref={homeHref}
      physicalHref={physicalHref}
      onlineHref={onlineHref}
      readingsHref={readingsHref}
      askOnlineHref={askOnlineHref}
      clarityHref={clarityHref}
      mirrorHref={mirrorHref}
      nextStepHref={nextStepHref}
      trustHrefs={{
        privacy: withLang("/privacy", {}, lang),
        terms: withLang("/terms", {}, lang),
        disclaimer: withLang("/disclaimer", {}, lang),
        contact: withLang("/contact", {}, lang),
      }}
    />
  );
}

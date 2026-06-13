import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import { normalizeLanguage, text, withLang } from "@/lib/ai-guide/i18n";

export default async function AiGuidePage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
  }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = normalizeLanguage(langParam);
  const copy = text(lang);
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

  return (
    <PageContainer compact>
      <div className="flex min-h-svh flex-col justify-between gap-8 sm:min-h-0">
        <div className="flex justify-end pt-3">
          <LanguageToggle
            lang={lang}
            pathname="/ai-guide"
            hasLangParam={Boolean(langParam)}
          />
        </div>
        <section className="pt-6 text-center">
          <p className="atelier-label mb-4 text-[0.68rem] font-semibold">
            {copy.homeTitle}
          </p>
          <h1 className="mx-auto max-w-sm font-serif text-[2.85rem] leading-[1.02] text-[#f6ecd8]">
            {copy.homeSubtitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-[#b7aa94]">
            {copy.homeDescription}
          </p>
        </section>

        <section className="flex flex-1 items-center justify-center py-2">
          <div className="atelier-worktop w-full max-w-sm p-4">
            <div className="grid gap-3">
              <TarotButton
                href={physicalHref}
                className="min-h-28 flex-col gap-2 rounded-2xl p-4 tracking-[0.12em]"
              >
                <span className="font-serif text-xl normal-case tracking-[0]">
                  {copy.homePhysicalTitle}
                </span>
                <span className="normal-case leading-5 tracking-[0] text-[#bfb39e]">
                  {copy.homePhysicalDescription}
                </span>
              </TarotButton>

              <TarotButton
                href={onlineHref}
                variant="ghost"
                className="min-h-28 flex-col gap-2 rounded-2xl p-4 tracking-[0.12em]"
              >
                <span className="font-serif text-xl normal-case tracking-[0]">
                  {copy.homeOnlineTitle}
                </span>
                <span className="normal-case leading-5 tracking-[0] text-[#bfb39e]">
                  {copy.homeOnlineDescription}
                </span>
              </TarotButton>
            </div>
            <div className="atelier-divider mt-4" />
            <div className="mt-4">
              <ActivationCodePanel />
            </div>
            <div className="atelier-divider mt-4" />
            <p className="pt-4 text-center text-[0.58rem] uppercase tracking-[0.32em] text-[#a19072]">
              {copy.entranceDesk}
            </p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

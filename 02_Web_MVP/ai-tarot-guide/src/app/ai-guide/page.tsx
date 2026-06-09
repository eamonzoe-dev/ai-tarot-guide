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
      <div className="flex min-h-[calc(100dvh-3rem)] flex-col justify-between gap-6">
        <div className="flex justify-end pt-3">
          <LanguageToggle
            lang={lang}
            pathname="/ai-guide"
            hasLangParam={Boolean(langParam)}
          />
        </div>
        <section className="pt-5">
          <p className="atelier-label mb-4 text-[0.68rem] font-semibold">
            {copy.homeTitle}
          </p>
          <h1 className="max-w-sm font-serif text-[2.75rem] leading-[0.98] text-[#f4efe5]">
            {copy.homeSubtitle}
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#aaa49b]">
            {copy.homeDescription}
          </p>
        </section>

        <section className="flex flex-1 items-center justify-center py-2">
          <div className="atelier-worktop w-full max-w-sm p-4">
            <div className="grid grid-cols-2 gap-3">
              <TarotButton
                href={physicalHref}
                className="min-h-52 flex-col gap-3 p-3 tracking-[0.16em]"
              >
                <span className="flex h-24 w-20 items-center justify-center border border-[#8c724b] bg-[linear-gradient(160deg,#21160f,#0d0906)] shadow-[0_14px_28px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,245,224,0.1)]">
                  <span className="h-16 w-12 border border-[#b49a68]/65 bg-[#080706]" />
                </span>
                <span className="leading-5">{copy.homePhysicalTitle}</span>
                <span className="normal-case leading-5 tracking-[0] text-[#c8c0b4]">
                  {copy.homePhysicalDescription}
                </span>
              </TarotButton>

              <TarotButton
                href={onlineHref}
                variant="ghost"
                className="min-h-52 flex-col gap-3 p-3 tracking-[0.16em]"
              >
                <span className="relative flex h-24 w-20 items-center justify-center">
                  <span className="absolute h-20 w-14 translate-x-2 translate-y-2 border border-[#4b5c54] bg-[#0b100f]" />
                  <span className="absolute h-20 w-14 translate-x-1 translate-y-1 border border-[#64776b] bg-[#101715]" />
                  <span className="relative h-20 w-14 border border-[#8aa08f] bg-[linear-gradient(160deg,#17201d,#080b0a)] shadow-[0_14px_28px_rgba(0,0,0,0.45)]" />
                </span>
                <span className="leading-5">{copy.homeOnlineTitle}</span>
                <span className="normal-case leading-5 tracking-[0] text-[#c8c0b4]">
                  {copy.homeOnlineDescription}
                </span>
              </TarotButton>
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

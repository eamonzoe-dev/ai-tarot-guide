import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { GalaxyBackground } from "@/components/ai-guide/GalaxyBackground";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import Link from "next/link";
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
  const readingsHref = withLang("/ai-guide/readings", {}, lang);
  const suggestedQuestions =
    lang === "zh"
      ? [
          "今天我需要留意什么？",
          "这件事里隐藏着什么？",
          "我应该放下什么？",
          "现在什么最值得我聚焦？",
        ]
      : [
          "What should I pay attention to today?",
          "What is hidden in this situation?",
          "What should I release?",
          "What is asking for my focus?",
        ];
  const footerCopy =
    lang === "zh"
      ? {
          brandLine: "为安静的问题而生。",
          brandDescription: "一个结合实体牌组与 AI 解读的反思空间。",
          readingTitle: "Reading",
          physical: "实体牌组解读",
          online: "在线单牌",
          redeem: "兑换牌组代码",
          journal: "阅读日志",
          trustTitle: "Trust",
          privacy: "隐私政策",
          terms: "使用条款",
          disclaimer: "AI / 娱乐用途声明",
          contact: "联系方式",
          comingSoon: "即将支持",
          reflectionOnly: "仅供反思，不替代专业建议。",
        }
      : {
          brandLine: "Made with intention.",
          brandDescription:
            "AI-powered tarot readings for quiet questions and clearer days.",
          readingTitle: "Reading",
          physical: "Physical Deck Reading",
          online: "Online Single Card",
          redeem: "Redeem Deck Code",
          journal: "Reading Journal",
          trustTitle: "Trust",
          privacy: "Privacy Policy",
          terms: "Terms of Use",
          disclaimer: "AI / Entertainment Disclaimer",
          contact: "Contact",
          comingSoon: "Coming soon",
          reflectionOnly: "For reflection only.",
        };

  return (
    <main className="atelier-page relative flex min-h-svh flex-1 overflow-hidden px-0 py-0 text-[#eee8dd] sm:px-6 sm:py-6 lg:px-8">
      <GalaxyBackground />
      <div className="atelier-grain pointer-events-none absolute inset-0" />

      <section className="ritual-room-container relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-5 sm:min-h-0 sm:px-6">
        <header className="grid grid-cols-[1fr_auto] items-start gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="min-w-0 pt-2">
            <p className="font-serif text-lg leading-none text-[#f6ecd8]">
              Ora Arcana
            </p>
          </div>
          <nav className="hidden items-center justify-center gap-6 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#8f826f] sm:flex">
            <span className="text-[#d9bd80]">Reading Room</span>
          </nav>
          <div className="flex items-start justify-end">
            <ActivationCodePanel
              lang={lang}
              hasLangParam={Boolean(langParam)}
            />
          </div>
        </header>

        <section className="mx-auto w-full max-w-3xl pt-8 text-center sm:pt-12 lg:pt-14">
          <p className="atelier-label mb-4 text-[0.68rem] font-semibold">
            {copy.homeTitle}
          </p>
          <h1 className="mx-auto max-w-2xl font-serif text-[2.85rem] leading-[1.02] text-[#f6ecd8] sm:text-[4.55rem]">
            {copy.homeSubtitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#c2b59f] sm:text-[1.05rem] sm:leading-8">
            {copy.homeDescription}
          </p>
        </section>

        <section className="mx-auto mt-7 w-full max-w-[54rem] sm:mt-9">
          <div className="atelier-worktop p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-[#3d3020] pb-4">
              <p className="atelier-label text-[0.62rem] font-semibold">
                Reading Portal
              </p>
              <p className="hidden text-sm leading-5 text-[#9f947f] sm:block">
                Choose how you want to begin.
              </p>
            </div>
            <p className="mb-4 text-sm leading-6 text-[#c8bca6] sm:hidden">
              Choose how you want to begin.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <TarotButton
                href={physicalHref}
                className="min-h-32 flex-col gap-3 rounded-2xl p-4 tracking-[0.12em] sm:min-h-40 sm:p-6"
              >
                <span className="font-serif text-xl normal-case tracking-[0] sm:text-2xl">
                  {copy.homePhysicalTitle}
                </span>
                <span className="normal-case leading-5 tracking-[0] text-[#bfb39e] sm:text-sm sm:leading-6">
                  {copy.homePhysicalDescription}
                </span>
              </TarotButton>

              <TarotButton
                href={onlineHref}
                variant="ghost"
                className="min-h-32 flex-col gap-3 rounded-2xl p-4 tracking-[0.12em] sm:min-h-40 sm:p-6"
              >
                <span className="font-serif text-xl normal-case tracking-[0] sm:text-2xl">
                  {copy.homeOnlineTitle}
                </span>
                <span className="normal-case leading-5 tracking-[0] text-[#bfb39e] sm:text-sm sm:leading-6">
                  {copy.homeOnlineDescription}
                </span>
              </TarotButton>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 w-full max-w-[54rem]">
          <div className="border-t border-[#4a3926] pt-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="atelier-label text-[0.62rem] font-semibold">
                {lang === "zh" ? "推荐问题" : "Suggested Questions"}
              </h2>
              <p className="hidden text-xs text-[#8f826f] sm:block">
                {lang === "zh" ? "仅作灵感提示" : "For reflection prompts only"}
              </p>
            </div>
            <div className="grid divide-y divide-[#33291d] border-y border-[#33291d]">
              {suggestedQuestions.map((question) => (
                <p
                  className="py-3.5 text-[0.95rem] leading-7 text-[#c8bca6]"
                  key={question}
                >
                  {question}
                </p>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-auto pt-10 opacity-85">
          <div className="mx-auto w-full max-w-[54rem] border-t border-[#6d5a35]/35 pt-5">
            <div className="grid gap-6 text-left sm:grid-cols-[1.4fr_1fr_1fr]">
              <section>
                <h2 className="font-serif text-xl leading-none text-[#d8c9ae]">
                  Ora Arcana
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#b7aa94]">
                  {footerCopy.brandLine}
                </p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-[#7d7466]">
                  {footerCopy.brandDescription}
                </p>
              </section>

              <section>
                <h3 className="atelier-label text-[0.62rem] font-semibold">
                  {footerCopy.readingTitle}
                </h3>
                <div className="mt-3 grid gap-1.5 text-sm leading-6">
                  <Link
                    className="text-[#9f947f] transition hover:text-[#d8c9ae]"
                    href={physicalHref}
                  >
                    {footerCopy.physical}
                  </Link>
                  <Link
                    className="text-[#9f947f] transition hover:text-[#d8c9ae]"
                    href={onlineHref}
                  >
                    {footerCopy.online}
                  </Link>
                  <span className="text-[#7d7466]">
                    {footerCopy.redeem}
                  </span>
                  <Link
                    className="text-[#6f6658] transition hover:text-[#d8c9ae]"
                    href={readingsHref}
                  >
                    {footerCopy.journal}
                  </Link>
                </div>
              </section>

              <section>
                <h3 className="atelier-label text-[0.62rem] font-semibold">
                  {footerCopy.trustTitle}
                </h3>
                <div className="mt-3 grid gap-1.5 text-sm leading-6 text-[#6f6658]">
                  <Link
                    className="transition hover:text-[#d8c9ae]"
                    href="/privacy"
                  >
                    {footerCopy.privacy}
                  </Link>
                  <Link
                    className="transition hover:text-[#d8c9ae]"
                    href="/terms"
                  >
                    {footerCopy.terms}
                  </Link>
                  <Link
                    className="transition hover:text-[#d8c9ae]"
                    href="/disclaimer"
                  >
                    {footerCopy.disclaimer}
                  </Link>
                  <Link
                    className="transition hover:text-[#d8c9ae]"
                    href="/contact"
                  >
                    {footerCopy.contact}
                  </Link>
                </div>
              </section>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-[#2b241a]/70 pt-4 text-[0.56rem] uppercase tracking-[0.24em] text-[#6f6658] sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Ora Arcana</p>
              <p>{footerCopy.reflectionOnly}</p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

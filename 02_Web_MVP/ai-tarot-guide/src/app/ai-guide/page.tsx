import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
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
          "What should I pay attention to right now?",
          "What is the central tension in this situation?",
          "What am I not seeing clearly?",
          "What next step deserves my attention?",
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
          brandLine: "Ora Arcana Reading Room",
          brandDescription:
            "An AI-assisted tarot reading room for symbolic reflection and structured card interpretation.",
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
          reflectionOnly: "For reflection only. Not a prediction or professional advice.",
        };
  const ritualPath = [
    {
      step: "01",
      title: "Prepare",
      description: "Set your space and your intention.",
    },
    {
      step: "02",
      title: "Ask",
      description: "Bring a clear question into the room.",
    },
    {
      step: "03",
      title: "Draw",
      description: "Draw your card and receive your message.",
    },
  ];

  return (
    <main className="relative flex min-h-svh flex-1 overflow-hidden bg-[#f4efe5] px-0 py-0 text-[#4b4034] sm:px-6 sm:py-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.96),rgba(244,239,229,0.72)_34%,transparent_66%),radial-gradient(circle_at_18%_14%,rgba(234,215,166,0.24),transparent_28%),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.58),transparent_31%),linear-gradient(180deg,#f8f4ec_0%,#efe6d7_58%,#d8c9ae_130%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34rem] bg-[linear-gradient(180deg,transparent,rgba(24,18,13,0.08)_68%,rgba(24,18,13,0.18))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full border border-[#caa96a]/16 opacity-70"
      />

      <section className="relative mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 py-5 sm:min-h-0 sm:px-6">
        <header className="grid grid-cols-[1fr_auto] items-start gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="min-w-0 pt-2">
            <p className="font-serif text-lg leading-none text-[#5b4a36]">
              Ora Arcana
            </p>
          </div>
          <nav className="hidden items-center justify-center gap-6 pt-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#9b8a73] sm:flex">
            <span className="text-[#9d7b3f]">Reading Room</span>
          </nav>
          <div className="flex items-start justify-end [&_button[aria-expanded]]:border-[#d8b76a]/45 [&_button[aria-expanded]]:bg-[#fffaf0]/78 [&_button[aria-expanded]]:text-[#5b4a36] [&_button[aria-expanded]]:shadow-[0_10px_28px_rgba(111,84,43,0.12)] [&_button[aria-expanded]]:backdrop-blur">
            <ActivationCodePanel
              lang={lang}
              hasLangParam={Boolean(langParam)}
            />
          </div>
        </header>

        <section className="mx-auto w-full max-w-4xl pt-9 text-center sm:pt-13 lg:pt-15">
          <p className="mb-3 flex items-center justify-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/70 to-transparent" />
            {copy.homeTitle}
            <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/70 to-transparent" />
          </p>
          <h1 className="mx-auto max-w-3xl font-serif text-[2.85rem] leading-[1.02] text-[#4f4235] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] sm:text-[4.5rem]">
            {copy.homeSubtitle}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#766955] sm:text-[1.05rem] sm:leading-8">
            {copy.homeDescription}
          </p>

          <div
            aria-hidden="true"
            className="relative mx-auto mt-8 flex h-[21rem] w-full max-w-[25rem] items-center justify-center sm:mt-10 sm:h-[24rem] sm:max-w-[31rem]"
          >
            <div className="absolute inset-x-8 top-4 h-60 rounded-full bg-[radial-gradient(ellipse_at_50%_42%,rgba(255,255,255,0.94),rgba(234,215,166,0.26)_36%,rgba(255,255,255,0.08)_58%,transparent_76%)] blur-[2px]" />
            <div className="absolute left-1/2 top-7 h-60 w-60 -translate-x-1/2 rounded-full border border-[#caa96a]/30" />
            <div className="absolute left-1/2 top-13 h-44 w-44 -translate-x-1/2 rounded-full border border-[#d8b76a]/24" />
            <div className="absolute left-1/2 top-21 h-px w-80 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa96a]/42 to-transparent" />
            <div className="absolute left-1/2 top-[3.6rem] h-px w-12 -translate-x-1/2 bg-[#caa96a]/42" />

            <div className="absolute left-[7%] top-13 h-56 w-34 -rotate-[11deg] rounded-[1.45rem] border border-[#caa96a]/52 bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(239,229,210,0.9))] shadow-[0_20px_48px_rgba(126,94,44,0.14),0_0_24px_rgba(255,255,255,0.55),inset_0_1px_0_rgba(255,255,255,0.95)] sm:left-[14%] sm:h-64 sm:w-38">
              <div className="absolute inset-3 rounded-[1.05rem] border border-[#d8b76a]/36" />
              <div className="absolute inset-x-7 top-6 h-px bg-gradient-to-r from-transparent via-[#caa96a]/54 to-transparent" />
              <div className="absolute inset-x-7 bottom-6 h-px bg-gradient-to-r from-transparent via-[#caa96a]/54 to-transparent" />
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#caa96a]/42" />
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#caa96a]/28 bg-[radial-gradient(circle,rgba(255,255,255,0.92),rgba(234,215,166,0.1))]" />
            </div>

            <div className="absolute top-1 h-68 w-42 rounded-[1.65rem] border border-[#caa96a]/68 bg-[linear-gradient(180deg,rgba(255,253,248,0.99),rgba(241,232,214,0.94))] shadow-[0_24px_60px_rgba(126,94,44,0.18),0_0_40px_rgba(255,255,255,0.78),inset_0_1px_0_rgba(255,255,255,0.98)] sm:h-80 sm:w-48">
              <div className="absolute inset-3 rounded-[1.2rem] border border-[#d8b76a]/42" />
              <div className="absolute inset-6 rounded-full border border-[#caa96a]/32" />
              <div className="absolute inset-x-10 top-12 h-px bg-gradient-to-r from-transparent via-[#caa96a]/58 to-transparent" />
              <div className="absolute inset-x-10 bottom-12 h-px bg-gradient-to-r from-transparent via-[#caa96a]/58 to-transparent" />
              <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#caa96a]/46" />
              <div className="absolute left-1/2 top-1/2 h-16 w-8 -translate-x-1/2 -translate-y-1/2 rounded-l-full border border-r-0 border-[#caa96a]/52" />
              <div className="absolute left-1/2 top-[18%] h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa96a]/62 to-transparent" />
              <div className="absolute bottom-[18%] left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa96a]/62 to-transparent" />
              <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#caa96a]/70" />
            </div>

            <div className="absolute right-[7%] top-13 h-56 w-34 rotate-[11deg] rounded-[1.45rem] border border-[#caa96a]/46 bg-[linear-gradient(180deg,rgba(255,253,248,0.97),rgba(239,229,210,0.88))] shadow-[0_20px_48px_rgba(126,94,44,0.12),0_0_22px_rgba(255,255,255,0.48),inset_0_1px_0_rgba(255,255,255,0.92)] sm:right-[14%] sm:h-64 sm:w-38">
              <div className="absolute inset-3 rounded-[1.05rem] border border-[#d8b76a]/32" />
              <div className="absolute inset-8 rounded-full border border-[#caa96a]/30" />
              <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#caa96a]/38" />
              <div className="absolute left-1/2 top-1/2 h-px w-18 -translate-x-1/2 bg-[#caa96a]/32" />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 w-full max-w-3xl sm:mt-8">
          <div className="rounded-[1.5rem] border border-[#d8b76a]/34 bg-[#fff9ee]/72 p-4 shadow-[0_18px_52px_rgba(126,94,44,0.11),inset_0_1px_0_rgba(255,255,255,0.86)] backdrop-blur sm:p-6">
            <div className="mb-4 grid gap-2 border-b border-[#d8b76a]/28 pb-4 text-center">
              <p className="flex items-center justify-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                <span className="size-1.5 rotate-45 bg-[#caa96a]/70" />
                Begin a Reading
                <span className="size-1.5 rotate-45 bg-[#caa96a]/70" />
              </p>
              <p className="text-sm leading-6 text-[#766955]">
                Choose your reading path. Use your own deck, or draw a single card online.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TarotButton
                href={physicalHref}
                className="relative min-h-32 flex-col gap-3 overflow-hidden rounded-[1.25rem] !border-[#d8b76a]/50 !bg-[linear-gradient(180deg,rgba(255,253,248,0.97),rgba(239,229,210,0.86))] p-4 !text-[#5b4a36] tracking-[0.12em] !shadow-[0_14px_30px_rgba(126,94,44,0.12),inset_0_1px_0_rgba(255,255,255,0.98)] before:pointer-events-none before:absolute before:left-1/2 before:top-5 before:h-px before:w-16 before:-translate-x-1/2 before:bg-gradient-to-r before:from-transparent before:via-[#caa96a]/54 before:to-transparent after:pointer-events-none after:absolute after:bottom-5 after:left-1/2 after:size-2 after:-translate-x-1/2 after:rotate-45 after:border after:border-[#caa96a]/38 hover:!border-[#b9934f]/72 hover:!text-[#3f352b] hover:!shadow-[0_16px_36px_rgba(126,94,44,0.16),0_0_20px_rgba(255,255,255,0.78)] sm:min-h-40 sm:p-6"
              >
                <span className="font-serif text-xl normal-case tracking-[0] sm:text-2xl">
                  {copy.homePhysicalTitle}
                </span>
                <span className="normal-case leading-5 tracking-[0] text-[#7a6b56] sm:text-sm sm:leading-6">
                  {copy.homePhysicalDescription}
                </span>
              </TarotButton>

              <TarotButton
                href={onlineHref}
                variant="ghost"
                className="relative min-h-32 flex-col gap-3 overflow-hidden rounded-[1.25rem] !border-[#d8b76a]/42 !bg-[linear-gradient(180deg,rgba(255,253,248,0.92),rgba(239,229,210,0.76))] p-4 !text-[#5b4a36] tracking-[0.12em] !shadow-[0_12px_26px_rgba(126,94,44,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] before:pointer-events-none before:absolute before:left-1/2 before:top-5 before:h-px before:w-16 before:-translate-x-1/2 before:bg-gradient-to-r before:from-transparent before:via-[#caa96a]/42 before:to-transparent after:pointer-events-none after:absolute after:bottom-5 after:left-1/2 after:size-2 after:-translate-x-1/2 after:rotate-45 after:border after:border-[#caa96a]/30 hover:!border-[#b9934f]/64 hover:!text-[#3f352b] hover:!shadow-[0_15px_32px_rgba(126,94,44,0.13),0_0_18px_rgba(255,255,255,0.68)] sm:min-h-40 sm:p-6"
              >
                <span className="font-serif text-xl normal-case tracking-[0] sm:text-2xl">
                  {copy.homeOnlineTitle}
                </span>
                <span className="normal-case leading-5 tracking-[0] text-[#7a6b56] sm:text-sm sm:leading-6">
                  {copy.homeOnlineDescription}
                </span>
              </TarotButton>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#d8b76a]/30 bg-white/46 p-4 shadow-[0_12px_34px_rgba(126,94,44,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur sm:p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[6.35rem] hidden h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#d8b76a]/34 to-transparent sm:block"
            />
            <p className="mb-4 flex items-center justify-center gap-3 text-center text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
              <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/60 to-transparent" />
              Your Ritual Path
              <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/60 to-transparent" />
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {ritualPath.map((item) => (
                <div
                  className="relative rounded-[1.1rem] border border-[#d8b76a]/28 bg-[#fffaf2]/72 p-4 text-center shadow-[0_8px_22px_rgba(126,94,44,0.06),inset_0_1px_0_rgba(255,255,255,0.72)]"
                  key={item.title}
                >
                  <span className="absolute left-1/2 top-3 size-2 -translate-x-1/2 rotate-45 border border-[#caa96a]/40 bg-[#fffaf2]" />
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#b9934f]">
                    {item.step}
                  </p>
                  <h3 className="mt-2 font-serif text-lg text-[#554635]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#7a6b56]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 w-full max-w-3xl">
          <div className="rounded-[1.5rem] border border-[#d8b76a]/30 bg-[#fff9ef]/68 p-4 shadow-[0_12px_34px_rgba(126,94,44,0.08),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur sm:p-5">
            <div className="mb-3 grid gap-2 text-center sm:text-left">
              <h2 className="flex items-center justify-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f] sm:justify-start">
                <span className="h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/60 to-transparent" />
                {lang === "zh" ? "推荐问题" : "Questions to Bring Into the Room"}
                <span className="hidden h-px w-8 bg-gradient-to-r from-transparent via-[#d8b76a]/60 to-transparent sm:block" />
              </h2>
              <p className="text-xs leading-5 text-[#8f7d63]">
                {lang === "zh"
                  ? "仅作灵感提示"
                  : "Reflection prompts for your reading. Ora helps interpret the symbols, not predict a fixed future."}
              </p>
            </div>
            <div className="grid gap-2">
              {suggestedQuestions.map((question) => (
                <div
                  className="grid grid-cols-[1.4rem_1fr] items-center gap-3 rounded-[1rem] border border-[#d8b76a]/24 bg-white/54 px-3 py-3 text-left shadow-[0_6px_18px_rgba(126,94,44,0.045),inset_0_1px_0_rgba(255,255,255,0.68)]"
                  key={question}
                >
                  <span className="flex size-5 items-center justify-center rounded-full border border-[#d8b76a]/46 text-[0.65rem] text-[#9d7b3f]">
                    <span className="size-1.5 rotate-45 bg-[#caa96a]/72" />
                  </span>
                  <p className="text-[0.95rem] leading-7 text-[#5f523f]">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-auto pt-10">
          <div className="mx-auto w-full max-w-3xl border-t border-[#d8b76a]/32 pt-5">
            <div className="grid gap-6 text-left sm:grid-cols-[1.4fr_1fr_1fr]">
              <section>
                <h2 className="font-serif text-xl leading-none text-[#554635]">
                  Ora Arcana
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6f614d]">
                  {footerCopy.brandLine}
                </p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-[#8f7d63]">
                  {footerCopy.brandDescription}
                </p>
              </section>

              <section>
                <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                  {footerCopy.readingTitle}
                </h3>
                <div className="mt-3 grid gap-1.5 text-sm leading-6">
                  <Link
                    className="text-[#6f614d] transition hover:text-[#9d7b3f]"
                    href={physicalHref}
                  >
                    {footerCopy.physical}
                  </Link>
                  <Link
                    className="text-[#6f614d] transition hover:text-[#9d7b3f]"
                    href={onlineHref}
                  >
                    {footerCopy.online}
                  </Link>
                  <span className="text-[#8f7d63]">
                    {footerCopy.redeem}
                  </span>
                  <Link
                    className="text-[#8f7d63] transition hover:text-[#9d7b3f]"
                    href={readingsHref}
                  >
                    {footerCopy.journal}
                  </Link>
                </div>
              </section>

              <section>
                <h3 className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                  {footerCopy.trustTitle}
                </h3>
                <div className="mt-3 grid gap-1.5 text-sm leading-6 text-[#8f7d63]">
                  <Link
                    className="transition hover:text-[#9d7b3f]"
                    href="/privacy"
                  >
                    {footerCopy.privacy}
                  </Link>
                  <Link
                    className="transition hover:text-[#9d7b3f]"
                    href="/terms"
                  >
                    {footerCopy.terms}
                  </Link>
                  <Link
                    className="transition hover:text-[#9d7b3f]"
                    href="/disclaimer"
                  >
                    {footerCopy.disclaimer}
                  </Link>
                  <Link
                    className="transition hover:text-[#9d7b3f]"
                    href="/contact"
                  >
                    {footerCopy.contact}
                  </Link>
                </div>
              </section>
            </div>

            <div className="mt-5 flex flex-col gap-2 border-t border-[#d8b76a]/22 pt-4 text-[0.56rem] uppercase tracking-[0.24em] text-[#9a8b76] sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Ora Arcana</p>
              <p>{footerCopy.reflectionOnly}</p>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}

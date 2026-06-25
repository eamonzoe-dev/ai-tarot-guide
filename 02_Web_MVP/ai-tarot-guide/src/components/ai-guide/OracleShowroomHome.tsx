"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ThemeToggle } from "@/components/ai-guide/ThemeToggle";
import { getRemainingStardust, type StardustCreditBalance } from "@/lib/ai-guide/credits";
import { type Language } from "@/lib/ai-guide/i18n";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type OracleShowroomHomeProps = {
  lang: Language;
  hasLangParam: boolean;
  homeHref: string;
  physicalHref: string;
  onlineHref: string;
  threeCardHref: string;
  readingsHref: string;
  askOnlineHref: string;
  trustHrefs: {
    privacy: string;
    terms: string;
    disclaimer: string;
    contact: string;
  };
};

type HomeCredits = StardustCreditBalance;
type HomeReadingRow = {
  id: string;
  question: string | null;
  card_id: string | null;
  card_title: string | null;
  mode: string | null;
  spread: string | null;
  orientation: string | null;
  reading_json: unknown;
  created_at: string;
};

const revealTiming = {
  transitionDuration: "700ms",
  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
};

const staggerDelays = ["80ms", "140ms", "200ms", "260ms"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getReadingSummary(reading: unknown, fallback: string) {
  if (!isRecord(reading)) {
    return fallback;
  }

  const candidates = [
    reading.summary,
    reading.reflection,
    reading.opening,
    reading.directAnswer,
    reading.fullReading,
  ];

  const summary = candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && candidate.trim().length > 0,
  );

  if (!summary) {
    return fallback;
  }

  return summary.length > 120 ? `${summary.slice(0, 120)}...` : summary;
}

function formatRecentTime(value: string, lang: Language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getModeSpreadLabel(mode: string | null, spread: string | null, lang: Language) {
  const modeLabel =
    mode === "physical" ? (lang === "zh" ? "实体" : "Physical") : lang === "zh" ? "线上" : "Online";
  const spreadLabel =
    spread === "three-card" ? (lang === "zh" ? "三牌" : "Three Card") : lang === "zh" ? "单牌" : "Single";
  return `${modeLabel} / ${spreadLabel}`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function OracleShowroomHome({
  lang,
  hasLangParam,
  homeHref,
  physicalHref,
  readingsHref,
  trustHrefs,
}: OracleShowroomHomeProps) {
  const [compactHeader, setCompactHeader] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<HomeCredits | null>(null);
  const [recentReadings, setRecentReadings] = useState<HomeReadingRow[]>([]);
  const [homeLoaded, setHomeLoaded] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState<"single" | "three-card">("single");
  const [questionDraft, setQuestionDraft] = useState("");

  const isZh = lang === "zh";
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const isLoggedIn = homeLoaded && Boolean(user);
  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0]?.trim() || user?.email || "";
  const stardustRemaining = credits ? getRemainingStardust(credits) : null;
  const recentPreview = recentReadings.slice(0, 3);

  const title = isZh ? "此刻，你想问什么？" : "What do you want to ask now?";
  const subtitle = isZh ? "A mirror, not a forecast. 一面镜子，不是预言。" : "A mirror, not a forecast.";
  const intro = isLoggedIn
    ? isZh
      ? `夜深了，${displayName}。阅读室已经安静下来。`
      : `Tonight is quiet, ${displayName}.`
    : isZh
      ? "夜深了。阅读室已经安静下来。"
      : "The reading room is quiet tonight.";
  const composerLabel = isZh ? "问题输入" : "Question";
  const composerHint = isLoggedIn
    ? isZh
      ? "把问题写具体一点，解读会更稳。"
      : "Write the question plainly and keep it close."
    : isZh
      ? "登录后可保存解读记录。"
      : "Log in to save your reading history.";
  const readingCostLabel = isZh ? "本次 AI 解读消耗 100 星尘。" : "This AI reading uses 100 Stardust.";
  const stardustLabel = isZh ? "剩余星尘" : "Stardust";
  const recentHeading = isZh ? "继续 · 最近的解读" : "Continue · Recent Readings";
  const openJournalLabel = isZh ? "打开解读日志 →" : "Open reading journal →";
  const recentEmptyTitle = isZh ? "阅读室目前很安静" : "The room is quiet for now";
  const recentEmptyBody = isZh
    ? "开始一次解读后，这里会保留你最近的三条记录。"
    : "Start a reading and your latest three entries will appear here.";
  const trustCards = isZh
    ? ["以隐私为先", "AI 辅助象征解读", "用于反思与娱乐"]
    : ["Privacy first", "AI-assisted symbolism", "For reflection and entertainment"];

  useEffect(() => {
    let frame = 0;
    function updateMotion() {
      frame = 0;
      setCompactHeader(window.scrollY > 42);
    }
    function handleScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(updateMotion);
    }
    updateMotion();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    async function loadHomeData() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;
      if (isCancelled) return;
      setUser(currentUser);
      if (!currentUser) {
        setCredits(null);
        setRecentReadings([]);
        setHomeLoaded(true);
        return;
      }
      const [creditsResponse, readingsResponse] = await Promise.all([
        fetch("/api/credits/me"),
        fetch("/api/readings/me?limit=3"),
      ]);
      if (isCancelled) return;
      try {
        const creditsPayload = (await creditsResponse.json()) as unknown;
        const creditsValue =
          isRecord(creditsPayload) && isRecord(creditsPayload.credits)
            ? (creditsPayload.credits as HomeCredits)
            : null;
        setCredits(creditsResponse.ok ? creditsValue : null);
      } catch {
        setCredits(null);
      }
      try {
        const readingsPayload = (await readingsResponse.json()) as unknown;
        const readingsValue =
          isRecord(readingsPayload) && Array.isArray(readingsPayload.readings)
            ? (readingsPayload.readings as HomeReadingRow[])
            : [];
        setRecentReadings(readingsResponse.ok ? readingsValue : []);
      } catch {
        setRecentReadings([]);
      }
      setHomeLoaded(true);
    }
    void loadHomeData();
    return () => {
      isCancelled = true;
    };
  }, [supabase]);

  function revealStyle(delayIndex = 0): CSSProperties {
    return {
      ...revealTiming,
      transitionDelay: staggerDelays[delayIndex % staggerDelays.length],
    };
  }

  return (
    <div className="ora-page-shell ora-homepage min-h-svh">
      <div id="reading-account-panel">
        <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />
      </div>

      <header
        className={cx(
          "sticky top-0 isolate z-[240] border-b transition duration-300",
          compactHeader
            ? "border-[var(--c-border)] bg-[var(--c-surface)] backdrop-blur"
            : "border-transparent bg-[var(--c-bg)] backdrop-blur-sm",
        )}
      >
        <div className="pointer-events-auto mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-6 lg:px-8">
          <Link
            className="wordmark inline-flex min-h-9 shrink-0 items-center justify-self-start pt-0 text-lg leading-none text-[var(--c-text)] transition hover:text-[var(--c-accent-text)] sm:min-w-0"
            href={homeHref}
          >
            Ora Arcana
          </Link>
          <nav
            aria-label={isZh ? "页面分区导航" : "Section navigation"}
            className="hidden items-center justify-center gap-4 text-[0.68rem] font-medium text-[var(--c-text-soft)] xl:flex xl:gap-5"
          >
            <Link className="transition hover:text-[var(--c-text)]" href="#how-it-works">
              {isZh ? "如何开始" : "How it works"}
            </Link>
            <Link className="transition hover:text-[var(--c-text)]" href="#journal">
              {isZh ? "解读日志" : "Journal"}
            </Link>
            <Link className="transition hover:text-[var(--c-text)]" href="#physical-deck">
              {isZh ? "实体卡组" : "Physical Deck"}
            </Link>
            <Link className="transition hover:text-[var(--c-text)]" href="#faq">
              {isZh ? "说明" : "FAQ"}
            </Link>
          </nav>
          <div className="justify-self-start sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="ora-homepage__main relative scroll-smooth overflow-x-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-4%,color-mix(in_srgb,var(--ora-home-surface)_90%,transparent),transparent_38%),radial-gradient(circle_at_14%_12%,color-mix(in_srgb,var(--ora-home-brass)_16%,transparent),transparent_24%),radial-gradient(circle_at_86%_14%,color-mix(in_srgb,var(--ora-home-green)_8%,transparent),transparent_24%),linear-gradient(180deg,var(--ora-home-surface)_0%,color-mix(in_srgb,var(--ora-home-surface-2)_84%,var(--ora-home-surface))_46%,color-mix(in_srgb,var(--ora-home-surface-3)_72%,var(--ora-home-surface))_100%)]"
        />

        <section className="ora-home-hero relative mx-auto w-full max-w-5xl px-5 pb-6 pt-8 sm:px-6 lg:px-8 lg:pt-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--ora-home-brass-text)]">
              {homeLoaded && isLoggedIn && displayName ? displayName : (isZh ? "Ora Arcana 阅读室" : "Ora Arcana Reading Room")}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--ora-home-text-soft)]">{intro}</p>
            <h1 className="mt-4 font-serif text-[clamp(2.2rem,5vw,4rem)] leading-[1.08] text-[var(--ora-home-text)]">
              {title}
            </h1>
            <p className="mt-4 text-[1rem] italic leading-7 text-[var(--ora-home-text-soft)] sm:text-[1.05rem]">
              {subtitle}
            </p>
          </div>

          <form
            action="/ai-guide/ask"
            className="ora-home-composer ora-home-composer--centered mx-auto mt-7"
            data-reveal-id="hero-form"
            data-showroom-reveal
            method="get"
            style={revealStyle(1)}
          >
            <input name="lang" type="hidden" value={lang} />
            <input name="mode" type="hidden" value="online" />
            <input name="spread" type="hidden" value={selectedSpread} />
            <input name="orientation" type="hidden" value="upright" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="ora-home-mode-tabs" role="tablist" aria-label={isZh ? "解读模式" : "Reading modes"}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedSpread === "single"}
                  className={cx("ora-home-mode-tab", selectedSpread === "single" && "ora-home-mode-tab--active")}
                  onClick={() => setSelectedSpread("single")}
                >
                  {isZh ? "单牌解读" : "Single Card"}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedSpread === "three-card"}
                  className={cx("ora-home-mode-tab", selectedSpread === "three-card" && "ora-home-mode-tab--active")}
                  onClick={() => setSelectedSpread("three-card")}
                >
                  {isZh ? "三牌阵" : "Three Card"}
                </button>
                <button type="button" role="tab" className="ora-home-mode-tab ora-home-mode-tab--disabled" aria-selected={false} disabled>
                  {isZh ? "关系解读·将至" : "Relationship · Coming Soon"}
                </button>
              </div>
              {isLoggedIn && stardustRemaining !== null ? (
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--ora-home-brass-text)]">
                  {stardustLabel} {stardustRemaining.toLocaleString()}
                </p>
              ) : null}
            </div>

            <label
              className="mt-4 block text-left text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--ora-home-brass-text)]"
              htmlFor="homepage-ask-ora-question"
            >
              {composerLabel}
            </label>
            <textarea
              className="ora-home-composer__textarea mt-3"
              id="homepage-ask-ora-question"
              name="question"
              placeholder={isZh ? "把问题写清楚一点。" : "Write the question plainly."}
              rows={4}
              value={questionDraft}
              onChange={(event) => setQuestionDraft(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {(isZh ? ["关系", "工作", "自我", "选择", "身体", "未来"] : ["Love", "Work", "Self", "Decision", "Body", "Future"]).map((chip) => (
                <button
                  key={chip}
                  className="ora-home-prompt"
                  type="button"
                  onClick={() => {
                    setQuestionDraft((current) => {
                      if (!current.trim()) {
                        return `${isZh ? "关于" : "About "}${chip}`;
                      }
                      return `${current.trim()} ${chip}`;
                    });
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-xl text-left text-xs leading-6 text-[var(--ora-home-text-soft)]">
                {readingCostLabel}
                {!isLoggedIn ? ` · ${composerHint}` : ""}
              </p>
              <button className="showroom-action-primary" type="submit">
                {isZh ? "开始解读" : "Begin reading"} →
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em]">
              <Link className="showroom-action-quiet" href={physicalHref}>
                {isZh ? "使用实体卡组" : "Use Physical Deck"}
              </Link>
              <Link className="showroom-action-quiet" href={readingsHref}>
                {isZh ? "解读日志" : "Reading Journal"}
              </Link>
            </div>
          </form>

          {homeLoaded && isLoggedIn ? (
            <section className="ora-home-recent relative mx-auto mt-8 w-full max-w-6xl" id="journal">
              <div className="flex items-end justify-between gap-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--ora-home-brass-text)]">
                  {recentHeading}
                </p>
                <Link className="showroom-action-quiet" href={readingsHref}>
                  {openJournalLabel}
                </Link>
              </div>
              {recentPreview.length > 0 ? (
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {recentPreview.map((item) => (
                    <article
                      key={`${item.card_title || item.card_id || item.id}-${item.created_at}`}
                      className="rounded-[1rem] border border-[var(--ora-home-border)] bg-[var(--ora-home-surface)] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--ora-home-brass-text)]">
                            {getModeSpreadLabel(item.mode, item.spread, lang)}
                          </p>
                          <h3 className="mt-2 font-serif text-xl leading-tight text-[var(--ora-home-text)]">
                            {item.card_title || item.card_id || recentEmptyTitle}
                          </h3>
                        </div>
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--ora-home-text-muted)]">
                          {formatRecentTime(item.created_at, lang)}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--ora-home-text-soft)]">
                        {item.question || recentEmptyBody}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--ora-home-text)]">
                        {getReadingSummary(item.reading_json, recentEmptyBody)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[1rem] border border-[var(--ora-home-border)] bg-[var(--ora-home-surface)] p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--ora-home-brass-text)]">
                    {recentEmptyTitle}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--ora-home-text-soft)]">
                    {recentEmptyBody}
                  </p>
                </div>
              )}
            </section>
          ) : null}

          {homeLoaded && !isLoggedIn ? (
            <section className="ora-home-recent relative mx-auto mt-8 w-full max-w-6xl">
              <div className="grid gap-3 md:grid-cols-3">
                {trustCards.map((card, index) => (
                  <article
                    key={card}
                    className="rounded-[1rem] border border-[var(--ora-home-border)] bg-[var(--ora-home-surface)] p-5"
                  >
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--ora-home-brass-text)]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-serif text-[1.5rem] leading-tight text-[var(--ora-home-text)]">
                      {card}
                    </h3>
                  </article>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--ora-home-text-soft)]">
                {composerHint}
              </p>
            </section>
          ) : null}

          <section className="ora-home-rhythm relative mx-auto mt-4 w-full max-w-6xl px-5 sm:px-0" id="how-it-works">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--ora-home-brass-text)]">
              {isZh ? "解读如何展开" : "How the reading unfolds"}
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ora-home-text-soft)]">
              {isZh
                ? "五个安静动作只是一个轻量提示，不是首页核心。"
                : "Five quiet movements are a light cue, not the center of the page."}
            </p>
          </section>

          <section className="ora-home-faq relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 lg:px-8" id="faq">
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ora-home-text-soft)]">
              <Link className="transition hover:text-[var(--ora-home-brass-text)]" href={trustHrefs.privacy}>
                {isZh ? "隐私" : "Privacy"}
              </Link>
              <Link className="transition hover:text-[var(--ora-home-brass-text)]" href={trustHrefs.terms}>
                {isZh ? "条款" : "Terms"}
              </Link>
              <Link className="transition hover:text-[var(--ora-home-brass-text)]" href={trustHrefs.disclaimer}>
                {isZh ? "免责声明" : "Disclaimer"}
              </Link>
              <Link className="transition hover:text-[var(--ora-home-brass-text)]" href={trustHrefs.contact}>
                {isZh ? "联系" : "Contact"}
              </Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

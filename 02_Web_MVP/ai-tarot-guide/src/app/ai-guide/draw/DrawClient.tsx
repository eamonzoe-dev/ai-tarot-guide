"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CircularDeckCarouselDraw } from "@/components/ai-guide/CircularDeckCarouselDraw";
import { type Language, text } from "@/lib/ai-guide/i18n";

const USER_QUESTION_KEY = "aiTarot:userQuestion";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";

type DrawClientProps = {
  initialMode: ReadingMode;
  initialQuestion: string;
  initialSpread: Spread;
  initialLang: Language;
  hasLangParam: boolean;
  initialRitualStep: number;
  initialClarifyId: string;
  initialClarifyLabel: string;
  initialClarifyFocus: string;
  initialClarifyNote: string;
};

type ClarifyParams = {
  id: string;
  label: string;
  focus: string;
  note: string;
};

function buildQuery(
  mode: ReadingMode,
  spread: Spread,
  question: string,
  lang: Language,
  card?: string,
  cards?: string,
  ritualStep?: number,
  clarify?: ClarifyParams,
) {
  const params = new URLSearchParams({
    mode,
    spread,
    orientation: "upright",
    question,
    lang,
  });

  if (card) {
    params.set("card", card);
  }

  if (cards) {
    params.set("cards", cards);
  }

  if (ritualStep) {
    params.set("ritualStep", String(ritualStep));
  }

  if (clarify?.id) {
    params.set("clarifyId", clarify.id);
  }

  if (clarify?.label) {
    params.set("clarifyLabel", clarify.label);
  }

  if (clarify?.focus) {
    params.set("clarifyFocus", clarify.focus);
  }

  if (clarify?.note) {
    params.set("clarifyNote", clarify.note);
  }

  return params.toString();
}

function saveLatestRitual(
  mode: ReadingMode,
  spread: Spread,
  question: string,
  lang: Language,
  card?: string,
  cards?: string,
) {
  localStorage.setItem(
    LATEST_RITUAL_KEY,
    JSON.stringify({
      mode,
      spread,
      orientation: "upright",
      question,
      lang,
      card,
      cards,
    }),
  );
}

function LuminousShell({
  children,
  stage = false,
}: {
  children: React.ReactNode;
  stage?: boolean;
}) {
  return (
    <main
      className={`ora-guide-shell relative overflow-hidden ${
        stage ? "h-[100dvh]" : "min-h-svh px-0 py-0 sm:px-6 sm:py-6 lg:px-8"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_96%,transparent),color-mix(in_srgb,var(--c-bg)_90%,var(--c-surface)_10%)_42%,color-mix(in_srgb,var(--c-border)_50%,transparent)_100%)]" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[color:var(--c-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-[color:var(--c-surface)]/42 blur-3xl" />

      <div
        className={`relative z-10 mx-auto flex w-full flex-col ${
          stage
            ? "h-[100dvh] max-w-none overflow-visible"
            : "min-h-svh max-w-[720px] gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9"
        }`}
      >
        {children}
      </div>
    </main>
  );
}

function LuminousAction({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={`ora-guide-button ora-guide-button-primary w-full touch-manipulation select-none ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function DrawClient({
  initialMode,
  initialQuestion,
  initialSpread,
  initialLang,
  initialClarifyId,
  initialClarifyLabel,
  initialClarifyFocus,
  initialClarifyNote,
}: DrawClientProps) {
  const router = useRouter();
  const clarify: ClarifyParams = {
    id: initialClarifyId,
    label: initialClarifyLabel,
    focus: initialClarifyFocus,
    note: initialClarifyNote,
  };
  const copy = text(initialLang);
  const [question, setQuestion] = useState<string | undefined>(
    initialQuestion || undefined,
  );
  const [shuffleSignal, setShuffleSignal] = useState(0);
  const [isDrawShuffling, setIsDrawShuffling] = useState(false);
  const requiredSelectionCount = initialSpread === "three-card" ? 3 : 1;

  useEffect(() => {
    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY) ?? "";
    const resolvedQuestion = initialQuestion || storedQuestion;

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
      saveLatestRitual(
        initialMode,
        initialSpread,
        initialQuestion,
        initialLang,
      );
    }

    queueMicrotask(() => {
      setQuestion(resolvedQuestion);
    });

    if (!resolvedQuestion) {
      router.replace(
        `/ai-guide/ask?mode=${initialMode}&spread=${initialSpread}&orientation=upright&lang=${initialLang}`,
      );
    }
  }, [
    initialLang,
    initialMode,
    initialQuestion,
    initialSpread,
    router,
  ]);

  function handleOnlineConfirm(selectedCardIds: string[]) {
    const selectedCard = initialSpread === "single" ? selectedCardIds[0] : undefined;
    const selectedCards =
      initialSpread === "three-card" ? selectedCardIds.join(",") : undefined;

    saveLatestRitual(
      "online",
      initialSpread,
      question ?? initialQuestion,
      initialLang,
      selectedCard,
      selectedCards,
    );
    router.push(
      `/ai-guide/reveal?${buildQuery(
        "online",
        initialSpread,
        question ?? initialQuestion,
        initialLang,
        selectedCard,
        selectedCards,
        undefined,
        clarify,
      )}`,
    );
  }

  if (question === undefined) {
    return (
      <LuminousShell>
        <section className="ora-guide-panel my-auto rounded-[2rem] p-6 text-center backdrop-blur-md">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
            {copy.readingRoom}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--c-text)]">
            {copy.readingCard}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.gatheringReading}
          </p>
          <p className="mt-6 text-sm text-[color:var(--c-text-soft)]">
            {copy.preparingMessage}
          </p>
        </section>
      </LuminousShell>
    );
  }

  if (!question) {
    return null;
  }

  if (initialMode === "online") {
    const revealLabel =
      requiredSelectionCount === 1
        ? copy.revealCard
        : initialLang === "zh"
          ? "揭示这三张牌"
          : "Reveal these cards";
    const shuffleLabel = initialLang === "zh" ? "洗牌" : "Shuffle";

    return (
      <LuminousShell stage>
        <div className="fixed right-3 top-3 z-[1600] flex items-center gap-2 sm:right-5 sm:top-5">
          <button
            aria-label={initialLang === "zh" ? "洗牌" : "Shuffle deck"}
            className="h-10 rounded-full border border-[color:var(--c-accent)]/42 bg-[color:var(--c-surface)]/82 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--c-accent)] shadow-[0_10px_26px_color-mix(in_srgb,var(--c-text)_10%,transparent)] backdrop-blur-md transition hover:border-[color:var(--c-accent)]/68 hover:bg-[color:var(--c-surface)] disabled:cursor-default disabled:opacity-55"
            disabled={isDrawShuffling}
            onClick={() => setShuffleSignal((current) => current + 1)}
            type="button"
          >
            {shuffleLabel}
          </button>
          <Link
            aria-label={initialLang === "zh" ? "退出抽牌" : "Exit draw"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--c-accent)]/42 bg-[color:var(--c-surface)]/82 text-xl leading-none text-[color:var(--c-accent)] shadow-[0_10px_26px_color-mix(in_srgb,var(--c-text)_10%,transparent)] backdrop-blur-md transition hover:border-[color:var(--c-accent)]/68 hover:bg-[color:var(--c-surface)]"
            href={`/ai-guide?lang=${initialLang}`}
          >
            ×
          </Link>
        </div>

        <CircularDeckCarouselDraw
          confirmLabel={revealLabel}
          key={initialSpread}
          onConfirm={handleOnlineConfirm}
          onShuffleStateChange={setIsDrawShuffling}
          requiredSelectionCount={requiredSelectionCount}
          selectedLabel={initialLang === "zh" ? "已选择" : "selected"}
          shuffleSignal={shuffleSignal}
        />
      </LuminousShell>
    );
  }

  return (
    <LuminousShell>
      <header className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 text-[color:var(--c-accent)]">
          <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
            {copy.physicalDeck}
          </span>
          <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
        </div>
        <h1 className="font-serif text-[2.6rem] leading-tight text-[color:var(--c-text)] sm:text-[3.25rem]">
          {copy.physicalDrawTitle}
        </h1>
        <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
          {copy.physicalDrawDescription}
        </p>
      </header>

      <section className="ora-guide-panel relative overflow-hidden rounded-[2.25rem] p-5 text-sm leading-7 text-[color:var(--c-text-soft)] backdrop-blur-md sm:p-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/60 to-transparent" />
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
          {copy.yourQuestion}
        </p>
        <p className="mt-3 text-[color:var(--c-text)]">{question}</p>
        <p className="mt-3 text-sm leading-6 text-[color:var(--c-text-soft)]">
          {copy.keepQuestion}
        </p>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/46 to-transparent" />

        <ol className="space-y-4">
          <li className="rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/50 p-4">
            <p className="font-semibold text-[color:var(--c-text)]">1. {copy.prepareStep}</p>
            <p className="mt-1">{copy.prepareDeck}</p>
          </li>
          <li className="rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/50 p-4">
            <p className="font-semibold text-[color:var(--c-text)]">2. {copy.shuffle}</p>
            <p className="mt-1">{copy.shuffleDeck}</p>
          </li>
          <li className="rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/50 p-4">
            <p className="font-semibold text-[color:var(--c-text)]">3. {copy.cut}</p>
            <p className="mt-1">{copy.cutDeck}</p>
          </li>
          <li className="rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/50 p-4">
            <p className="font-semibold text-[color:var(--c-text)]">4. {copy.draw}</p>
            <p className="mt-1">{copy.drawDeck}</p>
          </li>
        </ol>

        <p className="mt-5 text-[color:var(--c-text)]">{copy.selectSameCard}</p>
      </section>

      <LuminousAction
        href={`/ai-guide/reveal?${buildQuery(
          "physical",
          initialSpread,
          question,
          initialLang,
          undefined,
          undefined,
          undefined,
          clarify,
        )}`}
      >
        {copy.haveDrawnCard}
      </LuminousAction>
    </LuminousShell>
  );
}

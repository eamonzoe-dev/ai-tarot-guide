"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { tarotCards } from "@/data/tarotCards";
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

function getRandomTarotCardId() {
  return tarotCards[Math.floor(Math.random() * tarotCards.length)]?.id ?? "";
}

function getRandomTarotCardIds(count: number) {
  const deck = [...tarotCards];
  const drawn: string[] = [];

  while (drawn.length < count && deck.length > 0) {
    const index = Math.floor(Math.random() * deck.length);
    const [card] = deck.splice(index, 1);

    if (card) {
      drawn.push(card.id);
    }
  }

  return drawn;
}

function LuminousShell({
  children,
  lang,
  hasLangParam,
}: {
  children: React.ReactNode;
  lang: Language;
  hasLangParam: boolean;
}) {
  return (
    <main className="ora-page-shell ora-flow-page relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[720px] flex-col gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
        {children}
      </div>
    </main>
  );
}

function LuminousNav({
  lang,
}: {
  lang: Language;
}) {
  return (
    <div className="card px-4 py-3">
      <ReadingNav lang={lang} />
    </div>
  );
}

function LuminousAction({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="btn btn--primary w-full"
      href={href}
    >
      {children}
    </Link>
  );
}

function LuminousCardBack({
  activeStep,
}: {
  activeStep: number;
}) {
  const fanRotation =
    activeStep === 0
      ? ["-rotate-12 -translate-x-8", "rotate-0", "rotate-12 translate-x-8"]
      : activeStep === 1
        ? ["-rotate-6 -translate-x-14", "rotate-0", "rotate-6 translate-x-14"]
        : ["-rotate-3 -translate-x-16", "rotate-0 scale-105", "rotate-3 translate-x-16"];

  return (
    <div className="relative mx-auto h-72 w-full max-w-[24rem]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-56 -translate-x-1/2 bg-[var(--c-border-strong)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-px -translate-y-1/2 bg-[var(--c-border)]" />

      {fanRotation.map((rotationClass, index) => (
        <div
          key={index}
          className={`ora-card-back absolute left-1/2 top-8 h-56 w-36 -translate-x-1/2 transition-transform duration-500 ${rotationClass}`}
        >
          <div className="absolute inset-3 rounded-[1rem] border border-[var(--c-border-strong)]" />
          <div className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[var(--c-accent)]" />
        </div>
      ))}
    </div>
  );
}

export function DrawClient({
  initialMode,
  initialQuestion,
  initialSpread,
  initialLang,
  hasLangParam,
  initialRitualStep,
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
  const onlineSteps = [
    {
      label: copy.shuffle,
      title: copy.drawStepShuffleTitle,
      lines: [copy.drawStepShuffleLine1, copy.drawStepShuffleLine2],
      button: copy.shuffleAction,
      description: copy.onlineShuffleDescription,
    },
    {
      label: copy.cut,
      title: copy.drawStepCutTitle,
      lines: [copy.drawStepCutLine1, copy.drawStepCutLine2],
      button: copy.cutAction,
      description: copy.onlineCutDescription,
    },
    {
      label: copy.draw,
      title: copy.drawStepDrawTitle,
      lines: [copy.drawStepDrawLine1, copy.drawStepDrawLine2],
      button: copy.drawAction,
      description: copy.onlineDrawStepDescription,
    },
  ] as const;
  const [question, setQuestion] = useState<string | undefined>(
    initialQuestion || undefined,
  );
  const [stepSettled, setStepSettled] = useState(false);
  const [drawnCard, setDrawnCard] = useState<string | undefined>(undefined);
  const [drawnCards, setDrawnCards] = useState<string | undefined>(undefined);
  const currentOnlineStep = onlineSteps[initialRitualStep];
  const selectedCards = drawnCards || (drawnCard ? drawnCard : undefined);
  const onlineActionHref =
    initialRitualStep < 2
      ? `/ai-guide/draw?${buildQuery(
          "online",
          initialSpread,
          question ?? initialQuestion,
          initialLang,
          undefined,
          undefined,
          initialRitualStep + 1,
          clarify,
        )}`
      : `/ai-guide/reveal?${buildQuery(
          "online",
          initialSpread,
          question ?? initialQuestion,
          initialLang,
          initialSpread === "single" ? drawnCard : undefined,
          initialSpread === "three-card" ? drawnCards : undefined,
          undefined,
          clarify,
        )}`;

  useEffect(() => {
    queueMicrotask(() => {
      setStepSettled(false);
    });
    const settleTimer = setTimeout(() => setStepSettled(true), 20);
    return () => clearTimeout(settleTimer);
  }, [initialRitualStep]);

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
        initialSpread === "single" && initialRitualStep === 2
          ? drawnCard
          : undefined,
        initialSpread === "three-card" && initialRitualStep === 2
          ? drawnCards
          : undefined,
      );
    }

    if (initialRitualStep === 2 && initialSpread === "single" && !drawnCard) {
      queueMicrotask(() => {
        setDrawnCard(getRandomTarotCardId());
      });
    }

    if (initialRitualStep === 2 && initialSpread === "three-card" && !drawnCards) {
      queueMicrotask(() => {
        setDrawnCards(getRandomTarotCardIds(3).join(","));
      });
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
    drawnCard,
    drawnCards,
    initialLang,
    initialMode,
    initialQuestion,
    initialSpread,
    initialRitualStep,
    router,
  ]);

  if (question === undefined) {
    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <section className="card my-auto p-6 text-center">
          <p className="eyebrow">
            {copy.readingRoom}
          </p>
          <h1 className="t-h2 mt-4">
            {copy.readingCard}
          </h1>
          <p className="caption mt-4">
            {copy.gatheringReading}
          </p>
          <p className="caption mt-6 text-sm">
            {copy.preparingMessage}
          </p>
        </section>
      </LuminousShell>
    );
  }

  if (!question) {
    return null;
  }

  if (initialMode === "online" && initialRitualStep === 2 && !selectedCards) {
    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <section className="card my-auto p-6 text-center">
          <p className="eyebrow">
            {copy.readingRoom}
          </p>
          <h1 className="t-h2 mt-4">
            {copy.readingCard}
          </h1>
          <p className="caption mt-4">
            {copy.gatheringReading}
          </p>
          <p className="caption mt-6 text-sm">
            {copy.preparingMessage}
          </p>
        </section>
      </LuminousShell>
    );
  }

  if (initialMode === "online") {
    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <LuminousNav lang={initialLang} />

        <header className="space-y-4 text-center">
          <div className="rule mx-auto max-w-xs">
            <span className="eyebrow">
              {copy.onlineDrawMode}
            </span>
          </div>
          <h1 className="t-h1">
            {copy.onlineDraw}
          </h1>
          <p className="caption mx-auto max-w-[31rem]">
            {copy.onlineDrawDescription}
          </p>
        </header>

        <section className="well p-5">
          <p className="eyebrow">
            {copy.yourQuestion}
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--c-text)]">{question}</p>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-2 text-center">
            {onlineSteps.map((step, index) => {
              const isActive = index === initialRitualStep;
              const isComplete = index < initialRitualStep;

              return (
                <div key={step.label} className="relative">
                  {index > 0 && (
                    <div className="absolute right-1/2 top-3 h-px w-full bg-[var(--c-border)]" />
                  )}
                  <div
                    className={`relative z-10 mx-auto mb-3 h-6 w-6 rounded-full border ${
                      isActive
                        ? "border-[var(--c-accent)] bg-[var(--c-accent)]"
                        : isComplete
                          ? "border-[var(--c-accent)] bg-[var(--c-accent-wash)]"
                          : "border-[var(--c-border-strong)] bg-[var(--c-surface-2)]"
                    }`}
                  />
                  <p
                    className={`text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${
                      isActive ? "text-[var(--c-accent-text)]" : "text-[var(--c-text-muted)]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-8 text-center transition-all duration-300 ${
              stepSettled ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <p className="eyebrow">
              {copy.shuffle} · {copy.cut} · {copy.draw}
            </p>
            <h2 className="t-h2 mt-4">
              {currentOnlineStep.title}
            </h2>
            <p className="caption mt-3">
              {currentOnlineStep.description}
            </p>
            <div className="caption mt-4 space-y-1">
              {currentOnlineStep.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div
            className={`mt-6 flex justify-center transition-all duration-500 ${
              stepSettled ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <LuminousCardBack activeStep={initialRitualStep} />
          </div>
        </section>

        <LuminousAction href={onlineActionHref}>
          {initialRitualStep < 2 ? currentOnlineStep.button : copy.revealCard}
        </LuminousAction>
      </LuminousShell>
    );
  }

  return (
    <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
      <LuminousNav lang={initialLang} />

      <header className="space-y-4 text-center">
        <div className="rule mx-auto max-w-xs">
          <span className="eyebrow">
            {copy.physicalDeck}
          </span>
        </div>
        <h1 className="t-h1">
          {copy.physicalDrawTitle}
        </h1>
        <p className="caption mx-auto max-w-[31rem]">
          {copy.physicalDrawDescription}
        </p>
      </header>

      <section className="card p-5 text-sm leading-7 sm:p-6">
        <p className="eyebrow">
          {copy.yourQuestion}
        </p>
        <p className="mt-3 text-[var(--c-text)]">{question}</p>
        <p className="caption mt-3 text-sm">
          {copy.keepQuestion}
        </p>

        <div className="my-5 h-px bg-[var(--c-border)]" />

        <ol className="space-y-4">
          <li className="well p-4">
            <p className="font-semibold text-[var(--c-text)]">1. {copy.prepareStep}</p>
            <p className="mt-1">{copy.prepareDeck}</p>
          </li>
          <li className="well p-4">
            <p className="font-semibold text-[var(--c-text)]">2. {copy.shuffle}</p>
            <p className="mt-1">{copy.shuffleDeck}</p>
          </li>
          <li className="well p-4">
            <p className="font-semibold text-[var(--c-text)]">3. {copy.cut}</p>
            <p className="mt-1">{copy.cutDeck}</p>
          </li>
          <li className="well p-4">
            <p className="font-semibold text-[var(--c-text)]">4. {copy.draw}</p>
            <p className="mt-1">{copy.drawDeck}</p>
          </li>
        </ol>

        <p className="mt-5 text-[var(--c-text)]">{copy.selectSameCard}</p>
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

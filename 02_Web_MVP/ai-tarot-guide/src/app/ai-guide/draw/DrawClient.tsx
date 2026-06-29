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
    <main className="ora-guide-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_96%,transparent),color-mix(in_srgb,var(--c-bg)_90%,var(--c-surface)_10%)_42%,color-mix(in_srgb,var(--c-border)_50%,transparent)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-[color:var(--c-accent)]/16 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[23rem] w-[23rem] -translate-x-1/2 rounded-full border border-[color:var(--c-accent)]/20 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-[13rem] w-[13rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/34 opacity-80" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[color:var(--c-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-[color:var(--c-surface)]/42 blur-3xl" />
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
    <div className="ora-guide-surface rounded-[2rem] px-4 py-3 backdrop-blur-md">
      <ReadingNav lang={lang} />
    </div>
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d2b06d]/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d2b06d]/26" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa664]/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#caa664]/32 to-transparent" />

      {fanRotation.map((rotationClass, index) => (
        <div
          key={index}
          className={`absolute left-1/2 top-8 h-56 w-36 -translate-x-1/2 rounded-[1.35rem] border border-[#cfa85e]/45 bg-[#fffaf0]/82 shadow-[0_24px_55px_rgba(121,84,30,0.16),inset_0_1px_0_rgba(255,255,255,0.74)] transition-transform duration-500 ${rotationClass}`}
        >
          <div className="absolute inset-3 rounded-[1rem] border border-[#d8bd82]/44" />
          <div className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full border border-[#d8bd82]/42" />
          <div className="absolute bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full border border-[#d8bd82]/32" />
          <div className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#cfa85e]/48" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfa85e]/52" />
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

  if (initialMode === "online" && initialRitualStep === 2 && !selectedCards) {
    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
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

  if (initialMode === "online") {
    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <LuminousNav lang={initialLang} />

        <header className="space-y-4 text-center">
        <div className="mx-auto flex items-center justify-center gap-3 text-[color:var(--c-accent)]">
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.onlineDrawMode}
            </span>
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
          </div>
          <h1 className="font-serif text-[2.6rem] leading-tight text-[color:var(--c-text)] sm:text-[3.25rem]">
            {copy.onlineDraw}
          </h1>
          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.onlineDrawDescription}
          </p>
        </header>

        <section className="ora-guide-panel relative overflow-hidden rounded-[2rem] p-5 backdrop-blur-md">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[color:var(--c-accent)]/20" />
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--c-accent)]">
            {copy.yourQuestion}
          </p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--c-text)]">{question}</p>
        </section>

        <section className="ora-guide-panel relative overflow-hidden rounded-[2.25rem] p-5 backdrop-blur-md sm:p-6">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/60 to-transparent" />
          <div className="grid grid-cols-3 gap-2 text-center">
            {onlineSteps.map((step, index) => {
              const isActive = index === initialRitualStep;
              const isComplete = index < initialRitualStep;

              return (
                <div key={step.label} className="relative">
                  {index > 0 && (
                    <div className="absolute right-1/2 top-3 h-px w-full bg-[#d8bd82]/40" />
                  )}
                  <div
                    className={`relative z-10 mx-auto mb-3 h-6 w-6 rounded-full border ${
                      isActive
                        ? "border-[#c89d4f] bg-[#d8b460] shadow-[0_0_22px_rgba(200,157,79,0.35)]"
                        : isComplete
                          ? "border-[#c89d4f]/70 bg-[#f5dfa8]"
                          : "border-[#d8bd82]/60 bg-[#fff8ea]"
                    }`}
                  />
                  <p
                    className={`text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${
                      isActive ? "text-[#8d6426]" : "text-[#9b8b73]"
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
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--c-accent)]">
              {copy.shuffle} · {copy.cut} · {copy.draw}
            </p>
            <h2 className="mt-4 font-serif text-[2.35rem] leading-tight text-[color:var(--c-text)] sm:text-[2.75rem]">
              {currentOnlineStep.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--c-text-soft)]">
              {currentOnlineStep.description}
            </p>
            <div className="mt-4 space-y-1 text-sm leading-6 text-[color:var(--c-text-soft)]">
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

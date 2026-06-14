"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { type Language, text } from "@/lib/ai-guide/i18n";

const USER_QUESTION_KEY = "aiTarot:userQuestion";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ReadingMode = "physical" | "online";

type DrawClientProps = {
  initialMode: ReadingMode;
  initialQuestion: string;
  initialLang: Language;
  hasLangParam: boolean;
  initialRitualStep: number;
  initialDrawnCard: string;
};

function buildQuery(
  mode: ReadingMode,
  question: string,
  lang: Language,
  card?: string,
  ritualStep?: number,
) {
  const params = new URLSearchParams({
    mode,
    spread: "single",
    orientation: "upright",
    question,
    lang,
  });

  if (card) {
    params.set("card", card);
  }

  if (ritualStep) {
    params.set("ritualStep", String(ritualStep));
  }

  return params.toString();
}

function saveLatestRitual(
  mode: ReadingMode,
  question: string,
  lang: Language,
  card?: string,
) {
  localStorage.setItem(
    LATEST_RITUAL_KEY,
    JSON.stringify({
      mode,
      spread: "single",
      orientation: "upright",
      question,
      lang,
      card,
    }),
  );
}

function LuminousShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#f6f0e5] px-0 py-0 text-[#34271b] sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.98),rgba(246,240,229,0.9)_42%,rgba(226,213,188,0.5)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-[#c9a86a]/16 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[23rem] w-[23rem] -translate-x-1/2 rounded-full border border-[#d8bd82]/20 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-[13rem] w-[13rem] -translate-x-1/2 rounded-full border border-[#ead7aa]/34 opacity-80" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[#d7bd82]/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-white/45 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[720px] flex-col gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
        {children}
      </div>
    </main>
  );
}

function LuminousNav({
  lang,
  pathname,
  params,
  hasLangParam,
}: {
  lang: Language;
  pathname: string;
  params: Record<string, string>;
  hasLangParam: boolean;
}) {
  return (
    <div className="rounded-[2rem] border border-[#d7bd82]/40 bg-white/42 px-4 py-3 shadow-[0_18px_60px_rgba(123,93,45,0.08)] backdrop-blur-md">
      <ReadingNav lang={lang} />
      <div className="mt-3 flex justify-end">
        <LanguageToggle
          lang={lang}
          pathname={pathname}
          params={params}
          hasLangParam={hasLangParam}
        />
      </div>
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
      className="flex min-h-12 touch-manipulation select-none items-center justify-center rounded-full border border-[#c89d4f]/70 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#3a2a18] shadow-[0_18px_38px_rgba(148,105,39,0.22),inset_0_1px_0_rgba(255,255,255,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(148,105,39,0.26),inset_0_1px_0_rgba(255,255,255,0.62)] focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#f6f0e5]"
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
  initialLang,
  hasLangParam,
  initialRitualStep,
  initialDrawnCard,
}: DrawClientProps) {
  const router = useRouter();
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
  const currentOnlineStep = onlineSteps[initialRitualStep];
  const onlineActionHref =
    initialRitualStep < 2
      ? `/ai-guide/draw?${buildQuery(
          "online",
          question ?? initialQuestion,
          initialLang,
          undefined,
          initialRitualStep + 1,
        )}`
      : `/ai-guide/reveal?${buildQuery(
          "online",
          question ?? initialQuestion,
          initialLang,
          initialDrawnCard,
        )}`;

  useEffect(() => {
    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY) ?? "";
    const resolvedQuestion = initialQuestion || storedQuestion;

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
      saveLatestRitual(
        initialMode,
        initialQuestion,
        initialLang,
        initialRitualStep === 2 ? initialDrawnCard : undefined,
      );
    }

    queueMicrotask(() => {
      setQuestion(resolvedQuestion);
    });

    if (!resolvedQuestion) {
      router.replace(
        `/ai-guide/ask?mode=${initialMode}&spread=single&orientation=upright&lang=${initialLang}`,
      );
    }
  }, [
    initialDrawnCard,
    initialLang,
    initialMode,
    initialQuestion,
    initialRitualStep,
    router,
  ]);

  if (question === undefined) {
    return (
      <LuminousShell>
        <section className="my-auto rounded-[2rem] border border-[#d8bd82]/45 bg-[#fffaf1]/74 p-6 text-center shadow-[0_24px_70px_rgba(116,83,36,0.10)] backdrop-blur-md">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
            {copy.readingRoom}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#34271b]">
            {copy.readingCard}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#7b6c58]">
            {copy.gatheringReading}
          </p>
          <p className="mt-6 text-sm text-[#80715d]">
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
    return (
      <LuminousShell>
        <LuminousNav
          lang={initialLang}
          pathname="/ai-guide/draw"
          params={{
            mode: initialMode,
            spread: "single",
            orientation: "upright",
            question,
            ritualStep: String(initialRitualStep),
          }}
          hasLangParam={hasLangParam}
        />

        <header className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 text-[#a77f3c]">
            <span className="h-px w-10 bg-[#d2b06d]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.onlineDrawMode}
            </span>
            <span className="h-px w-10 bg-[#d2b06d]/55" />
          </div>
          <h1 className="font-serif text-[2.6rem] leading-tight text-[#34271b] sm:text-[3.25rem]">
            {copy.onlineDraw}
          </h1>
          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[#7b6c58]">
            {copy.onlineDrawDescription}
          </p>
        </header>

        <section className="relative overflow-hidden rounded-[2rem] border border-[#d8bd82]/45 bg-[#fffaf1]/74 p-5 shadow-[0_24px_70px_rgba(116,83,36,0.10)] backdrop-blur-md">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-[#d2b06d]/20" />
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
            {copy.yourQuestion}
          </p>
          <p className="mt-3 text-sm leading-6 text-[#4f4334]">{question}</p>
        </section>

        <section className="relative overflow-hidden rounded-[2.25rem] border border-[#cfad6d]/50 bg-[#fffdf7]/82 p-5 shadow-[0_28px_80px_rgba(111,78,31,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:p-6">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/60 to-transparent" />
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

          <div className="mt-8 text-center">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
              {copy.shuffle} · {copy.cut} · {copy.draw}
            </p>
            <h2 className="mt-4 font-serif text-[2.35rem] leading-tight text-[#34271b] sm:text-[2.75rem]">
              {currentOnlineStep.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#7b6c58]">
              {currentOnlineStep.description}
            </p>
            <div className="mt-4 space-y-1 text-sm leading-6 text-[#6f624f]">
              {currentOnlineStep.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
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
    <LuminousShell>
      <LuminousNav
        lang={initialLang}
        pathname="/ai-guide/draw"
        params={{
          mode: initialMode,
          spread: "single",
          orientation: "upright",
          question,
        }}
        hasLangParam={hasLangParam}
      />

      <header className="space-y-4 text-center">
        <div className="mx-auto flex items-center justify-center gap-3 text-[#a77f3c]">
          <span className="h-px w-10 bg-[#d2b06d]/55" />
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
            {copy.physicalDeck}
          </span>
          <span className="h-px w-10 bg-[#d2b06d]/55" />
        </div>
        <h1 className="font-serif text-[2.6rem] leading-tight text-[#34271b] sm:text-[3.25rem]">
          {copy.physicalDrawTitle}
        </h1>
        <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[#7b6c58]">
          {copy.physicalDrawDescription}
        </p>
      </header>

      <section className="relative overflow-hidden rounded-[2.25rem] border border-[#cfad6d]/50 bg-[#fffdf7]/82 p-5 text-sm leading-7 text-[#6f624f] shadow-[0_28px_80px_rgba(111,78,31,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:p-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/60 to-transparent" />
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
          {copy.yourQuestion}
        </p>
        <p className="mt-3 text-[#4f4334]">{question}</p>
        <p className="mt-3 text-sm leading-6 text-[#80715d]">
          {copy.keepQuestion}
        </p>

        <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/46 to-transparent" />

        <ol className="space-y-4">
          <li className="rounded-[1.35rem] border border-[#d8bd82]/38 bg-[#fffaf0]/68 p-4">
            <p className="font-semibold text-[#3f3021]">1. {copy.prepareStep}</p>
            <p className="mt-1">{copy.prepareDeck}</p>
          </li>
          <li className="rounded-[1.35rem] border border-[#d8bd82]/38 bg-[#fffaf0]/68 p-4">
            <p className="font-semibold text-[#3f3021]">2. {copy.shuffle}</p>
            <p className="mt-1">{copy.shuffleDeck}</p>
          </li>
          <li className="rounded-[1.35rem] border border-[#d8bd82]/38 bg-[#fffaf0]/68 p-4">
            <p className="font-semibold text-[#3f3021]">3. {copy.cut}</p>
            <p className="mt-1">{copy.cutDeck}</p>
          </li>
          <li className="rounded-[1.35rem] border border-[#d8bd82]/38 bg-[#fffaf0]/68 p-4">
            <p className="font-semibold text-[#3f3021]">4. {copy.draw}</p>
            <p className="mt-1">{copy.drawDeck}</p>
          </li>
        </ol>

        <p className="mt-5 text-[#4f4334]">{copy.selectSameCard}</p>
      </section>

      <LuminousAction
        href={`/ai-guide/reveal?${buildQuery(
          "physical",
          question,
          initialLang,
        )}`}
      >
        {copy.haveDrawnCard}
      </LuminousAction>
    </LuminousShell>
  );
}
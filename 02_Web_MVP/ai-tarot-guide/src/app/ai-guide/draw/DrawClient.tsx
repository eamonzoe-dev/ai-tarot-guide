"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { TarotButton } from "@/components/ai-guide/TarotButton";
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

type DrawAction = "shuffle" | "cut" | "draw";

function getDrawAction(step: number): DrawAction {
  if (step === 0) {
    return "shuffle";
  }

  if (step === 1) {
    return "cut";
  }

  return "draw";
}

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
      title: copy.shuffleAction,
      description: copy.onlineShuffleDescription,
    },
    {
      title: copy.cutAction,
      description: copy.onlineCutDescription,
    },
    {
      title: copy.drawAction,
      description: copy.onlineDrawStepDescription,
    },
  ] as const;
  const [question, setQuestion] = useState<string | undefined>(
    initialQuestion || undefined,
  );
  const currentOnlineStep = onlineSteps[initialRitualStep];
  const currentDrawAction = getDrawAction(initialRitualStep);
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
      <PageContainer
        eyebrow={copy.readingRoom}
        title="Preparing the draw"
        description="Gathering your saved question."
      >
        <p className="text-sm text-[#a9a59d]">Preparing...</p>
      </PageContainer>
    );
  }

  if (!question) {
    return null;
  }

  if (initialMode === "online") {
    return (
      <PageContainer
        eyebrow={copy.onlineDrawMode}
        title={copy.onlineDraw}
        description={copy.onlineDrawDescription}
      >
        <ReadingNav lang={initialLang} />
        <div className="mb-5 flex justify-end">
          <LanguageToggle
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
        </div>
        <div className="space-y-6">
          <div className="atelier-worktop p-5">
            <p className="atelier-label text-[0.68rem] font-semibold">
              {copy.yourQuestion}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#efe8d9]">{question}</p>
            <div className="atelier-divider my-5" />
            <div className="grid grid-cols-3 gap-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#8f856f]">
              {onlineSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`border px-2 py-2 ${
                    index === initialRitualStep
                      ? "border-[#b08c58]/70 text-[#efe8d9]"
                      : "border-[#3d3328]"
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="atelier-label text-[0.68rem] font-semibold">
                {currentDrawAction}
              </p>
              <p className="mt-3 font-serif text-3xl text-[#f4efe5]">
                {currentOnlineStep.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#c8c0b4]">
                {currentOnlineStep.description}
              </p>
            </div>
          </div>
          <TarotButton href={onlineActionHref}>
            {initialRitualStep < 2 ? currentOnlineStep.title : copy.revealCard}
          </TarotButton>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      eyebrow={copy.physicalDeck}
      title={copy.physicalDrawTitle}
      description={copy.physicalDrawDescription}
    >
      <ReadingNav lang={initialLang} />
      <div className="mb-5 flex justify-end">
        <LanguageToggle
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
      </div>
      <div className="space-y-6">
        <div className="atelier-worktop p-5 text-sm leading-7 text-[#c8c0b4]">
          <p className="atelier-label text-[0.68rem] font-semibold">
            {copy.yourQuestion}
          </p>
          <p className="mt-3 text-[#efe8d9]">{question}</p>
          <p className="mt-3 text-sm leading-6 text-[#a9a59d]">
            {copy.keepQuestion}
          </p>
          <div className="atelier-divider my-5" />
          <ol className="space-y-4">
            <li>
              <p className="font-semibold text-[#efe8d9]">
                1. {copy.prepareStep}
              </p>
              <p>{copy.prepareDeck}</p>
            </li>
            <li>
              <p className="font-semibold text-[#efe8d9]">2. {copy.shuffle}</p>
              <p>{copy.shuffleDeck}</p>
            </li>
            <li>
              <p className="font-semibold text-[#efe8d9]">3. {copy.cut}</p>
              <p>{copy.cutDeck}</p>
            </li>
            <li>
              <p className="font-semibold text-[#efe8d9]">4. {copy.draw}</p>
              <p>{copy.drawDeck}</p>
            </li>
          </ol>
          <p className="mt-5 text-[#efe8d9]">{copy.selectSameCard}</p>
        </div>
        <TarotButton
          href={`/ai-guide/reveal?${buildQuery(
            "physical",
            question,
            initialLang,
          )}`}
        >
          {copy.haveDrawnCard}
        </TarotButton>
      </div>
    </PageContainer>
  );
}

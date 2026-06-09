"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import { tarotCards } from "@/data/tarotCards";
import { type Language, text } from "@/lib/ai-guide/i18n";

const USER_QUESTION_KEY = "aiTarot:userQuestion";
const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ReadingMode = "physical" | "online";

type DrawClientProps = {
  initialMode: ReadingMode;
  initialQuestion: string;
  initialLang: Language;
  hasLangParam: boolean;
};

function buildQuery(
  mode: ReadingMode,
  question: string,
  lang: Language,
  card?: string,
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
  const [ritualStep, setRitualStep] = useState(0);
  const [drawnCard, setDrawnCard] = useState("");

  useEffect(() => {
    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY) ?? "";
    const resolvedQuestion = initialQuestion || storedQuestion;

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
      saveLatestRitual(initialMode, initialQuestion, initialLang);
    }

    queueMicrotask(() => {
      setQuestion(resolvedQuestion);
    });

    if (!resolvedQuestion) {
      router.replace(
        `/ai-guide/ask?mode=${initialMode}&spread=single&orientation=upright&lang=${initialLang}`,
      );
    }
  }, [initialLang, initialMode, initialQuestion, router]);

  function handleOnlineRitual() {
    if (!question) {
      router.replace(
        `/ai-guide/ask?mode=${initialMode}&spread=single&orientation=upright&lang=${initialLang}`,
      );
      return;
    }

    if (ritualStep < 2) {
      setRitualStep((step) => step + 1);
      return;
    }

    const selectedCard =
      tarotCards[Math.floor(Math.random() * tarotCards.length)];
    localStorage.setItem(SELECTED_CARD_KEY, selectedCard.id);
    localStorage.setItem(USER_QUESTION_KEY, question);
    saveLatestRitual("online", question, initialLang, selectedCard.id);
    setDrawnCard(selectedCard.id);
  }

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
        eyebrow={copy.onlineDraw}
        title={copy.drawOnline}
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
            <div className="space-y-3">
              {onlineSteps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  disabled={Boolean(drawnCard) || index !== ritualStep}
                  onClick={() => {
                    if (!drawnCard && index === ritualStep) {
                      handleOnlineRitual();
                    }
                  }}
                  className={`flex items-center gap-3 border px-3 py-3 ${
                    index <= ritualStep
                      ? "border-[#a98552]/55 bg-[#17110d]"
                      : "border-[#3f3324] bg-[#090806]"
                  } ${
                    !drawnCard && index === ritualStep
                      ? "touch-manipulation text-left"
                      : "cursor-not-allowed opacity-55"
                  }`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#8c724b] text-xs text-[#d8c9ae]">
                    {index + 1}
                  </span>
                  <span className="text-left">
                    <span className="block text-[#efe8d9]">{step.title}</span>
                    <span className="block text-sm leading-6 text-[#a9a59d]">
                      {step.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {drawnCard && (
            <TarotButton
              href={`/ai-guide/reveal?${buildQuery(
                "online",
                question,
                initialLang,
                drawnCard,
              )}`}
            >
              {copy.revealCard}
            </TarotButton>
          )}
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

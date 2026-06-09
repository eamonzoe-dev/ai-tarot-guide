"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import { tarotCards } from "@/data/tarotCards";

const USER_QUESTION_KEY = "aiTarot:userQuestion";
const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ReadingMode = "physical" | "online";

type DrawClientProps = {
  initialMode: ReadingMode;
  initialQuestion: string;
};

const onlineSteps = [
  {
    title: "SHUFFLE",
    description: "Quiet the deck and return to your question.",
  },
  {
    title: "CUT",
    description: "Mark the moment of choice.",
  },
  {
    title: "DRAW",
    description: "Draw one card from the online deck.",
  },
] as const;

function buildQuery(mode: ReadingMode, question: string, card?: string) {
  const params = new URLSearchParams({
    mode,
    spread: "single",
    orientation: "upright",
    question,
  });

  if (card) {
    params.set("card", card);
  }

  return params.toString();
}

function saveLatestRitual(
  mode: ReadingMode,
  question: string,
  card?: string,
) {
  localStorage.setItem(
    LATEST_RITUAL_KEY,
    JSON.stringify({
      mode,
      spread: "single",
      orientation: "upright",
      question,
      card,
    }),
  );
}

export function DrawClient({
  initialMode,
  initialQuestion,
}: DrawClientProps) {
  const router = useRouter();
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
      saveLatestRitual(initialMode, initialQuestion);
    }

    queueMicrotask(() => {
      setQuestion(resolvedQuestion);
    });

    if (!resolvedQuestion) {
      router.replace(`/ai-guide/ask?mode=${initialMode}`);
    }
  }, [initialMode, initialQuestion, router]);

  function handleOnlineRitual() {
    if (!question) {
      router.replace(`/ai-guide/ask?mode=${initialMode}`);
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
    saveLatestRitual("online", question, selectedCard.id);
    setDrawnCard(selectedCard.id);
  }

  if (question === undefined) {
    return (
      <PageContainer
        eyebrow="Reading Room"
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
        eyebrow="Online Draw"
        title="Draw Online"
        description="Move through a simple online ritual before opening the reading."
      >
        <div className="space-y-6">
          <div className="atelier-worktop p-5 text-sm leading-7 text-[#c8c0b4]">
            <p className="atelier-label text-[0.68rem] font-semibold">
              Your Question
            </p>
            <p className="mt-3 text-[#efe8d9]">{question}</p>
            <p className="mt-3 text-sm leading-6 text-[#a9a59d]">
              Keep your question gently in mind as you move through the ritual.
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
              href={`/ai-guide/reveal?${buildQuery("online", question, drawnCard)}`}
            >
              Reveal the Card
            </TarotButton>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      eyebrow="Physical Deck"
      title="Ritual Step"
      description="Move through one card with a slow, deliberate physical sequence."
    >
      <div className="space-y-6">
        <div className="atelier-worktop p-5 text-sm leading-7 text-[#c8c0b4]">
          <p className="atelier-label text-[0.68rem] font-semibold">
            Your Question
          </p>
          <p className="mt-3 text-[#efe8d9]">{question}</p>
          <p className="mt-3 text-sm leading-6 text-[#a9a59d]">
            Keep your question gently in mind as you move through the ritual.
          </p>
          <div className="atelier-divider my-5" />
          <ol className="space-y-4">
            <li>
              <p className="font-semibold text-[#efe8d9]">1. Prepare</p>
              <p>Prepare your physical deck and place it in front of you.</p>
            </li>
            <li>
              <p className="font-semibold text-[#efe8d9]">2. Shuffle</p>
              <p>
                Shuffle your physical deck slowly while keeping your question
                in mind.
              </p>
            </li>
            <li>
              <p className="font-semibold text-[#efe8d9]">3. Cut</p>
              <p>
                Cut the deck once, or in the way that feels natural to your
                reading practice.
              </p>
            </li>
            <li>
              <p className="font-semibold text-[#efe8d9]">4. Draw</p>
              <p>
                Draw one card from your deck. Keep it face down until you are
                ready to select it here.
              </p>
            </li>
          </ol>
          <p className="mt-5 text-[#efe8d9]">
            When you are ready, select the same card in the guide.
          </p>
        </div>
        <TarotButton
          href={`/ai-guide/reveal?${buildQuery("physical", question)}`}
        >
          I HAVE DRAWN MY CARD
        </TarotButton>
      </div>
    </PageContainer>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import { getTarotCardById, tarotCardGroups } from "@/data/tarotCards";

const USER_QUESTION_KEY = "aiTarot:userQuestion";
const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const READING_MODE_KEY = "aiTarot:readingMode";
const READING_SPREAD_KEY = "aiTarot:readingSpread";
const CARD_ORIENTATION_KEY = "aiTarot:cardOrientation";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ReadingMode = "physical" | "online";

type RevealClientProps = {
  initialMode: string;
  initialQuestion: string;
  initialSpread: string;
  initialCard: string;
  initialOrientation: string;
};

type RitualState = {
  mode: ReadingMode;
  spread: "single";
  orientation: "upright";
  question: string;
  card: string;
};

function readLatestRitual(): Partial<RitualState> {
  const rawRitual = localStorage.getItem(LATEST_RITUAL_KEY);

  if (!rawRitual) {
    return {};
  }

  try {
    return JSON.parse(rawRitual) as Partial<RitualState>;
  } catch {
    return {};
  }
}

function buildResultHref(ritual: RitualState) {
  const params = new URLSearchParams({
    mode: ritual.mode,
    spread: ritual.spread,
    orientation: ritual.orientation,
    question: ritual.question,
    card: ritual.card,
  });

  return `/ai-guide/result?${params.toString()}`;
}

function resolveInitialRitual({
  initialMode,
  initialQuestion,
  initialSpread,
  initialCard,
  initialOrientation,
}: RevealClientProps): RitualState {
  const stored = readLatestRitual();
  const storedQuestion = localStorage.getItem(USER_QUESTION_KEY) ?? "";
  const storedCard = localStorage.getItem(SELECTED_CARD_KEY) ?? "";
  const mode: ReadingMode =
    initialMode === "online" || stored.mode === "online"
      ? "online"
      : "physical";

  return {
    mode,
    spread: initialSpread === "single" ? "single" : "single",
    orientation: initialOrientation === "upright" ? "upright" : "upright",
    question: initialQuestion || stored.question || storedQuestion,
    card: initialCard || stored.card || storedCard,
  };
}

export function RevealClient({
  initialMode,
  initialQuestion,
  initialSpread,
  initialCard,
  initialOrientation,
}: RevealClientProps) {
  const router = useRouter();
  const [ritual] = useState<RitualState>(() =>
    resolveInitialRitual({
      initialMode,
      initialQuestion,
      initialSpread,
      initialCard,
      initialOrientation,
    }),
  );

  useEffect(() => {
    if (!ritual.question) {
      router.replace(
        `/ai-guide/ask?mode=${ritual.mode}&spread=single&orientation=upright`,
      );
      return;
    }

    localStorage.setItem(USER_QUESTION_KEY, ritual.question);
    localStorage.setItem(READING_MODE_KEY, ritual.mode);
    localStorage.setItem(READING_SPREAD_KEY, ritual.spread);
    localStorage.setItem(CARD_ORIENTATION_KEY, ritual.orientation);

    if (ritual.card) {
      localStorage.setItem(SELECTED_CARD_KEY, ritual.card);
    }

    localStorage.setItem(LATEST_RITUAL_KEY, JSON.stringify(ritual));
  }, [ritual, router]);

  const card = ritual.card ? getTarotCardById(ritual.card) : undefined;

  if (ritual.mode === "physical") {
    function handleSelect(cardId: string) {
      const nextRitual: RitualState = {
        ...ritual,
        card: cardId,
      };

      localStorage.setItem(SELECTED_CARD_KEY, cardId);
      localStorage.setItem(LATEST_RITUAL_KEY, JSON.stringify(nextRitual));
    }

    function buildPhysicalHref(cardId: string) {
      return buildResultHref({ ...ritual, card: cardId });
    }

    return (
      <PageContainer
        eyebrow="Physical Card Mode"
        title="Reveal Your Physical Card"
        description="Select the card you drew from your physical deck. The reading will be based on that card, your question, and the single-card format."
      >
        <div className="space-y-6 pb-8">
          {tarotCardGroups.map((group) => (
            <section key={group.title} className="atelier-panel p-3">
              <h2 className="atelier-label mb-3 px-1 text-xs font-semibold">
                {group.title}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {group.cards.map((tarotCard) => (
                  <CardChoice
                    key={tarotCard.id}
                    card={tarotCard}
                    href={buildPhysicalHref(tarotCard.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </PageContainer>
    );
  }

  if (!ritual.card || !card) {
    return (
      <PageContainer
        eyebrow="Online Draw Mode"
        title="No card has been drawn"
        description="Return to the ritual table and complete the draw step."
      >
        <TarotButton
          href={`/ai-guide/draw?mode=online&spread=single&orientation=upright&question=${encodeURIComponent(
            ritual.question,
          )}`}
        >
          BACK TO DRAW
        </TarotButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      eyebrow="Online Draw Mode"
      title="The Card Is Drawn"
      description="Your card has been drawn. Open the reading when you are ready to see the symbolic reflection."
    >
      <div className="space-y-6">
        <div className="atelier-worktop p-5 text-center">
          <div className="mx-auto flex h-64 w-44 items-center justify-center border border-[#4a3b28] bg-[linear-gradient(160deg,#17110d,#070707)] shadow-[0_22px_48px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,245,224,0.08)]">
            <div className="h-52 w-32 border border-[#8c724b] bg-[#090806] p-4">
              <div className="h-full border border-[#3f3324]" />
            </div>
          </div>
          <p className="atelier-label mt-5 text-xs font-semibold">
            Online Deck
          </p>
          <p className="mt-2 text-sm leading-6 text-[#c8c0b4]">
            A single card has been drawn inside the atelier.
          </p>
          {card.image && (
            <Image
              src={card.image}
              alt={`${card.title} tarot card`}
              width={120}
              height={213}
              priority
              className="sr-only"
            />
          )}
        </div>

        <TarotButton href={buildResultHref(ritual)}>OPEN THE READING</TarotButton>
      </div>
    </PageContainer>
  );
}

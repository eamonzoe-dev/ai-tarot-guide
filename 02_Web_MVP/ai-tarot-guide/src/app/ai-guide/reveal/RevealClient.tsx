"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { TarotButton } from "@/components/ai-guide/TarotButton";
import {
  getTarotCardById,
  getTarotCardTitle,
  tarotCardGroups,
} from "@/data/tarotCards";
import { getGroupTitle, type Language, text } from "@/lib/ai-guide/i18n";

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
  initialLang: Language;
  hasLangParam: boolean;
};

type RitualState = {
  mode: ReadingMode;
  spread: "single";
  orientation: "upright";
  question: string;
  card: string;
  lang: Language;
};

function isReadingMode(value: string): value is ReadingMode {
  return value === "online" || value === "physical";
}

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
    lang: ritual.lang,
  });

  return `/ai-guide/result?${params.toString()}`;
}

function resolveInitialRitual({
  initialMode,
  initialQuestion,
  initialSpread,
  initialCard,
  initialOrientation,
  initialLang,
}: Omit<
  RevealClientProps,
  "hasLangParam"
>): RitualState {
  const mode: ReadingMode = isReadingMode(initialMode)
    ? initialMode
    : "physical";

  return {
    mode,
    spread: initialSpread === "single" ? "single" : "single",
    orientation: initialOrientation === "upright" ? "upright" : "upright",
    question: initialQuestion,
    card: initialCard,
    lang: initialLang,
  };
}

export function RevealClient({
  initialMode,
  initialQuestion,
  initialSpread,
  initialCard,
  initialOrientation,
  initialLang,
  hasLangParam,
}: RevealClientProps) {
  const router = useRouter();
  const copy = text(initialLang);
  const [ritual, setRitual] = useState<RitualState>(() =>
    resolveInitialRitual({
      initialMode,
      initialQuestion,
      initialSpread,
      initialCard,
      initialOrientation,
      initialLang,
    }),
  );
  const [selectedPhysicalCard, setSelectedPhysicalCard] = useState("");

  useEffect(() => {
    const stored = readLatestRitual();
    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY) ?? "";
    const storedCard = localStorage.getItem(SELECTED_CARD_KEY) ?? "";
    const hasInitialMode = isReadingMode(initialMode);
    const nextRitual: RitualState = {
      ...ritual,
      mode: hasInitialMode
        ? ritual.mode
        : stored.mode === "online"
          ? "online"
          : ritual.mode,
      question: ritual.question || stored.question || storedQuestion,
      card: ritual.card || stored.card || storedCard,
    };

    if (
      nextRitual.mode !== ritual.mode ||
      nextRitual.question !== ritual.question ||
      nextRitual.card !== ritual.card
    ) {
      setRitual(nextRitual);
      return;
    }

    if (!ritual.question && !ritual.card) {
      router.replace(
        `/ai-guide/ask?mode=${ritual.mode}&spread=single&orientation=upright&lang=${ritual.lang}`,
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
  }, [initialMode, ritual, router]);

  const card = ritual.card ? getTarotCardById(ritual.card) : undefined;

  if (ritual.mode === "physical") {
    function handleSelect(cardId: string) {
      const nextRitual: RitualState = {
        ...ritual,
        card: cardId,
      };

      setSelectedPhysicalCard(cardId);
      localStorage.setItem(SELECTED_CARD_KEY, cardId);
      localStorage.setItem(LATEST_RITUAL_KEY, JSON.stringify(nextRitual));
    }

    function buildPhysicalHref(cardId: string) {
      return buildResultHref({ ...ritual, card: cardId });
    }

    return (
      <PageContainer
        eyebrow={copy.physicalCardMode}
        title={copy.revealPhysicalTitle}
        description={copy.revealPhysicalDescription}
      >
        <ReadingNav lang={initialLang} />
        <div className="mb-5 flex justify-end">
          <LanguageToggle
            lang={initialLang}
            pathname="/ai-guide/reveal"
            params={{
              mode: ritual.mode,
              spread: ritual.spread,
              orientation: ritual.orientation,
              question: ritual.question,
              card: ritual.card,
            }}
            hasLangParam={hasLangParam}
          />
        </div>
        <div className="space-y-6 pb-8">
          {tarotCardGroups.map((group) => (
            <section key={group.title} className="atelier-panel p-3">
              <h2 className="atelier-label mb-3 px-1 text-xs font-semibold">
                {getGroupTitle(group.title, initialLang)}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {group.cards.map((tarotCard) => (
                  <CardChoice
                    key={tarotCard.id}
                    card={tarotCard}
                    href={buildPhysicalHref(tarotCard.id)}
                    isSelected={selectedPhysicalCard === tarotCard.id}
                    isSelectionActive={Boolean(selectedPhysicalCard)}
                    onSelect={handleSelect}
                    lang={initialLang}
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
    const title = ritual.card ? copy.invalidReadingTitle : copy.noCardDrawn;
    const description = ritual.card
      ? copy.invalidReadingDescription
      : copy.noCardDrawnDescription;

    return (
      <PageContainer
        eyebrow={copy.onlineDrawMode}
        title={title}
        description={description}
      >
        <ReadingNav lang={initialLang} />
        <div className="space-y-3">
          <TarotButton
            href={`/ai-guide/draw?mode=online&spread=single&orientation=upright&question=${encodeURIComponent(
              ritual.question,
            )}&lang=${initialLang}`}
          >
            {copy.backToDraw}
          </TarotButton>
          <TarotButton href={`/ai-guide?lang=${initialLang}`} variant="ghost">
            {copy.returnToReadingRoom}
          </TarotButton>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      eyebrow={copy.onlineDrawMode}
      title={copy.cardIsDrawn}
      description={copy.cardIsDrawnDescription}
    >
      <ReadingNav lang={initialLang} />
      <div className="mb-5 flex justify-end">
        <LanguageToggle
          lang={initialLang}
          pathname="/ai-guide/reveal"
          params={{
            mode: ritual.mode,
            spread: ritual.spread,
            orientation: ritual.orientation,
            question: ritual.question,
            card: ritual.card,
          }}
          hasLangParam={hasLangParam}
        />
      </div>
      <div className="space-y-6">
        <div className="atelier-worktop p-5 text-center">
          <div className="ritual-reveal-card mx-auto flex h-64 w-44 items-center justify-center border border-[#4a3b28] bg-[linear-gradient(160deg,#17110d,#070707)] shadow-[0_22px_48px_rgba(0,0,0,0.55),0_0_34px_rgba(169,133,82,0.12),inset_0_1px_0_rgba(255,245,224,0.08)]">
            <div className="h-52 w-32 border border-[#8c724b] bg-[#090806] p-4">
              <div className="h-full border border-[#3f3324]" />
            </div>
          </div>
          <p className="atelier-label mt-5 text-xs font-semibold">
            {copy.onlineDeck}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#c8c0b4]">
            {copy.onlineDeckDescription}
          </p>
          {card.image && (
            <Image
              src={card.image}
              alt={`${getTarotCardTitle(card, initialLang)} tarot card`}
              width={120}
              height={213}
              priority
              className="sr-only"
            />
          )}
        </div>

        <TarotButton href={buildResultHref(ritual)}>
          {copy.openReading}
        </TarotButton>
      </div>
    </PageContainer>
  );
}

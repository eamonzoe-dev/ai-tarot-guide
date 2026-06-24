"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
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
  initialCards: string;
  initialOrientation: string;
  initialLang: Language;
  hasLangParam: boolean;
  initialClarifyId: string;
  initialClarifyLabel: string;
  initialClarifyFocus: string;
  initialClarifyNote: string;
};

type RitualState = {
  mode: ReadingMode;
  spread: "single" | "three-card";
  orientation: "upright";
  question: string;
  card: string;
  cards: string;
  lang: Language;
  clarifyId: string;
  clarifyLabel: string;
  clarifyFocus: string;
  clarifyNote: string;
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
    lang: ritual.lang,
  });

  if (ritual.spread === "single" && ritual.card) {
    params.set("card", ritual.card);
  }

  if (ritual.spread === "three-card" && ritual.cards) {
    params.set("cards", ritual.cards);
  }

  if (ritual.clarifyId) {
    params.set("clarifyId", ritual.clarifyId);
  }

  if (ritual.clarifyLabel) {
    params.set("clarifyLabel", ritual.clarifyLabel);
  }

  if (ritual.clarifyFocus) {
    params.set("clarifyFocus", ritual.clarifyFocus);
  }

  if (ritual.clarifyNote) {
    params.set("clarifyNote", ritual.clarifyNote);
  }

  return `/ai-guide/result?${params.toString()}`;
}

function resolveInitialRitual({
  initialMode,
  initialQuestion,
  initialSpread,
  initialCard,
  initialCards,
  initialOrientation,
  initialLang,
  initialClarifyId,
  initialClarifyLabel,
  initialClarifyFocus,
  initialClarifyNote,
}: Omit<RevealClientProps, "hasLangParam">): RitualState {
  const mode: ReadingMode = isReadingMode(initialMode)
    ? initialMode
    : "physical";

  return {
    mode,
    spread: initialSpread === "three-card" ? "three-card" : "single",
    orientation: initialOrientation === "upright" ? "upright" : "upright",
    question: initialQuestion,
    card: initialCard,
    cards: initialCards,
    lang: initialLang,
    clarifyId: initialClarifyId,
    clarifyLabel: initialClarifyLabel,
    clarifyFocus: initialClarifyFocus,
    clarifyNote: initialClarifyNote,
  };
}

function LuminousShell({
  children,
  lang,
  hasLangParam,
}: {
  children: ReactNode;
  lang: Language;
  hasLangParam: boolean;
}) {
  return (
    <main className="ora-page-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
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
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const className =
    variant === "ghost"
      ? "btn btn--ghost w-full"
      : "btn btn--primary w-full";

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

function LuminousRevealCard() {
  return (
    <div className="relative mx-auto h-[24rem] w-full max-w-[22rem]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-64 -translate-x-1/2 bg-[var(--c-border-strong)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-px -translate-y-1/2 bg-[var(--c-border)]" />

      <div className="ora-card-back absolute left-1/2 top-8 h-[19rem] w-48 -translate-x-1/2">
        <div className="absolute inset-4 rounded-[1.25rem] border border-[var(--c-border-strong)]" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[var(--c-accent)]" />
      </div>
    </div>
  );
}

export function RevealClient({
  initialMode,
  initialQuestion,
  initialSpread,
  initialCard,
  initialCards,
  initialOrientation,
  initialLang,
  hasLangParam,
  initialClarifyId,
  initialClarifyLabel,
  initialClarifyFocus,
  initialClarifyNote,
}: RevealClientProps) {
  const router = useRouter();
  const copy = text(initialLang);
  const [ritual, setRitual] = useState<RitualState>(() =>
    resolveInitialRitual({
      initialMode,
      initialQuestion,
      initialSpread,
      initialCard,
      initialCards,
      initialOrientation,
      initialLang,
      initialClarifyId,
      initialClarifyLabel,
      initialClarifyFocus,
      initialClarifyNote,
    }),
  );
  const [selectedPhysicalCard, setSelectedPhysicalCard] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 380);
    return () => clearTimeout(timer);
  }, []);

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
      cards: ritual.cards || stored.cards || "",
    };

    if (
      nextRitual.mode !== ritual.mode ||
      nextRitual.question !== ritual.question ||
      nextRitual.card !== ritual.card ||
      nextRitual.cards !== ritual.cards
    ) {
      queueMicrotask(() => {
        setRitual(nextRitual);
      });
      return;
    }

    if (!ritual.question && !ritual.card && !ritual.cards) {
      router.replace(
        `/ai-guide/ask?mode=${ritual.mode}&spread=${ritual.spread}&orientation=upright&lang=${ritual.lang}`,
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
  const threeCardItems = ritual.cards
    .split(",")
    .map((cardId) => getTarotCardById(cardId.trim()))
    .filter((tarotCard): tarotCard is NonNullable<typeof tarotCard> =>
      Boolean(tarotCard),
    );
  const threeCardPositions = [
    copy.threeCardSituation,
    copy.threeCardChallenge,
    copy.threeCardGuidance,
  ];

  if (ritual.mode === "physical" && ritual.spread === "single") {
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
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <LuminousNav lang={initialLang} />

        <header className="space-y-4 text-center">
          <div className="rule mx-auto max-w-xs">
            <span className="eyebrow">
              {copy.physicalCardMode}
            </span>
          </div>
          <h1 className="t-h1">
            {copy.revealPhysicalTitle}
          </h1>
          <p className="caption mx-auto max-w-[31rem]">
            {copy.revealPhysicalDescription}
          </p>
        </header>

        <div className="space-y-5 pb-8">
          {tarotCardGroups.map((group) => (
            <section
              key={group.title}
              className="card p-3"
            >
              <h2 className="eyebrow mb-3 px-1">
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
      </LuminousShell>
    );
  }

  if (ritual.spread === "three-card" && threeCardItems.length === 3) {
    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <LuminousNav lang={initialLang} />

        <header className="space-y-4 text-center">
          <div className="rule mx-auto max-w-xs">
            <span className="eyebrow">
              {copy.threeCardSpread}
            </span>
          </div>
          <h1 className="t-h1">
            {copy.threeCardsAreDrawn}
          </h1>
          <p className="caption mx-auto max-w-[31rem]">
            {copy.threeCardsAreDrawnDescription}
          </p>
        </header>

        <section className="card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {threeCardItems.map((threeCard, index) => (
              <article
                className="well p-4 text-center"
                key={`${threeCard.id}-${threeCardPositions[index]}`}
              >
                <p className="eyebrow text-[0.62rem]">
                  {threeCardPositions[index]}
                </p>
                <div className="mx-auto mt-4 w-20">
                  {threeCard.image ? (
                    <Image
                      src={threeCard.image}
                      alt={`${getTarotCardTitle(threeCard, initialLang)} tarot card`}
                      width={160}
                      height={284}
                      className="block h-auto w-full rounded-[0.7rem] border border-[var(--c-border)] object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[9/16] w-full items-center justify-center rounded-[0.7rem] border border-[var(--c-border)] bg-[var(--c-surface)] p-1">
                      <span className="font-serif text-[0.68rem] leading-tight text-[var(--c-text)]">
                        {getTarotCardTitle(threeCard, initialLang)}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="t-h3 mt-4">
                  {getTarotCardTitle(threeCard, initialLang)}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <LuminousAction href={buildResultHref(ritual)}>
          {copy.openReading}
        </LuminousAction>
      </LuminousShell>
    );
  }

  if (!ritual.card || !card) {
    const title = ritual.card ? copy.invalidReadingTitle : copy.noCardDrawn;
    const description = ritual.card
      ? copy.invalidReadingDescription
      : copy.noCardDrawnDescription;

    return (
      <LuminousShell lang={initialLang} hasLangParam={hasLangParam}>
        <LuminousNav lang={initialLang} />

        <section className="card my-auto p-6 text-center">
          <p className="eyebrow">
            {copy.onlineDrawMode}
          </p>
          <h1 className="t-h2 mt-4">
            {title}
          </h1>
          <p className="caption mt-4">
            {description}
          </p>
          <div className="mt-6 space-y-3">
            <LuminousAction
              href={`/ai-guide/draw?mode=online&spread=${ritual.spread}&orientation=upright&question=${encodeURIComponent(
                ritual.question,
              )}&lang=${initialLang}`}
            >
              {copy.backToDraw}
            </LuminousAction>
            <LuminousAction href={`/ai-guide?lang=${initialLang}`} variant="ghost">
              {copy.returnToReadingRoom}
            </LuminousAction>
          </div>
        </section>
      </LuminousShell>
    );
  }

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
          {copy.cardIsDrawn}
        </h1>
        <p className="caption mx-auto max-w-[31rem]">
          {copy.cardIsDrawnDescription}
        </p>
      </header>

      <section className="card p-5 text-center sm:p-6">
        <LuminousRevealCard />

        <div
          className={`transition-all duration-500 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <p className="eyebrow mt-2">
            {copy.onlineDeck}
          </p>
          <p className="caption mx-auto mt-2 max-w-[24rem]">
            {copy.onlineDeckDescription}
          </p>
        </div>

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
      </section>

      <div
        className={`transition-all duration-500 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <LuminousAction href={buildResultHref(ritual)}>
          {copy.openReading}
        </LuminousAction>
      </div>
    </LuminousShell>
  );
}

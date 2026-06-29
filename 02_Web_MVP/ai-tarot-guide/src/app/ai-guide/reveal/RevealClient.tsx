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
    <main className="ora-guide-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_96%,transparent),color-mix(in_srgb,var(--c-bg)_92%,var(--c-surface)_8%)_42%,color-mix(in_srgb,var(--c-border)_56%,transparent)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/16 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[23rem] w-[23rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/20 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-[13rem] w-[13rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/34 opacity-80" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[color:var(--c-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-[color:var(--c-surface)]/45 blur-3xl" />
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
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const buttonClassName =
    variant === "ghost"
      ? "ora-guide-button ora-guide-button-ghost w-full touch-manipulation select-none"
      : "ora-guide-button ora-guide-button-primary w-full touch-manipulation select-none";

  return (
    <Link className={`${buttonClassName} ${className}`} href={href}>
      {children}
    </Link>
  );
}

function LuminousRevealCard() {
  return (
    <div className="relative mx-auto h-[27rem] w-full max-w-[25rem]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-accent)]/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-accent)]/26" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-72 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[color:var(--c-accent)]/32 to-transparent" />

      <div className="absolute left-1/2 top-8 h-[21rem] w-52 -translate-x-1/2 rounded-[1.65rem] border border-[color:var(--c-border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c-surface)_96%,var(--c-bg)_4%),color-mix(in_srgb,var(--c-surface-well)_84%,var(--c-bg)_16%))] shadow-[0_32px_75px_color-mix(in_srgb,var(--c-text)_14%,transparent),0_0_80px_color-mix(in_srgb,var(--c-accent)_18%,transparent)]">
        <div className="absolute inset-4 rounded-[1.25rem] border border-[color:var(--c-border)]/48" />
        <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/42" />
        <div className="absolute bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/34" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[color:var(--c-accent)]/52" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--c-accent)]/58" />
        <div className="absolute inset-x-9 top-1/2 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/40 to-transparent" />
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
          <div className="mx-auto flex items-center justify-center gap-3 text-[color:var(--c-accent)]">
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.physicalCardMode}
            </span>
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
          </div>
          <h1 className="font-serif text-[2.55rem] leading-tight text-[color:var(--c-text)] sm:text-[3rem]">
            {copy.revealPhysicalTitle}
          </h1>
          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.revealPhysicalDescription}
          </p>
        </header>

        <div className="space-y-5 pb-8">
          {tarotCardGroups.map((group) => (
            <section
              key={group.title}
              className="ora-guide-panel rounded-[1.5rem] p-3 backdrop-blur-md"
            >
              <h2 className="mb-3 px-1 text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--c-accent)]">
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
          <div className="mx-auto flex items-center justify-center gap-3 text-[color:var(--c-accent)]">
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.threeCardSpread}
            </span>
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
          </div>
          <h1 className="font-serif text-[2.6rem] leading-tight text-[color:var(--c-text)] sm:text-[3.25rem]">
            {copy.threeCardsAreDrawn}
          </h1>
          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.threeCardsAreDrawnDescription}
          </p>
        </header>

        <section className="ora-guide-altar rounded-[2rem] p-5 backdrop-blur-md sm:p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {threeCardItems.map((threeCard, index) => (
              <article
                className="rounded-[1.15rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/44 p-4 text-center"
                key={`${threeCard.id}-${threeCardPositions[index]}`}
              >
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[color:var(--c-accent)]">
                  {threeCardPositions[index]}
                </p>
                <div className="mx-auto mt-4 w-20">
                  {threeCard.image ? (
                    <Image
                      src={threeCard.image}
                      alt={`${getTarotCardTitle(threeCard, initialLang)} tarot card`}
                      width={160}
                      height={284}
                      className="block h-auto w-full rounded-[0.7rem] border border-[color:var(--c-border)]/50 object-cover shadow-[0_16px_32px_rgba(116,83,36,0.16)]"
                    />
                  ) : (
                    <div className="flex aspect-[9/16] w-full items-center justify-center rounded-[0.7rem] border border-[color:var(--c-border)]/50 bg-[color:var(--c-surface)]/86 p-1 shadow-[0_16px_32px_rgba(116,83,36,0.14)]">
                      <span className="font-serif text-[0.68rem] leading-tight text-[color:var(--c-text)]">
                        {getTarotCardTitle(threeCard, initialLang)}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="mt-4 font-serif text-xl leading-tight text-[color:var(--c-text)]">
                  {getTarotCardTitle(threeCard, initialLang)}
                </h2>
              </article>
            ))}
          </div>
        </section>

        <LuminousAction className="mx-auto w-full max-w-[28rem]" href={buildResultHref(ritual)}>
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

        <section className="ora-guide-panel my-auto rounded-[1.5rem] p-6 text-center backdrop-blur-md">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
            {copy.onlineDrawMode}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--c-text)]">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--c-text-soft)]">
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
        <div className="mx-auto flex items-center justify-center gap-3 text-[color:var(--c-accent)]">
          <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
            {copy.onlineDrawMode}
          </span>
          <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
        </div>
        <h1 className="font-serif text-[2.6rem] leading-tight text-[color:var(--c-text)] sm:text-[3.25rem]">
          {copy.cardIsDrawn}
        </h1>
        <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
          {copy.cardIsDrawnDescription}
        </p>
      </header>

      <section className="ora-guide-altar rounded-[2rem] p-5 text-center backdrop-blur-md sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[color:var(--c-accent)]/20" />

        <LuminousRevealCard />

        <div
          className={`transition-all duration-500 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <p className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--c-accent)]">
            {copy.onlineDeck}
          </p>
          <p className="mx-auto mt-2 max-w-[24rem] text-sm leading-6 text-[color:var(--c-text-soft)]">
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
        <LuminousAction className="mx-auto w-full max-w-[28rem]" href={buildResultHref(ritual)}>
          {copy.openReading}
        </LuminousAction>
      </div>
    </LuminousShell>
  );
}

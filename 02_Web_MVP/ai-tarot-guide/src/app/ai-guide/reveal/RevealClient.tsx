"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import {
  getTarotCardById,
  getTarotCardTitle,
  type TarotCard,
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
}: RevealClientProps): RitualState {
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
  stage = false,
}: {
  children: ReactNode;
  lang: Language;
  stage?: boolean;
}) {
  return (
    <main
      className={`ora-guide-shell relative overflow-hidden ${
        stage ? "h-[100dvh]" : "min-h-svh px-0 py-0 sm:px-6 sm:py-6 lg:px-8"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_96%,transparent),color-mix(in_srgb,var(--c-bg)_92%,var(--c-surface)_8%)_42%,color-mix(in_srgb,var(--c-border)_56%,transparent)_100%)]" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[color:var(--c-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-[color:var(--c-surface)]/45 blur-3xl" />
      <Link
        aria-label={lang === "zh" ? "退出揭牌" : "Exit reveal"}
        className="fixed right-3 top-3 z-[1600] flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--c-accent)]/42 bg-[color:var(--c-surface)]/82 text-xl leading-none text-[color:var(--c-accent)] shadow-[0_10px_26px_color-mix(in_srgb,var(--c-text)_10%,transparent)] backdrop-blur-md transition hover:border-[color:var(--c-accent)]/68 hover:bg-[color:var(--c-surface)] sm:right-5 sm:top-5"
        href={`/ai-guide?lang=${lang}`}
      >
        ×
      </Link>

      <div
        className={`relative z-10 mx-auto flex w-full max-w-[720px] flex-col ${
          stage
            ? "h-[100dvh] gap-0 px-5 py-4 sm:px-6 sm:py-5"
            : "min-h-svh gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9"
        }`}
      >
        {children}
      </div>
    </main>
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

function RevealCardBack() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.45rem] border border-[color:var(--c-accent)]/58 bg-[linear-gradient(155deg,color-mix(in_srgb,var(--card-face)_96%,var(--c-surface)),color-mix(in_srgb,var(--c-surface-well)_58%,var(--card-face)))] shadow-[0_22px_58px_color-mix(in_srgb,var(--c-text)_15%,transparent),inset_0_0_0_8px_color-mix(in_srgb,var(--c-surface)_38%,transparent),inset_0_0_0_9px_color-mix(in_srgb,var(--c-accent)_20%,transparent)] [backface-visibility:hidden]">
      <span className="pointer-events-none absolute inset-4 rounded-[1rem] border border-[color:var(--c-accent)]/24" />
      <span className="pointer-events-none absolute left-1/2 top-[44%] h-[34%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-accent)]/44" />
      <span className="pointer-events-none absolute left-1/2 top-[44%] h-px w-[62%] -translate-x-1/2 bg-[color:var(--c-accent)]/30" />
      <span className="pointer-events-none absolute left-1/2 top-[44%] h-[12%] w-[12%] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[color:var(--c-accent)]/52" />
    </div>
  );
}

function RevealCardFront({
  card,
  lang,
}: {
  card: TarotCard;
  lang: Language;
}) {
  const title = getTarotCardTitle(card, lang);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[1.45rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface)] shadow-[0_24px_64px_color-mix(in_srgb,var(--c-text)_16%,transparent)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
      {card.image ? (
        <Image
          src={card.image}
          alt={`${title} tarot card`}
          width={360}
          height={640}
          priority
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c-surface)_96%,var(--c-bg)_4%),color-mix(in_srgb,var(--c-surface-well)_88%,var(--c-bg)_12%))] p-5 text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--c-accent)]">
            Ora Arcana
          </p>
          <h2 className="mt-4 font-serif text-2xl leading-tight text-[color:var(--c-text)]">
            {title}
          </h2>
        </div>
      )}
    </div>
  );
}

function RevealRitualCard({
  card,
  index,
  isRevealed,
  lang,
  total,
  onReveal,
}: {
  card: TarotCard;
  index: number;
  isRevealed: boolean;
  lang: Language;
  total: number;
  onReveal: () => void;
}) {
  const title = getTarotCardTitle(card, lang);
  const fanClassName =
    total === 3
      ? index === 0
        ? "-rotate-6 sm:-translate-y-1"
        : index === 2
          ? "rotate-6 sm:-translate-y-1"
          : "sm:-translate-y-4"
      : "";
  const sizeClassName =
    total === 1
      ? "w-[clamp(12.5rem,52vw,18rem)]"
      : "w-[clamp(6.8rem,28vw,15rem)]";

  return (
    <button
      aria-label={
        isRevealed
          ? `${title} revealed`
          : lang === "zh"
            ? `翻开${title}`
            : `Reveal ${title}`
      }
      aria-pressed={isRevealed}
      className={`group relative aspect-[9/16] ${sizeClassName} touch-manipulation select-none rounded-[1.45rem] outline-none transition-transform duration-500 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)]/70 motion-reduce:transition-none ${fanClassName}`}
      onClick={onReveal}
      style={{ transitionDelay: isRevealed ? `${index * 90}ms` : "0ms" }}
      type="button"
    >
      <span
        className={`absolute inset-0 rounded-[1.45rem] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] [transform-style:preserve-3d] motion-reduce:duration-0 ${
          isRevealed ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        }`}
        style={{ transitionDelay: isRevealed ? `${index * 110}ms` : "0ms" }}
      >
        <RevealCardBack />
        <RevealCardFront card={card} lang={lang} />
      </span>
    </button>
  );
}

function RevealRitualStage({
  cards,
  lang,
  onCompleteHref,
  spread,
}: {
  cards: TarotCard[];
  lang: Language;
  onCompleteHref: string;
  spread: "single" | "three-card";
}) {
  const router = useRouter();
  const [isRevealed, setIsRevealed] = useState(false);
  const isThreeCardSpread = spread === "three-card";
  const instruction = isThreeCardSpread
    ? lang === "zh"
      ? "点击这些牌，翻开它们。"
      : "Tap the cards to reveal them."
    : lang === "zh"
      ? "点击这张牌，翻开它。"
      : "Tap the card to reveal it.";
  const openingCopy =
    lang === "zh" ? "正在开启你的解读…" : "Opening your reading…";

  useEffect(() => {
    if (!isRevealed) {
      return;
    }

    const prefersReducedMotion =
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const timer = setTimeout(() => {
      router.push(onCompleteHref);
    }, prefersReducedMotion ? 650 : 2500);

    return () => clearTimeout(timer);
  }, [isRevealed, onCompleteHref, router]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-7 px-3 py-8 text-center sm:gap-8">
      <header className="max-w-[34rem] space-y-3">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
          {isThreeCardSpread
            ? lang === "zh"
              ? "三张牌阵"
              : "Three-card spread"
            : lang === "zh"
              ? "线上抽牌"
              : "Online draw"}
        </p>
        <h1 className="font-serif text-[2.45rem] leading-tight text-[color:var(--c-text)] sm:text-[3.1rem]">
          {instruction}
        </h1>
        <p
          className={`text-sm leading-6 text-[color:var(--c-text-soft)] transition-opacity duration-300 motion-reduce:transition-none ${
            isRevealed ? "opacity-100" : "opacity-70"
          }`}
        >
          {isRevealed ? openingCopy : " "}
        </p>
      </header>

      <div
        className={`flex w-full max-w-[46rem] items-center justify-center ${
          isThreeCardSpread ? "gap-2 sm:gap-5" : ""
        }`}
      >
        {cards.map((revealCard, index) => (
          <RevealRitualCard
            card={revealCard}
            index={index}
            isRevealed={isRevealed}
            key={`${revealCard.id}-${index}`}
            lang={lang}
            onReveal={() => setIsRevealed(true)}
            total={cards.length}
          />
        ))}
      </div>
    </section>
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
      <LuminousShell lang={initialLang}>
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
      <LuminousShell lang={initialLang} stage>
        <RevealRitualStage
          cards={threeCardItems}
          lang={initialLang}
          onCompleteHref={buildResultHref(ritual)}
          spread="three-card"
        />
      </LuminousShell>
    );
  }

  if (!ritual.card || !card) {
    const title = ritual.card ? copy.invalidReadingTitle : copy.noCardDrawn;
    const description = ritual.card
      ? copy.invalidReadingDescription
      : copy.noCardDrawnDescription;

    return (
      <LuminousShell lang={initialLang}>
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
    <LuminousShell lang={initialLang} stage>
      <RevealRitualStage
        cards={[card]}
        lang={initialLang}
        onCompleteHref={buildResultHref(ritual)}
        spread="single"
      />
    </LuminousShell>
  );
}

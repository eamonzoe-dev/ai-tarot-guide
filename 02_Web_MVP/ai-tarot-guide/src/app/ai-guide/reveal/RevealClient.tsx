"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { CardChoice } from "@/components/ai-guide/CardChoice";
import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
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
}: Omit<RevealClientProps, "hasLangParam">): RitualState {
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

function LuminousShell({ children }: { children: ReactNode }) {
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
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
}) {
  const className =
    variant === "ghost"
      ? "flex min-h-12 touch-manipulation select-none items-center justify-center rounded-full border border-[#c89d4f]/45 bg-white/45 px-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#6f552b] shadow-[0_14px_32px_rgba(148,105,39,0.10)] transition hover:-translate-y-0.5 hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/35 focus:ring-offset-2 focus:ring-offset-[#f6f0e5]"
      : "flex min-h-12 touch-manipulation select-none items-center justify-center rounded-full border border-[#c89d4f]/70 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#3a2a18] shadow-[0_18px_38px_rgba(148,105,39,0.22),inset_0_1px_0_rgba(255,255,255,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(148,105,39,0.26),inset_0_1px_0_rgba(255,255,255,0.62)] focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#f6f0e5]";

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

function LuminousRevealCard() {
  return (
    <div className="relative mx-auto h-[24rem] w-full max-w-[22rem]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d2b06d]/20" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d2b06d]/26" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-64 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa664]/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#caa664]/32 to-transparent" />

      <div className="absolute left-1/2 top-8 h-[19rem] w-48 -translate-x-1/2 rounded-[1.65rem] border border-[#cfa85e]/52 bg-[#fffaf0]/88 shadow-[0_32px_75px_rgba(121,84,30,0.18),0_0_80px_rgba(211,178,109,0.24),inset_0_1px_0_rgba(255,255,255,0.78)]">
        <div className="absolute inset-4 rounded-[1.25rem] border border-[#d8bd82]/48" />
        <div className="absolute left-1/2 top-10 h-20 w-20 -translate-x-1/2 rounded-full border border-[#d8bd82]/42" />
        <div className="absolute bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border border-[#d8bd82]/34" />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#cfa85e]/52" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cfa85e]/58" />
        <div className="absolute inset-x-9 top-1/2 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/40 to-transparent" />
      </div>
    </div>
  );
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
      queueMicrotask(() => {
        setRitual(nextRitual);
      });
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
      <LuminousShell>
        <LuminousNav
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

        <header className="space-y-4 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 text-[#a77f3c]">
            <span className="h-px w-10 bg-[#d2b06d]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.physicalCardMode}
            </span>
            <span className="h-px w-10 bg-[#d2b06d]/55" />
          </div>
          <h1 className="font-serif text-[2.55rem] leading-tight text-[#34271b] sm:text-[3rem]">
            {copy.revealPhysicalTitle}
          </h1>
          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[#7b6c58]">
            {copy.revealPhysicalDescription}
          </p>
        </header>

        <div className="space-y-5 pb-8">
          {tarotCardGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-[1.75rem] border border-[#d8bd82]/45 bg-[#fffaf1]/74 p-3 shadow-[0_18px_50px_rgba(116,83,36,0.08)] backdrop-blur-md"
            >
              <h2 className="mb-3 px-1 text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
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

  if (!ritual.card || !card) {
    const title = ritual.card ? copy.invalidReadingTitle : copy.noCardDrawn;
    const description = ritual.card
      ? copy.invalidReadingDescription
      : copy.noCardDrawnDescription;

    return (
      <LuminousShell>
        <LuminousNav
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

        <section className="my-auto rounded-[2rem] border border-[#d8bd82]/45 bg-[#fffaf1]/74 p-6 text-center shadow-[0_24px_70px_rgba(116,83,36,0.10)] backdrop-blur-md">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
            {copy.onlineDrawMode}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#34271b]">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#7b6c58]">
            {description}
          </p>
          <div className="mt-6 space-y-3">
            <LuminousAction
              href={`/ai-guide/draw?mode=online&spread=single&orientation=upright&question=${encodeURIComponent(
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
    <LuminousShell>
      <LuminousNav
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

      <header className="space-y-4 text-center">
        <div className="mx-auto flex items-center justify-center gap-3 text-[#a77f3c]">
          <span className="h-px w-10 bg-[#d2b06d]/55" />
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
            {copy.onlineDrawMode}
          </span>
          <span className="h-px w-10 bg-[#d2b06d]/55" />
        </div>
        <h1 className="font-serif text-[2.6rem] leading-tight text-[#34271b] sm:text-[3.25rem]">
          {copy.cardIsDrawn}
        </h1>
        <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[#7b6c58]">
          {copy.cardIsDrawnDescription}
        </p>
      </header>

      <section className="relative overflow-hidden rounded-[2.25rem] border border-[#cfad6d]/50 bg-[#fffdf7]/82 p-5 text-center shadow-[0_28px_80px_rgba(111,78,31,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:p-6">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/60 to-transparent" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#d2b06d]/20" />

        <LuminousRevealCard />

        <p className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
          {copy.onlineDeck}
        </p>
        <p className="mx-auto mt-2 max-w-[24rem] text-sm leading-6 text-[#7b6c58]">
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
      </section>

      <LuminousAction href={buildResultHref(ritual)}>
        {copy.openReading}
      </LuminousAction>
    </LuminousShell>
  );
}

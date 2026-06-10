"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import {
  getTarotCardById,
  getTarotCardKeywords,
  getTarotCardLabel,
  getTarotCardTitle,
} from "@/data/tarotCards";
import {
  LANGUAGE_STORAGE_KEY,
  type Language,
  text,
  withLang,
} from "@/lib/ai-guide/i18n";

const SELECTED_CARD_KEY = "aiTarot:selectedCard";
const USER_QUESTION_KEY = "aiTarot:userQuestion";
const READING_MODE_KEY = "aiTarot:readingMode";
const READING_SPREAD_KEY = "aiTarot:readingSpread";
const CARD_ORIENTATION_KEY = "aiTarot:cardOrientation";
const LATEST_RITUAL_KEY = "aiTarot:latestRitual";

type ResultClientProps = {
  initialMode: "physical" | "online" | "";
  initialSpread: string;
  initialCard: string;
  initialOrientation: string;
  initialQuestion: string;
  initialLang: Language;
  hasLangParam: boolean;
};

const READING_LABEL_PATTERN =
  /^(Core Message|What This Means For Your Question|What To Notice|A Practical Next Step):\s*/i;

function cleanParagraph(paragraph: string) {
  return paragraph.replace(READING_LABEL_PATTERN, "").trim();
}

type StoredRitual = {
  mode?: "physical" | "online";
  spread?: string;
  orientation?: string;
  question?: string;
  card?: string;
  lang?: Language;
};

function readStoredRitual(): StoredRitual {
  const rawRitual = localStorage.getItem(LATEST_RITUAL_KEY);

  if (!rawRitual) {
    return {};
  }

  try {
    return JSON.parse(rawRitual) as StoredRitual;
  } catch {
    return {};
  }
}

export function ResultClient({
  initialMode,
  initialSpread,
  initialCard,
  initialOrientation,
  initialQuestion,
  initialLang,
  hasLangParam,
}: ResultClientProps) {
  const router = useRouter();
  const copy = text(initialLang);
  const [mode, setMode] = useState<"physical" | "online" | undefined>(
    initialMode || undefined,
  );
  const [spread, setSpread] = useState<string | undefined>(
    initialSpread || undefined,
  );
  const [orientation, setOrientation] = useState<string | undefined>(
    initialOrientation || undefined,
  );
  const [selectedCard, setSelectedCard] = useState<string | null | undefined>(
    initialCard || undefined,
  );
  const [question, setQuestion] = useState<string | null | undefined>(
    initialQuestion || undefined,
  );
  const card = selectedCard ? getTarotCardById(selectedCard) : undefined;

  useEffect(() => {
    const storedRitual = readStoredRitual();
    const storedMode = localStorage.getItem(READING_MODE_KEY);
    const storedSpread = localStorage.getItem(READING_SPREAD_KEY);
    const storedSelectedCard = localStorage.getItem(SELECTED_CARD_KEY);
    const storedOrientation = localStorage.getItem(CARD_ORIENTATION_KEY);
    const storedUserQuestion = localStorage.getItem(USER_QUESTION_KEY);
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const resolvedMode =
      initialMode ||
      storedRitual.mode ||
      (storedMode === "online" ? "online" : "physical");
    const resolvedSpread =
      initialSpread || storedRitual.spread || storedSpread || "single";
    const resolvedCard = initialCard || storedRitual.card || storedSelectedCard;
    const resolvedOrientation =
      initialOrientation ||
      storedRitual.orientation ||
      storedOrientation ||
      "upright";
    const resolvedQuestion =
      initialQuestion || storedRitual.question || storedUserQuestion;
    const resolvedLang =
      hasLangParam || !storedLanguage
        ? initialLang
        : storedLanguage === "zh"
          ? "zh"
          : "en";

    if (initialMode) {
      localStorage.setItem(READING_MODE_KEY, initialMode);
    }

    if (initialCard) {
      localStorage.setItem(SELECTED_CARD_KEY, initialCard);
    }

    if (initialSpread) {
      localStorage.setItem(READING_SPREAD_KEY, initialSpread);
    }

    if (initialOrientation) {
      localStorage.setItem(CARD_ORIENTATION_KEY, initialOrientation);
    }

    if (initialQuestion) {
      localStorage.setItem(USER_QUESTION_KEY, initialQuestion);
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLang);

    if (resolvedQuestion || resolvedCard) {
      localStorage.setItem(
        LATEST_RITUAL_KEY,
        JSON.stringify({
          mode: resolvedMode,
          spread: resolvedSpread,
          orientation: resolvedOrientation,
          question: resolvedQuestion,
          card: resolvedCard,
          lang: resolvedLang,
        }),
      );
    }

    queueMicrotask(() => {
      setMode(resolvedMode);
      setSpread(resolvedSpread);
      setSelectedCard(resolvedCard);
      setOrientation(resolvedOrientation);
      setQuestion(resolvedQuestion);
    });

    if (!resolvedCard) {
      router.replace(
        resolvedMode === "online"
          ? `/ai-guide/draw?mode=online${
              resolvedQuestion
                ? `&spread=single&orientation=upright&question=${encodeURIComponent(
                    resolvedQuestion,
                  )}`
                : ""
            }&lang=${initialLang}`
          : `/ai-guide/reveal?mode=physical&spread=single&orientation=upright${
              resolvedQuestion
                ? `&question=${encodeURIComponent(resolvedQuestion)}`
                : ""
            }&lang=${initialLang}`,
      );
    }
  }, [
    initialMode,
    initialSpread,
    initialCard,
    initialOrientation,
    initialQuestion,
    initialLang,
    hasLangParam,
    router,
  ]);

  if (
    mode === undefined ||
    spread === undefined ||
    selectedCard === undefined ||
    orientation === undefined ||
    question === undefined
  ) {
    return (
      <PageContainer
        eyebrow={copy.readingDossier}
        title={copy.readingCard}
        description={copy.gatheringReading}
      >
        <ReadingNav lang={initialLang} />
        <p className="text-sm text-[#a9a59d]">{copy.preparingMessage}</p>
      </PageContainer>
    );
  }

  if (!card) {
    return (
      <PageContainer
        eyebrow={copy.readingDossier}
        title={copy.invalidReadingTitle}
        description={copy.invalidReadingDescription}
      >
        <ReadingNav lang={initialLang} />
        <div className="mb-5 flex justify-end">
          <LanguageToggle
            lang={initialLang}
            pathname="/ai-guide/result"
            params={{
              mode,
              spread,
              orientation,
              question: question ?? undefined,
              card: selectedCard ?? undefined,
            }}
            hasLangParam={hasLangParam}
          />
        </div>
        <Link
          className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center border border-[#b08c58]/70 bg-[linear-gradient(180deg,#2a1d15,#120d0a)] px-5 text-center text-xs font-semibold uppercase tracking-[0.24em] text-[#f0eadf] shadow-[0_12px_28px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,235,204,0.12),inset_0_-1px_0_rgba(0,0,0,0.72)]"
          href={withLang("/ai-guide", {}, initialLang)}
        >
          {copy.returnToReadingRoom}
        </Link>
      </PageContainer>
    );
  }

  const modeLabel =
    mode === "online" ? copy.onlineDrawMode : copy.physicalCardMode;
  const readingTypeLabel =
    spread === "single" ? copy.singleCardReading : copy.singleCardReading;
  const orientationLabel =
    orientation === "upright" ? copy.upright : copy.upright;
  const cardLabel = getTarotCardLabel(card, initialLang);
  const cardTitle = getTarotCardTitle(card, initialLang);
  const cardKeywords = getTarotCardKeywords(card, initialLang);
  const questionText = question || copy.noQuestion;
  const reflectionPrompt =
    card.reflectionQuestion || copy.reflectionFallback;
  const homeHref = withLang("/ai-guide", {}, initialLang);

  return (
    <main className="atelier-page relative min-h-screen overflow-hidden text-zinc-100">
      <div className="atelier-grain pointer-events-none absolute inset-0" />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 lg:py-14">
        <header className="atelier-label relative flex items-center justify-between text-xs font-semibold">
          <p>{copy.readingDossier}</p>
          <p>{mode === "online" ? copy.onlineDrawMode : copy.physicalDeck}</p>
        </header>
        <div className="relative mt-6">
          <ReadingNav lang={initialLang} />
          <div className="flex justify-end">
            <LanguageToggle
              lang={initialLang}
              pathname="/ai-guide/result"
              params={{
                mode,
                spread,
                orientation,
                question: question ?? undefined,
                card: selectedCard ?? undefined,
              }}
              hasLangParam={hasLangParam}
            />
          </div>
        </div>

        <div className="relative mt-8 grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-16">
          <aside className="lg:col-span-2">
            <div className="text-center lg:sticky lg:top-10">
              <div className="ritual-result-stage-1 atelier-worktop mx-auto max-w-xs p-4">
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={`${cardTitle} tarot card`}
                    width={320}
                    height={569}
                    priority
                    className="mx-auto block h-auto w-36 border border-[#4a3b28] object-cover shadow-[0_22px_48px_rgba(0,0,0,0.55)] sm:w-44 lg:w-60 xl:w-64"
                  />
                ) : (
                  <div className="mx-auto flex aspect-[9/16] w-36 items-center justify-center border border-[#4a3b28] bg-[linear-gradient(160deg,#17110d,#070707)] p-4 shadow-[0_22px_48px_rgba(0,0,0,0.55)] sm:w-44 lg:w-60 xl:w-64">
                    <div className="flex h-full w-full flex-col justify-between border border-[#8c724b]/70 p-5 text-center">
                      <span className="atelier-label text-xs font-semibold">
                        {cardLabel}
                      </span>
                      <span className="font-serif text-3xl leading-tight text-[#efe8d9]">
                        {cardTitle}
                      </span>
                      <span className="text-xs uppercase tracking-[0.24em] text-[#bca77f]">
                        {card.rank}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <p className="ritual-result-stage-1 atelier-label mt-6 text-xs font-semibold">
                {cardLabel}
              </p>
              <h1 className="ritual-result-stage-1 mt-2 font-serif text-4xl leading-tight text-zinc-100 sm:text-5xl">
                {cardTitle}
              </h1>
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="ritual-result-stage-2 atelier-paper p-5 lg:p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d5532]">
                {copy.yourQuestion}
              </h2>
              <p className="mt-3 text-base leading-7 text-[#17110d] sm:text-lg">
                {questionText}
              </p>
            </div>

            <div className="ritual-result-stage-2 atelier-panel mt-4 border-[#a98552]/35 p-5">
              <h2 className="atelier-label text-xs font-semibold">
                {copy.readingDossier}
              </h2>
              <div className="mt-4 grid gap-4 text-sm leading-6 sm:grid-cols-3">
                <div>
                  <p className="text-[#bca77f]">{copy.readingType}</p>
                  <p className="mt-1 text-zinc-100">{readingTypeLabel}</p>
                </div>
                <div>
                  <p className="text-[#bca77f]">{copy.readingMode}</p>
                  <p className="mt-1 text-zinc-100">{modeLabel}</p>
                </div>
                <div>
                  <p className="text-[#bca77f]">{copy.cardOrientation}</p>
                  <p className="mt-1 text-zinc-100">{orientationLabel}</p>
                </div>
              </div>
            </div>

            <div className="ritual-result-stage-3 atelier-panel mt-4 p-5">
              <h2 className="atelier-label text-xs font-semibold">
                {copy.theCard}
              </h2>
              <p className="mt-3 font-serif text-2xl leading-tight text-zinc-100">
                {cardTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#bca77f]">
                {cardLabel} / {card.rank}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {cardKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="border border-[#4a3b28] bg-[#0f0b08] px-3 py-1 text-xs text-[#d8c9ae]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#c8c0b4]">
                {cleanParagraph(card.coreMeaning)}
              </p>
            </div>

            <div className="ritual-result-stage-4 mt-4 space-y-4">
              <section className="atelier-paper-dark p-5">
                <h2 className="atelier-label text-xs font-semibold">
                  {copy.readingReflection}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-zinc-200 sm:text-base sm:leading-8">
                  In relation to your question, {card.reflection}
                </p>
              </section>

              <section className="atelier-paper-dark p-5">
                <h2 className="atelier-label text-xs font-semibold">
                  {copy.quietSuggestion}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-zinc-200 sm:text-base sm:leading-8">
                  {card.suggestion}
                </p>
              </section>

              <section className="atelier-paper-dark p-5">
                <h2 className="atelier-label text-xs font-semibold">
                  {copy.reflectionPrompt}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-zinc-200 sm:text-base sm:leading-8">
                  {cleanParagraph(reflectionPrompt).replace(/^Ask yourself:\s*/i, "")}
                </p>
              </section>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                className="flex min-h-12 touch-manipulation items-center justify-center border border-[#3f4e47] bg-[linear-gradient(180deg,#111715,#090b0a)] px-5 text-center text-xs font-semibold uppercase tracking-widest text-zinc-200 shadow-[0_10px_24px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#7d927d] hover:bg-zinc-900"
                href={`/ai-guide/ask?mode=${
                  mode ?? "physical"
                }&spread=single&orientation=upright&lang=${initialLang}`}
              >
                {copy.continueToQuestion}
              </Link>
              <Link
                className="flex min-h-12 touch-manipulation items-center justify-center border border-[#3f4e47] bg-[linear-gradient(180deg,#111715,#090b0a)] px-5 text-center text-xs font-semibold uppercase tracking-widest text-zinc-200 shadow-[0_10px_24px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-[#7d927d] hover:bg-zinc-900"
                href={homeHref}
              >
                {copy.startAnotherReading}
              </Link>
            </div>

            <section className="mt-4 border-t border-[#3d3020] pt-5">
              <h2 className="atelier-label text-xs font-semibold">
                {copy.closingNote}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#9f947f]">
                {copy.closingReflection}
              </p>
              <p className="mt-4 text-xs leading-5 text-[#777063]">
                {copy.disclaimer}
              </p>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { EmailSignInPanel } from "@/components/ai-guide/EmailSignInPanel";
import { GalaxyBackground } from "@/components/ai-guide/GalaxyBackground";
import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { ReadingThinkingState } from "@/components/ai-guide/ReadingThinkingState";
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
const AI_READING_CACHE_PREFIX = "aiTarot:aiReading:v1";

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

type AiReading = {
  fullReading?: string;
  summary?: string;
  directAnswer?: string;
  cardMessage?: string;
  situationReading?: string;
  hiddenTension?: string;
  advice?: string;
  nextStep?: string;
  reflectionQuestion?: string;
  closingNote?: string;
  cardMeaning?: string;
};

type AiReadingStatus = "idle" | "loading" | "ready" | "error";

type AiReadingApiErrorCode =
  | "auth_required"
  | "daily_limit_reached"
  | "no_credits_remaining"
  | "insufficient_credits"
  | "quota_check_failed"
  | "credits_check_failed"
  | "credit_consume_failed"
  | "usage_record_failed";

type AiReadingApiErrorPayload = {
  error?: unknown;
  code?: unknown;
};

function getAiReadingErrorMessage(code: string | undefined) {
  switch (code) {
    case "auth_required":
      return "Please sign in to generate your AI reading.";
    case "daily_limit_reached":
      return "You have reached today's free AI reading limit.";
    case "no_credits_remaining":
    case "insufficient_credits":
      return "You do not have enough AI readings. Please redeem a deck code to continue.";
    case "quota_check_failed":
    case "credits_check_failed":
    case "credit_consume_failed":
    case "usage_record_failed":
      return "AI reading quota check failed. Please try again later.";
    default:
      return "AI reading request failed.";
  }
}

async function readAiReadingApiError(response: Response) {
  try {
    const payload = (await response.json()) as AiReadingApiErrorPayload;
    const code = typeof payload.code === "string" ? payload.code : undefined;
    const message =
      typeof payload.error === "string"
        ? payload.error
        : getAiReadingErrorMessage(code);

    return {
      code: code as AiReadingApiErrorCode | undefined,
      message: code ? getAiReadingErrorMessage(code) : message,
    };
  } catch {
    return {
      code: undefined,
      message: "AI reading request failed.",
    };
  }
}

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

function firstText(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim().length > 0)?.trim() ?? "";
}

function normalizeAiReadingForDisplay(reading: AiReading) {
  const cardMessage = firstText(reading.cardMessage, reading.cardMeaning);

  return {
    fullReading: firstText(reading.fullReading),
    summary: firstText(reading.summary),
    directAnswer: firstText(reading.directAnswer, reading.summary),
    cardMessage,
    situationReading: firstText(reading.situationReading),
    hiddenTension: firstText(reading.hiddenTension, reading.situationReading),
    advice: firstText(reading.advice),
    nextStep: firstText(reading.nextStep, reading.advice),
    reflectionQuestion: firstText(reading.reflectionQuestion),
    closingNote: firstText(reading.closingNote),
  };
}

function isDisplayableAiReading(value: unknown): value is AiReading {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reading = value as AiReading;
  const display = normalizeAiReadingForDisplay(reading);
  return Boolean(
    display.fullReading ||
      (display.summary &&
        display.directAnswer &&
        display.situationReading &&
        display.advice),
  );
}

function buildFallbackFullReading(
  aiDisplay: ReturnType<typeof normalizeAiReadingForDisplay>,
) {
  return [
    aiDisplay.directAnswer,
    aiDisplay.situationReading,
    aiDisplay.hiddenTension,
    aiDisplay.advice,
    aiDisplay.nextStep,
    aiDisplay.closingNote,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function splitReadingParagraphs(reading: string) {
  return reading
    .split(/\n{2,}|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
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
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [aiReadingStatus, setAiReadingStatus] =
    useState<AiReadingStatus>("idle");
  const [aiReadingErrorMessage, setAiReadingErrorMessage] = useState<
    string | null
  >(null);
  const [aiRetryKey, setAiRetryKey] = useState(0);
  const card = selectedCard ? getTarotCardById(selectedCard) : undefined;

  useEffect(() => {
    if (!card || !question || !mode || orientation !== "upright") {
      setAiReading(null);
      setAiReadingStatus("idle");
      setAiReadingErrorMessage(null);
      return;
    }

    const cacheKey = [
      AI_READING_CACHE_PREFIX,
      initialLang,
      mode,
      orientation,
      card.id,
      question,
    ].join(":");
    const cachedReading = sessionStorage.getItem(cacheKey);

    if (cachedReading) {
      try {
        const parsedCachedReading = JSON.parse(cachedReading) as unknown;

        if (!isDisplayableAiReading(parsedCachedReading)) {
          sessionStorage.removeItem(cacheKey);
        } else {
          setAiReading(parsedCachedReading);
          setAiReadingStatus("ready");
          return;
        }
      } catch {
        sessionStorage.removeItem(cacheKey);
      }
    }

    const cachedFailureKey = `${cacheKey}:error`;
    sessionStorage.removeItem(cachedFailureKey);

    const controller = new AbortController();
    setAiReading(null);
    setAiReadingStatus("loading");
    setAiReadingErrorMessage(null);

    fetch("/api/ai-reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardId: card.id,
        question,
        lang: initialLang,
        mode,
        orientation,
        spread: "single",
      }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          const apiError = await readAiReadingApiError(response);
          throw new Error(apiError.message);
        }

        return response.json() as Promise<{ reading?: AiReading }>;
      })
      .then((payload) => {
        if (!payload.reading || !isDisplayableAiReading(payload.reading)) {
          throw new Error("AI reading response was empty.");
        }

        sessionStorage.setItem(cacheKey, JSON.stringify(payload.reading));
        setAiReading(payload.reading);
        setAiReadingStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setAiReading(null);
        setAiReadingErrorMessage(
          error instanceof Error
            ? error.message
            : "AI reading request failed.",
        );
        setAiReadingStatus("error");
      });

    return () => {
      controller.abort();
    };
  }, [card, question, mode, orientation, initialLang, aiRetryKey]);

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
          className="ritual-action-link"
          href={withLang("/ai-guide", {}, initialLang)}
        >
          {copy.returnToReadingRoom}
        </Link>
      </PageContainer>
    );
  }

  const modeLabel =
    mode === "online" ? copy.onlineDrawMode : copy.physicalCardMode;
  const orientationLabel =
    orientation === "upright" ? copy.upright : copy.upright;
  const cardLabel = getTarotCardLabel(card, initialLang);
  const cardTitle = getTarotCardTitle(card, initialLang);
  const cardKeywords = getTarotCardKeywords(card, initialLang);
  const questionText = question || copy.noQuestion;
  const reflectionPrompt =
    card.reflectionQuestion || copy.reflectionFallback;
  const practicalAdvice = card.practicalAdvice || card.suggestion;
  const homeHref = withLang("/ai-guide", {}, initialLang);
  const displayKeywords = cardKeywords.slice(0, 2);
  const aiDisplay = aiReading
    ? normalizeAiReadingForDisplay(aiReading)
    : undefined;
  const fullReadingText = aiDisplay
    ? firstText(
        aiDisplay.fullReading,
        buildFallbackFullReading(aiDisplay),
      )
    : "";
  const readingParagraphs = fullReadingText
    ? splitReadingParagraphs(fullReadingText)
    : [];
  const referenceItems =
    initialLang === "zh"
      ? [
          {
            title: copy.coreInterpretation,
            body: `${cardTitle}的辅助关键词是：${cardKeywords
              .slice(0, 4)
              .join("、")}。牌面资料只作为参考，具体判断以上方本次解读为主。`,
          },
          {
            title: copy.situationMapping,
            body: "先观察这些关键词是否对应你正在经历的处境，不要把牌义当成固定答案。",
          },
          {
            title: copy.reflectionPrompt,
            body: copy.reflectionFallback,
          },
          {
            title: copy.quietSuggestion,
            body: "把最有触动的一个关键词写下来，再对照你的问题看它指向哪个选择、边界或行动。",
          },
        ]
      : [
          {
            title: copy.coreInterpretation,
            body: cleanParagraph(card.coreMeaning),
          },
          {
            title: copy.situationMapping,
            body: cleanParagraph(card.uprightMessage),
          },
          {
            title: copy.reflectionPrompt,
            body: cleanParagraph(reflectionPrompt).replace(
              /^Ask yourself:\s*/i,
              "",
            ),
          },
          {
            title: copy.quietSuggestion,
            body: cleanParagraph(practicalAdvice),
          },
        ];
  return (
    <main className="atelier-page relative min-h-svh overflow-hidden px-0 py-0 text-[#eee8dd] sm:px-6 sm:py-6 lg:px-8">
      <GalaxyBackground opacity={0.2} />
      <div className="atelier-grain pointer-events-none absolute inset-0" />
      <div className="ritual-room-container relative mx-auto min-h-svh w-full max-w-6xl px-5 py-8 sm:min-h-0 sm:px-6 lg:py-12">
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

        <section className="ritual-result-stage-1 relative mt-6 border-b border-[#3d3020] pb-5">
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 shrink-0 sm:w-16">
                {card.image ? (
                  <Image
                    src={card.image}
                    alt={`${cardTitle} tarot card`}
                    width={320}
                    height={569}
                    priority
                    className="block h-auto w-full rounded-[0.55rem] border border-[#d9bd80]/28 object-cover shadow-[0_12px_28px_rgba(0,0,0,0.42)]"
                  />
                ) : (
                  <div className="flex aspect-[9/16] w-full items-center justify-center rounded-[0.55rem] border border-[#d9bd80]/28 bg-[linear-gradient(160deg,#17110d,#070707)] p-1 shadow-[0_12px_28px_rgba(0,0,0,0.42)]">
                    <div className="flex h-full w-full items-center justify-center rounded-[0.4rem] border border-[#8c724b]/60 p-1 text-center">
                      <span className="font-serif text-[0.68rem] leading-tight text-[#efe8d9]">
                        {cardTitle}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="atelier-label text-[0.62rem] font-semibold">
                  {copy.theCard}
                </p>
                <h1 className="mt-1 font-serif text-xl leading-tight text-[#f4efe5] sm:text-2xl">
                  {cardTitle}
                </h1>
                <p className="mt-1 text-xs leading-5 text-[#bca77f]">
                  {cardLabel}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <h2 className="atelier-label text-[0.62rem] font-semibold">
                {copy.yourQuestion}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#efe8d9] sm:text-base">
                {questionText}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#6d5a35]/55 bg-[#0f0b08]/55 px-3 py-1 text-[0.66rem] text-[#c9b895]">
                  {modeLabel} / {orientationLabel}
                </span>
                {displayKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-[#314433]/55 bg-[#0b120d]/55 px-3 py-1 text-[0.66rem] text-[#aebdaa]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="ritual-result-stage-2 relative mx-auto mt-8 max-w-[840px]">
          {aiReadingStatus === "loading" ? (
            <ReadingThinkingState
              subtitle={copy.aiReadingLoading}
              title={copy.aiReadingTitle}
            />
          ) : null}

          {aiReadingStatus === "error" ? (
            <div className="mt-6 border-l border-[#d9bd80]/45 pl-4">
              <p className="text-sm leading-6 text-[#d8c9ae]">
                {aiReadingErrorMessage || copy.aiReadingUnavailable}
              </p>
              {aiReadingErrorMessage ===
              "Please sign in to generate your AI reading." ? (
                <div className="mt-4">
                  <EmailSignInPanel reason="Sign in to generate your AI reading." />
                </div>
              ) : null}
              <button
                className="ritual-action-link mt-4 w-full sm:w-auto"
                type="button"
                onClick={() => {
                  if (card && question && mode) {
                    const retryCacheKey = [
                      AI_READING_CACHE_PREFIX,
                      initialLang,
                      mode,
                      orientation,
                      card.id,
                      question,
                    ].join(":");
                    sessionStorage.removeItem(retryCacheKey);
                    sessionStorage.removeItem(`${retryCacheKey}:error`);
                  }

                  setAiRetryKey((value) => value + 1);
                }}
              >
                {copy.aiRetryReading}
              </button>
            </div>
          ) : null}

          {aiReadingStatus === "ready" && aiDisplay ? (
            <article className="border border-[#d9bd80]/24 bg-[linear-gradient(180deg,rgba(17,13,10,0.9),rgba(7,7,6,0.96))] px-5 py-6 shadow-[0_22px_58px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,245,224,0.05)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <p className="atelier-label text-[0.68rem] font-semibold">
                {copy.aiPersonalizedReading}
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-[#f7efdf] sm:text-4xl">
                {copy.aiReadingTitle}
              </h2>

              {aiDisplay.summary ? (
                <p className="mt-6 border-l border-[#d9bd80]/45 pl-4 font-serif text-[1.15rem] leading-8 text-[#f5ecd9] sm:text-[1.35rem] sm:leading-9">
                  {aiDisplay.summary}
                </p>
              ) : null}

              <div className="mt-7 space-y-6 text-[15px] leading-8 text-[#ddd5c8] sm:text-base sm:leading-9">
                {readingParagraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph.slice(0, 16)}`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {aiDisplay.reflectionQuestion ? (
                <div className="mt-8 border-t border-[#3d3020] pt-5">
                  <p className="atelier-label text-[0.68rem] font-semibold">
                    {copy.aiReflectionQuestion}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#e5dbc9] sm:text-base">
                    {aiDisplay.reflectionQuestion}
                  </p>
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl border border-[#3d3020] bg-[#070706]/70 p-3 sm:flex sm:items-center sm:gap-3">
                <input
                  className="min-h-11 w-full rounded-full border border-[#3d3020] bg-[#0d0a08]/80 px-4 text-sm text-[#837866] outline-none"
                  disabled
                  placeholder={copy.aiFollowUpPlaceholder}
                  type="text"
                />
                <button
                  className="ritual-action-link mt-3 w-full opacity-55 sm:mt-0 sm:w-auto"
                  disabled
                  type="button"
                >
                  {copy.aiFollowUpSoon}
                </button>
              </div>
            </article>
          ) : null}
        </section>

        <details className="ritual-result-stage-3 atelier-panel relative mt-5 p-5">
          <summary className="cursor-pointer select-none list-none">
            <span className="atelier-label text-xs font-semibold">
              {copy.cardReference}
            </span>
            <span className="mt-2 block text-sm leading-6 text-[#bca77f]">
              {copy.showCardReference}
            </span>
          </summary>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {referenceItems.map((item) => (
              <section
                key={item.title}
                className="border-t border-[#3d3020] pt-4"
              >
                <h3 className="atelier-label text-[0.68rem] font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#a9a095]">
                  {item.body}
                </p>
              </section>
            ))}
          </div>
        </details>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            className="ritual-action-link"
            href={`/ai-guide/ask?mode=${
              mode ?? "physical"
            }&spread=single&orientation=upright&lang=${initialLang}`}
          >
            {copy.continueToQuestion}
          </Link>
          <Link className="ritual-action-link" href={homeHref}>
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
      </div>
    </main>
  );
}

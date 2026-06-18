"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { EmailSignInPanel } from "@/components/ai-guide/EmailSignInPanel";
import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
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
const AI_READING_CACHE_PREFIX = "aiTarot:aiReading:v1";
const AI_READING_CLIENT_REQUEST_PREFIX = "aiTarot:aiReadingRequest:v1";
const CREDITS_UPDATED_EVENT = "ora-arcana:credits-updated";
const activeAiReadingRequests = new Set<string>();

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
  fallback?: boolean;
  readingSource?: "system_fallback";
  fallbackReason?: "upstream_failure";
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
  | "reading_log_failed"
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
    case "reading_log_failed":
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

function LuminousShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#f6f0e5] px-0 py-0 text-[#352a1f] sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.98),rgba(246,240,229,0.9)_42%,rgba(226,213,188,0.48)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-[#c9a86a]/16 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[23rem] w-[23rem] -translate-x-1/2 rounded-full border border-[#d8bd82]/20 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-[13rem] w-[13rem] -translate-x-1/2 rounded-full border border-[#ead7aa]/34 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[44rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#caa664]/20 to-transparent" />
      <div className="pointer-events-none absolute left-6 top-28 h-24 w-px bg-gradient-to-b from-transparent via-[#c9a86a]/28 to-transparent sm:left-14" />
      <div className="pointer-events-none absolute right-6 top-40 h-24 w-px bg-gradient-to-b from-transparent via-[#c9a86a]/28 to-transparent sm:right-14" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[#d7bd82]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-white/42 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[900px] flex-col gap-5 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
        {children}
      </div>
    </main>
  );
}

function LuminousPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-[#d8bd82]/42 bg-[linear-gradient(180deg,rgba(255,250,241,0.92),rgba(248,241,229,0.86))] shadow-[0_24px_70px_rgba(116,83,36,0.10),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-md ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/60 to-transparent" />
      {children}
    </section>
  );
}

function LuminousActionLink({
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
  const base =
    "flex min-h-12 touch-manipulation select-none items-center justify-center rounded-full px-5 text-center text-xs font-semibold uppercase tracking-[0.2em] transition focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#f6f0e5]";
  const primary =
    "border border-[#c89d4f]/72 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] text-[#3a2a18] shadow-[0_18px_38px_rgba(148,105,39,0.22),inset_0_1px_0_rgba(255,255,255,0.58)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(148,105,39,0.26),inset_0_1px_0_rgba(255,255,255,0.65)]";
  const ghost =
    "border border-[#c89d4f]/42 bg-white/50 text-[#6f552b] shadow-[0_14px_32px_rgba(148,105,39,0.10)] hover:-translate-y-0.5 hover:bg-white/72";

  return (
    <Link
      className={`${base} ${variant === "ghost" ? ghost : primary} ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}

function LuminousTag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[#d8bd82]/48 bg-[#fffaf1]/88 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#8d6426] ${className}`}
    >
      {children}
    </span>
  );
}

function LuminousThinkingState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <LuminousPanel className="mt-6 px-5 py-6 sm:px-7 sm:py-8">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="relative h-28 w-20 rounded-[1rem] border border-[#d7bd82]/38 bg-[linear-gradient(180deg,rgba(255,250,241,0.98),rgba(242,231,211,0.88))] shadow-[0_0_36px_rgba(217,189,128,0.12)]"
        >
          <div className="absolute inset-2 rounded-[0.75rem] border border-[#d8bd82]/44" />
          <div className="absolute inset-x-2 top-4 h-px bg-gradient-to-r from-transparent via-[#caa664]/40 to-transparent" />
          <div className="absolute inset-x-3 bottom-4 h-px bg-gradient-to-r from-transparent via-[#caa664]/30 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9bd80]/22" />
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[#a77f3c]">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-7 text-[#7b6c58]">
          {subtitle}
        </p>
      </div>
    </LuminousPanel>
  );
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

function isFallbackAiReading(reading: AiReading | null | undefined) {
  return (
    reading?.fallback === true || reading?.readingSource === "system_fallback"
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

function createClientRequestId() {
  const browserCrypto = globalThis.crypto;

  if (browserCrypto?.randomUUID) {
    return browserCrypto.randomUUID();
  }

  if (browserCrypto?.getRandomValues) {
    return `${Date.now().toString(36)}-${Array.from(
      browserCrypto.getRandomValues(new Uint32Array(2)),
    ).join("-")}`;
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getStableClientRequestId(cacheKey: string, retryKey: number) {
  const storageKey = `${AI_READING_CLIENT_REQUEST_PREFIX}:${cacheKey}:${retryKey}`;
  const existingRequestId = sessionStorage.getItem(storageKey);

  if (existingRequestId) {
    return existingRequestId;
  }

  const nextRequestId = createClientRequestId();
  sessionStorage.setItem(storageKey, nextRequestId);
  return nextRequestId;
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
  const inFlightAiReadingKeyRef = useRef<string | null>(null);
  const card = selectedCard ? getTarotCardById(selectedCard) : undefined;

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

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

      const requestKey = `${cacheKey}:${aiRetryKey}`;

      if (
        inFlightAiReadingKeyRef.current === requestKey ||
        activeAiReadingRequests.has(requestKey)
      ) {
        return;
      }

      const clientRequestId = getStableClientRequestId(cacheKey, aiRetryKey);
      inFlightAiReadingKeyRef.current = requestKey;
      activeAiReadingRequests.add(requestKey);
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
          clientRequestId,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const apiError = await readAiReadingApiError(response);
            throw new Error(apiError.message);
          }

          return response.json() as Promise<{
            reading?: AiReading;
            credits?: unknown;
            fallback?: boolean;
          }>;
        })
        .then((payload) => {
          if (!payload.reading || !isDisplayableAiReading(payload.reading)) {
            throw new Error("AI reading response was empty.");
          }

          const nextReading =
            payload.fallback || isFallbackAiReading(payload.reading)
              ? {
                  ...payload.reading,
                  fallback: true,
                  readingSource: "system_fallback" as const,
                  fallbackReason:
                    payload.reading.fallbackReason || "upstream_failure",
                }
              : payload.reading;

          sessionStorage.setItem(cacheKey, JSON.stringify(nextReading));
          setAiReading(nextReading);
          setAiReadingStatus("ready");
          window.dispatchEvent(new Event(CREDITS_UPDATED_EVENT));
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
        })
        .finally(() => {
          if (inFlightAiReadingKeyRef.current === requestKey) {
            inFlightAiReadingKeyRef.current = null;
          }
          activeAiReadingRequests.delete(requestKey);
        });
      });

    return () => {
      isCancelled = true;
      // Keep the in-flight guard active across React dev remounts.
      // The request result is idempotent server-side via clientRequestId.
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
      <LuminousShell>
        <LuminousPanel className="my-auto px-6 py-8 text-center">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
            {copy.readingDossier}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#34271b]">
            {copy.readingCard}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#7b6c58]">
            {copy.gatheringReading}
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-[#d8bd82]/38 bg-white/46 px-4 py-3">
            <ReadingNav lang={initialLang} />
          </div>
          <p className="mt-5 text-sm text-[#80715d]">
            {copy.preparingMessage}
          </p>
        </LuminousPanel>
      </LuminousShell>
    );
  }

  if (!card) {
    return (
      <LuminousShell>
        <LuminousPanel className="my-auto px-6 py-8 text-center">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
            {copy.readingDossier}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#34271b]">
            {copy.invalidReadingTitle}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#7b6c58]">
            {copy.invalidReadingDescription}
          </p>
          <div className="mt-6 rounded-[1.5rem] border border-[#d8bd82]/38 bg-white/46 px-4 py-3">
            <ReadingNav lang={initialLang} />
            <div className="mt-3 flex justify-end">
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
          <LuminousActionLink
            className="mt-6"
            href={withLang("/ai-guide", {}, initialLang)}
          >
            {copy.returnToReadingRoom}
          </LuminousActionLink>
        </LuminousPanel>
      </LuminousShell>
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
  const isFallbackDisplay = isFallbackAiReading(aiReading);
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
    <LuminousShell>
      <header className="flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
        <span>{copy.readingDossier}</span>
        <span className="text-right">
          {mode === "online" ? copy.onlineDrawMode : copy.physicalDeck}
        </span>
      </header>

      <div className="rounded-[2rem] border border-[#d7bd82]/40 bg-white/42 px-4 py-3 shadow-[0_18px_60px_rgba(123,93,45,0.08)] backdrop-blur-md">
        <ReadingNav lang={initialLang} />
        <div className="mt-3 flex justify-end">
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

      <LuminousPanel className="p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#d2b06d]/20" />
        <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 shrink-0 sm:w-20">
              {card.image ? (
                <Image
                  src={card.image}
                  alt={`${cardTitle} tarot card`}
                  width={320}
                  height={569}
                  priority
                  className="block h-auto w-full rounded-[0.7rem] border border-[#d8bd82]/50 object-cover shadow-[0_18px_36px_rgba(116,83,36,0.16)]"
                />
              ) : (
                <div className="flex aspect-[9/16] w-full items-center justify-center rounded-[0.7rem] border border-[#d8bd82]/50 bg-[#fffaf0]/86 p-1 shadow-[0_18px_36px_rgba(116,83,36,0.14)]">
                  <div className="flex h-full w-full items-center justify-center rounded-[0.5rem] border border-[#d8bd82]/48 p-1 text-center">
                    <span className="font-serif text-[0.68rem] leading-tight text-[#3f3021]">
                      {cardTitle}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
                {copy.theCard}
              </p>
              <h1 className="mt-1 font-serif text-2xl leading-tight text-[#34271b] sm:text-3xl">
                {cardTitle}
              </h1>
              <p className="mt-1 text-xs leading-5 text-[#8b765a]">
                {cardLabel}
              </p>
            </div>
          </div>

          <div className="min-w-0 border-t border-[#d8bd82]/35 pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <h2 className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
              {copy.yourQuestion}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#4f4334] sm:text-base">
              {questionText}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <LuminousTag>{modeLabel} / {orientationLabel}</LuminousTag>
              {displayKeywords.map((keyword) => (
                <LuminousTag
                  key={keyword}
                  className="bg-white/58 text-[#7b6c58]"
                >
                  {keyword}
                </LuminousTag>
              ))}
            </div>
          </div>
        </div>
      </LuminousPanel>

      <section className="mx-auto w-full max-w-[820px]">
        {aiReadingStatus === "loading" ? (
          <LuminousThinkingState
            subtitle={copy.aiReadingLoading}
            title={copy.aiReadingTitle}
          />
        ) : null}

        {aiReadingStatus === "error" ? (
          <div className="mt-6 rounded-[1.75rem] border border-[#c48a73]/42 bg-[#fff5ed]/82 p-5 shadow-[0_20px_54px_rgba(137,83,54,0.10)] backdrop-blur-md sm:p-6">
            <p className="text-sm leading-7 text-[#8a4634]">
              {aiReadingErrorMessage || copy.aiReadingUnavailable}
            </p>
            {aiReadingErrorMessage ===
            "Please sign in to generate your AI reading." ? (
              <div className="mt-4">
                <EmailSignInPanel reason="Sign in to generate your AI reading." />
              </div>
            ) : null}
            <button
              className="mt-4 min-h-12 w-full touch-manipulation select-none rounded-full border border-[#c89d4f]/70 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#3a2a18] shadow-[0_18px_38px_rgba(148,105,39,0.20),inset_0_1px_0_rgba(255,255,255,0.58)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#f6f0e5] sm:w-auto"
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
          <article className="mt-6 rounded-[2.2rem] border border-[#cfad6d]/52 bg-[linear-gradient(180deg,rgba(255,253,247,0.96),rgba(250,244,233,0.92))] px-5 py-7 shadow-[0_30px_86px_rgba(111,78,31,0.13),inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur-md sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/60 to-transparent" />
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a77f3c]">
              {copy.aiPersonalizedReading}
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#34271b] sm:text-4xl">
              {copy.aiReadingTitle}
            </h2>

            {isFallbackDisplay ? (
              <div className="mt-5 rounded-[1.35rem] border border-[#d8bd82]/42 bg-[#fffaf1]/76 p-4 text-sm leading-6 text-[#6f624f]">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#9d7b3f]">
                  {copy.aiFallbackNoticeTitle}
                </p>
                <p className="mt-2">{copy.aiFallbackNoticeBody}</p>
              </div>
            ) : null}

            {aiDisplay.summary ? (
              <p className="mt-6 border-l border-[#c89d4f]/55 bg-[#fffaf1]/72 py-2 pl-4 font-serif text-[1.15rem] leading-8 text-[#4a3827] sm:text-[1.35rem] sm:leading-9">
                {aiDisplay.summary}
              </p>
            ) : null}

            <div className="mt-7 space-y-6 text-[15px] leading-8 text-[#4f4334] sm:text-base sm:leading-9">
              {readingParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 16)}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            {aiDisplay.reflectionQuestion ? (
              <div className="mt-8 border-t border-[#d8bd82]/42 pt-5">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
                  {copy.aiReflectionQuestion}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#4f4334] sm:text-base">
                  {aiDisplay.reflectionQuestion}
                </p>
              </div>
            ) : null}

            <div className="mt-6 rounded-[1.4rem] border border-[#d8bd82]/38 bg-[#fffaf0]/70 p-3 sm:flex sm:items-center sm:gap-3">
              <input
                className="min-h-11 w-full rounded-full border border-[#d8bd82]/45 bg-white/64 px-4 text-sm text-[#8b7a61] outline-none placeholder:text-[#9d8f78]"
                disabled
                placeholder={copy.aiFollowUpPlaceholder}
                type="text"
              />
              <button
                className="mt-3 min-h-11 w-full rounded-full border border-[#d8bd82]/45 bg-white/46 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8d6426] opacity-60 sm:mt-0 sm:w-auto"
                disabled
                type="button"
              >
                {copy.aiFollowUpSoon}
              </button>
            </div>
          </article>
        ) : null}
      </section>

      <details className="relative mt-1 overflow-hidden rounded-[1.85rem] border border-[#d8bd82]/42 bg-[#fffaf1]/72 p-5 shadow-[0_20px_58px_rgba(116,83,36,0.09)] backdrop-blur-md">
        <summary className="cursor-pointer select-none list-none">
          <span className="block text-xs font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
            {copy.cardReference}
          </span>
          <span className="mt-2 block text-sm leading-6 text-[#7b6c58]">
            {copy.showCardReference}
          </span>
        </summary>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {referenceItems.map((item) => (
            <section
              key={item.title}
              className="border-t border-[#d8bd82]/38 pt-4"
            >
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#a77f3c]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6f624f]">
                {item.body}
              </p>
            </section>
          ))}
        </div>
      </details>

      <div className="grid gap-3 sm:grid-cols-2">
        <LuminousActionLink
          href={`/ai-guide/ask?mode=${
            mode ?? "physical"
          }&spread=single&orientation=upright&lang=${initialLang}`}
        >
          {copy.continueToQuestion}
        </LuminousActionLink>
        <LuminousActionLink href={homeHref} variant="ghost">
          {copy.startAnotherReading}
        </LuminousActionLink>
      </div>

      <section className="rounded-[1.75rem] border border-[#d8bd82]/32 bg-white/34 p-5 backdrop-blur-md">
        <h2 className="text-xs font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
          {copy.closingNote}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6f624f]">
          {copy.closingReflection}
        </p>
        <p className="mt-4 text-xs leading-5 text-[#8b7a61]">
          {copy.disclaimer}
        </p>
      </section>
    </LuminousShell>
  );
}

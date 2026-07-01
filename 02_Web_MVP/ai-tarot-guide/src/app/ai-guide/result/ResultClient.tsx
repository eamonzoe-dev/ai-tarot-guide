"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { EmailSignInPanel } from "@/components/ai-guide/EmailSignInPanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { ResultFollowUpPanel } from "@/components/ai-guide/ResultFollowUpPanel";
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
const CLARIFY_NOTE_MAX_LENGTH = 180;
const activeAiReadingRequests = new Set<string>();

const resultDisplayCopy = {
  en: {
    readingSummary: "Reading Stage",
    aiReading: "AI Reading",
    oraLabel: "ORA",
    userQuestion: "Your question",
    blockIcons: {
      overview: "I",
      card: "II",
      guidance: "III",
      relationship: "II",
      situation: "1",
      challenge: "2",
      integrated: "6",
      fallback: "!",
    },
    openingSingle: "I am reading this card through the question you brought here.",
    openingThree:
      "I am reading these three cards as a sequence: what is happening, what asks for attention, and what can guide you forward.",
    coreMessage: "Core message",
    cardAndQuestion: "Card Interpretation",
    spreadRelationship: "Spread Relationship",
    integratedGuidance: "Integrated Guidance",
    currentReminder: "Current reminder",
    nextSuggestion: "Guidance",
    overallReading: "Reading Overview",
    combinedAdvice: "How these cards speak together",
    context: "Context",
    fallbackTitle: "Backup reflection",
    fallbackBody:
      "Ora is temporarily unable to connect to the live reading. The reflection below is based on the card and your question, and will not use Stardust.",
    loadingStages: [
      "Organizing the reading overview...",
      "Connecting the card symbols...",
      "Shaping guidance and next steps...",
    ],
    loadingPatience: "Your reading is still being shaped. Please wait a little longer.",
  },
  zh: {
    readingSummary: "本次牌面舞台",
    aiReading: "本次解读",
    oraLabel: "ORA",
    userQuestion: "你的问题",
    blockIcons: {
      overview: "I",
      card: "II",
      guidance: "III",
      relationship: "II",
      situation: "1",
      challenge: "2",
      integrated: "6",
      fallback: "!",
    },
    openingSingle: "我会把你带来的问题，放回这张牌里一起看。",
    openingThree:
      "我会把这三张牌读成一个顺序：正在发生什么、哪里需要被看见，以及接下来可以怎样往前走。",
    coreMessage: "核心提示",
    cardAndQuestion: "牌面解读",
    spreadRelationship: "牌阵关系",
    integratedGuidance: "综合建议",
    currentReminder: "当前提醒",
    nextSuggestion: "指引与建议",
    overallReading: "解读概览",
    combinedAdvice: "这组牌合在一起的建议",
    context: "上下文",
    fallbackTitle: "备用反思",
    fallbackBody:
      "Ora 暂时无法连接实时解读。以下是基于牌面与问题生成的备用反思，不会消耗 Stardust。",
    loadingStages: [
      "正在整理解读概览……",
      "正在连接牌面象征……",
      "正在生成指引建议……",
    ],
    loadingPatience: "解读仍在生成中，请稍等。",
  },
} as const;

type ResultClientProps = {
  initialMode: "physical" | "online" | "";
  initialSpread: string;
  initialCard: string;
  initialCards: string;
  initialOrientation: string;
  initialQuestion: string;
  initialLang: Language;
  hasLangParam: boolean;
  initialClarifyId: string;
  initialClarifyLabel: string;
  initialClarifyFocus: string;
  initialClarifyNote: string;
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
  cards?: string;
  lang?: Language;
};

type AiReading = {
  fullReading?: string;
  summary?: string;
  directAnswer?: string;
  cardMessage?: string;
  situationReading?: string;
  challengeReading?: string;
  guidanceReading?: string;
  cardRelationship?: string;
  hiddenTension?: string;
  advice?: string;
  nextStep?: string;
  reflectionQuestion?: string;
  closingNote?: string;
  cardMeaning?: string;
  readingLang?: Language;
  spread?: "single" | "three-card";
  cards?: Array<{
    position: "situation" | "challenge" | "guidance";
    cardId: string;
    title: string;
  }>;
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
      return "Today's AI reading limit has been reached. Please try again later.";
    case "no_credits_remaining":
    case "insufficient_credits":
      return "You do not have enough Stardust for this reading. Redeem a deck code or add Stardust to continue.";
    case "quota_check_failed":
    case "credits_check_failed":
    case "credit_consume_failed":
    case "usage_record_failed":
    case "reading_log_failed":
      return "Stardust availability check failed. Please try again later.";
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
    challengeReading: firstText(reading.challengeReading),
    guidanceReading: firstText(reading.guidanceReading),
    cardRelationship: firstText(reading.cardRelationship),
    hiddenTension: firstText(reading.hiddenTension, reading.situationReading),
    advice: firstText(reading.advice),
    nextStep: firstText(reading.nextStep, reading.advice),
    reflectionQuestion: firstText(reading.reflectionQuestion),
    closingNote: firstText(reading.closingNote),
  };
}

function LuminousShell({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Language;
}) {
  return (
    <main className="ora-guide-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_96%,transparent),color-mix(in_srgb,var(--c-bg)_92%,var(--c-surface)_8%)_42%,color-mix(in_srgb,var(--c-border)_54%,transparent)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/16 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[23rem] w-[23rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/20 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-44 h-[13rem] w-[13rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/34 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[44rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/20 to-transparent" />
      <div className="pointer-events-none absolute left-6 top-28 h-24 w-px bg-gradient-to-b from-transparent via-[color:var(--c-border)]/28 to-transparent sm:left-14" />
      <div className="pointer-events-none absolute right-6 top-40 h-24 w-px bg-gradient-to-b from-transparent via-[color:var(--c-border)]/28 to-transparent sm:right-14" />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[color:var(--c-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-[color:var(--c-surface)]/42 blur-3xl" />
      <ActivationCodePanel lang={lang} />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[900px] flex-col gap-4 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
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
      className={`ora-guide-panel overflow-hidden rounded-[1.5rem] backdrop-blur-md ${className}`}
    >
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
    "ora-guide-button touch-manipulation select-none";
  const primary = "ora-guide-button-primary";
  const ghost = "ora-guide-button-ghost";

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
      className={`inline-flex items-center rounded-full border border-[color:var(--c-border)]/48 bg-[color:var(--c-surface)]/88 px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--c-accent)] ${className}`}
    >
      {children}
    </span>
  );
}

function LuminousThinkingState({
  cardImage,
  cardTitle,
  lang,
}: {
  cardImage?: string;
  cardTitle?: string;
  lang: Language;
}) {
  const ritualCopy = resultDisplayCopy[lang];
  const [stageIndex, setStageIndex] = useState(0);
  const [isPatient, setIsPatient] = useState(false);

  useEffect(() => {
    const stageTimer = window.setInterval(() => {
      setStageIndex((value) => (value + 1) % ritualCopy.loadingStages.length);
    }, 4000);
    const patienceTimer = window.setTimeout(() => {
      setIsPatient(true);
    }, 15000);

    return () => {
      window.clearInterval(stageTimer);
      window.clearTimeout(patienceTimer);
    };
  }, [ritualCopy.loadingStages.length]);

  return (
    <LuminousPanel className="ora-result-loading mt-6 px-5 py-7 sm:px-7 sm:py-9">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="ora-result-loading-card relative h-32 w-[5.75rem] overflow-hidden rounded-[1rem] border border-[color:var(--c-border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c-surface)_96%,var(--c-bg)_4%),color-mix(in_srgb,var(--c-surface-well)_84%,var(--c-bg)_16%))] shadow-[0_0_36px_color-mix(in_srgb,var(--c-accent)_14%,transparent)]"
        >
          {cardImage ? (
            <Image
              src={cardImage}
              alt=""
              fill
              sizes="92px"
              className="object-cover opacity-85"
            />
          ) : null}
          <div className="absolute inset-2 rounded-[0.75rem] border border-[color:var(--c-border)]/54 bg-[color:var(--c-surface)]/20" />
          <div className="absolute inset-x-2 top-4 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/50 to-transparent" />
          <div className="absolute inset-x-3 bottom-4 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/35 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-border)] bg-[color:var(--c-surface)]/30" />
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[color:var(--c-accent)]">
          {resultDisplayCopy[lang].aiReading}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-7 text-[color:var(--c-text)]">
          {ritualCopy.loadingStages[stageIndex]}
        </p>
        {cardTitle ? (
          <p className="mt-2 text-xs leading-5 text-[color:var(--c-text-soft)]">
            {cardTitle}
          </p>
        ) : null}
        {isPatient ? (
          <p className="mt-4 rounded-full border border-[color:var(--c-border)]/60 bg-[color:var(--c-surface)]/72 px-4 py-2 text-xs leading-5 text-[color:var(--c-text-soft)]">
            {ritualCopy.loadingPatience}
          </p>
        ) : null}
        <div className="mt-7 w-full space-y-3" aria-hidden="true">
          <div className="ora-result-skeleton h-4 w-2/3 rounded-full" />
          <div className="ora-result-skeleton h-4 w-full rounded-full" />
          <div className="ora-result-skeleton h-4 w-5/6 rounded-full" />
        </div>
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
        display.situationReading &&
        display.challengeReading &&
        display.guidanceReading &&
        display.cardRelationship &&
        display.advice &&
        display.nextStep) ||
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

function getHighlightText(display: ReturnType<typeof normalizeAiReadingForDisplay>) {
  const source = firstText(
    display.summary,
    display.directAnswer,
    display.cardMessage,
    display.fullReading,
    buildFallbackFullReading(display),
  );
  const firstParagraph = splitReadingParagraphs(source)[0] ?? source;
  const firstSentence = firstParagraph.match(/^(.+?[.!?。！？])(\s|$)/)?.[1];

  return (firstSentence || firstParagraph).trim();
}

function uniqueBodies(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const normalized = value.trim();

    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
}

function splitMessageText(textValue: string, maxLength = 360) {
  const paragraphs = splitReadingParagraphs(textValue);
  const messages: string[] = [];

  paragraphs.forEach((paragraph) => {
    if (paragraph.length <= maxLength) {
      messages.push(paragraph);
      return;
    }

    const sentences = paragraph
      .split(/(?<=[.!?。！？])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    let current = "";

    sentences.forEach((sentence) => {
      if (`${current} ${sentence}`.trim().length > maxLength && current) {
        messages.push(current);
        current = sentence;
      } else {
        current = `${current} ${sentence}`.trim();
      }
    });

    if (current) {
      messages.push(current);
    }
  });

  return messages;
}

function getGuidanceItems(display: ReturnType<typeof normalizeAiReadingForDisplay>) {
  const source = uniqueBodies([display.advice, display.nextStep]).join("\n\n");
  const paragraphs = splitReadingParagraphs(source);

  if (paragraphs.length > 1) {
    return paragraphs.slice(0, 3).map(cleanParagraph);
  }

  const sentences = (paragraphs[0] || "")
    .split(/(?<=[.!?。！？])\s+/)
    .map((sentence) => cleanParagraph(sentence))
    .filter(Boolean);

  return (sentences.length > 1 ? sentences : paragraphs.map(cleanParagraph))
    .filter(Boolean)
    .slice(0, 3);
}

function getTheoryLine({
  arcana,
  keywords,
  lang,
  position,
  rank,
  suit,
  title,
}: {
  arcana: "major" | "minor";
  keywords: string[];
  lang: Language;
  position?: string;
  rank: string;
  suit: string;
  title: string;
}) {
  const keywordText = keywords.slice(0, 3).join(lang === "zh" ? "、" : ", ");
  const positionText = position
    ? lang === "zh"
      ? `在「${position}」的位置上，`
      : `In the ${position} position, `
    : "";

  if (lang === "zh") {
    if (arcana === "major") {
      return `${positionText}${title}属于大阿尔卡那，通常指向人生阶段、深层选择或意识转向；放在正位语境里，它会把注意力带向${keywordText}。`;
    }

    const rankText = rank ? `「${rank}」` : "这张牌";
    return `${positionText}${title}来自小阿尔卡那的${suit}牌组，${rankText}更贴近日常经验中的具体选择；正位时，它把问题带向${keywordText}。`;
  }

  if (arcana === "major") {
    return `${positionText}${title} is a Major Arcana card, so Ora reads it as a larger turning point or inner threshold. Upright, it draws attention to ${keywordText}.`;
  }

  const rankText = rank ? `the ${rank}` : "this card";
  return `${positionText}${title} belongs to the ${suit} suit, so ${rankText} brings the reading into practical lived experience. Upright, it points toward ${keywordText}.`;
}

function ReadingStage({
  cards,
  chips,
  lang,
  question,
  spreadLabel,
}: {
  cards: Array<{
    id: string;
    image?: string;
    label: string;
    title: string;
    position?: string;
  }>;
  chips: string[];
  lang: Language;
  question: string;
  spreadLabel: string;
}) {
  const ui = resultDisplayCopy[lang];
  const isThreeCard = cards.length > 1;

  return (
    <LuminousPanel className="ora-result-stage p-4 sm:p-5">
      <div
        className={`grid gap-4 ${
          isThreeCard
            ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
            : "sm:grid-cols-[7rem_minmax(0,1fr)]"
        } sm:items-center`}
      >
        <div
          className={`ora-result-stage-cards ${
            isThreeCard
              ? "grid grid-cols-3 gap-2 sm:gap-3"
              : "w-full max-w-[6.25rem]"
          }`}
        >
          {cards.map((cardItem) => (
            <article
              className={`ora-result-stage-card ${
                isThreeCard ? "p-2 sm:p-3" : "p-3"
              }`}
              key={cardItem.id}
            >
              <div className="relative aspect-[9/16] overflow-hidden rounded-[0.75rem] border border-[color:var(--c-border)]/54 bg-[color:var(--c-surface-well)]/70">
                {cardItem.image ? (
                  <Image
                    src={cardItem.image}
                    alt={`${cardItem.title} tarot card`}
                    fill
                    sizes={isThreeCard ? "160px" : "220px"}
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="mt-3 min-w-0 text-center">
                {cardItem.position ? (
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--c-accent)]">
                    {cardItem.position}
                  </p>
                ) : null}
                <h2 className="mt-1 font-serif text-base leading-tight text-[color:var(--c-text)] sm:text-xl">
                  {cardItem.title}
                </h2>
                <p className="mt-1 text-xs leading-5 text-[color:var(--c-text-soft)]">
                  {cardItem.label}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--c-accent)]">
              {ui.readingSummary}
            </p>
            <span className="rounded-full border border-[color:var(--c-border)]/60 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-text-dim)]">
              {spreadLabel}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[color:var(--c-text)] sm:text-[0.95rem]">
            {question}
          </p>
          {chips.length > 0 ? (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <LuminousTag
                    className="px-2.5 py-0.5 text-[0.6rem] normal-case tracking-[0.02em] text-[color:var(--c-text-soft)]"
                    key={chip}
                  >
                    {chip}
                  </LuminousTag>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LuminousPanel>
  );
}

function OraAvatar({ label }: { label: string }) {
  return (
    <div className="ora-result-avatar" aria-hidden="true">
      {label.slice(0, 1)}
    </div>
  );
}

function OraReadingBlock({
  children,
  icon,
  label,
  quote,
  title,
}: {
  children: ReactNode;
  icon: string;
  label: string;
  quote?: string;
  title: string;
}) {
  return (
    <section className="ora-result-block">
      <div className="ora-result-block-rail">
        <OraAvatar label={label} />
      </div>
      <div className="ora-result-block-body">
        <div className="ora-result-block-header">
          <div className="ora-result-block-title">
            <span className="ora-result-block-icon" aria-hidden="true">
              {icon}
            </span>
            <h2>{title}</h2>
          </div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--c-accent)]">
            {label}
          </p>
        </div>
        {quote ? <blockquote>{quote}</blockquote> : null}
        <div className="ora-result-block-content">{children}</div>
      </div>
    </section>
  );
}

function UserQuestionBubble({
  label,
  question,
}: {
  label: string;
  question: string;
}) {
  return (
    <div className="ora-result-message-row ora-result-message-row-user">
      <div className="min-w-0">
        <p className="mb-1 pr-2 text-right text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--c-text-dim)]">
          {label}
        </p>
        <div className="ora-result-bubble ora-result-bubble-user">
          {question}
        </div>
      </div>
    </div>
  );
}

function getThreeCardRelationLine({
  cardTitle,
  lang,
  otherCards,
  position,
}: {
  cardTitle: string;
  lang: Language;
  otherCards: string[];
  position?: string;
}) {
  const otherCardText = otherCards.join(lang === "zh" ? "、" : " and ");

  if (lang === "zh") {
    return `放在整组牌里，${cardTitle}不是单独给答案；它需要和${otherCardText}一起读，承担「${position || "当前位置"}」这一步的作用。`;
  }

  return `Within the full spread, ${cardTitle} is not read in isolation; it works with ${otherCardText} and carries the role of ${position || "this position"}.`;
}

function formatThreeCardBlockTitle({
  index,
  lang,
  position,
  title,
}: {
  index: number;
  lang: Language;
  position?: string;
  title: string;
}) {
  if (lang === "zh") {
    return `第${index + 1}张牌：${position || ""} · ${title}`;
  }

  return `Card ${index + 1}: ${position || ""} · ${title}`;
}

function AiReadingBlocks({
  display,
  isFallback,
  isThreeCard,
  lang,
  question,
  stageCards,
}: {
  display: ReturnType<typeof normalizeAiReadingForDisplay>;
  isFallback: boolean;
  isThreeCard: boolean;
  lang: Language;
  question: string;
  stageCards: Array<{
    arcana: "major" | "minor";
    keywords: string[];
    position?: string;
    rank: string;
    suit: string;
    title: string;
  }>;
}) {
  const ui = resultDisplayCopy[lang];
  const highlight = getHighlightText(display);
  const fallbackParagraphs = splitReadingParagraphs(
    firstText(display.fullReading, buildFallbackFullReading(display)),
  );
  const overviewBody = uniqueBodies([
    isThreeCard ? ui.openingThree : ui.openingSingle,
    firstText(display.summary, display.directAnswer, fallbackParagraphs[0]),
  ]).join("\n\n");
  const singleInterpretation = uniqueBodies([
    stageCards[0]
      ? getTheoryLine({ ...stageCards[0], lang })
      : "",
    display.cardMessage,
    display.situationReading,
    display.hiddenTension,
    fallbackParagraphs[1] ?? "",
  ]).join("\n\n");
  const threeInterpretation = stageCards
    .map((cardItem, index) => {
      const body = [
        getTheoryLine({ ...cardItem, lang }),
        [
          display.situationReading,
          display.challengeReading,
          display.guidanceReading,
        ][index],
        getThreeCardRelationLine({
          cardTitle: cardItem.title,
          lang,
          otherCards: stageCards
            .filter((_, cardIndex) => cardIndex !== index)
            .map((item) => item.title),
          position: cardItem.position,
        }),
      ]
        .filter(Boolean)
        .join("\n\n");

      return body
        ? {
            body,
            title: formatThreeCardBlockTitle({
              index,
              lang,
              position: cardItem.position,
              title: cardItem.title,
            }),
          }
        : null;
    })
    .filter((item): item is { body: string; title: string } => Boolean(item));
  const guidanceItems = getGuidanceItems(display);
  const guidanceIntro = uniqueBodies([
    isThreeCard ? display.cardRelationship : "",
    display.hiddenTension,
  ]).join("\n\n");
  const guidanceReflection = firstText(display.reflectionQuestion);
  const positionIcons = [
    ui.blockIcons.situation,
    ui.blockIcons.challenge,
    ui.blockIcons.guidance,
  ];

  function renderParagraphs(textValue: string) {
    return splitMessageText(textValue, 520).map((paragraph, index) => (
      <p key={`${paragraph.slice(0, 18)}-${index}`}>{cleanParagraph(paragraph)}</p>
    ));
  }

  const hasGuidance = guidanceIntro || guidanceItems.length > 0;
  const hasInterpretation =
    (isThreeCard && threeInterpretation.length > 0) ||
    (!isThreeCard && singleInterpretation);

  return (
    <article className="ora-result-conversation ora-result-reading mx-auto mt-6 w-full max-w-[820px]">
      <UserQuestionBubble label={ui.userQuestion} question={question} />

      {isFallback ? (
        <OraReadingBlock
          icon={ui.blockIcons.fallback}
          label={ui.oraLabel}
          title={ui.fallbackTitle}
        >
          <p>{ui.fallbackBody}</p>
        </OraReadingBlock>
      ) : null}

      <OraReadingBlock
        icon={ui.blockIcons.overview}
        label={ui.oraLabel}
        quote={highlight}
        title={ui.overallReading}
      >
        {renderParagraphs(overviewBody)}
      </OraReadingBlock>

      {isThreeCard ? (
        <>
          {display.cardRelationship ? (
            <OraReadingBlock
              icon={ui.blockIcons.relationship}
              label={ui.oraLabel}
              title={ui.spreadRelationship}
            >
              {renderParagraphs(display.cardRelationship)}
            </OraReadingBlock>
          ) : null}

          {threeInterpretation.map((item, index) => (
            <OraReadingBlock
              icon={positionIcons[index] || ui.blockIcons.card}
              key={item.title}
              label={ui.oraLabel}
              title={item.title}
            >
              {renderParagraphs(item.body)}
            </OraReadingBlock>
          ))}

          {hasGuidance ? (
            <OraReadingBlock
              icon={ui.blockIcons.integrated}
              label={ui.oraLabel}
              title={ui.integratedGuidance}
            >
              {guidanceItems.length > 0 ? (
                <ol className="ora-result-guidance-list">
                  {guidanceItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              ) : null}
              {guidanceReflection ? (
                <p className="ora-result-guidance-reflection">
                  {guidanceReflection}
                </p>
              ) : null}
            </OraReadingBlock>
          ) : null}
        </>
      ) : null}

      {!isThreeCard && hasInterpretation ? (
        <OraReadingBlock
          icon={ui.blockIcons.card}
          label={ui.oraLabel}
          title={ui.cardAndQuestion}
        >
          {renderParagraphs(singleInterpretation)}
        </OraReadingBlock>
      ) : null}

      {!isThreeCard && hasGuidance ? (
        <OraReadingBlock
          icon={ui.blockIcons.guidance}
          label={ui.oraLabel}
          title={ui.nextSuggestion}
        >
          {guidanceIntro ? renderParagraphs(guidanceIntro) : null}
          {guidanceItems.length > 0 ? (
            <ol className="ora-result-guidance-list">
              {guidanceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : null}
          {guidanceReflection ? (
            <p className="ora-result-guidance-reflection">{guidanceReflection}</p>
          ) : null}
        </OraReadingBlock>
      ) : null}
    </article>
  );
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

function buildAiReadingCacheKey({
  mode,
  orientation,
  spread,
  cardId,
  cardIds,
  question,
  clarifyId,
  clarifyFocus,
  clarifyNote,
}: {
  mode: "physical" | "online";
  orientation: string;
  spread: "single" | "three-card";
  cardId?: string;
  cardIds?: string;
  question: string;
  clarifyId?: string;
  clarifyFocus?: string;
  clarifyNote?: string;
}) {
  return [
    AI_READING_CACHE_PREFIX,
    spread,
    mode,
    orientation,
    spread === "three-card" ? cardIds : cardId,
    question,
    clarifyId || "",
    clarifyFocus || "",
    clarifyNote || "",
  ].join(":");
}

export function ResultClient({
  initialMode,
  initialSpread,
  initialCard,
  initialCards,
  initialOrientation,
  initialQuestion,
  initialLang,
  hasLangParam,
  initialClarifyId,
  initialClarifyLabel,
  initialClarifyFocus,
  initialClarifyNote,
}: ResultClientProps) {
  const router = useRouter();
  const copy = text(initialLang);
  const clarifyId = initialClarifyId.trim();
  const clarifyLabel = initialClarifyLabel.trim();
  const clarifyFocus = initialClarifyFocus.trim();
  const clarifyNote = initialClarifyNote.trim().slice(0, CLARIFY_NOTE_MAX_LENGTH);
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
  const [selectedCards, setSelectedCards] = useState<string | null | undefined>(
    initialCards || undefined,
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
  const threeCardItems = useMemo(
    () =>
      (selectedCards ?? "")
        .split(",")
        .map((cardId) => getTarotCardById(cardId.trim()))
        .filter((tarotCard): tarotCard is NonNullable<typeof tarotCard> =>
          Boolean(tarotCard),
        ),
    [selectedCards],
  );

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

      if (
        (spread === "single" && !card) ||
        (spread === "three-card" && threeCardItems.length !== 3) ||
        !question ||
        !mode ||
        orientation !== "upright"
      ) {
        setAiReading(null);
        setAiReadingStatus("idle");
        setAiReadingErrorMessage(null);
        return;
      }

      const normalizedSpread = spread === "three-card" ? "three-card" : "single";
      const threeCardIds = threeCardItems.map((item) => item.id).join(",");
      const cacheKey = buildAiReadingCacheKey({
        mode,
        orientation,
        spread: normalizedSpread,
        cardId: card?.id,
        cardIds: threeCardIds,
        question,
        clarifyId,
        clarifyFocus,
        clarifyNote,
      });
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
          ...(normalizedSpread === "single"
            ? { cardId: card?.id }
            : {
                cards: threeCardItems.map((item, index) => ({
                  position: (["situation", "challenge", "guidance"] as const)[
                    index
                  ],
                  cardId: item.id,
                })),
              }),
          question,
          lang: initialLang,
          mode,
          orientation,
          spread: normalizedSpread,
          clientRequestId,
          ...(clarifyId ? { clarifyId } : {}),
          ...(clarifyLabel ? { clarifyLabel } : {}),
          ...(clarifyFocus ? { clarifyFocus } : {}),
          ...(clarifyNote ? { clarifyNote } : {}),
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
                  readingLang: payload.reading.readingLang || initialLang,
                  fallback: true,
                  readingSource: "system_fallback" as const,
                  fallbackReason:
                    payload.reading.fallbackReason || "upstream_failure",
                }
              : {
                  ...payload.reading,
                  readingLang: payload.reading.readingLang || initialLang,
                };

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
  }, [
    card,
    question,
    mode,
    orientation,
    initialLang,
    aiRetryKey,
    spread,
    selectedCards,
    threeCardItems,
    clarifyId,
    clarifyLabel,
    clarifyFocus,
    clarifyNote,
  ]);

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
    const resolvedCard =
      resolvedSpread === "three-card"
        ? ""
        : initialCard || storedRitual.card || storedSelectedCard;
    const resolvedCards = initialCards || storedRitual.cards || "";
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
          cards: resolvedCards,
          lang: resolvedLang,
        }),
      );
    }

    queueMicrotask(() => {
      setMode(resolvedMode);
      setSpread(resolvedSpread);
      setSelectedCard(resolvedCard);
      setSelectedCards(resolvedCards);
      setOrientation(resolvedOrientation);
      setQuestion(resolvedQuestion);
    });

    if (!resolvedCard && !(resolvedSpread === "three-card" && resolvedCards)) {
      router.replace(
        resolvedMode === "online"
          ? `/ai-guide/draw?mode=online${
              resolvedQuestion
                ? `&spread=${resolvedSpread}&orientation=upright&question=${encodeURIComponent(
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
    initialCards,
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
    selectedCards === undefined ||
    orientation === undefined ||
    question === undefined
  ) {
    return (
      <LuminousShell lang={initialLang}>
        <LuminousPanel className="my-auto px-6 py-8 text-center">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
            {copy.readingDossier}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--c-text)]">
            {copy.readingCard}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.gatheringReading}
          </p>
          <div className="ora-guide-surface mt-6 rounded-[1.5rem] px-4 py-3">
            <ReadingNav lang={initialLang} />
          </div>
          <p className="mt-5 text-sm text-[color:var(--c-text-soft)]">
            {copy.preparingMessage}
          </p>
        </LuminousPanel>
      </LuminousShell>
    );
  }

  if (spread === "three-card") {
    const questionText = question || copy.noQuestion;
    const resultQuestion = question || "";
    const homeHref = withLang("/ai-guide", {}, initialLang);
    const positions = [
      copy.threeCardSituation,
      copy.threeCardChallenge,
      copy.threeCardGuidance,
    ];
    const aiDisplay = aiReading
      ? normalizeAiReadingForDisplay(aiReading)
      : undefined;
    const isFallbackDisplay = isFallbackAiReading(aiReading);
    const followUpStorageKey = `${buildAiReadingCacheKey({
      mode,
      orientation,
      spread: "three-card",
      cardIds: threeCardItems.map((item) => item.id).join(","),
      question: resultQuestion,
    })}:followUp:v1`;
    const passportChips = [
      mode === "online" ? copy.onlineDrawMode : copy.physicalCardMode,
      orientation === "upright" ? copy.upright : copy.upright,
      clarifyLabel || clarifyFocus,
      clarifyNote,
    ].filter(Boolean);

    if (threeCardItems.length !== 3) {
      return (
        <LuminousShell lang={initialLang}>
          <LuminousPanel className="my-auto px-6 py-8 text-center">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
              {copy.readingDossier}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--c-text)]">
              {copy.invalidReadingTitle}
            </h1>
            <p className="mt-4 text-sm leading-7 text-[color:var(--c-text-soft)]">
              {copy.invalidReadingDescription}
            </p>
            <LuminousActionLink className="mt-6" href={homeHref}>
              {copy.returnToReadingRoom}
            </LuminousActionLink>
          </LuminousPanel>
        </LuminousShell>
      );
    }

    return (
      <LuminousShell lang={initialLang}>
        <header className="flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
          <span>{copy.readingDossier}</span>
          <span className="text-right">{copy.threeCardSpread}</span>
        </header>

        <div className="ora-guide-surface rounded-[2rem] px-4 py-3 backdrop-blur-md">
          <ReadingNav lang={initialLang} />
        </div>

        <ReadingStage
          cards={threeCardItems.map((threeCard, index) => ({
            id: threeCard.id,
            image: threeCard.image,
            label: getTarotCardLabel(threeCard, initialLang),
            position: `${index + 1}. ${positions[index]}`,
            title: getTarotCardTitle(threeCard, initialLang),
          }))}
          chips={passportChips}
          lang={initialLang}
          question={questionText}
          spreadLabel={copy.threeCardSpread}
        />

        {aiReadingStatus === "loading" ? (
          <LuminousThinkingState
            cardImage={threeCardItems[2]?.image || threeCardItems[0]?.image}
            cardTitle={copy.threeCardSpread}
            lang={initialLang}
          />
        ) : null}

        {aiReadingStatus === "error" ? (
          <div className="ora-guide-panel rounded-[1.5rem] p-5 backdrop-blur-md sm:p-6">
            <p className="text-sm leading-7 text-[color:var(--c-text-soft)]">
              {aiReadingErrorMessage || copy.aiReadingUnavailable}
            </p>
            {aiReadingErrorMessage ===
            "Please sign in to generate your AI reading." ? (
              <div className="mt-4">
                <EmailSignInPanel reason="Sign in to generate your AI reading." />
              </div>
            ) : null}
            <button
              className="ora-guide-button ora-guide-button-surface mt-4 w-full touch-manipulation select-none sm:w-auto"
              type="button"
              onClick={() => {
                if (question && mode) {
                  const retryCacheKey = buildAiReadingCacheKey({
                    mode,
                    orientation,
                    spread: "three-card",
                    cardIds: threeCardItems.map((item) => item.id).join(","),
                    question,
                  });
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
          <>
            <AiReadingBlocks
              display={aiDisplay}
              isFallback={isFallbackDisplay}
              isThreeCard
              lang={initialLang}
              question={questionText}
              stageCards={threeCardItems.map((threeCard, index) => ({
                arcana: threeCard.arcana,
                keywords: getTarotCardKeywords(threeCard, initialLang),
                position: positions[index],
                rank: threeCard.rank,
                suit: getTarotCardLabel(threeCard, initialLang),
                title: getTarotCardTitle(threeCard, initialLang),
              }))}
            />
            {!isFallbackDisplay ? (
              <ResultFollowUpPanel
                cards={threeCardItems.map((item, index) => ({
                  position: (["situation", "challenge", "guidance"] as const)[
                    index
                  ],
                  cardId: item.id,
                }))}
                existingReading={aiReading}
                lang={initialLang}
                mode={mode}
                orientation="upright"
                question={resultQuestion}
                spread="three-card"
                storageKey={followUpStorageKey}
              />
            ) : null}
          </>
        ) : null}

      </LuminousShell>
    );
  }

  if (!card) {
    return (
      <LuminousShell lang={initialLang}>
        <LuminousPanel className="my-auto px-6 py-8 text-center">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
            {copy.readingDossier}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[color:var(--c-text)]">
            {copy.invalidReadingTitle}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.invalidReadingDescription}
          </p>
          <div className="ora-guide-surface mt-6 rounded-[1.5rem] px-4 py-3">
            <ReadingNav lang={initialLang} />
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
  const resultQuestion = question || "";
  const aiDisplay = aiReading
    ? normalizeAiReadingForDisplay(aiReading)
    : undefined;
  const isFallbackDisplay = isFallbackAiReading(aiReading);
  const followUpStorageKey = `${buildAiReadingCacheKey({
    mode,
    orientation,
    spread: "single",
    cardId: card.id,
    question: resultQuestion,
    clarifyId,
    clarifyFocus,
    clarifyNote,
  })}:followUp:v1`;
  const passportChips = [
    `${modeLabel} / ${orientationLabel}`,
    ...cardKeywords.slice(0, 3),
    clarifyLabel || clarifyFocus,
    clarifyNote,
  ].filter(Boolean);
  return (
    <LuminousShell lang={initialLang}>
      <header className="flex items-center justify-between gap-4 text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--c-accent)]">
        <span>{copy.readingDossier}</span>
        <span className="text-right">
          {mode === "online" ? copy.onlineDrawMode : copy.physicalDeck}
        </span>
      </header>

      <div className="ora-guide-surface rounded-[2rem] px-4 py-3 backdrop-blur-md">
        <ReadingNav lang={initialLang} />
      </div>

      <ReadingStage
        cards={[
          {
            id: card.id,
            image: card.image,
            label: cardLabel,
            title: cardTitle,
          },
        ]}
        chips={passportChips}
        lang={initialLang}
        question={questionText}
        spreadLabel={copy.singleCardReading}
      />

      <section className="mx-auto w-full max-w-[820px]">
        {aiReadingStatus === "loading" ? (
          <LuminousThinkingState
            cardImage={card.image}
            cardTitle={cardTitle}
            lang={initialLang}
          />
        ) : null}

        {aiReadingStatus === "error" ? (
          <div className="ora-guide-panel mt-6 rounded-[1.5rem] p-5 backdrop-blur-md sm:p-6">
            <p className="text-sm leading-7 text-[color:var(--c-text-soft)]">
              {aiReadingErrorMessage || copy.aiReadingUnavailable}
            </p>
            {aiReadingErrorMessage ===
            "Please sign in to generate your AI reading." ? (
              <div className="mt-4">
                <EmailSignInPanel reason="Sign in to generate your AI reading." />
              </div>
            ) : null}
            <button
              className="ora-guide-button ora-guide-button-surface mt-4 w-full touch-manipulation select-none sm:w-auto"
              type="button"
              onClick={() => {
                if (card && question && mode) {
                  const retryCacheKey = buildAiReadingCacheKey({
                    mode,
                    orientation,
                    spread: "single",
                    cardId: card.id,
                    question,
                    clarifyId,
                    clarifyFocus,
                    clarifyNote,
                  });
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
          <>
            <AiReadingBlocks
              display={aiDisplay}
              isFallback={isFallbackDisplay}
              isThreeCard={false}
              lang={initialLang}
              question={questionText}
              stageCards={[
                {
                  arcana: card.arcana,
                  keywords: cardKeywords,
                  rank: card.rank,
                  suit: cardLabel,
                  title: cardTitle,
                },
              ]}
            />
            {!isFallbackDisplay ? (
              <ResultFollowUpPanel
                cardId={card.id}
                existingReading={aiReading}
                lang={initialLang}
                mode={mode}
                orientation="upright"
                question={resultQuestion}
                spread="single"
                storageKey={followUpStorageKey}
              />
            ) : null}
          </>
        ) : null}
      </section>

    </LuminousShell>
  );
}

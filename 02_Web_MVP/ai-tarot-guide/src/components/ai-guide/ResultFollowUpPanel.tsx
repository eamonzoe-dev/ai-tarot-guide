"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { FOLLOW_UP_STARDUST_COST } from "@/lib/ai-guide/credits";
import { type Language, text } from "@/lib/ai-guide/i18n";

type Spread = "single" | "three-card";
type ThreeCardPosition = "situation" | "challenge" | "guidance";

type FollowUpMessage = {
  question: string;
  answer: string;
  nextStep?: string;
  reflectionQuestion?: string;
  fallback?: boolean;
};

type FollowUpResponse = {
  answer?: unknown;
  nextStep?: unknown;
  reflectionQuestion?: unknown;
  source?: unknown;
  fallback?: unknown;
};

type FollowUpApiResponse = FollowUpResponse & {
  followUp?: unknown;
  code?: unknown;
  fallback?: unknown;
};

type ResultFollowUpPanelProps = {
  lang: Language;
  question: string;
  mode: "physical" | "online";
  spread: Spread;
  orientation: "upright";
  cardId?: string;
  cards?: Array<{
    position: ThreeCardPosition;
    cardId: string;
  }>;
  existingReading: unknown;
  storageKey: string;
};

const MAX_FOLLOW_UPS = 3;
const MAX_FOLLOW_UP_LENGTH = 300;
const CREDITS_UPDATED_EVENT = "ora-arcana:credits-updated";
const followUpPrompts = {
  en: [
    "How can I apply this advice?",
    "Which step should I handle first?",
    "What is this card showing me that I missed?",
  ],
  zh: [
    "这个建议具体怎么落地？",
    "我应该先处理哪一步？",
    "这张牌提醒我忽略了什么？",
  ],
} as const;
const followUpContinuation = {
  en: "If you want to go deeper, I can stay with this spread and help you look at one specific part of it.",
  zh: "如果你想继续深入，我可以沿着这次牌面继续陪你看一个更具体的部分。",
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFollowUpMessage(value: unknown): value is FollowUpMessage {
  return (
    isRecord(value) &&
    typeof value.question === "string" &&
    typeof value.answer === "string" &&
    (value.nextStep === undefined || typeof value.nextStep === "string") &&
    (value.reflectionQuestion === undefined ||
      typeof value.reflectionQuestion === "string") &&
    (value.fallback === undefined || typeof value.fallback === "boolean")
  );
}

function readStoredMessages(storageKey: string) {
  const storedMessages = sessionStorage.getItem(storageKey);

  if (!storedMessages) {
    return [];
  }

  try {
    const parsedMessages = JSON.parse(storedMessages) as unknown;

    return Array.isArray(parsedMessages)
      ? parsedMessages.filter(isFollowUpMessage).slice(0, MAX_FOLLOW_UPS)
      : [];
  } catch {
    sessionStorage.removeItem(storageKey);
    return [];
  }
}

function normalizeFollowUpResponse(payload: FollowUpResponse) {
  const answer = typeof payload.answer === "string" ? payload.answer.trim() : "";
  const nextStep =
    typeof payload.nextStep === "string" ? payload.nextStep.trim() : "";
  const reflectionQuestion =
    typeof payload.reflectionQuestion === "string"
      ? payload.reflectionQuestion.trim()
      : "";

  return {
    answer,
    nextStep: nextStep || undefined,
    reflectionQuestion: reflectionQuestion || undefined,
    fallback: payload.fallback === true,
  };
}

function getFollowUpPayload(payload: FollowUpApiResponse): FollowUpResponse {
  if (isRecord(payload.followUp)) {
    return {
      ...(payload.followUp as FollowUpResponse),
      fallback: payload.fallback,
    };
  }

  return payload;
}

function createFollowUpRequestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 12)}`;
}

function buildOraBubbleText(message: FollowUpMessage) {
  return [message.answer, message.nextStep].filter(Boolean).join("\n\n");
}

function UserChatBubble({
  label,
  message,
}: {
  label: string;
  message: string;
}) {
  return (
    <div className="ora-result-message-row ora-result-message-row-user">
      <div className="min-w-0">
        <p className="mb-1 pr-2 text-right text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--c-text-dim)]">
          {label}
        </p>
        <div className="ora-result-bubble ora-result-bubble-user whitespace-pre-wrap break-words text-right">
          {message}
        </div>
      </div>
    </div>
  );
}

function OraChatBubble({
  label,
  message,
  fallbackNotice,
}: {
  label: string;
  message: string;
  fallbackNotice?: string;
}) {
  return (
    <div className="ora-result-message-row">
      <div className="ora-result-avatar" aria-hidden="true">
        {label.slice(0, 1)}
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--c-accent)]">
          {label}
        </p>
        <div className="ora-result-bubble ora-result-bubble-ora whitespace-pre-wrap break-words text-left">
          {fallbackNotice ? (
            <p className="mb-2 whitespace-pre-wrap break-words text-left text-xs leading-5 text-[color:var(--c-text-soft)]">
              {fallbackNotice}
            </p>
          ) : null}
          {message}
        </div>
      </div>
    </div>
  );
}

export function ResultFollowUpPanel({
  lang,
  question,
  mode,
  spread,
  orientation,
  cardId,
  cards,
  existingReading,
  storageKey,
}: ResultFollowUpPanelProps) {
  const copy = text(lang);
  const [messages, setMessages] = useState<FollowUpMessage[]>(() =>
    readStoredMessages(storageKey),
  );
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [pendingFollowUp, setPendingFollowUp] = useState<{
    text: string;
    requestId: string;
  } | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const hasReachedLimit = messages.length >= MAX_FOLLOW_UPS;
  const trimmedQuestion = followUpQuestion.trim();
  const isTooLong = trimmedQuestion.length > MAX_FOLLOW_UP_LENGTH;
  const helperId = useMemo(() => {
    const hash = Array.from(storageKey).reduce(
      (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
      0,
    );

    return `follow-up-helper-${hash.toString(36)}`;
  }, [storageKey]);
  const canSubmit =
    trimmedQuestion.length > 0 &&
    !isTooLong &&
    !hasReachedLimit &&
    status !== "loading";
  const characterCounter = useMemo(
    () => `${trimmedQuestion.length}/${MAX_FOLLOW_UP_LENGTH}`,
    [trimmedQuestion.length],
  );

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    const followUpRequestId =
      pendingFollowUp && pendingFollowUp.text === trimmedQuestion
        ? pendingFollowUp.requestId
        : createFollowUpRequestId();

    if (!pendingFollowUp || pendingFollowUp.text !== trimmedQuestion) {
      setPendingFollowUp({
        text: trimmedQuestion,
        requestId: followUpRequestId,
      });
    }

    try {
      const response = await fetch("/api/ai-reading/follow-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lang,
          question,
          followUpQuestion: trimmedQuestion,
          followUpRequestId,
          mode,
          spread,
          orientation,
          ...(spread === "single" ? { cardId } : { cards }),
          existingReading,
        }),
      });
      const payload = (await response.json()) as FollowUpApiResponse;

      if (!response.ok) {
        const errorCode = typeof payload.code === "string" ? payload.code : "";

        if (response.status === 402 || errorCode === "insufficient_stardust") {
          setPendingFollowUp(null);
          throw new Error("insufficient_stardust");
        }

        throw new Error("follow_up_failed");
      }

      const followUpPayload = getFollowUpPayload(payload);
      const nextFollowUp = normalizeFollowUpResponse(followUpPayload);

      if (!nextFollowUp.answer || followUpPayload.source !== "ai_follow_up") {
        throw new Error("follow_up_failed");
      }

      setMessages((currentMessages) =>
        [
          ...currentMessages,
          {
            question: trimmedQuestion,
            answer: nextFollowUp.answer,
            nextStep: nextFollowUp.nextStep,
            reflectionQuestion: nextFollowUp.reflectionQuestion,
            fallback: nextFollowUp.fallback,
          },
        ].slice(0, MAX_FOLLOW_UPS),
      );
      if (!nextFollowUp.fallback) {
        window.dispatchEvent(new Event(CREDITS_UPDATED_EVENT));
      }
      setFollowUpQuestion("");
      setPendingFollowUp(null);
      setStatus("idle");
    } catch (followUpError) {
      setErrorMessage(
        followUpError instanceof Error &&
          followUpError.message === "insufficient_stardust"
          ? copy.aiFollowUpInsufficientStardust
          : copy.aiFollowUpError,
      );
      setStatus("error");
    }
  }

  return (
    <section className="ora-result-follow-up mx-auto mt-8 w-full max-w-[820px] px-1 pb-1 sm:px-2">
      {messages.length > 0 ? (
        <div className="ora-result-follow-up-thread mt-5 space-y-4 opacity-90">
          {messages.map((message, index) => (
            <div
              className="space-y-3"
              key={`${index}-${message.question.slice(0, 18)}`}
            >
              <UserChatBubble
                label={copy.aiFollowUpUserLabel}
                message={message.question}
              />
              <OraChatBubble
                fallbackNotice={
                  message.fallback
                    ? copy.aiFollowUpFallbackNotice
                    : undefined
                }
                label={copy.aiFollowUpOraLabel}
                message={buildOraBubbleText(message)}
              />
            </div>
          ))}
        </div>
      ) : null}

      <form className="ora-result-composer-shell mt-5" onSubmit={handleSubmit}>
        <div className="ora-result-composer rounded-[1.35rem] border border-[color:var(--c-border)]/58 bg-[color:var(--c-surface)]/42 p-4 shadow-[0_8px_18px_color-mix(in_srgb,var(--c-text)_4%,transparent)] sm:p-5">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--c-accent)]">
            Ora
          </p>
          <p className="mt-1 font-serif text-xl leading-tight text-[color:var(--c-text)] sm:text-[1.45rem]">
            {copy.aiFollowUpPrice(FOLLOW_UP_STARDUST_COST)}
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--c-text-soft)]">
            {followUpContinuation[lang]}
          </p>
          <p className="mt-1 text-xs leading-5 text-[color:var(--c-text-dim)]">
            {copy.aiFollowUpHelper}
          </p>

          <div className="mt-4 flex max-w-[46rem] flex-wrap gap-2">
            {followUpPrompts[lang].map((prompt) => (
              <button
                className="rounded-full border border-[color:var(--c-border)]/68 bg-[color:var(--c-surface)]/42 px-3 py-2 text-left text-xs leading-5 text-[color:var(--c-text-soft)] transition hover:border-[color:var(--c-accent)] hover:bg-[color:var(--c-surface)]/70 hover:text-[color:var(--c-text)] disabled:cursor-not-allowed disabled:opacity-55"
                disabled={status === "loading" || hasReachedLimit}
                key={prompt}
                onClick={() => setFollowUpQuestion(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>

          {hasReachedLimit ? (
            <p className="mt-4 rounded-[1.1rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface)]/82 px-4 py-3 text-sm leading-6 text-[color:var(--c-text-soft)]">
              {copy.aiFollowUpLimitReached}
            </p>
          ) : (
            <div className="ora-result-composer-input mt-4 rounded-[1.15rem] border border-[color:var(--c-border)]/62 bg-[color:var(--c-bg)]/38 p-2 sm:flex sm:items-end sm:gap-2">
              <div className="min-w-0 flex-1">
                <textarea
                  aria-describedby={helperId}
                  className="min-h-32 w-full resize-none rounded-[1rem] border border-transparent bg-transparent px-3 py-3 text-sm leading-6 text-[color:var(--c-text)] outline-none placeholder:text-[color:var(--c-text-dim)] focus:border-[color:var(--c-accent)] focus:bg-[color:var(--c-surface)]/66"
                  disabled={status === "loading"}
                  maxLength={MAX_FOLLOW_UP_LENGTH + 1}
                  onChange={(event) => {
                    const nextValue = event.target.value;

                    setFollowUpQuestion(nextValue);

                    if (nextValue.trim().length === 0) {
                      setPendingFollowUp(null);
                    }
                  }}
                  placeholder={
                    lang === "zh" ? "继续问 Ora…" : "Continue with Ora..."
                  }
                  value={followUpQuestion}
                />
                <div
                  className="flex items-center justify-between gap-3 px-3 pb-1 text-xs text-[color:var(--c-text-soft)]"
                  id={helperId}
                >
                  <span>
                    {isTooLong
                      ? copy.aiFollowUpTooLong
                      : status === "loading"
                        ? copy.aiFollowUpLoading
                        : copy.aiFollowUpComposerHint}
                  </span>
                  <span aria-hidden="true" className="shrink-0">
                    {characterCounter}
                  </span>
                </div>
              </div>
              <button
                className="ora-guide-button ora-guide-button-primary min-h-12 w-full touch-manipulation px-5 py-2 text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
                disabled={!canSubmit}
                type="submit"
              >
                {status === "loading"
                  ? copy.aiFollowUpLoading
                  : copy.aiFollowUpButton}
              </button>
            </div>
          )}
          </div>
      </form>

      {errorMessage ? (
        <p className="ora-result-composer-shell mt-3 rounded-[1rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface)]/84 px-3 py-2 text-sm leading-6 text-[color:var(--c-text-soft)]">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

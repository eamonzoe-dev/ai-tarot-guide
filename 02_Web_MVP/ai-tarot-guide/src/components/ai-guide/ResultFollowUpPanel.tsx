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
    <div className="flex justify-end">
      <div className="ml-auto max-w-[90%] sm:max-w-[78%]">
        <p className="mb-1 pr-2 text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-accent)]">
          {label}
        </p>
        <div className="ml-auto w-fit max-w-full rounded-[1.25rem] rounded-tr-sm border border-[color:var(--c-border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c-surface)_94%,var(--c-bg)_6%),color-mix(in_srgb,var(--c-surface-well)_84%,var(--c-bg)_16%))] px-4 py-3 text-right shadow-[0_10px_24px_color-mix(in_srgb,var(--c-text)_10%,transparent)]">
          <p className="whitespace-pre-wrap break-words text-right text-sm leading-7 text-[color:var(--c-text)]">
            {message}
          </p>
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
    <div className="flex justify-start">
      <div className="mr-auto max-w-[90%] sm:max-w-[78%]">
        <p className="mb-1 pl-2 text-left text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--c-accent)]">
          {label}
        </p>
        <div className="mr-auto w-fit max-w-full rounded-[1.25rem] rounded-tl-sm border border-[color:var(--c-border)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--c-surface)_96%,var(--c-bg)_4%),color-mix(in_srgb,var(--c-surface-well)_84%,var(--c-bg)_16%))] px-4 py-3 text-left shadow-[0_10px_24px_color-mix(in_srgb,var(--c-text)_8%,transparent)]">
          {fallbackNotice ? (
            <p className="mb-2 whitespace-pre-wrap break-words text-left text-xs leading-5 text-[color:var(--c-text-soft)]">
              {fallbackNotice}
            </p>
          ) : null}
          <p className="whitespace-pre-wrap break-words text-left text-sm leading-7 text-[color:var(--c-text)]">
            {message}
          </p>
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
  const originalQuestion = question.trim();
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
    <section className="ora-guide-panel mt-7 rounded-[1.35rem] p-4">
      <div>
        <p className="font-serif text-xl leading-tight text-[color:var(--c-text)]">
          {copy.aiFollowUpPrice(FOLLOW_UP_STARDUST_COST)}
        </p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--c-text-soft)]">
          {copy.aiFollowUpHelper}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <UserChatBubble label={copy.aiFollowUpUserLabel} message={originalQuestion} />
        <OraChatBubble
          label={copy.aiFollowUpOraLabel}
          message={copy.aiFollowUpIntro}
        />

        {messages.length > 0
          ? messages.map((message, index) => (
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
            ))
          : null}
      </div>

      {hasReachedLimit ? (
        <p className="mt-5 rounded-[1.1rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface)]/82 px-4 py-3 text-sm leading-6 text-[color:var(--c-text-soft)]">
          {copy.aiFollowUpLimitReached}
        </p>
      ) : (
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="rounded-[1.35rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface)]/76 p-2 shadow-[0_12px_28px_color-mix(in_srgb,var(--c-text)_8%,transparent)] sm:flex sm:items-end sm:gap-2">
            <div className="min-w-0 flex-1">
              <textarea
                aria-describedby={helperId}
                className="min-h-14 w-full resize-none rounded-[1rem] border border-transparent bg-transparent px-3 py-2 text-sm leading-6 text-[color:var(--c-text)] outline-none placeholder:text-[color:var(--c-text-dim)] focus:border-[color:var(--c-accent)] focus:bg-[color:var(--c-surface)]/76"
                disabled={status === "loading"}
                maxLength={MAX_FOLLOW_UP_LENGTH + 1}
                onChange={(event) => {
                  const nextValue = event.target.value;

                  setFollowUpQuestion(nextValue);

                  if (nextValue.trim().length === 0) {
                    setPendingFollowUp(null);
                  }
                }}
                placeholder={copy.aiFollowUpPlaceholder}
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
              className="ora-guide-button ora-guide-button-primary w-full touch-manipulation disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
              disabled={!canSubmit}
              type="submit"
            >
              {status === "loading" ? copy.aiFollowUpLoading : copy.aiFollowUpButton}
            </button>
          </div>
        </form>
      )}

      {errorMessage ? (
        <p className="mt-3 rounded-[1rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface)]/84 px-3 py-2 text-sm leading-6 text-[color:var(--c-text-soft)]">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

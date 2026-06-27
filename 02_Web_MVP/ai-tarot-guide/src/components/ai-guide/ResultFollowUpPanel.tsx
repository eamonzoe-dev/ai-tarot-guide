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
        <p className="mb-1 pr-2 text-right text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#a77f3c]">
          {label}
        </p>
        <div className="ml-auto w-fit max-w-full rounded-[1.25rem] rounded-tr-sm border border-[#d6b16b]/30 bg-[#f3dfaa]/58 px-4 py-3 text-right shadow-[0_10px_24px_rgba(148,105,39,0.08)]">
          <p className="whitespace-pre-wrap break-words text-right text-sm leading-7 text-[#4a3827]">
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
        <p className="mb-1 pl-2 text-left text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#9d7b3f]">
          {label}
        </p>
        <div className="mr-auto w-fit max-w-full rounded-[1.25rem] rounded-tl-sm border border-[#d8bd82]/30 bg-white/66 px-4 py-3 text-left shadow-[0_10px_24px_rgba(116,83,36,0.06)]">
          {fallbackNotice ? (
            <p className="mb-2 whitespace-pre-wrap break-words text-left text-xs leading-5 text-[#8b7a61]">
              {fallbackNotice}
            </p>
          ) : null}
          <p className="whitespace-pre-wrap break-words text-left text-sm leading-7 text-[#4f4334]">
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
    <section className="mt-7 rounded-[1.55rem] border border-[#d8bd82]/34 bg-[linear-gradient(180deg,rgba(255,250,241,0.72),rgba(255,255,255,0.46))] p-4 shadow-[0_18px_44px_rgba(116,83,36,0.07)]">
      <div>
        <p className="font-serif text-xl leading-tight text-[#4a3827]">
          {copy.aiFollowUpPrice(FOLLOW_UP_STARDUST_COST)}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#7b6c58]">
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
        <p className="mt-5 rounded-[1.1rem] border border-[#d8bd82]/26 bg-white/42 px-4 py-3 text-sm leading-6 text-[#7b6c58]">
          {copy.aiFollowUpLimitReached}
        </p>
      ) : (
        <form className="mt-5" onSubmit={handleSubmit}>
          <div className="rounded-[1.35rem] border border-[#d8bd82]/40 bg-white/54 p-2 shadow-[0_12px_28px_rgba(116,83,36,0.06)] sm:flex sm:items-end sm:gap-2">
            <div className="min-w-0 flex-1">
              <textarea
                aria-describedby={helperId}
                className="min-h-14 w-full resize-none rounded-[1rem] border border-transparent bg-transparent px-3 py-2 text-sm leading-6 text-[#4f4334] outline-none placeholder:text-[#9d8f78] focus:border-[#d8bd82]/45 focus:bg-white/42"
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
                className="flex items-center justify-between gap-3 px-3 pb-1 text-xs text-[#8b7a61]"
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
              className="min-h-11 w-full rounded-full border border-[#c89d4f]/62 bg-[linear-gradient(180deg,rgba(246,225,174,0.96),rgba(197,151,72,0.96))] px-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#3a2a18] shadow-[0_12px_26px_rgba(148,105,39,0.14),inset_0_1px_0_rgba(255,255,255,0.58)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 sm:w-auto"
              disabled={!canSubmit}
              type="submit"
            >
              {status === "loading" ? copy.aiFollowUpLoading : copy.aiFollowUpButton}
            </button>
          </div>
        </form>
      )}

      {errorMessage ? (
        <p className="mt-3 rounded-[1rem] border border-[#c48a73]/36 bg-[#fff5ed]/72 px-3 py-2 text-sm leading-6 text-[#8a4634]">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

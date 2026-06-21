"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  const [messages, setMessages] = useState<FollowUpMessage[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
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
    setMessages(readStoredMessages(storageKey));
    setFollowUpQuestion("");
    setStatus("idle");
    setErrorMessage("");
  }, [storageKey]);

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
          mode,
          spread,
          orientation,
          ...(spread === "single" ? { cardId } : { cards }),
          existingReading,
        }),
      });

      if (!response.ok) {
        throw new Error("follow_up_failed");
      }

      const payload = (await response.json()) as FollowUpResponse;
      const nextFollowUp = normalizeFollowUpResponse(payload);

      if (!nextFollowUp.answer || payload.source !== "ai_follow_up") {
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
      setFollowUpQuestion("");
      setStatus("idle");
    } catch {
      setErrorMessage(copy.aiFollowUpError);
      setStatus("error");
    }
  }

  return (
    <section className="mt-6 rounded-[1.4rem] border border-[#d8bd82]/38 bg-[#fffaf0]/70 p-4">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#a77f3c]">
          {copy.aiFollowUpTitle}
        </p>
        <p className="mt-2 text-sm leading-6 text-[#7b6c58]">
          {copy.aiFollowUpHelper}
        </p>
      </div>

      {messages.length > 0 ? (
        <div className="mt-5 space-y-4">
          {messages.map((message, index) => (
            <article
              className="rounded-[1.2rem] border border-[#d8bd82]/32 bg-white/46 p-4"
              key={`${index}-${message.question.slice(0, 18)}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                {copy.aiFollowUpUserLabel}
              </p>
              <p className="mt-2 text-sm leading-7 text-[#4f4334]">
                {message.question}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#9d7b3f]">
                {copy.aiFollowUpOraLabel}
              </p>
              {message.fallback ? (
                <p className="mt-2 rounded-[1rem] border border-[#d8bd82]/34 bg-[#fffaf1]/72 px-3 py-2 text-xs leading-5 text-[#7b6c58]">
                  {copy.aiFollowUpFallbackNotice}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-7 text-[#4f4334]">
                {message.answer}
              </p>
              {message.nextStep ? (
                <div className="mt-4 border-t border-[#d8bd82]/34 pt-4">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#a77f3c]">
                    {copy.aiNextStep}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#4f4334]">
                    {message.nextStep}
                  </p>
                </div>
              ) : null}
              {message.reflectionQuestion ? (
                <div className="mt-4 border-t border-[#d8bd82]/34 pt-4">
                  <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#a77f3c]">
                    {copy.aiReflectionQuestion}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#4f4334]">
                    {message.reflectionQuestion}
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="sm:flex sm:items-start sm:gap-3">
          <div className="min-w-0 flex-1">
            <textarea
              aria-describedby={helperId}
              className="min-h-24 w-full resize-none rounded-[1.15rem] border border-[#d8bd82]/45 bg-white/64 px-4 py-3 text-sm leading-6 text-[#4f4334] outline-none placeholder:text-[#9d8f78] focus:border-[#c89d4f]/72 focus:ring-2 focus:ring-[#c89d4f]/18 disabled:opacity-60"
              disabled={hasReachedLimit || status === "loading"}
              maxLength={MAX_FOLLOW_UP_LENGTH + 1}
              onChange={(event) => setFollowUpQuestion(event.target.value)}
              placeholder={copy.aiFollowUpPlaceholder}
              value={followUpQuestion}
            />
            <div
              className="mt-2 flex items-center justify-between gap-3 text-xs text-[#8b7a61]"
              id={helperId}
            >
              <span>
                {hasReachedLimit
                  ? copy.aiFollowUpLimitReached
                  : isTooLong
                    ? copy.aiFollowUpTooLong
                    : status === "loading"
                      ? copy.aiFollowUpLoading
                      : copy.aiFollowUpHelper}
              </span>
              <span aria-hidden="true" className="shrink-0">
                {characterCounter}
              </span>
            </div>
          </div>
          <button
            className="mt-3 min-h-11 w-full rounded-full border border-[#c89d4f]/62 bg-[linear-gradient(180deg,rgba(246,225,174,0.96),rgba(197,151,72,0.96))] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3a2a18] shadow-[0_14px_30px_rgba(148,105,39,0.16),inset_0_1px_0_rgba(255,255,255,0.58)] transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#fffaf0] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 sm:mt-0 sm:w-auto"
            disabled={!canSubmit}
            type="submit"
          >
            {status === "loading" ? copy.aiFollowUpLoading : copy.aiFollowUpButton}
          </button>
        </div>
      </form>

      {errorMessage ? (
        <p className="mt-3 rounded-[1rem] border border-[#c48a73]/36 bg-[#fff5ed]/72 px-3 py-2 text-sm leading-6 text-[#8a4634]">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
}

import { NextResponse } from "next/server";

import {
  getTarotCardById,
  getTarotCardKeywords,
  getTarotCardLabel,
  getTarotCardTitle,
} from "@/data/tarotCards";
import { normalizeLanguage } from "@/lib/ai-guide/i18n";

type AiReadingRequest = {
  cardId?: unknown;
  question?: unknown;
  lang?: unknown;
  mode?: unknown;
  orientation?: unknown;
};

type AiReading = {
  fullReading?: string;
  summary: string;
  directAnswer: string;
  situationReading: string;
  hiddenTension: string;
  advice: string;
  nextStep: string;
  reflectionQuestion: string;
  cardMessage?: string;
  cardMeaning?: string;
  closingNote?: string;
};

export const maxDuration = 60;

const OPENAI_TIMEOUT_MS = 45_000;
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const MAX_QUESTION_LENGTH = 800;

class UpstreamRequestError extends Error {
  status: number;

  constructor(status: number) {
    super(`Upstream returned status ${status}.`);
    this.name = "UpstreamRequestError";
    this.status = status;
  }
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength).trim() : value;
}

function normalizeMode(value: unknown): "physical" | "online" {
  const mode = stringValue(value);
  return mode === "online" || mode === "physical" ? mode : "physical";
}

function normalizeOrientation(value: unknown): "upright" | "" {
  return stringValue(value) === "upright" ? "upright" : "";
}

function isAiReading(value: unknown): value is AiReading {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reading = value as Record<string, unknown>;
  return (
    typeof reading.fullReading === "string" ||
    typeof reading.summary === "string" &&
    typeof reading.directAnswer === "string" &&
    typeof reading.situationReading === "string" &&
    typeof reading.hiddenTension === "string" &&
    typeof reading.advice === "string" &&
    typeof reading.nextStep === "string" &&
    typeof reading.reflectionQuestion === "string"
  );
}

function normalizeAiReading(reading: AiReading): AiReading {
  return {
    fullReading: reading.fullReading,
    summary: reading.summary,
    directAnswer: reading.directAnswer,
    situationReading: reading.situationReading,
    hiddenTension: reading.hiddenTension,
    advice: reading.advice,
    nextStep: reading.nextStep,
    reflectionQuestion: reading.reflectionQuestion,
    cardMessage: reading.cardMessage || reading.cardMeaning,
    cardMeaning: reading.cardMeaning || reading.cardMessage,
    closingNote: reading.closingNote,
  };
}

function isTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || /timeout|timed out/i.test(error.message))
  );
}

function shouldRetry(error: unknown) {
  if (isTimeoutError(error)) {
    return true;
  }

  if (error instanceof UpstreamRequestError) {
    return error.status >= 500;
  }

  return error instanceof TypeError;
}

function getErrorDiagnostics(error: unknown) {
  if (!error || typeof error !== "object") {
    return {
      name: "UnknownError",
      status: undefined,
      code: undefined,
    };
  }

  const diagnosticError = error as {
    name?: unknown;
    status?: unknown;
    code?: unknown;
  };

  return {
    name:
      typeof diagnosticError.name === "string"
        ? diagnosticError.name
        : "UnknownError",
    status:
      error instanceof UpstreamRequestError
        ? error.status
        : typeof diagnosticError.status === "number"
        ? diagnosticError.status
        : undefined,
    code:
      typeof diagnosticError.code === "string"
        ? diagnosticError.code
        : undefined,
  };
}

function chatCompletionsUrl(baseURL: string) {
  return `${baseURL.replace(/\/+$/, "")}/chat/completions`;
}

function stripJsonCodeFence(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseUpstreamJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("data:")) {
    const dataLine = trimmed
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.startsWith("data:") && line !== "data: [DONE]");

    if (dataLine) {
      return JSON.parse(dataLine.replace(/^data:\s*/, ""));
    }
  }

  return JSON.parse(trimmed);
}

type ReadingPayload = {
  baseURL: string;
  apiKey: string;
  model: string;
  languageName: string;
  lang: "en" | "zh";
  mode: "physical" | "online";
  orientation: "upright";
  question: string;
  cardData: {
    title: string;
    englishTitle: string;
    label: string;
    keywords: string[];
    reflection: string;
    suggestion: string;
    practicalAdvice: string;
    reflectionQuestion: string;
  };
  lightweight: boolean;
};

function buildSystemPrompt(lang: "en" | "zh", lightweight: boolean) {
  const shared = [
    "You are a professional tarot reader writing one continuous single-card upright reading.",
    "Use only the supplied card data and the user's question. The result should read like a real reading, not a field-by-field report.",
    "Return only valid JSON. No markdown, code fences, bullet lists, or text outside JSON.",
    "Required string fields: fullReading, summary, directAnswer, situationReading, hiddenTension, advice, nextStep, reflectionQuestion.",
    "fullReading should be the main output: one continuous reading with clear paragraphs and a natural narrative flow.",
    "summary must be exactly one sentence. The other fields should stay compact and supportive.",
    "directAnswer must be clear about what the card leans toward, while avoiding absolute predictions.",
    "advice and nextStep must be specific and usable; nextStep must fit the next 24-72 hours.",
    "Avoid repeating the same idea across fields. Avoid long tarot theory or list-like reporting.",
    "Do not provide medical, legal, financial, or investment conclusions.",
  ];

  if (lang === "zh") {
    shared.push("Write natural Simplified Chinese, not translation-style Chinese.");
  } else {
    shared.push("Write natural contemporary English.");
  }

  if (lightweight) {
    shared.push(
      "This is a retry after a slow upstream response: keep the reading concise, complete every required field, and make fullReading shorter than usual.",
    );
  }

  return shared.join(" ");
}

function buildUserPrompt(payload: ReadingPayload) {
  return JSON.stringify({
    language: payload.languageName,
    readingRules: {
      spread: "single-card",
      orientation: payload.orientation,
      mode: payload.mode,
      reversals: "not used",
      tone:
        payload.lang === "zh"
          ? "正式、清晰、有判断，但不过度断言；直接围绕用户问题。"
          : "formal, clear, discerning, and concrete without overclaiming; stay centered on the user's question.",
    },
    userQuestion: payload.question,
    card: payload.cardData,
    outputShape: {
      fullReading: "string",
      summary: "string",
      directAnswer: "string",
      situationReading: "string",
      hiddenTension: "string",
      advice: "string",
      nextStep: "string",
      reflectionQuestion: "string",
    },
  });
}

async function requestAiReading(payload: ReadingPayload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch(chatCompletionsUrl(payload.baseURL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.apiKey}`,
      },
      body: JSON.stringify({
        model: payload.model,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(payload.lang, payload.lightweight),
          },
          {
            role: "user",
            content: buildUserPrompt(payload),
          },
        ],
        max_tokens: payload.lightweight ? 900 : 1200,
      }),
      signal: controller.signal,
    });

    const upstreamText = await response.text();

    if (!response.ok) {
      throw new UpstreamRequestError(response.status);
    }

    const data = parseUpstreamJson(upstreamText) as {
      choices?: Array<{ message?: { content?: unknown } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    const parsed =
      typeof content === "string"
        ? JSON.parse(stripJsonCodeFence(content))
        : null;

    if (!isAiReading(parsed)) {
      throw new Error("AI response did not match the expected schema.");
    }

    return normalizeAiReading(parsed);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  let body: AiReadingRequest;

  try {
    body = (await request.json()) as AiReadingRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const cardId = stringValue(body.cardId);
  const question = truncateText(stringValue(body.question), MAX_QUESTION_LENGTH);
  const lang = normalizeLanguage(stringValue(body.lang));
  const mode = normalizeMode(body.mode);
  const orientation = normalizeOrientation(body.orientation);
  const card = getTarotCardById(cardId);

  if (!card) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  if (!orientation) {
    return NextResponse.json(
      { error: "Only upright single-card readings are supported." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  const customBaseURL = process.env.OPENAI_BASE_URL?.trim();
  const baseURL = customBaseURL || DEFAULT_OPENAI_BASE_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "AI reading is not configured." },
      { status: 503 },
    );
  }

  const languageName =
    lang === "zh"
      ? "natural Simplified Chinese"
      : "natural contemporary English";
  const cardData = {
    title: getTarotCardTitle(card, lang),
    englishTitle: card.title,
    label: getTarotCardLabel(card, lang),
    keywords: getTarotCardKeywords(card, lang),
    reflection: card.reflection,
    suggestion: card.suggestion,
    practicalAdvice: card.practicalAdvice,
    reflectionQuestion: card.reflectionQuestion,
  };

  const startedAt = Date.now();
  console.info("AI reading request started:", {
    model,
    hasCustomBaseURL: Boolean(customBaseURL),
  });

  try {
    const payload = {
      baseURL,
      apiKey,
      model,
      languageName,
      lang,
      mode,
      orientation,
      question,
      cardData,
      lightweight: false,
    };
    let reading: AiReading;

    try {
      reading = await requestAiReading(payload);
    } catch (error) {
      if (!shouldRetry(error)) {
        throw error;
      }

      console.warn("AI reading retrying with lightweight prompt:", {
        model,
        hasCustomBaseURL: Boolean(customBaseURL),
        elapsedMs: Date.now() - startedAt,
        upstreamStatus: getErrorDiagnostics(error).status,
        errorName: getErrorDiagnostics(error).name,
      });

      reading = await requestAiReading({
        ...payload,
        lightweight: true,
      });
    }

    console.info("AI reading request completed:", {
      model,
      hasCustomBaseURL: Boolean(customBaseURL),
      elapsedMs: Date.now() - startedAt,
    });

    return NextResponse.json({ reading });
  } catch (error) {
    const timedOut = isTimeoutError(error);
    const diagnostics = getErrorDiagnostics(error);
    console.error("AI reading generation failed:", {
      model,
      hasCustomBaseURL: Boolean(customBaseURL),
      elapsedMs:
        typeof startedAt === "number" ? Date.now() - startedAt : undefined,
      upstreamStatus: diagnostics.status,
      errorName: diagnostics.name,
      errorCode: diagnostics.code,
      reason: timedOut
        ? "OpenAI-compatible request timed out."
        : "OpenAI-compatible request failed.",
    });
    return NextResponse.json(
      { error: "AI reading could not be generated." },
      { status: timedOut ? 504 : 502 },
    );
  }
}

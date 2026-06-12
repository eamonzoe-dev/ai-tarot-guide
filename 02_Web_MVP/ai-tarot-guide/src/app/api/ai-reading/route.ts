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
  summary: string;
  cardMeaning: string;
  situationReading: string;
  advice: string;
  reflectionQuestion: string;
  closingNote: string;
};

const OPENAI_TIMEOUT_MS = 25_000;
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";
const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com/v1";
const MAX_QUESTION_LENGTH = 800;

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function truncateText(value: string, maxLength: number) {
  return value.length > maxLength ? value.slice(0, maxLength).trim() : value;
}

function normalizeMode(value: unknown) {
  const mode = stringValue(value);
  return mode === "online" || mode === "physical" ? mode : "physical";
}

function normalizeOrientation(value: unknown) {
  return stringValue(value) === "upright" ? "upright" : "";
}

function isAiReading(value: unknown): value is AiReading {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reading = value as Record<keyof AiReading, unknown>;
  return (
    typeof reading.summary === "string" &&
    typeof reading.cardMeaning === "string" &&
    typeof reading.situationReading === "string" &&
    typeof reading.advice === "string" &&
    typeof reading.reflectionQuestion === "string" &&
    typeof reading.closingNote === "string"
  );
}

function isTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || /timeout|timed out/i.test(error.message))
  );
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
      typeof diagnosticError.status === "number"
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

  const languageName = lang === "zh" ? "Chinese" : "English";
  const cardData = {
    title: getTarotCardTitle(card, lang),
    englishTitle: card.title,
    label: getTarotCardLabel(card, lang),
    keywords: getTarotCardKeywords(card, lang),
    reflection: card.reflection,
    suggestion: card.suggestion,
    reflectionQuestion: card.reflectionQuestion,
  };

  const startedAt = Date.now();
  console.info("AI reading request started:", {
    model,
    hasCustomBaseURL: Boolean(customBaseURL),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch(chatCompletionsUrl(baseURL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You write concise single-card upright tarot reflections. Use only supplied card data. Return only valid JSON. Do not use markdown, code fences, or explanatory text. Each field must be at most one sentence. Required string fields: summary, cardMeaning, situationReading, advice, reflectionQuestion, closingNote.",
          },
          {
            role: "user",
            content: JSON.stringify({
              language: languageName,
              spread: "single-card",
              orientation,
              mode,
              question,
              card: cardData,
            }),
          },
        ],
        max_tokens: 500,
      }),
      signal: controller.signal,
    });

    const upstreamText = await response.text();

    if (!response.ok) {
      console.error("AI reading upstream request failed:", {
        model,
        hasCustomBaseURL: Boolean(customBaseURL),
        elapsedMs: Date.now() - startedAt,
        upstreamStatus: response.status,
        reason: "Upstream returned non-2xx.",
      });
      return NextResponse.json(
        { error: "AI reading could not be generated." },
        { status: 502 },
      );
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

    console.info("AI reading request completed:", {
      model,
      hasCustomBaseURL: Boolean(customBaseURL),
      elapsedMs: Date.now() - startedAt,
      upstreamStatus: response.status,
    });

    return NextResponse.json({ reading: parsed });
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
  } finally {
    clearTimeout(timeoutId);
  }
}

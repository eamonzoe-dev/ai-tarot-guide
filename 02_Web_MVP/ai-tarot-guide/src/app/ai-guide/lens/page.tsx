import { redirect } from "next/navigation";

import { normalizeLanguage } from "@/lib/ai-guide/i18n";

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";
type Orientation = "upright";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function LensPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    question?: string | string[];
    lang?: string | string[];
    clarifyId?: string | string[];
    clarifyLabel?: string | string[];
    clarifyFocus?: string | string[];
    clarifyNote?: string | string[];
    clarifyDetail?: string | string[];
    clarifyMood?: string | string[];
    mood?: string | string[];
    ritual?: string | string[];
    preparation?: string | string[];
  }>;
}) {
  const allParams = await searchParams;
  const {
    mode: modeParam,
    spread: spreadParam,
    orientation: orientationParam,
    question: questionParam,
    lang: langParam,
  } = allParams;

  const mode = normalizeMode(modeParam);
  const spread: Spread =
    normalizeValue(spreadParam) === "three-card" ? "three-card" : "single";
  const orientation: Orientation =
    normalizeValue(orientationParam) === "upright" ? "upright" : "upright";
  const lang = normalizeLanguage(langParam);
  const question = normalizeValue(questionParam).trim();
  const params = new URLSearchParams({
    mode,
    spread,
    orientation,
    lang,
  });

  if (question) {
    params.set("question", question);
  }

  [
    "clarifyId",
    "clarifyLabel",
    "clarifyFocus",
    "clarifyNote",
    "clarifyDetail",
    "clarifyMood",
    "mood",
    "ritual",
    "preparation",
  ].forEach((key) => {
    const value = normalizeValue(allParams[key as keyof typeof allParams]).trim();

    if (value) {
      params.set(key, value);
    }
  });

  redirect(`/ai-guide/ask?${params.toString()}`);
}

import Link from "next/link";

import { normalizeLanguage, withLang } from "@/lib/ai-guide/i18n";
import { PrepareRitualStepClient } from "./PrepareRitualStepClient";

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

export default async function PreparePage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
    question?: string | string[];
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
    lang: langParam,
    question: questionParam,
  } = allParams;
  const mode = normalizeMode(modeParam);
  const lang = normalizeLanguage(langParam);
  const spreadValue = normalizeValue(spreadParam);
  const orientationValue = normalizeValue(orientationParam);
  const spread: Spread = spreadValue === "three-card" ? "three-card" : "single";
  const orientation: Orientation =
    orientationValue === "upright" ? "upright" : "upright";
  const question = normalizeValue(questionParam).trim();
  const drawParams = new URLSearchParams({
    mode,
    spread,
    orientation,
    lang,
  });

  if (question) {
    drawParams.set("question", question);
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
      drawParams.set(key, value);
    }
  });

  const drawHref = `/ai-guide/draw?${drawParams.toString()}`;
  const exitHref = withLang("/ai-guide", {}, lang);
  const exitLabel = lang === "zh" ? "退出准备仪式" : "Exit ritual";

  return (
    <main className="ora-guide-shell relative flex h-[100dvh] flex-1 overflow-hidden px-0 py-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-12%,color-mix(in_srgb,var(--c-surface)_82%,transparent),color-mix(in_srgb,var(--c-bg)_82%,transparent)_38%,transparent_70%),linear-gradient(180deg,var(--c-bg)_0%,color-mix(in_srgb,var(--c-bg)_82%,var(--c-surface-well))_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34dvh] bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--c-text)_8%,transparent)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(58dvh,34rem)] w-[min(58dvh,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-border)]/20"
      />
      <Link
        aria-label={exitLabel}
        className="group absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--c-border)] bg-[color:color-mix(in_srgb,var(--c-bg)_74%,transparent)] text-2xl leading-none text-[color:var(--c-text-soft)] shadow-[0_18px_40px_-30px_rgba(0,0,0,.65)] backdrop-blur transition hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent)] sm:right-6 sm:top-6"
        href={exitHref}
      >
        <span aria-hidden="true" className="-mt-0.5">×</span>
      </Link>

      <PrepareRitualStepClient drawHref={drawHref} lang={lang} question={question} />
    </main>
  );
}

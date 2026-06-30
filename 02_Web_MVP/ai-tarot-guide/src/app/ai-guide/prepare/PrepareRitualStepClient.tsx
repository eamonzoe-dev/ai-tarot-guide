"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { type Language } from "@/lib/ai-guide/i18n";

type PrepareRitualStepClientProps = {
  drawHref: string;
  lang: Language;
  question: string;
};

type RitualStep = {
  count: string;
  title: string;
  body: string;
};

const STEP_MS = 4000;
const REDUCED_STEP_MS = 900;

export function PrepareRitualStepClient({
  drawHref,
  lang,
  question,
}: PrepareRitualStepClientProps) {
  const router = useRouter();
  const isZh = lang === "zh";
  const [activeStep, setActiveStep] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const stepDuration = isReducedMotion ? REDUCED_STEP_MS : STEP_MS;

  const steps = useMemo<RitualStep[]>(
    () =>
      isZh
        ? [
            {
              count: "1 / 3",
              title: "先安静下来。",
              body: "让注意力回到当下，给解读一个安静的入口。",
            },
            {
              count: "2 / 3",
              title: "把问题放在心里。",
              body: "不急着寻找答案，先诚实地看见问题本身。",
            },
            {
              count: "3 / 3",
              title: "准备好时，解读开始。",
              body: "带着这个问题，进入在线抽牌。",
            },
          ]
        : [
            {
              count: "1 / 3",
              title: "Settle for a moment.",
              body: "Let your attention return to the present.",
            },
            {
              count: "2 / 3",
              title: "Hold the question gently.",
              body: "Do not rush the answer. Notice what you are really asking.",
            },
            {
              count: "3 / 3",
              title: "When you are ready, the reading begins.",
              body: "Carry this question into the draw.",
            },
          ],
    [isZh],
  );
  const totalDuration = steps.length * stepDuration;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setIsReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const timers = steps.map((_, index) =>
      window.setTimeout(() => {
        setActiveStep(index);
      }, index * stepDuration),
    );
    const navigateTimer = window.setTimeout(() => {
      router.push(drawHref);
    }, totalDuration);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(navigateTimer);
    };
  }, [drawHref, router, stepDuration, steps, totalDuration]);

  const currentStep = steps[activeStep] ?? steps[0];
  const skipLabel = isZh ? "跳过" : "Skip";
  const progressLabel = isZh ? "准备仪式总进度" : "Ritual progress";
  const questionLabel = isZh ? "带着这个问题，安静一下。" : "Settle with this question.";
  const questionSummary = question.replace(/\s+/g, " ").trim();

  return (
    <section className="absolute inset-0 z-10 grid place-items-center px-6 py-14 text-center">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[min(46dvh,24rem)] w-[min(46dvh,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-border)]/25 motion-safe:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[min(28dvh,15rem)] w-[min(28dvh,15rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--c-accent)]/12 motion-safe:animate-pulse"
      />

      <div className="relative flex w-full max-w-3xl flex-col items-center">
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[color:var(--c-accent-text)]">
          {currentStep.count}
        </p>
        <h1 className="max-w-[12ch] font-serif text-[clamp(2rem,6vw,4.6rem)] font-medium leading-[1.05] text-[color:var(--c-text)]">
          {currentStep.title}
        </h1>
        <p className="mt-6 max-w-md text-sm leading-7 text-[color:var(--c-text-soft)] sm:text-base">
          {currentStep.body}
        </p>
        {questionSummary ? (
          <div className="mt-7 max-w-md rounded-full border border-[color:var(--c-border)]/60 bg-[color:color-mix(in_srgb,var(--c-surface)_58%,transparent)] px-4 py-2 text-xs leading-5 text-[color:var(--c-text-soft)] backdrop-blur">
            <span className="text-[color:var(--c-accent)]">{questionLabel}</span>
            <span className="ml-2 text-[color:var(--c-text)]">「{questionSummary}」</span>
          </div>
        ) : null}

        <div
          aria-label={progressLabel}
          aria-valuemax={100}
          aria-valuemin={0}
          className="mt-10 h-px w-full max-w-sm overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--c-text)_16%,transparent)]"
          role="progressbar"
        >
          <span
            className="prepare-total-progress block h-full rounded-full bg-[color:var(--c-accent)] shadow-[0_0_16px_color-mix(in_srgb,var(--c-accent)_44%,transparent)]"
            key={totalDuration}
            style={{
              animationDuration: `${totalDuration}ms`,
            }}
          />
        </div>

        <div aria-hidden="true" className="mt-7 flex items-center justify-center gap-3">
          {steps.map((step, index) => (
            <span
              className={`h-1.5 w-1.5 rounded-full transition motion-reduce:transition-none ${
                index === activeStep
                  ? "scale-125 bg-[color:var(--c-accent)] opacity-100"
                  : "bg-[color:var(--c-text-soft)] opacity-35"
              }`}
              key={step.count}
            />
          ))}
        </div>

        <Link
          className="mt-9 text-xs font-medium uppercase tracking-[0.22em] text-[color:var(--c-text-soft)] transition hover:text-[color:var(--c-accent)] motion-reduce:transition-none"
          href={drawHref}
        >
          {skipLabel}
        </Link>
      </div>

      <style jsx>{`
        .prepare-total-progress {
          transform: scaleX(0);
          transform-origin: left center;
          animation-name: prepareTotalProgress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }

        @keyframes prepareTotalProgress {
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}

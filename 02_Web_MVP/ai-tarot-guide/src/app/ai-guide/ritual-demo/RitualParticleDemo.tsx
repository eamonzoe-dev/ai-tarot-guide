"use client";

import { useState } from "react";

import {
  RitualCoreV2,
  type RitualCoreV2State,
} from "@/components/ai-guide/RitualCoreV2";

type RitualDemoState = RitualCoreV2State;
type DemoLanguage = "en" | "zh";

const states: RitualDemoState[] = ["breath", "settle", "ready", "focus"];

const copy: Record<
  RitualDemoState,
  Record<DemoLanguage, { main: string; sub: string }>
> = {
  breath: {
    en: {
      main: "Breath",
      sub: "Slow down. Take a breath.",
    },
    zh: {
      main: "先让呼吸落下。",
      sub: "慢慢呼吸三次，让注意力回到当下。",
    },
  },
  settle: {
    en: {
      main: "Settle",
      sub: "Let the noise soften before the question takes shape.",
    },
    zh: {
      main: "让杂音慢慢沉下去。",
      sub: "不用急着寻找答案，先让问题变得清楚。",
    },
  },
  ready: {
    en: {
      main: "Ready",
      sub: "The ritual field is open. Move forward when it feels steady.",
    },
    zh: {
      main: "仪式场已经打开。",
      sub: "准备好了，就把问题带入下一步。",
    },
  },
  focus: {
    en: {
      main: "Focus",
      sub: "Place one clear question at the center.",
    },
    zh: {
      main: "把问题放在这里。",
      sub: "只保留一个清晰的问题。",
    },
  },
};

export function RitualParticleDemo() {
  const [stateIndex, setStateIndex] = useState(0);
  const [language, setLanguage] = useState<DemoLanguage>("en");
  const [transitionPhase, setTransitionPhase] = useState<
    "idle" | "contract" | "reveal"
  >("idle");
  const [pulseCount, setPulseCount] = useState(0);
  const state = states[stateIndex];
  const text = copy[state][language];
  const isTransitioning = transitionPhase !== "idle";

  function continueRitual() {
    if (isTransitioning) {
      return;
    }

    setPulseCount((count) => count + 1);
    setTransitionPhase("contract");

    window.setTimeout(() => {
      setStateIndex((index) => (index + 1) % states.length);
      setTransitionPhase("reveal");
    }, 390);

    window.setTimeout(() => {
      setTransitionPhase("idle");
    }, 820);
  }

  return (
    <main
      className={`ritual-demo-page ritual-demo-page-${state} ${
        isTransitioning ? "ritual-demo-page-transitioning" : ""
      } relative min-h-dvh overflow-hidden px-5 py-8 text-[#eee8dd]`}
    >
      <div className="atelier-grain pointer-events-none absolute inset-0" />

      <section className="ritual-demo-frame relative z-10 mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col">
        <header className="ritual-demo-header flex items-start justify-between gap-4">
          <div className="min-w-0 text-center">
            <p className="atelier-label text-[0.58rem] font-semibold">
              AI Tarot Guide
            </p>
            <h1 className="mt-3 font-serif text-2xl leading-tight text-[#d9bd80]">
              Ritual Particle Core
            </h1>
            <div className="ritual-demo-state-dots" aria-hidden="true">
              {states.map((step) => (
                <span
                  className={step === state ? "ritual-demo-state-dot-active" : ""}
                  key={step}
                />
              ))}
            </div>
          </div>

          <div className="inline-flex border border-[#3f3324] bg-[#090806]/85 p-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em]">
            {(["en", "zh"] as const).map((nextLanguage) => (
              <button
                key={nextLanguage}
                type="button"
                disabled={isTransitioning}
                onClick={() => setLanguage(nextLanguage)}
                className={`min-h-8 px-3 ${
                  language === nextLanguage
                    ? "bg-[#251a12] text-[#efe8d9]"
                    : "text-[#a9a59d]"
                }`}
              >
                {nextLanguage}
              </button>
            ))}
          </div>
        </header>

        <div className="ritual-demo-stage relative flex flex-1 flex-col items-center justify-center py-8">
          <RitualCoreV2 pulseCount={pulseCount} state={state} />
        </div>

        <div
          className={`ritual-demo-copy ${
            transitionPhase === "contract" ? "ritual-demo-copy-out" : ""
          } ${transitionPhase === "reveal" ? "ritual-demo-copy-in" : ""}`}
        >
          <p className="ritual-step-indicator mb-4">Current state / {state}</p>
          <h2 className="font-serif text-5xl leading-none text-[#f4efe5]">
            {text.main}
          </h2>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#c8c0b4]">
            {text.sub}
          </p>
        </div>

        <button
          type="button"
          disabled={isTransitioning}
          onClick={continueRitual}
          className="relative z-10 mx-auto mb-6 min-h-11 w-full max-w-52 touch-manipulation rounded-full border border-[#d9bd80]/80 bg-transparent px-5 text-sm text-[#ead9b4] shadow-[0_0_22px_rgba(217,189,128,0.08),inset_0_0_18px_rgba(217,189,128,0.03)] transition hover:border-[#f0d69e] hover:bg-[#d9bd80]/5 disabled:cursor-not-allowed disabled:opacity-55"
        >
          Continue
        </button>
      </section>
    </main>
  );
}

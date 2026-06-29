"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { RitualCoreV2, type RitualCoreV2State } from "@/components/ai-guide/RitualCoreV2";
import { TarotButton } from "@/components/ai-guide/TarotButton";

type PrepareRitualStepClientProps = {
  button: string;
  count: string;
  main: string;
  nextHref: string;
  readingRoom: string;
  step: Exclude<RitualCoreV2State, "focus">;
  sub: string;
};

export function PrepareRitualStepClient({
  button,
  count,
  main,
  nextHref,
  readingRoom,
  step,
  sub,
}: PrepareRitualStepClientProps) {
  const router = useRouter();
  const navigationTimer = useRef<number | undefined>(undefined);
  const [transitionPhase, setTransitionPhase] = useState<"idle" | "in" | "out">(
    "in",
  );
  const [pulseCount, setPulseCount] = useState(0);
  const isNavigating = transitionPhase === "out";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setTransitionPhase("idle");
    }, 520);

    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  function continueRitual(
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    if (isNavigating) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setPulseCount((countValue) => countValue + 1);
    setTransitionPhase("out");

    if (navigationTimer.current) {
      window.clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = window.setTimeout(() => {
      router.push(nextHref);
    }, 720);
  }

  return (
    <section className="ritual-prepare-section ora-guide-panel relative isolate z-10 flex min-h-[28rem] flex-col justify-center overflow-hidden rounded-[1.75rem] px-4 py-7 sm:min-h-[30rem] sm:px-6">
      <RitualCoreV2 pulseCount={pulseCount} state={step} />

      <div
        className={`ritual-demo-copy ritual-prepare-copy ${
          transitionPhase === "out" ? "ritual-demo-copy-out" : ""
        } ${transitionPhase === "in" ? "ritual-demo-copy-in" : ""}`}
      >
        <p className="ritual-step-indicator mb-5">
          {readingRoom} / {count}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-[color:var(--c-text)]">
          {main}
        </h1>
        <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-[color:var(--c-text-soft)]">
          {sub}
        </p>
      </div>

      <div className="ritual-prepare-card relative z-20 mx-auto my-8" />

      <div className="ritual-prepare-action relative z-40">
        <TarotButton
          className="ritual-prepare-button"
          disabled={isNavigating}
          href={nextHref}
          onClick={continueRitual}
        >
          {button}
        </TarotButton>
      </div>
    </section>
  );
}

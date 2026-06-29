import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { normalizeLanguage, text } from "@/lib/ai-guide/i18n";
import { PrepareRitualStepClient } from "./PrepareRitualStepClient";

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";
type Orientation = "upright";
type RitualStep = "breath" | "settle" | "ready";

function normalizeMode(mode: string | string[] | undefined): ReadingMode {
  const value = Array.isArray(mode) ? mode[0] : mode;
  return value === "online" ? "online" : "physical";
}

function normalizeValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeStep(step: string | string[] | undefined): RitualStep {
  const value = Array.isArray(step) ? step[0] : step;
  return value === "settle" || value === "ready" ? value : "breath";
}

export default async function PreparePage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string | string[];
    spread?: string | string[];
    orientation?: string | string[];
    lang?: string | string[];
    step?: string | string[];
  }>;
}) {
  const {
    mode: modeParam,
    spread: spreadParam,
    orientation: orientationParam,
    lang: langParam,
    step: stepParam,
  } = await searchParams;
  const mode = normalizeMode(modeParam);
  const lang = normalizeLanguage(langParam);
  const copy = text(lang);
  const spreadValue = normalizeValue(spreadParam);
  const orientationValue = normalizeValue(orientationParam);
  const spread: Spread = spreadValue === "three-card" ? "three-card" : "single";
  const orientation: Orientation =
    orientationValue === "upright" ? "upright" : "upright";
  const step = normalizeStep(stepParam);
  const baseParams = { mode, spread, orientation, lang };
  const nextStep = step === "breath" ? "settle" : "ready";
  const nextParams = new URLSearchParams(
    step === "ready" ? baseParams : { ...baseParams, step: nextStep },
  );
  const nextHref =
    step === "ready"
      ? `/ai-guide/ask?${nextParams.toString()}`
      : `/ai-guide/prepare?${nextParams.toString()}`;
  const stepContent =
    step === "breath"
      ? {
          main: copy.prepareStepBreathMain,
          sub: copy.prepareStepBreathSub,
          button: copy.prepareStepContinue,
          count: "1 / 3",
        }
      : step === "settle"
        ? {
            main: copy.prepareStepSettleMain,
            sub: copy.prepareStepSettleSub,
            button: copy.prepareStepContinue,
            count: "2 / 3",
          }
        : {
            main:
              mode === "physical"
                ? copy.prepareStepReadyPhysicalMain
                : copy.prepareStepReadyOnlineMain,
            sub:
              mode === "physical"
                ? copy.prepareStepReadyPhysicalSub
                : copy.prepareStepReadyOnlineSub,
            button: copy.continueToQuestion,
            count: "3 / 3",
          };

  return (
    <main className="ora-guide-shell relative flex min-h-svh flex-1 overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-12%,color-mix(in_srgb,var(--c-surface)_90%,transparent),color-mix(in_srgb,var(--c-bg)_74%,transparent)_34%,transparent_66%),radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--c-accent)_14%,transparent),transparent_28%),linear-gradient(180deg,var(--c-bg)_0%,color-mix(in_srgb,var(--c-bg)_78%,var(--c-surface-well))_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22rem] bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--c-text)_8%,transparent)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/40"
      />
      <ActivationCodePanel lang={lang} hasLangParam={Boolean(langParam)} />

      <section className="relative mx-auto flex min-h-svh w-full max-w-[560px] flex-col gap-4 px-5 py-5 sm:min-h-0 sm:px-6">
        <div className="ora-guide-surface rounded-[1.5rem] px-4 py-3">
          <ReadingNav lang={lang} />
        </div>

        <div className="[&_.ritual-prepare-action]:flex [&_.ritual-prepare-action]:justify-center [&_.ritual-prepare-button]:!w-auto [&_.ritual-prepare-button]:min-w-[13rem] [&_.ritual-prepare-card]:!my-4 [&_.ritual-step-indicator]:!text-[color:var(--c-accent)] [&_.ritual-step-indicator]:mb-3 [&_.ritual-step-indicator]:tracking-[0.22em]">
          <PrepareRitualStepClient
            button={stepContent.button}
            count={stepContent.count}
            main={stepContent.main}
            nextHref={nextHref}
            readingRoom={copy.readingRoom}
            step={step}
            sub={stepContent.sub}
          />
        </div>
      </section>
    </main>
  );
}

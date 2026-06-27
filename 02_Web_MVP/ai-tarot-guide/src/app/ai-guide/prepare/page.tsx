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
    <main className="relative flex min-h-svh flex-1 overflow-hidden bg-[#f4efe5] px-0 py-0 text-[#4b4034] sm:px-6 sm:py-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-12%,rgba(255,255,255,0.96),rgba(244,239,229,0.74)_34%,transparent_66%),radial-gradient(circle_at_18%_18%,rgba(234,215,166,0.22),transparent_28%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.56),transparent_30%),linear-gradient(180deg,#f8f4ec_0%,#efe6d7_64%,#d8c9ae_132%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28rem] bg-[linear-gradient(180deg,transparent,rgba(24,18,13,0.08)_70%,rgba(24,18,13,0.16))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-[#caa96a]/14"
      />
      <ActivationCodePanel lang={lang} hasLangParam={Boolean(langParam)} />

      <section className="relative mx-auto flex min-h-svh w-full max-w-[500px] flex-col px-5 py-5 sm:min-h-0 sm:px-6">
        <div className="[&_nav]:mb-4 [&_nav]:text-[#8f7d63] [&_nav_a]:border-[#d8b76a]/38 [&_nav_a]:bg-[#fffaf0]/72 [&_nav_a]:text-[#6f614d] [&_nav_a]:shadow-[0_8px_22px_rgba(126,94,44,0.08)] [&_nav_a:hover]:border-[#b9934f]/68 [&_nav_a:hover]:text-[#4f4235] [&_nav_button]:border-[#d8b76a]/38 [&_nav_button]:bg-[#fffaf0]/72 [&_nav_button]:text-[#6f614d] [&_nav_button]:shadow-[0_8px_22px_rgba(126,94,44,0.08)] [&_nav_button:hover]:border-[#b9934f]/68 [&_nav_button:hover]:text-[#4f4235]">
          <ReadingNav lang={lang} />
        </div>

        <div className="[&_.ritual-core-v2]:top-[46%] [&_.ritual-core-v2]:opacity-72 [&_.ritual-core-v2]:mix-blend-multiply [&_.ritual-core-v2-axis]:opacity-60 [&_.ritual-core-v2-axis]:!bg-[linear-gradient(90deg,transparent,rgba(185,147,79,0.38),transparent)] [&_.ritual-core-v2-center]:!bg-[radial-gradient(circle,rgba(255,255,255,0.96)_0_30%,rgba(234,215,166,0.48)_49%,transparent_73%)] [&_.ritual-core-v2-depth-a]:!bg-[radial-gradient(circle,rgba(255,255,255,0.52)_0_38%,rgba(234,215,166,0.18)_58%,transparent_78%)] [&_.ritual-core-v2-depth-b]:!bg-[radial-gradient(circle,rgba(255,255,255,0.72),rgba(234,215,166,0.16)_46%,transparent_74%)] [&_.ritual-core-v2-orbit]:!border-[#caa96a]/24 [&_.ritual-core-v2-center-ring]:!border-[#caa96a]/28 [&_.ritual-core-v2-far]:!bg-[#b9934f]/42 [&_.ritual-core-v2-mid]:!bg-[#b9934f]/46 [&_.ritual-core-v2-near]:!bg-[#fffdf8]/78 [&_.ritual-prepare-section]:min-h-[calc(78svh-8rem)] [&_.ritual-prepare-section]:justify-start [&_.ritual-prepare-section]:rounded-[2rem] [&_.ritual-prepare-section]:border [&_.ritual-prepare-section]:border-[#d8b76a]/22 [&_.ritual-prepare-section]:bg-[#fff8ed]/32 [&_.ritual-prepare-section]:px-3 [&_.ritual-prepare-section]:py-3 [&_.ritual-prepare-section]:pt-7 [&_.ritual-prepare-section]:shadow-[0_18px_54px_rgba(126,94,44,0.10),inset_0_1px_0_rgba(255,255,255,0.58)] [&_.ritual-prepare-section]:backdrop-blur-sm [&_.ritual-prepare-copy]:rounded-[1.45rem] [&_.ritual-prepare-copy]:border [&_.ritual-prepare-copy]:border-[#d8b76a]/28 [&_.ritual-prepare-copy]:bg-[#fff9ef]/64 [&_.ritual-prepare-copy]:px-5 [&_.ritual-prepare-copy]:py-5 [&_.ritual-prepare-copy]:shadow-[0_14px_38px_rgba(126,94,44,0.08),inset_0_1px_0_rgba(255,255,255,0.78)] [&_.ritual-prepare-copy]:backdrop-blur [&_.ritual-prepare-copy::before]:!hidden [&_.ritual-step-indicator]:!text-[#9d7b3f] [&_.ritual-step-indicator]:mb-3 [&_.ritual-step-indicator]:tracking-[0.22em] [&_h1]:!text-[#4f4235] [&_h1]:drop-shadow-[0_1px_0_rgba(255,255,255,0.72)] [&_p]:!text-[#766955] [&_.ritual-prepare-card]:!my-4 [&_.ritual-prepare-card]:!h-14 [&_.ritual-prepare-card]:!w-9 [&_.ritual-prepare-card]:!rounded-xl [&_.ritual-prepare-card]:!border [&_.ritual-prepare-card]:!border-[#caa96a]/48 [&_.ritual-prepare-card]:!bg-[linear-gradient(180deg,rgba(255,253,248,0.96),rgba(239,229,210,0.86))] [&_.ritual-prepare-card]:!shadow-[0_14px_34px_rgba(126,94,44,0.12),0_0_24px_rgba(255,255,255,0.7),inset_0_1px_0_rgba(255,255,255,0.9)] [&_.ritual-prepare-action]:mt-0 [&_.ritual-prepare-action]:flex [&_.ritual-prepare-action]:justify-center [&_.ritual-prepare-action::before]:!hidden [&_.ritual-prepare-button]:!w-auto [&_.ritual-prepare-button]:min-w-[13rem] [&_.ritual-prepare-button]:!px-6 [&_.ritual-prepare-button]:!border-[#d8b76a]/56 [&_.ritual-prepare-button]:!bg-[linear-gradient(180deg,rgba(255,253,248,0.94),rgba(234,215,166,0.82))] [&_.ritual-prepare-button]:!text-[#4f4235] [&_.ritual-prepare-button]:!shadow-[0_14px_34px_rgba(126,94,44,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] [&_.ritual-prepare-button]:!text-shadow-none [&_.ritual-prepare-button:hover]:!border-[#b9934f]/75 [&_.ritual-prepare-button:hover]:!text-[#3f352b] [&_.ritual-prepare-button:hover]:!shadow-[0_16px_38px_rgba(126,94,44,0.16),0_0_22px_rgba(255,255,255,0.72)]">
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

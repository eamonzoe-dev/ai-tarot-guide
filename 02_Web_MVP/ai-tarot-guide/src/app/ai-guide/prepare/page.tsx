import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { PageContainer } from "@/components/ai-guide/PageContainer";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { normalizeLanguage, text } from "@/lib/ai-guide/i18n";
import { PrepareRitualStepClient } from "./PrepareRitualStepClient";

type ReadingMode = "physical" | "online";
type Spread = "single";
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
  const spread: Spread = spreadValue === "single" ? "single" : "single";
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
    <PageContainer compact>
      <ReadingNav lang={lang} />
      <div className="mb-5 flex justify-end">
        <LanguageToggle
          lang={lang}
          pathname="/ai-guide/prepare"
          params={{ mode, spread, orientation, step }}
          hasLangParam={Boolean(langParam)}
        />
      </div>
      <PrepareRitualStepClient
        button={stepContent.button}
        count={stepContent.count}
        main={stepContent.main}
        nextHref={nextHref}
        readingRoom={copy.readingRoom}
        step={step}
        sub={stepContent.sub}
      />
    </PageContainer>
  );
}

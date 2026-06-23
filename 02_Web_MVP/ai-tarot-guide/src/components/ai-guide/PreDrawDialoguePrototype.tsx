"use client";

import { useMemo, useState } from "react";

import { TarotButton } from "@/components/ai-guide/TarotButton";
import type { Language } from "@/lib/ai-guide/i18n";
import { generateAhaSentence } from "@/lib/ora/ahaSentence";
import {
  buildAhaPromptContract,
  type AhaPromptContractInput,
} from "@/lib/ora/ahaPromptContract";
import { parseAndValidateAhaAiOutput } from "@/lib/ora/ahaOutputValidator";
import { getMicroSlicesByStateKey } from "@/lib/ora/microSliceBank";
import {
  buildPreDrawDialogueResult,
  detectSurfaceScenario,
  getInitialDialogueStep,
  getSecondDialogueStep,
  type DialogueOption,
} from "@/lib/ora/preDrawDialogue";
import {
  defaultFinalAhaConstraints,
  type ReflectionSignalInput,
  validateReflectionSignalInput,
} from "@/lib/ora/reflectionSignal";

type PreDrawDialoguePrototypeProps = {
  lang: Language;
};

const copy = {
  en: {
    inputLabel: "Surface question",
    inputPlaceholder: "I feel lost recently...",
    detected: "Detected scenario",
    firstStep: "First branch",
    secondStep: "Second branch",
    finalQuestion: "Final reflective question",
    structuredPreview: "Structured preview",
    surfaceQuestion: "surfaceQuestion",
    selectedState: "selectedState",
    exactAnchors: "exactAnchors",
    candidateStateKey: "candidateStateKey",
    matchedMicroSlices: "matchedMicroSlices",
    validation: "Reflection Signal validation",
    valid: "valid",
    invalid: "invalid",
    stopsHere: "This prototype stops before the draw step.",
    drawLater: "Continue to draw later",
    reset: "Reset choices",
    chooseFirst: "Choose a first branch to continue.",
    chooseSecond: "Choose a second branch to form the reflection signal.",
    microSliceLine: "Concrete line",
    softened: "Softened version",
    risk: "Risk",
    signalJson: "Reflection Signal preview",
    ahaPreview: "AHA SENTENCE PREVIEW",
    prototypeOnly: "Prototype preview only. Not a formal reading.",
    ahaSentence: "sentence",
    usedSliceId: "usedSliceId",
    usedAnchors: "usedAnchors",
    warnings: "warnings",
    aiContractPreview: "AI PROMPT CONTRACT PREVIEW",
    aiContractNote:
      "Internal prototype only. No AI call is made here, and this is not formal reading output.",
    aiContractSubtitle:
      "This panel only shows the contract that a future AI aha generator must follow.",
    systemPrompt: "systemPrompt",
    userPrompt: "userPrompt",
    expectedOutputShape: "expectedOutputShape",
    forbiddenPatterns: "forbiddenPatterns",
    requiredChecks: "requiredChecks",
    mockValidationPreview: "MOCK AI OUTPUT VALIDATION",
    mockValidationNote:
      "Prototype only. This validates a mock JSON output made from the deterministic aha sentence; no prediction, API call, or Stardust use happens here.",
    rawMockJson: "raw mock JSON",
    validationStatus: "validation",
    ok: "ok",
    failed: "failed",
    errors: "errors",
    none: "None",
  },
  zh: {
    inputLabel: "原始问题",
    inputPlaceholder: "我最近很迷茫...",
    detected: "识别到的场景",
    firstStep: "第一轮分叉",
    secondStep: "第二轮分叉",
    finalQuestion: "最终抽牌问题",
    structuredPreview: "结构化预览",
    surfaceQuestion: "surfaceQuestion",
    selectedState: "selectedState",
    exactAnchors: "exactAnchors",
    candidateStateKey: "candidateStateKey",
    matchedMicroSlices: "matchedMicroSlices",
    validation: "Reflection Signal 校验",
    valid: "valid",
    invalid: "invalid",
    stopsHere: "这个 prototype 会停在抽牌前。",
    drawLater: "Continue to draw later",
    reset: "重置选择",
    chooseFirst: "先选择第一轮分叉。",
    chooseSecond: "再选择第二轮分叉，形成 reflection signal。",
    microSliceLine: "具体生活切片",
    softened: "柔化版本",
    risk: "风险",
    signalJson: "Reflection Signal preview",
    ahaPreview: "AHA SENTENCE PREVIEW",
    prototypeOnly: "仅 prototype 预览，不是正式解读。",
    ahaSentence: "sentence",
    usedSliceId: "usedSliceId",
    usedAnchors: "usedAnchors",
    warnings: "warnings",
    aiContractPreview: "AI PROMPT CONTRACT PREVIEW",
    aiContractNote:
      "Internal prototype only. No AI call, no formal reading output, no prediction.",
    aiContractSubtitle:
      "This panel only shows the contract that a future AI aha generator must follow.",
    systemPrompt: "systemPrompt",
    userPrompt: "userPrompt",
    expectedOutputShape: "expectedOutputShape",
    forbiddenPatterns: "forbiddenPatterns",
    requiredChecks: "requiredChecks",
    mockValidationPreview: "MOCK AI OUTPUT VALIDATION",
    mockValidationNote:
      "Prototype only. This validates mock JSON from the deterministic aha sentence; it does not call AI or use Stardust.",
    rawMockJson: "raw mock JSON",
    validationStatus: "validation",
    ok: "ok",
    failed: "failed",
    errors: "errors",
    none: "None",
  },
} as const;

const mockDialogueCard = {
  id: "two-of-swords",
  name: "宝剑二",
  symbolicLens: "回避选择、暂停判断、用不看见来维持暂时平衡",
};

export function PreDrawDialoguePrototype({
  lang,
}: PreDrawDialoguePrototypeProps) {
  const ui = copy[lang];
  const [surfaceQuestion, setSurfaceQuestion] = useState(
    lang === "zh" ? "我最近很迷茫" : "I feel lost recently",
  );
  const [firstOptionId, setFirstOptionId] = useState<string>();
  const [secondOptionId, setSecondOptionId] = useState<string>();

  const scenario = useMemo(
    () => detectSurfaceScenario(surfaceQuestion),
    [surfaceQuestion],
  );
  const initialStep = getInitialDialogueStep(scenario);
  const secondStep = firstOptionId
    ? getSecondDialogueStep(scenario, firstOptionId)
    : undefined;

  const firstOption = initialStep.options.find(
    (option) => option.id === firstOptionId,
  );
  const secondOption = secondStep?.options.find(
    (option) => option.id === secondOptionId,
  );

  const previewSeed = buildPreDrawDialogueResult(
    {
      surfaceQuestion,
      scenario,
      firstOptionId,
      secondOptionId,
    },
    [],
  );
  const matchedMicroSlices = previewSeed
    ? getMicroSlicesByStateKey(previewSeed.candidateStateKey).slice(0, 2)
    : [];
  const result = buildPreDrawDialogueResult(
    {
      surfaceQuestion,
      scenario,
      firstOptionId,
      secondOptionId,
    },
    matchedMicroSlices,
  );

  const reflectionSignalPreview = useMemo<ReflectionSignalInput | undefined>(() => {
    if (!result || !firstOption || !secondOption || !secondStep) {
      return undefined;
    }

    const question = surfaceQuestion.trim();

    return {
      locale: lang,
      surfaceQuestion: question,
      dialogueTurns: [
        { role: "user", text: question },
        {
          role: "ora",
          text: lang === "zh" ? initialStep.questionZh : initialStep.questionEn,
        },
        {
          role: "user",
          text: lang === "zh" ? firstOption.labelZh : firstOption.labelEn,
        },
        {
          role: "ora",
          text: lang === "zh" ? secondStep.questionZh : secondStep.questionEn,
        },
        {
          role: "user",
          text: lang === "zh" ? secondOption.labelZh : secondOption.labelEn,
        },
      ],
      dialogueSignals: {
        selectedState: result.selectedState,
        userSelectedBehavior:
          lang === "zh" ? secondOption.labelZh : secondOption.labelEn,
        ruminationType: result.candidateStateKey,
        agencyPosition: "pre_draw_dialogue_prototype",
        hiddenCost: result.anchorHints.slice(0, 3).join(", "),
        exactAnchors: result.exactAnchors,
      },
      microSliceCandidates: result.matchedMicroSlices.map((slice, index) => ({
        sliceId: slice.sliceId,
        stateKey: slice.stateKey,
        lineZh: slice.concreteLineZh,
        lineEn: slice.concreteLineEn,
        riskLevel: slice.riskLevel,
        confidence: Math.max(0.62, 0.86 - index * 0.08),
      })),
      drawnCard: mockDialogueCard,
      finalAhaConstraints: defaultFinalAhaConstraints,
    };
  }, [
    firstOption,
    initialStep.questionEn,
    initialStep.questionZh,
    lang,
    result,
    secondOption,
    secondStep,
    surfaceQuestion,
  ]);

  const validationResult = reflectionSignalPreview
    ? validateReflectionSignalInput(reflectionSignalPreview)
    : undefined;

  const firstMatchedMicroSlice = result?.matchedMicroSlices[0];

  const ahaSentencePreview = result && firstMatchedMicroSlice
    ? generateAhaSentence({
        locale: lang,
        surfaceQuestion: surfaceQuestion.trim(),
        exactAnchors: result.exactAnchors,
        card: mockDialogueCard,
        microSlice: {
          sliceId: firstMatchedMicroSlice.sliceId,
          stateKey: firstMatchedMicroSlice.stateKey,
          concreteLineZh: firstMatchedMicroSlice.concreteLineZh,
          concreteLineEn: firstMatchedMicroSlice.concreteLineEn,
          softenedVersionZh: firstMatchedMicroSlice.softenedVersionZh,
          riskLevel: firstMatchedMicroSlice.riskLevel,
        },
      })
    : undefined;

  const ahaPromptContractInput = useMemo<AhaPromptContractInput | undefined>(() => {
    if (!result || !firstOption || !secondOption || !firstMatchedMicroSlice) {
      return undefined;
    }

    return {
      locale: lang,
      surfaceQuestion: surfaceQuestion.trim(),
      exactAnchors: result.exactAnchors,
      dialogueSummary: {
        selectedState: result.selectedState,
        userSelectedBehavior:
          lang === "zh" ? secondOption.labelZh : secondOption.labelEn,
        ruminationType: result.candidateStateKey,
        agencyPosition: "pre_draw_dialogue_prototype",
        hiddenCost: result.anchorHints.slice(0, 3).join(", "),
      },
      card: mockDialogueCard,
      microSlice: {
        sliceId: firstMatchedMicroSlice.sliceId,
        stateKey: firstMatchedMicroSlice.stateKey,
        concreteLineZh: firstMatchedMicroSlice.concreteLineZh,
        concreteLineEn: firstMatchedMicroSlice.concreteLineEn,
        softenedVersionZh: firstMatchedMicroSlice.softenedVersionZh,
        riskLevel: firstMatchedMicroSlice.riskLevel,
      },
      constraints: defaultFinalAhaConstraints,
    };
  }, [
    firstMatchedMicroSlice,
    firstOption,
    lang,
    result,
    secondOption,
    surfaceQuestion,
  ]);

  const ahaPromptContract = ahaPromptContractInput
    ? buildAhaPromptContract(ahaPromptContractInput)
    : undefined;

  const mockAhaRawOutput = ahaSentencePreview
    ? JSON.stringify(
        {
          sentence: ahaSentencePreview.sentence,
          usedAnchors: ahaSentencePreview.usedAnchors,
          riskLevel: ahaSentencePreview.riskLevel,
          notes:
            "Mock output generated from deterministic prototype for validator preview.",
        },
        null,
        2,
      )
    : undefined;

  const mockAhaValidation =
    mockAhaRawOutput && result && firstMatchedMicroSlice
      ? parseAndValidateAhaAiOutput(mockAhaRawOutput, {
          locale: lang,
          cardName: mockDialogueCard.name,
          exactAnchors: result.exactAnchors,
          expectedRiskLevel: firstMatchedMicroSlice.riskLevel,
          mustIncludeUserAnchor: true,
        })
      : undefined;

  function resetChoices() {
    setFirstOptionId(undefined);
    setSecondOptionId(undefined);
  }

  function updateQuestion(value: string) {
    setSurfaceQuestion(value);
    resetChoices();
  }

  return (
    <div className="space-y-5 pb-8">
      <section className="ora-surface-archive rounded-2xl p-4">
        <label
          className="atelier-label mb-3 block text-[0.64rem] font-semibold"
          htmlFor="pre-draw-question"
        >
          {ui.inputLabel}
        </label>
        <textarea
          id="pre-draw-question"
          value={surfaceQuestion}
          onChange={(event) => updateQuestion(event.target.value)}
          placeholder={ui.inputPlaceholder}
          className="min-h-28 w-full resize-none rounded-xl border border-[#6d5a35]/70 bg-[#0b0907]/82 p-4 text-sm leading-6 text-[#f4efe5] outline-none placeholder:text-[#8f826f] focus:border-[#d9bd80]/70 focus:ring-2 focus:ring-[#d9bd80]/20"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#b9a789]">
          <span>{ui.detected}</span>
          <span className="rounded-full border border-[#6d5a35]/70 px-3 py-1 text-[#ead7a6]">
            {scenario}
          </span>
        </div>
      </section>

      <DialogueStepPanel
        title={ui.firstStep}
        question={lang === "zh" ? initialStep.questionZh : initialStep.questionEn}
        options={initialStep.options}
        selectedOptionId={firstOptionId}
        lang={lang}
        onSelect={(optionId) => {
          setFirstOptionId(optionId);
          setSecondOptionId(undefined);
        }}
      />

      {secondStep ? (
        <DialogueStepPanel
          title={ui.secondStep}
          question={lang === "zh" ? secondStep.questionZh : secondStep.questionEn}
          options={secondStep.options}
          selectedOptionId={secondOptionId}
          lang={lang}
          onSelect={setSecondOptionId}
        />
      ) : (
        <p className="rounded-xl border border-[#6d5a35]/60 bg-[#0b0907]/70 px-4 py-3 text-sm leading-6 text-[#b9a789]">
          {ui.chooseFirst}
        </p>
      )}

      {firstOptionId && !secondOptionId && (
        <p className="rounded-xl border border-[#6d5a35]/60 bg-[#0b0907]/70 px-4 py-3 text-sm leading-6 text-[#b9a789]">
          {ui.chooseSecond}
        </p>
      )}

      {result && (
        <section className="space-y-4">
          <div className="ora-surface-luminous rounded-2xl p-4">
            <p className="atelier-label mb-2 text-[0.64rem] font-semibold">
              {ui.finalQuestion}
            </p>
            <p className="text-base leading-7 text-[#f4efe5]">
              {lang === "zh"
                ? result.finalReflectiveQuestionZh
                : result.finalReflectiveQuestionEn}
            </p>
          </div>

          <section className="ora-surface-archive rounded-2xl p-4">
            <p className="atelier-label mb-4 text-[0.64rem] font-semibold">
              {ui.structuredPreview}
            </p>
            <PreviewRows
              rows={[
                [ui.surfaceQuestion, surfaceQuestion.trim()],
                [ui.selectedState, result.selectedState],
                [ui.candidateStateKey, result.candidateStateKey],
                [ui.exactAnchors, result.exactAnchors.join(", ")],
              ]}
            />
          </section>

          <section className="space-y-3">
            <p className="atelier-label text-[0.64rem] font-semibold">
              {ui.matchedMicroSlices}
            </p>
            {result.matchedMicroSlices.map((slice) => (
              <article
                key={slice.sliceId}
                className="ora-surface-parchment rounded-2xl p-4"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#6c5434]">
                  <span>{slice.sliceId}</span>
                  <span className="rounded-full border border-[#8a6a3d]/35 px-2 py-1">
                    {ui.risk}: {slice.riskLevel}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#241a11]">
                  {ui.microSliceLine}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#3f3021]">
                  {slice.concreteLineZh}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#241a11]">
                  {ui.softened}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#4b3b29]">
                  {slice.softenedVersionZh}
                </p>
              </article>
            ))}
          </section>

          {ahaSentencePreview && (
            <section className="ora-surface-luminous rounded-2xl p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="atelier-label text-[0.64rem] font-semibold">
                    {ui.ahaPreview}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#d8c9ae]">
                    {ui.prototypeOnly}
                  </p>
                </div>
                <span className="rounded-full border border-[#d9bd80]/40 px-3 py-1 text-xs text-[#ead7a6]">
                  {ui.risk}: {ahaSentencePreview.riskLevel}
                </span>
              </div>
              <PreviewRows
                rows={[
                  [ui.ahaSentence, ahaSentencePreview.sentence],
                  [ui.usedSliceId, ahaSentencePreview.usedSliceId],
                  [
                    ui.usedAnchors,
                    formatPreviewAnchors(
                      ahaSentencePreview.usedAnchors,
                      lang,
                      ui.none,
                    ),
                  ],
                  [
                    ui.warnings,
                    ahaSentencePreview.warnings.join(" | ") || ui.none,
                  ],
                ]}
              />
            </section>
          )}

          {ahaPromptContract && (
            <section className="ora-surface-archive rounded-2xl p-4">
              <div className="mb-4">
                <p className="atelier-label text-[0.64rem] font-semibold">
                  {ui.aiContractPreview}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#d8c9ae]">
                  {ui.aiContractNote}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#b9a789]">
                  {ui.aiContractSubtitle}
                </p>
              </div>
              <div className="grid gap-3">
                <PromptPreviewBlock
                  label={ui.systemPrompt}
                  value={ahaPromptContract.systemPrompt}
                />
                <PromptPreviewBlock
                  label={ui.userPrompt}
                  value={ahaPromptContract.userPrompt}
                />
                <PromptPreviewBlock
                  label={ui.expectedOutputShape}
                  value={ahaPromptContract.expectedOutputShape}
                />
                <PreviewRows
                  rows={[
                    [
                      ui.forbiddenPatterns,
                      `${ahaPromptContract.forbiddenPatterns.length}`,
                    ],
                    [
                      ui.requiredChecks,
                      `${ahaPromptContract.requiredChecks.length}`,
                    ],
                  ]}
                />
              </div>
            </section>
          )}

          {mockAhaRawOutput && mockAhaValidation && (
            <section className="ora-surface-archive rounded-2xl p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="atelier-label text-[0.64rem] font-semibold">
                    {ui.mockValidationPreview}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#d8c9ae]">
                    {ui.mockValidationNote}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    mockAhaValidation.ok
                      ? "border-[#6f8f61]/50 text-[#cfe0b8]"
                      : "border-[#a36a58]/50 text-[#e7b2a2]"
                  }`}
                >
                  {mockAhaValidation.ok ? ui.ok : ui.failed}
                </span>
              </div>
              <PromptPreviewBlock label={ui.rawMockJson} value={mockAhaRawOutput} />
              <div className="mt-3">
                <PreviewRows
                  rows={[
                    [
                      ui.validationStatus,
                      mockAhaValidation.ok ? ui.ok : ui.failed,
                    ],
                    [
                      ui.errors,
                      mockAhaValidation.errors.join(" | ") || ui.none,
                    ],
                    [
                      ui.warnings,
                      mockAhaValidation.warnings.join(" | ") || ui.none,
                    ],
                  ]}
                />
              </div>
            </section>
          )}

          <section className="ora-surface-archive rounded-2xl p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="atelier-label text-[0.64rem] font-semibold">
                {ui.validation}
              </p>
              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  validationResult?.ok
                    ? "border-[#6f8f61]/50 text-[#cfe0b8]"
                    : "border-[#a36a58]/50 text-[#e7b2a2]"
                }`}
              >
                {validationResult?.ok ? ui.valid : ui.invalid}
              </span>
            </div>
            {!validationResult?.ok && validationResult && (
              <ul className="space-y-2 text-sm leading-6 text-[#e7b2a2]">
                {validationResult.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
            {reflectionSignalPreview && (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#d2b06d]">
                  {ui.signalJson}
                </p>
                <pre className="mt-3 max-h-96 overflow-auto rounded-xl border border-[#6d5a35]/60 bg-[#080706]/86 p-3 text-xs leading-5 text-[#d8c9ae]">
                  {JSON.stringify(reflectionSignalPreview, null, 2)}
                </pre>
              </>
            )}
          </section>
        </section>
      )}

      <div className="space-y-3">
        <button
          type="button"
          disabled
          className="min-h-12 w-full cursor-not-allowed rounded-[1.35rem] border border-[#6d5a35]/70 bg-[#0b0907]/70 px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f826f]"
        >
          {ui.drawLater}
        </button>
        <p className="text-center text-xs leading-5 text-[#a9a59d]">
          {ui.stopsHere}
        </p>
        <TarotButton variant="ghost" onClick={resetChoices}>
          {ui.reset}
        </TarotButton>
      </div>
    </div>
  );
}

function DialogueStepPanel({
  title,
  question,
  options,
  selectedOptionId,
  lang,
  onSelect,
}: {
  title: string;
  question: string;
  options: DialogueOption[];
  selectedOptionId?: string;
  lang: Language;
  onSelect: (optionId: string) => void;
}) {
  return (
    <section className="ora-surface-archive rounded-2xl p-4">
      <p className="atelier-label mb-3 text-[0.64rem] font-semibold">{title}</p>
      <p className="text-sm leading-6 text-[#f4efe5]">{question}</p>
      <div className="mt-4 grid gap-3">
        {options.map((option) => {
          const selected = option.id === selectedOptionId;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm leading-5 transition ${
                selected
                  ? "border-[#d9bd80]/70 bg-[#d9bd80]/14 text-[#f4efe5]"
                  : "border-[#6d5a35]/70 bg-[#0b0907]/70 text-[#d8c9ae] hover:border-[#d9bd80]/55 hover:text-[#f4efe5]"
              }`}
            >
              {lang === "zh" ? option.labelZh : option.labelEn}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function formatPreviewAnchors(
  anchors: string[],
  lang: Language,
  emptyLabel: string,
): string {
  if (anchors.length === 0) {
    return emptyLabel;
  }

  return anchors
    .map((anchor) => (lang === "zh" ? `「${anchor}」` : `"${anchor}"`))
    .join(", ");
}

function PromptPreviewBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#6d5a35]/60 bg-[#0b0907]/64 p-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#d2b06d]">
        {label}
      </p>
      <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-[#d8c9ae]">
        {value}
      </pre>
    </div>
  );
}

function PreviewRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="space-y-3">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-[#6d5a35]/60 bg-[#0b0907]/64 p-3"
        >
          <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#d2b06d]">
            {label}
          </dt>
          <dd className="mt-2 break-words text-sm leading-6 text-[#d8c9ae]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

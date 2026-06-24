"use client";

import { useCallback, useEffect, useState } from "react";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import type { Language } from "@/lib/ai-guide/i18n";

type ReadingMode = "physical" | "online";
type Spread = "single" | "three-card";
type Orientation = "upright";

type PreDrawClarifierProps = {
  lang: Language;
  mode: ReadingMode;
  spread: Spread;
  orientation: Orientation;
  initialQuestion: string;
};

type ClarifyOption = {
  id: string;
  label: string;
  focus: string;
};

type ClarifyResult = {
  status: "ready" | "needs_focus";
  intro: string;
  prompt: string;
  options: ClarifyOption[];
  directLabel: string;
};

const NOTE_MAX_LENGTH = 180;

const copy = {
  en: {
    eyebrow: "Before the Draw",
    title: "Before the draw, let's steady this question first.",
    description:
      "Ora can help you gently organize it. You can also skip this and draw directly.",
    questionLabel: "Your question:",
    editButton: "Edit",
    refreshButton: "Refresh the guidance",
    loading: "Ora is helping bring the question into focus…",
    guidanceLabel: "Ora gently organized it:",
    guidanceFallback:
      "This question is ready for the draw. If you want, you can choose what you want the cards to respond to first.",
    optionsLeadIn: "You can enter this reading through one of these:",
    skipDirectLabel: "Skip this and draw directly instead",
    ctaWithFocus: "Draw with this focus",
    ctaWithNote: "Draw with my note",
    ctaDirect: "Draw directly",
    transitionMessage: "Entering the draw with this question…",
    noteToggleLabel: "Add one thing to bring in",
    noteTitle: "Is there one more thing you want to bring into the draw?",
    noteDescription:
      "You can add one thing you want this draw to pay attention to.",
    notePlaceholder:
      "For example: I want to know what to do next, not whether the outcome is good or bad.",
    userFocusLabel: "User focus",
    hintWithFocus: (label: string) => `Ora will bring "${label}" into the draw.`,
    hintWithFocusAndNote: "Ora will bring this focus and your note into the draw.",
    hintWithNote: "Ora will bring your note into the draw.",
    hintDirect: "Ora will bring this question directly into the draw.",
  },
  zh: {
    eyebrow: "抽牌前",
    title: "抽牌前，我们先把这个问题放稳一点。",
    description: "Ora 可以帮你轻轻整理一下。也可以不整理，直接抽牌。",
    questionLabel: "你的问题：",
    editButton: "修改",
    refreshButton: "重新整理这个问题",
    loading: "Ora 正在帮你靠近这个问题…",
    guidanceLabel: "Ora 轻轻整理了一下：",
    guidanceFallback:
      "这个问题可以直接抽牌。如果你愿意，也可以先选一个更想让牌回应的方向。",
    optionsLeadIn: "你可以这样进入这次解读：",
    skipDirectLabel: "不整理了，改为直接抽牌",
    ctaWithFocus: "带着这个聚焦进入抽牌",
    ctaWithNote: "带着我的补充进入抽牌",
    ctaDirect: "直接抽牌",
    transitionMessage: "正在带着这个问题进入抽牌…",
    noteToggleLabel: "补充一句想带进去的话",
    noteTitle: "还有一句想带进去的吗？",
    noteDescription: "可以补一句你更想让这次抽牌注意的地方。",
    notePlaceholder:
      "比如：我更想知道接下来该怎么做，而不是判断结果好坏。",
    userFocusLabel: "用户补充",
    hintWithFocus: (label: string) => `Ora 会带着「${label}」进入抽牌。`,
    hintWithFocusAndNote: "Ora 会带着这个聚焦和你的补充进入抽牌。",
    hintWithNote: "Ora 会带着你的补充进入抽牌。",
    hintDirect: "Ora 会直接带着这个问题进入抽牌。",
  },
} as const;

function buildDrawHref({
  mode,
  spread,
  orientation,
  question,
  lang,
  clarifyId,
  clarifyLabel,
  clarifyFocus,
  clarifyNote,
}: {
  mode: ReadingMode;
  spread: Spread;
  orientation: Orientation;
  question: string;
  lang: Language;
  clarifyId: string;
  clarifyLabel?: string;
  clarifyFocus?: string;
  clarifyNote?: string;
}) {
  const params = new URLSearchParams({
    mode,
    spread,
    orientation,
    question,
    lang,
  });
  params.set("clarifyId", clarifyId);

  if (clarifyLabel) {
    params.set("clarifyLabel", clarifyLabel);
  }

  if (clarifyFocus) {
    params.set("clarifyFocus", clarifyFocus);
  }

  if (clarifyNote) {
    params.set("clarifyNote", clarifyNote);
  }

  return `/ai-guide/draw?${params.toString()}`;
}

export function PreDrawClarifier({
  lang,
  mode,
  spread,
  orientation,
  initialQuestion,
}: PreDrawClarifierProps) {
  const ui = copy[lang];
  const [question, setQuestion] = useState(initialQuestion);
  const [settled, setSettled] = useState(false);
  const [loadingClarify, setLoadingClarify] = useState(true);
  const [clarify, setClarify] = useState<ClarifyResult | null>(null);
  const [selectedId, setSelectedId] = useState("direct");
  const [transitioning, setTransitioning] = useState(false);
  const [noteExpanded, setNoteExpanded] = useState(false);
  const [userNote, setUserNote] = useState("");
  const [questionEditing, setQuestionEditing] = useState(!initialQuestion.trim());

  const fetchClarify = useCallback(
    async (questionToClarify: string) => {
      setLoadingClarify(true);
      setSelectedId("direct");

      try {
        const response = await fetch("/api/pre-draw-clarify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: questionToClarify, lang }),
        });
        const data = (await response.json()) as ClarifyResult;
        setClarify(data);
      } catch {
        setClarify(null);
      } finally {
        setLoadingClarify(false);
      }
    },
    [lang],
  );

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 20);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchClarify(initialQuestion);
    });
    // Only run once on mount; subsequent refreshes are user-triggered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trimmedQuestion = question.trim();
  const trimmedNote = userNote.trim().slice(0, NOTE_MAX_LENGTH);
  const selectedOption = clarify?.options.find((option) => option.id === selectedId);
  const hasAiOption = Boolean(selectedOption);

  const ctaLabel = hasAiOption
    ? ui.ctaWithFocus
    : trimmedNote
      ? ui.ctaWithNote
      : ui.ctaDirect;

  const continueHint = hasAiOption
    ? trimmedNote
      ? ui.hintWithFocusAndNote
      : ui.hintWithFocus(selectedOption!.label)
    : trimmedNote
      ? ui.hintWithNote
      : ui.hintDirect;

  const guidanceText =
    clarify?.intro || clarify?.prompt
      ? `${clarify.intro}${clarify.prompt ? ` ${clarify.prompt}` : ""}`
      : ui.guidanceFallback;

  function handleContinue() {
    if (transitioning) {
      return;
    }

    setTransitioning(true);

    const drawHref = hasAiOption
      ? buildDrawHref({
          mode,
          spread,
          orientation,
          question: trimmedQuestion,
          lang,
          clarifyId: selectedOption!.id,
          clarifyLabel: selectedOption!.label,
          clarifyFocus: selectedOption!.focus,
          clarifyNote: trimmedNote || undefined,
        })
      : trimmedNote
        ? buildDrawHref({
            mode,
            spread,
            orientation,
            question: trimmedQuestion,
            lang,
            clarifyId: "custom",
            clarifyLabel: ui.userFocusLabel,
            clarifyFocus: trimmedNote,
          })
        : buildDrawHref({
            mode,
            spread,
            orientation,
            question: trimmedQuestion,
            lang,
            clarifyId: "direct",
          });

    setTimeout(() => {
      window.location.href = drawHref;
    }, 600);
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-[#f6f0e5] px-0 py-0 text-[#2f261d] sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.96),rgba(246,240,229,0.86)_42%,rgba(226,213,188,0.44)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-[#c9a86a]/18 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full border border-[#d8bd82]/22 opacity-70" />
      <ActivationCodePanel lang={lang} />

      <div
        className={`relative z-10 mx-auto flex min-h-svh w-full max-w-[620px] flex-col gap-4 px-5 py-7 transition-all duration-300 sm:min-h-0 sm:px-6 sm:py-9 ${
          settled ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="rounded-[2rem] border border-[#d7bd82]/40 bg-white/42 px-4 py-3 shadow-[0_18px_60px_rgba(123,93,45,0.08)] backdrop-blur-md">
          <ReadingNav lang={lang} />
        </div>

        <header className="space-y-3 pt-1 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 text-[#a77f3c]">
            <span className="h-px w-10 bg-[#d2b06d]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {ui.eyebrow}
            </span>
            <span className="h-px w-10 bg-[#d2b06d]/55" />
          </div>
          <h1 className="mx-auto max-w-[24rem] font-serif text-[1.85rem] leading-[1.2] text-[#34271b] sm:max-w-none sm:text-[2.3rem]">
            {ui.title}
          </h1>
          <p className="mx-auto max-w-[31rem] text-sm leading-6 text-[#7b6c58]">
            {ui.description}
          </p>
        </header>

        {questionEditing ? (
          <section className="relative overflow-hidden rounded-[1.6rem] border border-[#d8bd82]/45 bg-[#fffaf1]/74 p-4 shadow-[0_18px_50px_rgba(116,83,36,0.08)] backdrop-blur-md">
            <textarea
              id="pre-draw-clarify-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-[1.2rem] border border-[#d7bd82]/48 bg-[#fbf4e7]/78 p-3 text-sm leading-6 text-[#33281d] outline-none placeholder:text-[#9d8f78] transition focus:border-[#c49a4f] focus:bg-[#fffaf0] focus:ring-2 focus:ring-[#d6b36d]/22"
            />
            <button
              type="button"
              onClick={() => {
                setQuestionEditing(false);
                fetchClarify(question.trim());
              }}
              disabled={loadingClarify}
              className="mt-3 min-h-9 touch-manipulation select-none rounded-full border border-[#c9a86a]/55 bg-white/55 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#8d6426] transition hover:border-[#c49a4f] hover:bg-white/80 disabled:opacity-60"
            >
              {ui.refreshButton}
            </button>
          </section>
        ) : (
          <section className="flex items-start justify-between gap-3 rounded-[1.4rem] border border-[#d8bd82]/35 bg-white/40 px-4 py-3">
            <p className="text-sm leading-6 text-[#4f4334]">
              <span className="text-[#a77f3c]">{ui.questionLabel}</span>{" "}
              <span className="font-medium">&ldquo;{trimmedQuestion}&rdquo;</span>
            </p>
            <button
              type="button"
              onClick={() => setQuestionEditing(true)}
              className="min-h-8 shrink-0 touch-manipulation select-none rounded-full border border-[#d8bd82]/45 bg-white/50 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#8d6426] transition hover:border-[#c49a4f]"
            >
              {ui.editButton}
            </button>
          </section>
        )}

        {loadingClarify ? (
          <p className="text-sm leading-6 text-[#7b6c58]">{ui.loading}</p>
        ) : (
          <>
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#a77f3c]">
                {ui.guidanceLabel}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[#5c4d38]">
                {guidanceText}
              </p>
            </div>

            {clarify && clarify.options.length > 0 && (
              <div className="space-y-2">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#a99a80]">
                  {ui.optionsLeadIn}
                </p>
                <div className="grid gap-2">
                  {clarify.options.map((option) => {
                    const selected = option.id === selectedId;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedId(option.id)}
                        className={`flex min-h-11 items-start gap-2.5 rounded-[1.1rem] border px-3.5 py-2.5 text-left transition ${
                          selected
                            ? "border-[#c49a4f] bg-[#fffaf0] shadow-[0_10px_26px_rgba(148,105,39,0.14)]"
                            : "border-[#d7bd82]/40 bg-white/50 hover:border-[#c49a4f]/55 hover:bg-[#fffaf0]/60"
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full border ${
                            selected
                              ? "border-[#c49a4f] bg-[#c49a4f]"
                              : "border-[#c9a86a]/50 bg-transparent"
                          }`}
                        />
                        <span className="flex-1">
                          <span className="block text-sm leading-6 text-[#4f4334]">
                            {option.label}
                          </span>
                          {option.focus && (
                            <span className="mt-0.5 block text-xs leading-5 text-[#9d8f78]">
                              {option.focus}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {hasAiOption && (
              <button
                type="button"
                onClick={() => setSelectedId("direct")}
                className="min-h-8 touch-manipulation select-none self-start rounded-full border border-transparent px-1 text-xs leading-6 text-[#a99a80] underline-offset-2 transition hover:text-[#8b7c64] hover:underline"
              >
                {ui.skipDirectLabel}
              </button>
            )}

            {!noteExpanded ? (
              <button
                type="button"
                onClick={() => setNoteExpanded(true)}
                className="min-h-8 touch-manipulation select-none self-start rounded-full border border-[#d8bd82]/40 bg-white/35 px-4 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#8b7c64] transition hover:border-[#c9a86a]/55 hover:text-[#5c4d38]"
              >
                {ui.noteToggleLabel}
              </button>
            ) : (
              <div className="rounded-[1.2rem] border border-[#d8bd82]/40 bg-white/45 p-3.5">
                <p className="text-sm font-semibold text-[#4f4334]">
                  {ui.noteTitle}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#8b7c64]">
                  {ui.noteDescription}
                </p>
                <textarea
                  value={userNote}
                  onChange={(event) =>
                    setUserNote(event.target.value.slice(0, NOTE_MAX_LENGTH))
                  }
                  placeholder={ui.notePlaceholder}
                  rows={2}
                  maxLength={NOTE_MAX_LENGTH}
                  className="mt-2 w-full resize-none rounded-xl border border-[#d7bd82]/45 bg-[#fbf4e7]/70 p-2.5 text-sm leading-6 text-[#33281d] outline-none placeholder:text-[#a99a80] transition focus:border-[#c49a4f] focus:bg-[#fffaf0] focus:ring-2 focus:ring-[#d6b36d]/20"
                />
              </div>
            )}
          </>
        )}

        <div className="space-y-2">
          {!loadingClarify && (
            <p className="text-center text-xs leading-5 text-[#a99a80]">
              {continueHint}
            </p>
          )}
          <button
            type="button"
            onClick={handleContinue}
            disabled={transitioning || loadingClarify}
            className="min-h-12 w-full touch-manipulation select-none rounded-full border border-[#c89d4f]/70 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#3a2a18] shadow-[0_18px_38px_rgba(148,105,39,0.22),inset_0_1px_0_rgba(255,255,255,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(148,105,39,0.26),inset_0_1px_0_rgba(255,255,255,0.62)] disabled:translate-y-0 disabled:opacity-70"
          >
            {transitioning ? ui.transitionMessage : ctaLabel}
          </button>
        </div>
      </div>
    </main>
  );
}

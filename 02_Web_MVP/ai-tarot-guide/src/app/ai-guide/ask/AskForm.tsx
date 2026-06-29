"use client";

import { useEffect, useState } from "react";

import { ActivationCodePanel } from "@/components/ai-guide/ActivationCodePanel";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { type Language, text } from "@/lib/ai-guide/i18n";

const USER_QUESTION_KEY = "aiTarot:userQuestion";

type AskFormProps = {
  mode: "physical" | "online";
  spread: "single" | "three-card";
  orientation: "upright";
  lang: Language;
  hasLangParam: boolean;
  initialQuestion?: string;
};

export function AskForm({
  mode,
  spread,
  orientation,
  lang,
  hasLangParam,
  initialQuestion = "",
}: AskFormProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [error, setError] = useState("");
  const copy = text(lang);

  useEffect(() => {
    if (initialQuestion) {
      return;
    }

    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY);

    if (storedQuestion) {
      queueMicrotask(() => {
        setQuestion(storedQuestion);
      });
    }
  }, [initialQuestion]);

  return (
    <main className="ora-guide-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--c-surface)_96%,transparent),color-mix(in_srgb,var(--c-bg)_88%,var(--c-surface)_12%)_42%,color-mix(in_srgb,var(--c-border)_48%,transparent)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-[color:var(--c-accent)]/18 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full border border-[color:var(--c-accent)]/22 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-36 h-[12rem] w-[12rem] -translate-x-1/2 rounded-full border border-[color:var(--c-border)]/35 opacity-70" />

      <div className="pointer-events-none absolute left-6 top-28 h-24 w-px bg-gradient-to-b from-transparent via-[#c9a86a]/30 to-transparent sm:left-14" />
      <div className="pointer-events-none absolute right-6 top-40 h-24 w-px bg-gradient-to-b from-transparent via-[#c9a86a]/30 to-transparent sm:right-14" />
      <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[620px] flex-col gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
        <div className="ora-guide-surface rounded-[2rem] px-4 py-3 backdrop-blur-md">
          <ReadingNav lang={lang} />
        </div>

        <header className="space-y-4 pt-2 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 text-[color:var(--c-accent)]">
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.askEyebrow}
            </span>
            <span className="h-px w-10 bg-[color:var(--c-accent)]/55" />
          </div>

          <h1 className="font-serif text-[2.55rem] leading-tight text-[color:var(--c-text)] sm:text-[3rem]">
            {copy.askTitle}
          </h1>

          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[color:var(--c-text-soft)]">
            {copy.askDescription}
          </p>
        </header>

        <section className="ora-guide-panel relative overflow-hidden rounded-[2rem] p-5 backdrop-blur-md">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[color:var(--c-accent)]/20" />
          <div className="pointer-events-none absolute -right-3 top-7 h-3 w-3 rotate-45 border border-[color:var(--c-accent)]/40" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-px w-16 bg-[color:var(--c-accent)]/35" />

          <div className="relative space-y-3">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--c-accent)]">
              Question Slip
            </p>

            <div className="space-y-2 text-sm leading-6 text-[color:var(--c-text-soft)]">
              {copy.askRitualPrompt.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          </div>
        </section>

        <form
          action="/ai-guide/lens"
          method="get"
          onSubmit={(event) => {
            const normalizedQuestion = question.trim();

            if (!normalizedQuestion) {
              event.preventDefault();
              setError(copy.askError);
              return;
            }

            localStorage.setItem(USER_QUESTION_KEY, normalizedQuestion);
          }}
          className="flex flex-col gap-4"
        >
          <input name="mode" type="hidden" value={mode} />
          <input name="spread" type="hidden" value={spread} />
          <input name="orientation" type="hidden" value={orientation} />
          <input name="lang" type="hidden" value={lang} />

          <div className="ora-guide-panel relative overflow-hidden rounded-[2.15rem] p-4 backdrop-blur-md sm:p-5">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--c-accent)]/60 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 right-5 h-12 w-12 rounded-full border border-[color:var(--c-accent)]/18" />

            <label
              className="mb-3 block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[color:var(--c-accent)]"
              htmlFor="tarot-question"
            >
              {copy.readingNote}
            </label>

            <textarea
              id="tarot-question"
              name="question"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              placeholder={copy.askPlaceholder}
              className="min-h-52 w-full resize-none rounded-[1.45rem] border border-[color:var(--c-border)] bg-[color:var(--c-surface-well)]/70 p-4 text-base leading-7 text-[color:var(--c-text)] shadow-[inset_0_1px_12px_color-mix(in_srgb,var(--c-text)_6%,transparent)] outline-none placeholder:text-[color:var(--c-text-dim)] focus:border-[color:var(--c-accent)] focus:bg-[color:var(--c-surface)] focus:ring-2 focus:ring-[color:var(--c-accent)]/22"
            />

            <p className="mt-3 text-xs leading-5 text-[color:var(--c-text-soft)]">
              {copy.askHint}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-[#c48a73]/45 bg-[#fff1ea] px-4 py-3 text-sm leading-6 text-[#8a4634]"
            >
              {error}
            </p>
          )}

          <button className="ora-guide-button ora-guide-button-primary w-full touch-manipulation select-none" type="submit">
            {copy.continueToRitual}
          </button>
        </form>
      </div>
    </main>
  );
}

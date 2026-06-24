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
    <main className="ora-page-shell relative min-h-svh overflow-hidden px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
      <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[620px] flex-col gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
        <div className="card px-4 py-3">
          <ReadingNav lang={lang} />
        </div>

        <header className="space-y-4 pt-2 text-center">
          <div className="rule mx-auto max-w-xs">
            <span className="eyebrow">
              {copy.askEyebrow}
            </span>
          </div>

          <h1 className="t-h1">
            {copy.askTitle}
          </h1>

          <p className="caption mx-auto max-w-[31rem]">
            {copy.askDescription}
          </p>
        </header>

        <section className="well p-5">
          <div className="relative space-y-3">
            <p className="eyebrow">
              问题纸条
            </p>

            <div className="caption space-y-2">
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

          <div className="card p-4 sm:p-5">
            <label
              className="eyebrow mb-3 block"
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
              className="input min-h-52 resize-none p-4 text-base leading-7"
            />

            <p className="caption mt-3 text-xs">
              {copy.askHint}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-[var(--c-danger-border)] bg-[var(--c-danger-bg)] px-4 py-3 text-sm leading-6 text-[var(--c-danger)]"
            >
              {error}
            </p>
          )}

          <button
            className="btn btn--primary w-full"
            type="submit"
          >
            {copy.continueToRitual}
          </button>
        </form>
      </div>
    </main>
  );
}

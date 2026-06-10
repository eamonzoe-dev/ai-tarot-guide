"use client";

import { useEffect, useState } from "react";

import { LanguageToggle } from "@/components/ai-guide/LanguageToggle";
import { ReadingNav } from "@/components/ai-guide/ReadingNav";
import { RitualField, RitualPrompt } from "@/components/ai-guide/RitualField";
import { type Language, text } from "@/lib/ai-guide/i18n";

const USER_QUESTION_KEY = "aiTarot:userQuestion";

type AskFormProps = {
  mode: "physical" | "online";
  spread: "single";
  orientation: "upright";
  lang: Language;
  hasLangParam: boolean;
};

export function AskForm({
  mode,
  spread,
  orientation,
  lang,
  hasLangParam,
}: AskFormProps) {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const copy = text(lang);

  useEffect(() => {
    const storedQuestion = localStorage.getItem(USER_QUESTION_KEY);

    if (storedQuestion) {
      queueMicrotask(() => {
        setQuestion(storedQuestion);
      });
    }
  }, []);

  return (
    <main className="atelier-page relative min-h-screen overflow-hidden px-5 py-8 text-[#eee8dd]">
      <div className="atelier-grain pointer-events-none absolute inset-0" />
      <RitualField variant="focus" />
      <div className="pointer-events-auto relative z-10 mx-auto flex max-w-sm flex-col gap-6">
        <div>
          <ReadingNav lang={lang} />
          <div className="flex justify-end">
            <LanguageToggle
              lang={lang}
              pathname="/ai-guide/ask"
              params={{ mode, spread, orientation }}
              hasLangParam={hasLangParam}
            />
          </div>
        </div>
        <header className="space-y-3">
          <p className="atelier-label text-[0.68rem] font-semibold">
            {copy.askEyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-[#f4efe5]">
            {copy.askTitle}
          </h1>
          <p className="text-sm leading-6 text-[#a9a59d]">
            {copy.askDescription}
          </p>
        </header>

        <RitualPrompt lines={[...copy.askRitualPrompt]} />

        <form
          action="/ai-guide/draw"
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
          <div className="ritual-note p-4">
            <label
              className="ritual-note-label mb-3 block text-[0.62rem] font-semibold uppercase tracking-[0.24em]"
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
              className="ritual-note-field min-h-48 w-full resize-none p-4 text-base leading-7 outline-none focus:border-[#c3a069] focus:ring-2 focus:ring-[#b89a68]/25"
            />
            <p className="ritual-note-muted mt-3 text-xs leading-5">
              {copy.askHint}
            </p>
          </div>
          {error && (
            <p className="border border-[#755246] bg-[#1a0e0b] px-3 py-2 text-sm text-[#e2b7aa]">
              {error}
            </p>
          )}
          <button
            className="pointer-events-auto min-h-12 touch-manipulation select-none border border-[#b08c58]/70 bg-[linear-gradient(180deg,#2a1d15,#120d0a)] px-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#f0eadf] shadow-[0_12px_28px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,235,204,0.12),inset_0_-1px_0_rgba(0,0,0,0.72)] focus:outline-none focus:ring-2 focus:ring-[#b89a68]/55 focus:ring-offset-2 focus:ring-offset-[#050506]"
            type="submit"
          >
            {copy.continueToRitual}
          </button>
        </form>
      </div>
    </main>
  );
}

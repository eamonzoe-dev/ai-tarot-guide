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
    <main className="relative min-h-svh overflow-hidden bg-[#f6f0e5] px-0 py-0 text-[#2f261d] sm:px-6 sm:py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.96),rgba(246,240,229,0.86)_42%,rgba(226,213,188,0.44)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-[#c9a86a]/18 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-28 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full border border-[#d8bd82]/22 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-36 h-[12rem] w-[12rem] -translate-x-1/2 rounded-full border border-[#ead7aa]/35 opacity-70" />

      <div className="pointer-events-none absolute left-6 top-28 h-24 w-px bg-gradient-to-b from-transparent via-[#c9a86a]/30 to-transparent sm:left-14" />
      <div className="pointer-events-none absolute right-6 top-40 h-24 w-px bg-gradient-to-b from-transparent via-[#c9a86a]/30 to-transparent sm:right-14" />
      <ActivationCodePanel lang={lang} hasLangParam={hasLangParam} />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[620px] flex-col gap-6 px-5 py-7 sm:min-h-0 sm:px-6 sm:py-9">
        <div className="rounded-[2rem] border border-[#d7bd82]/40 bg-white/42 px-4 py-3 shadow-[0_18px_60px_rgba(123,93,45,0.08)] backdrop-blur-md">
          <ReadingNav lang={lang} />
        </div>

        <header className="space-y-4 pt-2 text-center">
          <div className="mx-auto flex items-center justify-center gap-3 text-[#a77f3c]">
            <span className="h-px w-10 bg-[#d2b06d]/55" />
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.28em]">
              {copy.askEyebrow}
            </span>
            <span className="h-px w-10 bg-[#d2b06d]/55" />
          </div>

          <h1 className="font-serif text-[2.55rem] leading-tight text-[#34271b] sm:text-[3rem]">
            {copy.askTitle}
          </h1>

          <p className="mx-auto max-w-[31rem] text-sm leading-7 text-[#7b6c58]">
            {copy.askDescription}
          </p>
        </header>

        <section className="relative overflow-hidden rounded-[2rem] border border-[#d8bd82]/45 bg-[#fffaf1]/72 p-5 shadow-[0_24px_70px_rgba(116,83,36,0.10)] backdrop-blur-md">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#d2b06d]/20" />
          <div className="pointer-events-none absolute -right-3 top-7 h-3 w-3 rotate-45 border border-[#caa664]/40" />
          <div className="pointer-events-none absolute bottom-5 left-5 h-px w-16 bg-[#d2b06d]/35" />

          <div className="relative space-y-3">
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]">
              Question Slip
            </p>

            <div className="space-y-2 text-sm leading-6 text-[#6f624f]">
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

          <div className="relative overflow-hidden rounded-[2.15rem] border border-[#cfad6d]/50 bg-[#fffdf7]/82 p-4 shadow-[0_28px_80px_rgba(111,78,31,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md sm:p-5">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d2b06d]/60 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 right-5 h-12 w-12 rounded-full border border-[#d2b06d]/18" />

            <label
              className="mb-3 block text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#a77f3c]"
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
              className="min-h-52 w-full resize-none rounded-[1.45rem] border border-[#d7bd82]/48 bg-[#fbf4e7]/78 p-4 text-base leading-7 text-[#33281d] shadow-[inset_0_1px_12px_rgba(126,93,42,0.06)] outline-none placeholder:text-[#9d8f78] focus:border-[#c49a4f] focus:bg-[#fffaf0] focus:ring-2 focus:ring-[#d6b36d]/22"
            />

            <p className="mt-3 text-xs leading-5 text-[#80715d]">
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

          <button
            className="min-h-12 touch-manipulation select-none rounded-full border border-[#c89d4f]/70 bg-[linear-gradient(180deg,rgba(246,225,174,0.98),rgba(197,151,72,0.98))] px-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#3a2a18] shadow-[0_18px_38px_rgba(148,105,39,0.22),inset_0_1px_0_rgba(255,255,255,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(148,105,39,0.26),inset_0_1px_0_rgba(255,255,255,0.62)] focus:outline-none focus:ring-2 focus:ring-[#c89d4f]/45 focus:ring-offset-2 focus:ring-offset-[#f6f0e5]"
            type="submit"
          >
            {copy.continueToRitual}
          </button>
        </form>
      </div>
    </main>
  );
}

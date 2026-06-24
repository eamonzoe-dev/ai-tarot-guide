"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/ai-guide/ThemeToggle";
import { type Language, text, withLang } from "@/lib/ai-guide/i18n";

type ReadingNavProps = {
  lang: Language;
};

export function ReadingNav({ lang }: ReadingNavProps) {
  const copy = text(lang);
  const homeHref = withLang("/ai-guide", {}, lang);

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = homeHref;
  }

  return (
    <nav className="mb-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--c-text-soft)]">
      <button
        type="button"
        onClick={goBack}
        className="btn btn--surface min-h-10 px-3 text-left"
      >
        &larr; {copy.back}
      </button>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href={homeHref} className="btn btn--surface min-h-10 px-3">
          {copy.home}
        </Link>
      </div>
    </nav>
  );
}

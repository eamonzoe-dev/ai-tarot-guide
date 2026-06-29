"use client";

import Link from "next/link";

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
    <nav className="ora-reading-nav flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em]">
      <button
        type="button"
        onClick={goBack}
        className="ora-reading-nav-control touch-manipulation rounded-full border px-3 text-left transition"
      >
        &larr; {copy.back}
      </button>
      <Link
        href={homeHref}
        className="ora-reading-nav-control flex touch-manipulation items-center rounded-full border px-3 transition"
      >
        {copy.home}
      </Link>
    </nav>
  );
}

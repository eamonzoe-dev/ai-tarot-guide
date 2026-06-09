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
    <nav className="mb-6 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#bca77f]">
      <button
        type="button"
        onClick={goBack}
        className="min-h-10 touch-manipulation border border-[#3f3324] bg-[#090806]/75 px-3 text-left transition hover:border-[#8c724b] hover:text-[#efe8d9]"
      >
        &larr; {copy.back}
      </button>
      <Link
        href={homeHref}
        className="flex min-h-10 touch-manipulation items-center border border-[#3f3324] bg-[#090806]/75 px-3 transition hover:border-[#8c724b] hover:text-[#efe8d9]"
      >
        {copy.home}
      </Link>
    </nav>
  );
}

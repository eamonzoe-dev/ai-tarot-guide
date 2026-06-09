"use client";

import Link from "next/link";
import { useEffect } from "react";

import {
  LANGUAGE_STORAGE_KEY,
  type Language,
  languageLabel,
  withLang,
} from "@/lib/ai-guide/i18n";

type LanguageToggleProps = {
  lang: Language;
  pathname: string;
  params?: Record<string, string | undefined>;
  hasLangParam?: boolean;
};

export function LanguageToggle({
  lang,
  pathname,
  params = {},
  hasLangParam = true,
}: LanguageToggleProps) {
  useEffect(() => {
    if (hasLangParam) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      return;
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage === "en" || storedLanguage === "zh") {
      window.location.replace(
        withLang(pathname, params, storedLanguage as Language),
      );
      return;
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [hasLangParam, lang, params, pathname]);

  function rememberLanguage(nextLang: Language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
  }

  return (
    <div
      className="inline-flex min-h-10 items-center border border-[#3f3324] bg-[#090806]/85 p-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#a9a59d]"
      aria-label="Language"
    >
      {(["en", "zh"] as const).map((nextLang) => (
        <Link
          key={nextLang}
          href={withLang(pathname, params, nextLang)}
          onClick={() => rememberLanguage(nextLang)}
          className={`flex min-h-8 touch-manipulation items-center px-3 ${
            lang === nextLang
              ? "bg-[#251a12] text-[#efe8d9]"
              : "text-[#a9a59d] hover:text-[#efe8d9]"
          }`}
        >
          {nextLang === "en" ? "EN" : languageLabel(nextLang)}
        </Link>
      ))}
    </div>
  );
}
